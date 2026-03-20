import { storage } from "./storage";
import type { InsertDiscoveredIntent } from "@shared/schema";

// Use OpenRouter free models via OpenAI-compatible API
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const MODEL = "openrouter/stepfun/step-3.5-flash:free"; // free, 256k context

interface DiscoveredIntentData {
  intentName: string;
  description: string;
  exampleQuestions: string[];
  suggestedResponse: string;
  confidence: number;
  category: string;
}

export class IntentDiscoveryService {
  private static readonly INTENT_CATEGORIES = [
    "product_inquiry",
    "pricing",
    "support",
    "returns",
    "shipping",
    "account",
    "complaint",
    "feedback",
    "general",
  ];

  static async discoverIntentsFromDocument(
    documentId: string,
    documentContent: string,
    documentName: string
  ): Promise<DiscoveredIntentData[]> {
    if (!OPENROUTER_API_KEY) {
      console.warn("OpenRouter API key not configured, using sample intents");
      return this.generateSampleIntents(documentName);
    }

    try {
      const systemPrompt = `You are an AI that analyzes business documents to discover customer intents. 
      
Your task is to identify what questions or requests customers might have based on the document content.

For each intent you discover, provide:
1. intentName: A short, descriptive name (e.g., "Product Availability", "Return Policy")
2. description: A brief explanation of what the customer wants to know
3. exampleQuestions: 2-3 example questions a customer might ask
4. suggestedResponse: A helpful response based on the document content
5. confidence: Your confidence level (0-100) that this is a valid customer intent
6. category: One of: ${this.INTENT_CATEGORIES.join(", ")}

Return a JSON array of intents. Discover 3-7 intents depending on document complexity.`;

      const userPrompt = `Analyze this document and discover customer intents:

Document Name: ${documentName}

Content:
${documentContent.slice(0, 8000)}

Return ONLY valid JSON array, no markdown or explanation.`;

      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://aura-ai-platform.com",
          "X-Title": "Aura AI Platform",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "[]";
      
      let cleanedContent = content.trim();
      if (cleanedContent.startsWith("```json")) {
        cleanedContent = cleanedContent.slice(7);
      }
      if (cleanedContent.startsWith("```")) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith("```")) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      cleanedContent = cleanedContent.trim();

      const intents: DiscoveredIntentData[] = JSON.parse(cleanedContent);
      return intents.map((intent) => ({
        intentName: intent.intentName || "Unknown Intent",
        description: intent.description || "",
        exampleQuestions: Array.isArray(intent.exampleQuestions) ? intent.exampleQuestions : [],
        suggestedResponse: intent.suggestedResponse || "",
        confidence: Math.min(100, Math.max(0, intent.confidence || 75)),
        category: this.INTENT_CATEGORIES.includes(intent.category) ? intent.category : "general",
      }));
    } catch (error) {
      console.error("Error discovering intents with OpenRouter:", error);
      return this.generateSampleIntents(documentName);
    }
  }

  static async processDocumentAndSaveIntents(
    documentId: string,
    documentContent: string,
    documentName: string
  ): Promise<void> {
    const discoveredIntents = await this.discoverIntentsFromDocument(
      documentId,
      documentContent,
      documentName
    );

    for (const intent of discoveredIntents) {
      const insertIntent: InsertDiscoveredIntent = {
        documentId,
        intentName: intent.intentName,
        description: intent.description,
        exampleQuestions: intent.exampleQuestions,
        suggestedResponse: intent.suggestedResponse,
        confidence: intent.confidence,
        category: intent.category,
        status: "pending",
      };

      await storage.createDiscoveredIntent(insertIntent);
    }

    console.log(`Discovered ${discoveredIntents.length} intents from document: ${documentName}`);
  }

  private static generateSampleIntents(documentName: string): DiscoveredIntentData[] {
    const baseName = documentName.replace(/\.[^/.]+$/, "").toLowerCase();
    
    const sampleIntents: DiscoveredIntentData[] = [];
    
    if (baseName.includes("product") || baseName.includes("catalog")) {
      sampleIntents.push({
        intentName: "Product Features",
        description: "Customer wants to know about product features and specifications",
        exampleQuestions: [
          "What are the main features of this product?",
          "Can you tell me more about the specifications?",
          "What makes this product different?",
        ],
        suggestedResponse: "I'd be happy to help you understand our product features. Based on our documentation, here are the key highlights...",
        confidence: 85,
        category: "product_inquiry",
      });
      
      sampleIntents.push({
        intentName: "Product Availability",
        description: "Customer inquiring about product stock and availability",
        exampleQuestions: [
          "Is this product in stock?",
          "When will this be available?",
          "Do you have this in other colors?",
        ],
        suggestedResponse: "Let me check the availability for you. I can help you find the right product that meets your needs.",
        confidence: 80,
        category: "product_inquiry",
      });
    }
    
    if (baseName.includes("policy") || baseName.includes("return")) {
      sampleIntents.push({
        intentName: "Return Policy",
        description: "Customer wants to understand return and refund policies",
        exampleQuestions: [
          "What is your return policy?",
          "How do I return an item?",
          "Can I get a refund?",
        ],
        suggestedResponse: "Our return policy allows you to return items within the specified period. Let me explain the process...",
        confidence: 90,
        category: "returns",
      });
    }
    
    if (baseName.includes("shipping") || baseName.includes("delivery")) {
      sampleIntents.push({
        intentName: "Shipping Information",
        description: "Customer wants to know about shipping options and delivery times",
        exampleQuestions: [
          "How long does shipping take?",
          "What shipping options do you offer?",
          "Do you ship internationally?",
        ],
        suggestedResponse: "I can help you with shipping information. We offer various shipping options to meet your needs...",
        confidence: 88,
        category: "shipping",
      });
    }
    
    if (baseName.includes("faq") || baseName.includes("help")) {
      sampleIntents.push({
        intentName: "General Support",
        description: "Customer needs general assistance or has common questions",
        exampleQuestions: [
          "How do I contact support?",
          "Where can I find help?",
          "I need assistance with my order",
        ],
        suggestedResponse: "I'm here to help! Let me guide you to the right resources or answer your question directly.",
        confidence: 82,
        category: "support",
      });
    }
    
    sampleIntents.push({
      intentName: "Pricing Information",
      description: "Customer wants to know about pricing and payment options",
      exampleQuestions: [
        "How much does this cost?",
        "Do you have any discounts?",
        "What payment methods do you accept?",
      ],
      suggestedResponse: "I can help you with pricing information. Let me provide the details you need.",
      confidence: 75,
      category: "pricing",
    });
    
    sampleIntents.push({
      intentName: "Contact Information",
      description: "Customer looking for ways to reach the business",
      exampleQuestions: [
        "How can I contact you?",
        "What are your business hours?",
        "Do you have a phone number?",
      ],
      suggestedResponse: "I'd be happy to help you get in touch with us. Here's how you can reach us...",
      confidence: 70,
      category: "general",
    });
    
    return sampleIntents.slice(0, 5);
  }
}
