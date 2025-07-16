import { pgTable, text, serial, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const palettes = pgTable("palettes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  colors: text("colors").array().notNull(),
  shareId: text("share_id").unique(),
  isPublic: boolean("is_public").default(false),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaletteSchema = createInsertSchema(palettes).pick({
  name: true,
  colors: true,
  shareId: true,
  isPublic: true,
  metadata: true,
});

export type InsertPalette = z.infer<typeof insertPaletteSchema>;
export type Palette = typeof palettes.$inferSelect;
