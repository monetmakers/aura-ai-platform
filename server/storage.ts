import { 
  type User, type InsertUser,
  type Document, type InsertDocument,
  type Agent, type InsertAgent, type UpdateAgent,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type WidgetConfig, type InsertWidgetConfig,
  type Insight, type InsertInsight,
  type RevenueEvent, type InsertRevenueEvent,
  type Integration, type InsertIntegration,
  type DiscoveredIntent, type InsertDiscoveredIntent
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocumentStatus(id: string, status: string, content?: string): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<boolean>;

  getAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, agent: UpdateAgent): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<boolean>;

  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conv: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;

  getMessages(conversationId: string): Promise<Message[]>;
  getAllMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  getWidgetConfig(agentId: string): Promise<WidgetConfig | undefined>;
  createOrUpdateWidgetConfig(config: InsertWidgetConfig): Promise<WidgetConfig>;

  getInsights(): Promise<Insight[]>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  clearInsights(): Promise<void>;

  getRevenueEvents(): Promise<RevenueEvent[]>;
  createRevenueEvent(event: InsertRevenueEvent): Promise<RevenueEvent>;

  getIntegrations(): Promise<Integration[]>;
  updateIntegrationStatus(id: string, status: string): Promise<Integration | undefined>;

  getDiscoveredIntents(): Promise<DiscoveredIntent[]>;
  getDiscoveredIntentsByDocument(documentId: string): Promise<DiscoveredIntent[]>;
  createDiscoveredIntent(intent: InsertDiscoveredIntent): Promise<DiscoveredIntent>;
  updateDiscoveredIntentStatus(id: string, status: string): Promise<DiscoveredIntent | undefined>;
  deleteDiscoveredIntent(id: string): Promise<boolean>;

  getStats(): Promise<{
    totalDocuments: number;
    totalConversations: number;
    totalMessages: number;
    avgSatisfaction: number;
  }>;

  getRevenueStats(): Promise<{
    totalConversions: number;
    totalValue: number;
    missedOpportunities: number;
    sentimentTrend: number;
  }>;

  getAllDocumentContent(): Promise<string>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private documents: Map<string, Document>;
  private agents: Map<string, Agent>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;
  private widgetConfigs: Map<string, WidgetConfig>;
  private insights: Map<string, Insight>;
  private revenueEvents: Map<string, RevenueEvent>;
  private integrations: Map<string, Integration>;
  private discoveredIntents: Map<string, DiscoveredIntent>;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.agents = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.widgetConfigs = new Map();
    this.insights = new Map();
    this.revenueEvents = new Map();
    this.integrations = new Map();
    this.discoveredIntents = new Map();

    this.seedDefaultAgent();
    this.seedSupportAgent();
    this.seedDefaultIntegrations();
  }

  private seedDefaultAgent() {
    const defaultAgent: Agent = {
      id: "default-agent",
      name: "Support Bot",
      greeting: "Hello! How can I help you today?",
      tone: "friendly",
      formality: 50,
      responseLength: 50,
      confidenceThreshold: 70,
      boundaries: ["competitor pricing", "legal advice", "medical advice"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.agents.set(defaultAgent.id, defaultAgent);
  }

  private seedSupportAgent() {
    const supportAgent: Agent = {
      id: "support-agent",
      name: "Aura Support",
      greeting: "Hi there! 👋 I'm Aura's AI support assistant. I can help you with getting started, integrations, billing, and troubleshooting. What do you need help with?",
      tone: "friendly",
      formality: 40,
      responseLength: 70,
      confidenceThreshold: 80,
      boundaries: ["competitor pricing", "legal advice", "medical advice", "personal opinions"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.agents.set(supportAgent.id, supportAgent);
  }

  private seedDefaultIntegrations() {
    const defaultIntegrations: Integration[] = [
      // E-Commerce Platforms
      { id: "shopify", name: "Shopify", type: "ecommerce", status: "available", config: null, createdAt: new Date() },
      { id: "amazon", name: "Amazon", type: "ecommerce", status: "available", config: null, createdAt: new Date() },
      { id: "etsy", name: "Etsy", type: "ecommerce", status: "available", config: null, createdAt: new Date() },
      { id: "alibaba", name: "Alibaba", type: "ecommerce", status: "available", config: null, createdAt: new Date() },
      { id: "woocommerce", name: "WooCommerce", type: "ecommerce", status: "available", config: null, createdAt: new Date() },
      { id: "ebay", name: "eBay", type: "ecommerce", status: "available", config: null, createdAt: new Date() },
      
      // Lithuanian Marketplaces
      { id: "autoplius", name: "Autoplius.lt", type: "marketplace", status: "available", config: null, createdAt: new Date() },
      { id: "skelbiu", name: "Skelbiu.lt", type: "marketplace", status: "available", config: null, createdAt: new Date() },
      { id: "aruodas", name: "Aruodas.lt", type: "marketplace", status: "available", config: null, createdAt: new Date() },
      
      // Social Media & Messaging
      { id: "facebook", name: "Facebook Messenger", type: "messaging", status: "available", config: null, createdAt: new Date() },
      { id: "instagram", name: "Instagram", type: "messaging", status: "available", config: null, createdAt: new Date() },
      { id: "telegram", name: "Telegram", type: "messaging", status: "available", config: null, createdAt: new Date() },
      { id: "whatsapp", name: "WhatsApp Business", type: "messaging", status: "available", config: null, createdAt: new Date() },
      { id: "viber", name: "Viber", type: "messaging", status: "available", config: null, createdAt: new Date() },
      
      // Communication & Team Chat
      { id: "slack", name: "Slack", type: "communication", status: "available", config: null, createdAt: new Date() },
      { id: "discord", name: "Discord", type: "communication", status: "available", config: null, createdAt: new Date() },
      { id: "teams", name: "Microsoft Teams", type: "communication", status: "available", config: null, createdAt: new Date() },
      
      // Scheduling
      { id: "calendly", name: "Calendly", type: "scheduling", status: "available", config: null, createdAt: new Date() },
      { id: "google-calendar", name: "Google Calendar", type: "scheduling", status: "available", config: null, createdAt: new Date() },
      
      // CRM & Help Desk
      { id: "zendesk", name: "Zendesk", type: "helpdesk", status: "available", config: null, createdAt: new Date() },
      { id: "intercom", name: "Intercom", type: "helpdesk", status: "available", config: null, createdAt: new Date() },
      { id: "freshdesk", name: "Freshdesk", type: "helpdesk", status: "available", config: null, createdAt: new Date() },
      { id: "hubspot", name: "HubSpot", type: "crm", status: "available", config: null, createdAt: new Date() },
      { id: "salesforce", name: "Salesforce", type: "crm", status: "available", config: null, createdAt: new Date() },
      { id: "pipedrive", name: "Pipedrive", type: "crm", status: "available", config: null, createdAt: new Date() },
      
      // Payment
      { id: "stripe", name: "Stripe", type: "payment", status: "available", config: null, createdAt: new Date() },
      { id: "paypal", name: "PayPal", type: "payment", status: "available", config: null, createdAt: new Date() },
    ];
    defaultIntegrations.forEach(i => this.integrations.set(i.id, i));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values()).sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      id,
      name: doc.name,
      type: doc.type,
      size: doc.size,
      content: doc.content,
      status: doc.status ?? "processing",
      uploadedAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocumentStatus(id: string, status: string, content?: string): Promise<Document | undefined> {
    const doc = this.documents.get(id);
    if (!doc) return undefined;
    doc.status = status;
    if (content !== undefined) {
      doc.content = content;
    }
    this.documents.set(id, doc);
    return doc;
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const newAgent: Agent = {
      id,
      name: agent.name,
      greeting: agent.greeting ?? "Hello! How can I help you today?",
      tone: agent.tone ?? "friendly",
      formality: agent.formality ?? 50,
      responseLength: agent.responseLength ?? 50,
      confidenceThreshold: agent.confidenceThreshold ?? 70,
      boundaries: agent.boundaries ?? [],
      isActive: agent.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.agents.set(id, newAgent);
    return newAgent;
  }

  async updateAgent(id: string, updates: UpdateAgent): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    const updated: Agent = {
      ...agent,
      ...updates,
      boundaries: updates.boundaries ?? agent.boundaries,
      updatedAt: new Date(),
    };
    this.agents.set(id, updated);
    return updated;
  }

  async deleteAgent(id: string): Promise<boolean> {
    return this.agents.delete(id);
  }

  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(conv: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      id,
      agentId: conv.agentId ?? null,
      visitorId: conv.visitorId ?? null,
      status: conv.status ?? "active",
      satisfaction: conv.satisfaction ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conv = this.conversations.get(id);
    if (!conv) return undefined;
    const updated: Conversation = {
      ...conv,
      ...updates,
      updatedAt: new Date(),
    };
    this.conversations.set(id, updated);
    return updated;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getAllMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const newMessage: Message = {
      id,
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      confidence: message.confidence ?? null,
      sentiment: message.sentiment ?? null,
      sentimentScore: message.sentimentScore ?? null,
      createdAt: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getWidgetConfig(agentId: string): Promise<WidgetConfig | undefined> {
    return Array.from(this.widgetConfigs.values()).find(w => w.agentId === agentId);
  }

  async createOrUpdateWidgetConfig(config: InsertWidgetConfig): Promise<WidgetConfig> {
    const existing = await this.getWidgetConfig(config.agentId ?? "");
    if (existing) {
      const updated: WidgetConfig = {
        id: existing.id,
        agentId: config.agentId ?? existing.agentId,
        primaryColor: config.primaryColor ?? existing.primaryColor,
        position: config.position ?? existing.position,
        createdAt: existing.createdAt,
      };
      this.widgetConfigs.set(existing.id, updated);
      return updated;
    }
    const id = randomUUID();
    const newConfig: WidgetConfig = {
      id,
      agentId: config.agentId ?? null,
      primaryColor: config.primaryColor ?? "#7c3aed",
      position: config.position ?? "bottom-right",
      createdAt: new Date(),
    };
    this.widgetConfigs.set(id, newConfig);
    return newConfig;
  }

  async getStats(): Promise<{
    totalDocuments: number;
    totalConversations: number;
    totalMessages: number;
    avgSatisfaction: number;
  }> {
    const conversations = Array.from(this.conversations.values());
    const satisfiedConvs = conversations.filter(c => c.satisfaction !== null);
    const avgSatisfaction = satisfiedConvs.length > 0
      ? satisfiedConvs.reduce((sum, c) => sum + (c.satisfaction || 0), 0) / satisfiedConvs.length
      : 0;

    return {
      totalDocuments: this.documents.size,
      totalConversations: this.conversations.size,
      totalMessages: this.messages.size,
      avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
    };
  }

  async getAllDocumentContent(): Promise<string> {
    const docs = await this.getDocuments();
    if (docs.length === 0) return "";
    return docs
      .filter(d => d.status === "ready")
      .map(d => `--- Document: ${d.name} ---\n${d.content}`)
      .join("\n\n");
  }

  async getInsights(): Promise<Insight[]> {
    return Array.from(this.insights.values()).sort(
      (a, b) => b.frequency - a.frequency
    );
  }

  async createInsight(insight: InsertInsight): Promise<Insight> {
    const id = randomUUID();
    const newInsight: Insight = {
      id,
      type: insight.type,
      category: insight.category,
      description: insight.description,
      confidence: insight.confidence ?? 0,
      frequency: insight.frequency ?? 1,
      suggestedResponses: insight.suggestedResponses ?? [],
      createdAt: new Date(),
    };
    this.insights.set(id, newInsight);
    return newInsight;
  }

  async clearInsights(): Promise<void> {
    this.insights.clear();
  }

  async getRevenueEvents(): Promise<RevenueEvent[]> {
    return Array.from(this.revenueEvents.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createRevenueEvent(event: InsertRevenueEvent): Promise<RevenueEvent> {
    const id = randomUUID();
    const newEvent: RevenueEvent = {
      id,
      conversationId: event.conversationId ?? null,
      eventType: event.eventType,
      value: event.value ?? null,
      description: event.description ?? null,
      createdAt: new Date(),
    };
    this.revenueEvents.set(id, newEvent);
    return newEvent;
  }

  async getIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }

  async updateIntegrationStatus(id: string, status: string): Promise<Integration | undefined> {
    const integration = this.integrations.get(id);
    if (!integration) return undefined;
    integration.status = status;
    this.integrations.set(id, integration);
    return integration;
  }

  async getRevenueStats(): Promise<{
    totalConversions: number;
    totalValue: number;
    missedOpportunities: number;
    sentimentTrend: number;
  }> {
    const events = Array.from(this.revenueEvents.values());
    const conversions = events.filter(e => e.eventType === "conversion");
    const missed = events.filter(e => e.eventType === "missed_opportunity");
    
    const messages = Array.from(this.messages.values());
    const sentimentMessages = messages.filter(m => m.sentimentScore !== null);
    const avgSentiment = sentimentMessages.length > 0
      ? sentimentMessages.reduce((sum, m) => sum + (m.sentimentScore || 0), 0) / sentimentMessages.length
      : 50;

    return {
      totalConversions: conversions.length,
      totalValue: conversions.reduce((sum, e) => sum + (e.value || 0), 0),
      missedOpportunities: missed.length,
      sentimentTrend: Math.round(avgSentiment),
    };
  }

  async getDiscoveredIntents(): Promise<DiscoveredIntent[]> {
    return Array.from(this.discoveredIntents.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getDiscoveredIntentsByDocument(documentId: string): Promise<DiscoveredIntent[]> {
    return Array.from(this.discoveredIntents.values())
      .filter(intent => intent.documentId === documentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createDiscoveredIntent(intent: InsertDiscoveredIntent): Promise<DiscoveredIntent> {
    const id = randomUUID();
    const newIntent: DiscoveredIntent = {
      id,
      documentId: intent.documentId ?? null,
      intentName: intent.intentName,
      description: intent.description,
      exampleQuestions: intent.exampleQuestions ?? [],
      suggestedResponse: intent.suggestedResponse ?? null,
      confidence: intent.confidence ?? 75,
      category: intent.category ?? "general",
      status: intent.status ?? "pending",
      createdAt: new Date(),
    };
    this.discoveredIntents.set(id, newIntent);
    return newIntent;
  }

  async updateDiscoveredIntentStatus(id: string, status: string): Promise<DiscoveredIntent | undefined> {
    const intent = this.discoveredIntents.get(id);
    if (!intent) return undefined;
    intent.status = status;
    this.discoveredIntents.set(id, intent);
    return intent;
  }

  async deleteDiscoveredIntent(id: string): Promise<boolean> {
    return this.discoveredIntents.delete(id);
  }
}

export const storage = new MemStorage();
