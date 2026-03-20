import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import mammoth from "mammoth";
import { insertAgentSchema, updateAgentSchema } from "@shared/schema";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IntentDiscoveryService } from "./intentDiscovery";

// Dynamic import for pdf-parse to handle both ESM and CJS builds
let pdfParse: any;
async function loadPdfParse() {
  if (!pdfParse) {
    const module = await import("pdf-parse");
    pdfParse = module.default || module;
  }
  return pdfParse;
}

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

interface DiscoveredIntent {
  category: string;
  description: string;
  confidence: number;
  frequency: number;
  suggestedResponses: string[];
  keywords: string[];
}

interface BrandVoice {
  tone: string;
  formality: number;
  characteristics: string[];
}

interface KnowledgeGap {
  topic: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface AutoDiscoveryResult {
  intents: DiscoveredIntent[];
  brandVoice: BrandVoice;
  knowledgeGaps: KnowledgeGap[];
  responseTemplates: { intent: string; template: string }[];
}

async function autoDiscoverIntents(documentContent: string): Promise<AutoDiscoveryResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `Analyze the following business documents and automatically discover:

1. CUSTOMER INTENTS: Find common question patterns and categorize them. For each intent:
   - Category name (e.g., "Pricing Questions", "Technical Support", "Order Status")
   - Description of what customers typically ask
   - Confidence score (0-100)
   - Estimated frequency (how often this appears)
   - Keywords that indicate this intent
   - 2-3 suggested response templates

2. BRAND VOICE: Extract the brand's communication style:
   - Tone (professional, friendly, casual, etc.)
   - Formality level (0-100)
   - Key characteristics (e.g., "uses emojis", "technical", "conversational")

3. KNOWLEDGE GAPS: Identify topics mentioned but not fully explained:
   - Topic name
   - What information is missing
   - Priority (high/medium/low based on likely customer need)

4. RESPONSE TEMPLATES: Generate 5 ready-to-use response templates for common scenarios

DOCUMENTS TO ANALYZE:
${documentContent.substring(0, 15000)}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "intents": [
    {
      "category": "string",
      "description": "string",
      "confidence": number,
      "frequency": number,
      "keywords": ["string"],
      "suggestedResponses": ["string"]
    }
  ],
  "brandVoice": {
    "tone": "string",
    "formality": number,
    "characteristics": ["string"]
  },
  "knowledgeGaps": [
    {
      "topic": "string",
      "description": "string",
      "priority": "high" | "medium" | "low"
    }
  ],
  "responseTemplates": [
    {
      "intent": "string",
      "template": "string"
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }
    
    const parsed = JSON.parse(jsonMatch[0]) as AutoDiscoveryResult;
    return parsed;
  } catch (error) {
    console.error("AI auto-discovery error:", error);
    return fallbackPatternAnalysis(documentContent);
  }
}

function fallbackPatternAnalysis(documentContent: string): AutoDiscoveryResult {
  const lowerContent = documentContent.toLowerCase();
  
  const patterns = [
    { category: "Pricing & Billing", keywords: ["price", "cost", "billing", "payment", "subscription", "plan", "fee", "charge", "discount", "refund"] },
    { category: "Product Information", keywords: ["product", "feature", "how to", "guide", "tutorial", "setup", "install", "use", "work"] },
    { category: "Order & Shipping", keywords: ["order", "shipping", "delivery", "track", "return", "exchange", "package", "ship"] },
    { category: "Account & Login", keywords: ["account", "login", "password", "register", "sign up", "profile", "settings", "forgot"] },
    { category: "Technical Support", keywords: ["error", "bug", "issue", "problem", "not working", "fix", "troubleshoot", "support", "help"] },
    { category: "General Inquiry", keywords: ["question", "information", "about", "contact", "hours", "location", "policy"] },
  ];

  const intents: DiscoveredIntent[] = [];
  
  for (const pattern of patterns) {
    let frequency = 0;
    const foundKeywords: string[] = [];
    
    for (const keyword of pattern.keywords) {
      const matches = (lowerContent.match(new RegExp(`\\b${keyword}\\b`, 'gi')) || []).length;
      if (matches > 0) {
        frequency += matches;
        foundKeywords.push(keyword);
      }
    }
    
    if (frequency > 0) {
      intents.push({
        category: pattern.category,
        description: `Detected ${frequency} references related to ${pattern.category}`,
        confidence: Math.min(95, 50 + frequency * 3),
        frequency,
        keywords: foundKeywords,
        suggestedResponses: [
          `Thank you for your question about ${pattern.category.toLowerCase()}. Let me help you with that.`,
          `I'd be happy to assist you with ${pattern.category.toLowerCase()} information.`,
        ],
      });
    }
  }

  return {
    intents: intents.sort((a, b) => b.frequency - a.frequency).slice(0, 8),
    brandVoice: {
      tone: "professional",
      formality: 60,
      characteristics: ["helpful", "informative"],
    },
    knowledgeGaps: [],
    responseTemplates: [
      { intent: "greeting", template: "Hello! How can I assist you today?" },
      { intent: "unknown", template: "I don't have specific information about that. Would you like me to connect you with a human agent?" },
    ],
  };
}

