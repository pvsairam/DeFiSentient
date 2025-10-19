import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const pools = pgTable("pools", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  chain: varchar("chain", { length: 50 }).notNull(),
  protocol: varchar("protocol", { length: 100 }).notNull(),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  tvl_usd: decimal("tvl_usd", { precision: 20, scale: 2 }),
  apy: decimal("apy", { precision: 10, scale: 4 }),
  apy_base: decimal("apy_base", { precision: 10, scale: 4 }),
  apy_reward: decimal("apy_reward", { precision: 10, scale: 4 }),
  risk_score: integer("risk_score"),
  il_risk: varchar("il_risk", { length: 20 }),
  pool_id: varchar("pool_id", { length: 255 }).unique(),
  last_updated: timestamp("last_updated").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});

export const userSessions = pgTable("user_sessions", {
  session_id: uuid("session_id").primaryKey().default(sql`gen_random_uuid()`),
  sentient_user_id: varchar("sentient_user_id", { length: 255 }),
  preferences: jsonb("preferences"),
  created_at: timestamp("created_at").defaultNow(),
});

export const agentResponses = pgTable("agent_responses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  session_id: uuid("session_id"),
  query: text("query"),
  response: jsonb("response"),
  intermediate_steps: jsonb("intermediate_steps"),
  created_at: timestamp("created_at").defaultNow(),
});

export const aiSettings = pgTable("ai_settings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id", { length: 255 }).notNull().unique(),
  provider: varchar("provider", { length: 50 }).notNull().default('openai'),
  api_keys: jsonb("api_keys").notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPoolSchema = createInsertSchema(pools).omit({
  id: true,
  created_at: true,
  last_updated: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  session_id: true,
  created_at: true,
});

export const insertAgentResponseSchema = createInsertSchema(agentResponses).omit({
  id: true,
  created_at: true,
});

export const insertAiSettingsSchema = createInsertSchema(aiSettings).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type Pool = typeof pools.$inferSelect;
export type InsertPool = z.infer<typeof insertPoolSchema>;

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

export type AgentResponse = typeof agentResponses.$inferSelect;
export type InsertAgentResponse = z.infer<typeof insertAgentResponseSchema>;

export type AiSettings = typeof aiSettings.$inferSelect;
export type InsertAiSettings = z.infer<typeof insertAiSettingsSchema>;
