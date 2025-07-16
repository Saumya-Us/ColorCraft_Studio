import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPaletteSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create shareable palette
  app.post("/api/palettes/share", async (req, res) => {
    try {
      const { name, colors } = insertPaletteSchema.parse(req.body);
      const shareId = nanoid(10);
      
      const palette = await storage.createPalette({
        name,
        colors,
        shareId,
      });
      
      res.json({ shareId, palette });
    } catch (error) {
      res.status(400).json({ error: "Invalid palette data" });
    }
  });

  // Get palette by share ID
  app.get("/api/palettes/share/:shareId", async (req, res) => {
    try {
      const { shareId } = req.params;
      const palette = await storage.getPaletteByShareId(shareId);
      
      if (!palette) {
        return res.status(404).json({ error: "Palette not found" });
      }
      
      res.json(palette);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve palette" });
    }
  });

  // Get all palettes
  app.get("/api/palettes", async (req, res) => {
    try {
      const palettes = await storage.getAllPalettes();
      res.json(palettes);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve palettes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