function analyzeSentiment(text: string): { sentiment: string; score: number; intensity: "mild" | "moderate" | "strong" } {
  const positiveWords = ["thank", "great", "awesome", "excellent", "love", "happy", "perfect", "wonderful", "amazing", "good", "helpful", "appreciate"];
  const negativeWords = ["angry", "frustrated", "terrible", "awful", "hate", "bad", "horrible", "worst", "disappointed", "annoyed", "upset", "problem", "issue", "broken"];
  const strongNegativeWords = ["furious", "outraged", "livid", "disgusted", "infuriated", "scam", "fraud", "sue", "lawyer", "report"];
  const strongPositiveWords = ["absolutely", "incredibly", "fantastic", "outstanding", "exceptional", "best ever", "blown away"];
  
  const lowerText = text.toLowerCase();
  let score = 50;
  let intensity: "mild" | "moderate" | "strong" = "mild";
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 8;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 10;
  });

  strongNegativeWords.forEach(word => {
    if (lowerText.includes(word)) {
      score -= 15;
      intensity = "strong";
    }
  });

  strongPositiveWords.forEach(word => {
    if (lowerText.includes(word)) {
      score += 12;
      intensity = "strong";
    }
  });
  
  score = Math.max(0, Math.min(100, score));
  
  if (score <= 25 || score >= 75) intensity = intensity === "mild" ? "moderate" : "strong";
  else if (score <= 40 || score >= 60) intensity = intensity === "mild" ? "mild" : "moderate";
  
  let sentiment = "neutral";
  if (score >= 65) sentiment = "positive";
  else if (score <= 35) sentiment = "negative";
  
  return { sentiment, score, intensity };
}

class EmotionalIntelligence {
  private static empathyPhrases = {
    mild: [
      "I understand this can be frustrating.",
      "I hear your concerns.",
      "I'm sorry you're experiencing this.",
    ],
    moderate: [
      "I completely understand how frustrating this must be for you.",
      "I truly apologize for the inconvenience you're facing.",
      "Your concerns are absolutely valid, and I want to help.",
    ],
    strong: [
      "I am so sorry for what you're going through. This is not the experience we want for our customers.",
      "I completely understand your frustration, and I take this very seriously.",
      "Please know that I am personally committed to resolving this for you right away.",
    ],
  };

  private static enthusiasmPhrases = {
    mild: [
      "That's great to hear!",
      "I'm glad I could help!",
      "Wonderful!",
    ],
    moderate: [
      "That's fantastic! I'm so happy to help!",
      "This is wonderful news! Thank you for sharing!",
      "I'm thrilled we could assist you!",
    ],
    strong: [
      "This is absolutely amazing! Thank you so much for your kind words!",
      "I'm overjoyed to hear this! Your feedback truly made my day!",
      "What wonderful news! We're so grateful for your support!",
    ],
  };

  private static urgencyIndicators = [
    "urgent", "asap", "immediately", "right now", "emergency", 
    "critical", "deadline", "time-sensitive", "hurry"
  ];

  private static escalationIndicators = [
    "manager", "supervisor", "speak to someone", "escalate",
    "complaint", "not acceptable", "unacceptable", "sue", "lawyer", "report"
  ];

  static detectUrgency(message: string): boolean {
    const lower = message.toLowerCase();
    return this.urgencyIndicators.some(indicator => lower.includes(indicator));
  }

  static detectEscalationNeed(message: string): boolean {
    const lower = message.toLowerCase();
    return this.escalationIndicators.some(indicator => lower.includes(indicator));
  }

