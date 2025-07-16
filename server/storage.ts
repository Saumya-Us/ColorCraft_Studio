import { palettes, type Palette, type InsertPalette } from "@shared/schema";

export interface IStorage {
  createPalette(palette: InsertPalette): Promise<Palette>;
  getPaletteByShareId(shareId: string): Promise<Palette | undefined>;
  getAllPalettes(): Promise<Palette[]>;
  deletePalette(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createPalette(insertPalette: InsertPalette): Promise<Palette> {
    const { db } = await import("./db");
    const shareId = insertPalette.shareId || Math.random().toString(36).substring(2, 15);
    
    const [palette] = await db
      .insert(palettes)
      .values({
        name: insertPalette.name,
        colors: insertPalette.colors,
        shareId,
        isPublic: insertPalette.isPublic ?? false,
        metadata: insertPalette.metadata ?? null,
      })
      .returning();
    
    return palette;
  }

  async getPaletteByShareId(shareId: string): Promise<Palette | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    const [palette] = await db
      .select()
      .from(palettes)
      .where(eq(palettes.shareId, shareId));
    
    return palette || undefined;
  }

  async getAllPalettes(): Promise<Palette[]> {
    const { db } = await import("./db");
    const { desc } = await import("drizzle-orm");
    
    const allPalettes = await db
      .select()
      .from(palettes)
      .orderBy(desc(palettes.createdAt));
    
    return allPalettes;
  }

  async deletePalette(id: number): Promise<void> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    await db
      .delete(palettes)
      .where(eq(palettes.id, id));
  }
}

export class MemStorage implements IStorage {
  private palettes: Map<number, Palette>;
  private shareIdMap: Map<string, number>;
  private currentId: number;

  constructor() {
    this.palettes = new Map();
    this.shareIdMap = new Map();
    this.currentId = 1;
  }

  async createPalette(insertPalette: InsertPalette): Promise<Palette> {
    const id = this.currentId++;
    const palette: Palette = {
      id,
      name: insertPalette.name,
      colors: insertPalette.colors,
      shareId: insertPalette.shareId || null,
      isPublic: insertPalette.isPublic ?? false,
      metadata: insertPalette.metadata ?? null,
      createdAt: new Date(),
    };
    
    this.palettes.set(id, palette);
    
    if (palette.shareId) {
      this.shareIdMap.set(palette.shareId, id);
    }
    
    return palette;
  }

  async getPaletteByShareId(shareId: string): Promise<Palette | undefined> {
    const id = this.shareIdMap.get(shareId);
    if (!id) return undefined;
    return this.palettes.get(id);
  }

  async getAllPalettes(): Promise<Palette[]> {
    return Array.from(this.palettes.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async deletePalette(id: number): Promise<void> {
    const palette = this.palettes.get(id);
    if (palette?.shareId) {
      this.shareIdMap.delete(palette.shareId);
    }
    this.palettes.delete(id);
  }
}

export const storage = new DatabaseStorage();
