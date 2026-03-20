import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email").unique(),
  businessName: text("business_name"),
  industry: text("industry"),
  plan: text("plan").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("processing"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  greeting: text("greeting").notNull().default("Hello! How can I help you today?"),
  tone: text("tone").notNull().default("friendly"),
  formality: integer("formality").notNull().default(50),
  responseLength: integer("response_length").notNull().default(50),
  confidenceThreshold: integer("confidence_threshold").notNull().default(70),
  boundaries: text("boundaries").array().default(sql`ARRAY[]::text[]`),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => agents.id),
  visitorId: text("visitor_id"),
  status: text("status").notNull().default("active"),
  satisfaction: integer("satisfaction"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  confidence: integer("confidence"),
  sentiment: text("sentiment"),
  sentimentScore: integer("sentiment_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const widgetConfigs = pgTable("widget_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => agents.id),
  primaryColor: text("primary_color").notNull().default("#7c3aed"),
  position: text("position").notNull().default("bottom-right"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insights = pgTable("insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  confidence: integer("confidence").notNull().default(0),
  frequency: integer("frequency").notNull().default(1),
  suggestedResponses: text("suggested_responses").array().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const revenueEvents = pgTable("revenue_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  eventType: text("event_type").notNull(),
  value: integer("value"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const integrations = pgTable("integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("available"),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const discoveredIntents = pgTable("discovered_intents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").references(() => documents.id),
  intentName: text("intent_name").notNull(),
  description: text("description").notNull(),
  exampleQuestions: text("example_questions").array().default(sql`ARRAY[]::text[]`),
  suggestedResponse: text("suggested_response"),
  confidence: integer("confidence").notNull().default(75),
  category: text("category").notNull().default("general"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const registerUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  businessName: z.string().min(1),
  industry: z.string().min(1),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateAgentSchema = insertAgentSchema.partial();

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertWidgetConfigSchema = createInsertSchema(widgetConfigs).omit({
  id: true,
  createdAt: true,
});

export const insertInsightSchema = createInsertSchema(insights).omit({
  id: true,
  createdAt: true,
});

export const insertRevenueEventSchema = createInsertSchema(revenueEvents).omit({
  id: true,
  createdAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
});

export const insertDiscoveredIntentSchema = createInsertSchema(discoveredIntents).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type UpdateAgent = z.infer<typeof updateAgentSchema>;
export type Agent = typeof agents.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertWidgetConfig = z.infer<typeof insertWidgetConfigSchema>;

export type InsertInsight = z.infer<typeof insertInsightSchema>;
export type Insight = typeof insights.$inferSelect;

export type InsertRevenueEvent = z.infer<typeof insertRevenueEventSchema>;
export type RevenueEvent = typeof revenueEvents.$inferSelect;

export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = typeof integrations.$inferSelect;
export type WidgetConfig = typeof widgetConfigs.$inferSelect;

export type InsertDiscoveredIntent = z.infer<typeof insertDiscoveredIntentSchema>;
export type DiscoveredIntent = typeof discoveredIntents.$inferSelect;