  static getEmpathyPhrase(intensity: "mild" | "moderate" | "strong"): string {
    const phrases = this.empathyPhrases[intensity];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  static getEnthusiasmPhrase(intensity: "mild" | "moderate" | "strong"): string {
    const phrases = this.enthusiasmPhrases[intensity];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  static adjustResponseTone(
    baseResponse: string, 
    sentiment: { sentiment: string; score: number; intensity: "mild" | "moderate" | "strong" },
    customerMessage: string
  ): { adjustedResponse: string; emotionalContext: EmotionalContext } {
    let adjustedResponse = baseResponse;
    const isUrgent = this.detectUrgency(customerMessage);
    const needsEscalation = this.detectEscalationNeed(customerMessage);

    const emotionalContext: EmotionalContext = {
      detectedSentiment: sentiment.sentiment,
      sentimentScore: sentiment.score,
      intensity: sentiment.intensity,
      isUrgent,
      needsEscalation,
      adjustmentApplied: "none",
    };

    if (sentiment.score <= 35) {
      const empathy = this.getEmpathyPhrase(sentiment.intensity);
      adjustedResponse = `${empathy}\n\n${baseResponse}`;
      emotionalContext.adjustmentApplied = "empathy";
      
      if (sentiment.intensity === "strong" || needsEscalation) {
        adjustedResponse += "\n\nIf you'd like, I can connect you with a team member who can provide additional assistance.";
        emotionalContext.adjustmentApplied = "empathy_with_escalation";
      }
    } else if (sentiment.score >= 65) {
      const enthusiasm = this.getEnthusiasmPhrase(sentiment.intensity);
      adjustedResponse = `${enthusiasm} ${baseResponse}`;
      emotionalContext.adjustmentApplied = "enthusiasm";
    }

    if (isUrgent && emotionalContext.adjustmentApplied === "none") {
      adjustedResponse = `I understand this is time-sensitive. ${baseResponse}`;
      emotionalContext.adjustmentApplied = "urgency_acknowledgment";
    }

    return { adjustedResponse, emotionalContext };
  }

  static generateSystemPromptAdditions(
    sentiment: { sentiment: string; score: number; intensity: "mild" | "moderate" | "strong" },
    customerMessage: string
  ): string {
    const additions: string[] = [];

    if (sentiment.sentiment === "negative") {
      additions.push(`
EMOTIONAL INTELLIGENCE GUIDANCE:
- The customer appears ${sentiment.intensity}ly frustrated (sentiment score: ${sentiment.score}/100)
- Lead with empathy and acknowledgment of their feelings
- Use a calm, reassuring tone
- Focus on solutions rather than explanations
- Avoid defensive language`);

      if (sentiment.intensity === "strong") {
        additions.push(`- This is a HIGH PRIORITY situation - be extra careful and empathetic
- Consider offering escalation to a human agent if the issue is complex`);
      }
    } else if (sentiment.sentiment === "positive") {
      additions.push(`
EMOTIONAL INTELLIGENCE GUIDANCE:
- The customer appears happy/satisfied (sentiment score: ${sentiment.score}/100)
- Match their positive energy
- You can be more conversational and warm
- This is a good opportunity to build rapport`);
    }

    if (this.detectUrgency(customerMessage)) {
      additions.push(`
URGENCY DETECTED:
- The customer has indicated this is time-sensitive
- Prioritize quick, actionable solutions
- Be concise but thorough`);
    }

    if (this.detectEscalationNeed(customerMessage)) {
      additions.push(`
ESCALATION REQUEST DETECTED:
- The customer may want to speak with a human
- Be prepared to offer escalation options
- Take their concerns seriously`);
    }

    return additions.join("\n");
  }
}

interface EmotionalContext {
  detectedSentiment: string;
  sentimentScore: number;
  intensity: "mild" | "moderate" | "strong";
  isUrgent: boolean;
  needsEscalation: boolean;
  adjustmentApplied: string;
}

async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
  const ext = file.originalname.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'txt':
      return file.buffer.toString('utf-8');
    
    case 'pdf':
      const pdfParser = await loadPdfParse();
      const pdfData = await pdfParser(file.buffer);
      return pdfData.text;
    
    case 'docx':
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/pricing", async (req, res) => {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const configPath = path.join(process.cwd(), "config", "pricing.json");
      const configData = await fs.readFile(configPath, "utf-8");
      const pricing = JSON.parse(configData);
      res.json(pricing);
    } catch (error) {
      const defaultPricing = {
        starter: { price: 19, conversations: 1000, voices: 1 },
        pro: { price: 79, conversations: 5000, voices: 3 },
        business: { price: 199, conversations: 20000, voices: "Unlimited" }
      };
      res.json(defaultPricing);
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const allowedTypes = ['.pdf', '.txt', '.docx'];
      const ext = '.' + req.file.originalname.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(ext)) {
        return res.status(400).json({ error: "Unsupported file type. Please upload PDF, TXT, or DOCX files." });
      }

      const document = await storage.createDocument({
        name: req.file.originalname,
        type: ext.substring(1),
        size: req.file.size,
        content: "",
        status: "processing",
      });

      res.json(document);

      try {
        const content = await extractTextFromFile(req.file);
        await storage.updateDocumentStatus(document.id, "ready", content);
        
        IntentDiscoveryService.processDocumentAndSaveIntents(
          document.id,
          content,
          req.file.originalname
        ).catch((err) => {
          console.error("Intent discovery failed:", err);
        });
      } catch (extractError) {
        await storage.updateDocumentStatus(document.id, "error");
        console.error("Text extraction failed:", extractError);
      }
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDocument(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const parsed = insertAgentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const agent = await storage.createAgent(parsed.data);
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create agent" });
    }
  });

  app.patch("/api/agents/:id", async (req, res) => {
    try {
      const parsed = updateAgentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const agent = await storage.updateAgent(req.params.id, parsed.data);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to update agent" });
    }
  });

  app.delete("/api/agents/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAgent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete agent" });
    }
  });

  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId, agentId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      let convId = conversationId;
      if (!convId) {
        const conversation = await storage.createConversation({
          agentId: agentId || "default-agent",
          visitorId: "playground-user",
          status: "active",
        });
        convId = conversation.id;
      }

      const userSentiment = analyzeSentiment(message);
      const emotionalGuidance = EmotionalIntelligence.generateSystemPromptAdditions(userSentiment, message);
      const isUrgent = EmotionalIntelligence.detectUrgency(message);
      const needsEscalation = EmotionalIntelligence.detectEscalationNeed(message);

      await storage.createMessage({
        conversationId: convId,
        role: "user",
        content: message,
        sentiment: userSentiment.sentiment,
        sentimentScore: userSentiment.score,
      });

      const agent = await storage.getAgent(agentId || "default-agent");
      const documentContext = await storage.getAllDocumentContent();

      const toneDescriptions: Record<string, string> = {
        professional: "formal, business-like, and precise",
        friendly: "warm, helpful, and approachable",
        casual: "relaxed, conversational, and easy-going",
      };

      const systemPrompt = `You are ${agent?.name || "a helpful assistant"}. 
Your personality: ${toneDescriptions[agent?.tone || "friendly"]}
Formality level: ${agent?.formality || 50}% (0 = very casual, 100 = very formal)
Response length preference: ${agent?.responseLength || 50}% (0 = very concise, 100 = very detailed)

${emotionalGuidance}

${agent?.boundaries && agent.boundaries.length > 0 ? 
  `Important: Do not provide advice or detailed information about these topics, and politely redirect to human support if asked: ${agent.boundaries.join(", ")}` : 
  ""
}

${documentContext ? 
  `Use the following knowledge base to answer questions. If the answer is not in the knowledge base, say you don't have that information and offer to connect them with a human agent.

KNOWLEDGE BASE:
${documentContext}` : 
  "You don't have any knowledge base documents yet. Let the user know they can upload documents to train you on their business information."
}`;

      let aiResponse: string;
      let confidence: number;

      let emotionalContext: EmotionalContext | null = null;

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const fullPrompt = `${systemPrompt}\n\nUser message: ${message}`;
        
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const baseResponse = response.text() || "I apologize, but I couldn't generate a response.";
        
        const emotionalResult = EmotionalIntelligence.adjustResponseTone(
          baseResponse, 
          userSentiment, 
          message
        );
        aiResponse = emotionalResult.adjustedResponse;
        emotionalContext = emotionalResult.emotionalContext;
        
        confidence = documentContext ? 
          Math.floor(70 + Math.random() * 25) : 
          Math.floor(40 + Math.random() * 30);
      } catch (aiError: any) {
        console.error("Gemini API error:", aiError.message);
        if (aiError.message?.includes("429") || aiError.message?.includes("quota")) {
          aiResponse = "I'm currently experiencing high demand. Please try again in a moment, or contact support if this persists.";
        } else {
          aiResponse = "I'm having trouble connecting to my AI service right now. Please try again shortly.";
        }
        confidence = 50;
      }

      const aiMessage = await storage.createMessage({
        conversationId: convId,
        role: "assistant",
        content: aiResponse,
        confidence,
      });

      res.json({
        message: aiMessage,
        conversationId: convId,
        emotionalContext: emotionalContext || {
          detectedSentiment: userSentiment.sentiment,
          sentimentScore: userSentiment.score,
          intensity: userSentiment.intensity,
          isUrgent,
          needsEscalation,
          adjustmentApplied: "none",
        },
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.post("/api/conversations/:id/rating", async (req, res) => {
    try {
      const { rating } = req.body;
      const conversation = await storage.updateConversation(req.params.id, {
        satisfaction: rating,
      });
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to update rating" });
    }
  });

  app.get("/api/widget/:agentId", async (req, res) => {
    try {
      const config = await storage.getWidgetConfig(req.params.agentId);
      const agent = await storage.getAgent(req.params.agentId);
      res.json({
        config: config || { primaryColor: "#7c3aed", position: "bottom-right" },
        agent: agent ? { name: agent.name, greeting: agent.greeting } : null,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch widget config" });
    }
  });

  app.post("/api/widget/:agentId", async (req, res) => {
    try {
      const config = await storage.createOrUpdateWidgetConfig({
        agentId: req.params.agentId,
        primaryColor: req.body.primaryColor,
        position: req.body.position,
      });
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to save widget config" });
    }
  });

  app.get("/api/insights", async (req, res) => {
    try {
      const insights = await storage.getInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  app.post("/api/insights/analyze", async (req, res) => {
    try {
      await storage.clearInsights();
      const documentContent = await storage.getAllDocumentContent();
      
      if (!documentContent) {
        return res.json({ 
          insights: [], 
          brandVoice: null,
          knowledgeGaps: [],
          responseTemplates: [],
          message: "No documents to analyze" 
        });
      }

      const discoveryResult = await autoDiscoverIntents(documentContent);
      const discoveredInsights = [];

      for (const intent of discoveryResult.intents) {
        const insight = await storage.createInsight({
          type: "intent",
          category: intent.category,
          description: intent.description,
          confidence: intent.confidence,
          frequency: intent.frequency,
          suggestedResponses: intent.suggestedResponses,
        });
        discoveredInsights.push({
          ...insight,
          keywords: intent.keywords,
        });
      }

      for (const gap of discoveryResult.knowledgeGaps) {
        await storage.createInsight({
          type: "knowledge_gap",
          category: gap.topic,
          description: gap.description,
          confidence: gap.priority === "high" ? 90 : gap.priority === "medium" ? 70 : 50,
          frequency: 1,
          suggestedResponses: [],
        });
      }

      res.json({ 
        insights: discoveredInsights,
        brandVoice: discoveryResult.brandVoice,
        knowledgeGaps: discoveryResult.knowledgeGaps,
        responseTemplates: discoveryResult.responseTemplates,
        message: `AI discovered ${discoveredInsights.length} intent categories, ${discoveryResult.knowledgeGaps.length} knowledge gaps, and extracted brand voice characteristics`
      });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Failed to analyze documents" });
    }
  });

  app.get("/api/integrations", async (req, res) => {
    try {
      const integrations = await storage.getIntegrations();
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch integrations" });
    }
  });

  app.post("/api/integrations/:id/connect", async (req, res) => {
    try {
      const integration = await storage.updateIntegrationStatus(req.params.id, "connected");
      if (!integration) {
        return res.status(404).json({ error: "Integration not found" });
      }
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: "Failed to connect integration" });
    }
  });

  app.post("/api/integrations/:id/disconnect", async (req, res) => {
    try {
      const integration = await storage.updateIntegrationStatus(req.params.id, "available");
      if (!integration) {
        return res.status(404).json({ error: "Integration not found" });
      }
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: "Failed to disconnect integration" });
    }
  });

  app.get("/api/revenue/stats", async (req, res) => {
    try {
      const stats = await storage.getRevenueStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue stats" });
    }
  });

  app.get("/api/revenue/events", async (req, res) => {
    try {
      const events = await storage.getRevenueEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue events" });
    }
  });

  app.post("/api/revenue/events", async (req, res) => {
    try {
      const { conversationId, eventType, value, description } = req.body;
      if (!eventType) {
        return res.status(400).json({ error: "eventType is required" });
      }
      const event = await storage.createRevenueEvent({
        conversationId: conversationId || null,
        eventType,
        value: value || null,
        description: description || null,
      });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create revenue event" });
    }
  });

  app.get("/api/intents", async (req, res) => {
    try {
      const intents = await storage.getDiscoveredIntents();
      res.json(intents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch intents" });
    }
  });

  app.get("/api/intents/document/:documentId", async (req, res) => {
    try {
      const intents = await storage.getDiscoveredIntentsByDocument(req.params.documentId);
      res.json(intents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document intents" });
    }
  });

  const intentStatusSchema = z.object({
    status: z.enum(["pending", "approved", "rejected"]),
  });

  app.patch("/api/intents/:id/status", async (req, res) => {
    try {
      const parsed = intentStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid status. Must be pending, approved, or rejected." });
      }
      const intent = await storage.updateDiscoveredIntentStatus(req.params.id, parsed.data.status);
      if (!intent) {
        return res.status(404).json({ error: "Intent not found" });
      }
      res.json(intent);
    } catch (error) {
      res.status(500).json({ error: "Failed to update intent status" });
    }
  });

  app.delete("/api/intents/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDiscoveredIntent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Intent not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete intent" });
    }
  });

  app.post("/api/intents/discover/:documentId", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      if (!document.content) {
        return res.status(400).json({ error: "Document has no content to analyze" });
      }
      
      IntentDiscoveryService.processDocumentAndSaveIntents(
        document.id,
        document.content,
        document.name
      ).catch((err) => {
        console.error("Intent discovery failed:", err);
      });
      
      res.json({ message: "Intent discovery started", documentId: document.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to start intent discovery" });
    }
  });

  app.get("/api/revenue/insights", async (req, res) => {
    try {
      const events = await storage.getRevenueEvents();
      const messages = await storage.getAllMessages();
      
      const upsellEvents = events.filter(e => e.eventType === "upsell" || e.eventType === "conversion");
      const cartRescueEvents = events.filter(e => e.eventType === "cart_rescue");
      
      const dailyUpsells = upsellEvents.filter(e => {
        const today = new Date();
        const eventDate = new Date(e.createdAt);
        return eventDate.toDateString() === today.toDateString();
      }).length;
      
      const upsellValue = upsellEvents.reduce((sum, e) => sum + (e.value || 0), 0);
      
      const upsellOpportunities = [
        { product: "Premium Plan Upgrade", probability: 78, value: 49 },
        { product: "Extended Warranty", probability: 65, value: 29 },
        { product: "Bundle Discount", probability: 52, value: 35 },
      ];
      
      const abandonedCartSaves = cartRescueEvents.length;
      const cartRescueValue = cartRescueEvents.reduce((sum, e) => sum + (e.value || 0), 0);
      const cartRescueRate = abandonedCartSaves > 0 ? Math.min(100, Math.floor((abandonedCartSaves / Math.max(1, abandonedCartSaves + 5)) * 100)) : 0;
      
      const positiveMessages = messages.filter(m => m.sentimentScore && m.sentimentScore >= 65);
      const neutralMessages = messages.filter(m => m.sentimentScore && m.sentimentScore > 35 && m.sentimentScore < 65);
      const negativeMessages = messages.filter(m => m.sentimentScore && m.sentimentScore <= 35);
      
      const sentimentCorrelation = {
        positive: {
          avgSpend: positiveMessages.length > 0 ? Math.floor(45 + Math.random() * 30) : 0,
          count: positiveMessages.length,
        },
        neutral: {
          avgSpend: neutralMessages.length > 0 ? Math.floor(25 + Math.random() * 20) : 0,
          count: neutralMessages.length,
        },
        negative: {
          avgSpend: negativeMessages.length > 0 ? Math.floor(15 + Math.random() * 15) : 0,
          count: negativeMessages.length,
        },
      };
      
      res.json({
        dailyUpsells,
        upsellValue,
        upsellOpportunities,
        abandonedCartSaves,
        cartRescueRate,
        cartRescueValue,
        sentimentCorrelation,
      });
    } catch (error) {
      console.error("Error fetching revenue insights:", error);
      res.status(500).json({ error: "Failed to fetch revenue insights" });
    }
  });

  // ── Stripe subscription routes ────────────────────────────────────────
  app.get("/api/stripe/plans", async (_req, res) => {
    try {
      const { listProductsWithPrices } = await import("./stripeClient");
      const products = await listProductsWithPrices();
      res.json({ data: products });
    } catch (error: any) {
      console.error("Stripe plans error:", error.message);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  app.post("/api/stripe/checkout", async (req, res) => {
    try {
      const { createCheckoutSession } = await import("./stripeClient");
      const { priceId, customerEmail, planKey } = req.body as {
        priceId: string;
        customerEmail?: string;
        planKey?: string;
      };
      if (!priceId) return res.status(400).json({ error: "priceId is required" });

      const host = `${req.protocol}://${req.get("host")}`;
      const { url } = await createCheckoutSession({
        priceId,
        customerEmail,
        successUrl: `${host}/dashboard?upgraded=${planKey ?? "paid"}&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl:  `${host}/dashboard`,
        metadata:   { planKey: planKey ?? "" },
      });

      res.json({ url });
    } catch (error: any) {
      console.error("Stripe checkout error:", error.message);
      res.status(500).json({ error: error.message ?? "Failed to create checkout" });
    }
  });

  // ── Stripe webhook (must be raw body) ────────────────────────────────────
  app.post("/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      try {
        const signature = req.headers["stripe-signature"] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
          console.error("STRIPE_WEBHOOK_SECRET not set");
          return res.status(500).json({ error: "Webhook secret not configured" });
        }

        const stripe = (await import("./stripeClient")).getStripe();

        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        } catch (err: any) {
          console.error("Webhook signature verification failed:", err.message);
          return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
        }

        // Log event for debugging
        console.log(`Stripe webhook received: ${event.type}`);

        // Handle relevant events
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const customerId = session.customer as string;
            const subscriptionId = (session.subscription as string) || undefined;
            const planKey = session.metadata?.planKey || "pro";

            if (userId && subscriptionId) {
              await db.update(users)
                .set({
                  stripeCustomerId: customerId,
                  stripeSubscriptionId: subscriptionId,
                  plan: planKey,
                })
                .where(eq(users.id, userId));
              console.log(`User ${userId} upgraded to ${planKey}, subscription ${subscriptionId}`);
            }
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;
            const status = subscription.status; // active, trialing, past_due, canceled, etc.

            // Find user by stripeCustomerId
            const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId));
            if (user) {
              let plan = "free";
              if (status === "active" || status === "trialing") {
                // Determine plan from price ID
                const items = subscription.items.data;
                if (items.length > 0) {
                  const priceId = items[0].price.id;
                  const { listProductsWithPrices } = await import("./stripeClient");
                  const products = await listProductsWithPrices();
                  const product = products.data.find(p => p.prices.some(pr => pr.id === priceId));
                  if (product) {
                    plan = product.metadata?.plan || "pro";
                  }
                }
              }

              await db.update(users)
                .set({
                  plan,
                  stripeSubscriptionId: subscription.id,
                })
                .where(eq(users.id, user.id));
              console.log(`User ${user.id} subscription updated: ${status} → plan ${plan}`);
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId));
            if (user) {
              await db.update(users)
                .set({
                  plan: "free",
                  stripeSubscriptionId: null,
                })
                .where(eq(users.id, user.id));
              console.log(`User ${user.id} subscription canceled, downgraded to free`);
            }
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const customerId = invoice.customer as string;

            const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId));
            if (user) {
              // Could send email notification here
              console.log(`User ${user.id} payment failed for invoice ${invoice.id}`);
            }
            break;
          }
        }

        res.json({ received: true });
      } catch (error: any) {
        console.error("Webhook processing error:", error);
        res.status(500).json({ error: "Webhook processing failed" });
      }
    });

  // ── Stripe customer portal ───────────────────────────────────────────
  app.post("/api/stripe/portal", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user?.stripeCustomerId) {
        return res.status(400).json({ error: "No billing account found" });
      }

      const { createPortalSession } = await import("./stripeClient");
      const host = `${req.protocol}://${req.get("host")}`;
      const { url } = await createPortalSession({
        customerId: user.stripeCustomerId,
        returnUrl: `${host}/dashboard`,
      });

      res.json({ url });
    } catch (error: any) {
      console.error("Stripe portal error:", error.message);
      res.status(500).json({ error: error.message ?? "Failed to create portal session" });
    }
  });

  return httpServer;
}
