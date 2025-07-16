// AI-based mood and keyword palette generator
export interface MoodPalette {
  name: string;
  colors: string[];
  keywords: string[];
  category: string;
}

export const moodPalettes: Record<string, MoodPalette> = {
  sunset: {
    name: "Sunset Dreams",
    colors: ["#FF6B35", "#F7931E", "#FFD23F", "#F8BBD0", "#E57373"],
    keywords: ["sunset", "warm", "evening", "golden", "romantic"],
    category: "Nature"
  },
  ocean: {
    name: "Ocean Depths",
    colors: ["#006064", "#0097A7", "#00BCD4", "#4FC3F7", "#81D4FA"],
    keywords: ["ocean", "water", "calm", "blue", "peaceful"],
    category: "Nature"
  },
  forest: {
    name: "Forest Whisper",
    colors: ["#1B5E20", "#2E7D32", "#388E3C", "#66BB6A", "#A5D6A7"],
    keywords: ["forest", "nature", "green", "fresh", "natural"],
    category: "Nature"
  },
  vintage: {
    name: "Vintage Charm",
    colors: ["#8D6E63", "#A1887F", "#BCAAA4", "#D7CCC8", "#EFEBE9"],
    keywords: ["vintage", "retro", "old", "brown", "classic"],
    category: "Classic"
  },
  neon: {
    name: "Neon Nights",
    colors: ["#E91E63", "#9C27B0", "#3F51B5", "#00BCD4", "#4CAF50"],
    keywords: ["neon", "bright", "electric", "cyberpunk", "vibrant"],
    category: "Trendy"
  },
  pastel: {
    name: "Pastel Softness",
    colors: ["#F8BBD0", "#E1BEE7", "#C5CAE9", "#BBDEFB", "#C8E6C9"],
    keywords: ["pastel", "soft", "gentle", "light", "delicate"],
    category: "Trendy"
  },
  tropical: {
    name: "Tropical Paradise",
    colors: ["#FF5722", "#FF9800", "#FFEB3B", "#4CAF50", "#00BCD4"],
    keywords: ["tropical", "summer", "bright", "paradise", "vacation"],
    category: "Nature"
  },
  monochrome: {
    name: "Monochrome Elegance",
    colors: ["#000000", "#424242", "#757575", "#BDBDBD", "#FFFFFF"],
    keywords: ["black", "white", "gray", "minimal", "elegant"],
    category: "Classic"
  },
  autumn: {
    name: "Autumn Leaves",
    colors: ["#D32F2F", "#FF5722", "#FF9800", "#FFC107", "#8BC34A"],
    keywords: ["autumn", "fall", "leaves", "warm", "cozy"],
    category: "Seasons"
  },
  cyberpunk: {
    name: "Cyberpunk Future",
    colors: ["#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#00BCD4"],
    keywords: ["cyberpunk", "future", "tech", "purple", "neon"],
    category: "Trendy"
  },
  cozy: {
    name: "Cozy Blanket",
    colors: ["#A0522D", "#FFDAB9", "#FFF8DC", "#B22222", "#8B4513"],
    keywords: ["cozy", "warm", "blanket", "snug", "comfort"],
    category: "Feelings"
  },
  energetic: {
    name: "Energetic Burst",
    colors: ["#FF1744", "#FF9100", "#FFD600", "#00E676", "#2979FF"],
    keywords: ["energetic", "burst", "active", "vivid", "dynamic"],
    category: "Feelings"
  },
  minimal: {
    name: "Minimal Zen",
    colors: ["#FFFFFF", "#F5F5F5", "#BDBDBD", "#757575", "#212121"],
    keywords: ["minimal", "zen", "simple", "clean", "modern"],
    category: "Classic"
  },
  royal: {
    name: "Royal Majesty",
    colors: ["#512DA8", "#9575CD", "#FFD700", "#C0C0C0", "#212121"],
    keywords: ["royal", "majesty", "luxury", "gold", "purple"],
    category: "Classic"
  },
  earthy: {
    name: "Earthy Roots",
    colors: ["#6D4C41", "#A1887F", "#D7CCC8", "#8D6E63", "#4E342E"],
    keywords: ["earthy", "roots", "brown", "natural", "organic"],
    category: "Nature"
  },
  ice: {
    name: "Icy Chill",
    colors: ["#E0F7FA", "#B3E5FC", "#81D4FA", "#0288D1", "#01579B"],
    keywords: ["ice", "chill", "cold", "winter", "frost"],
    category: "Seasons"
  },
  space: {
    name: "Space Odyssey",
    colors: ["#212121", "#512DA8", "#1976D2", "#00B8D4", "#B2EBF2"],
    keywords: ["space", "odyssey", "galaxy", "star", "cosmos"],
    category: "Trendy"
  },
  spring: {
    name: "Spring Bloom",
    colors: ["#AED581", "#FFEB3B", "#FFB300", "#FF8A65", "#BA68C8"],
    keywords: ["spring", "bloom", "fresh", "flowers", "renewal"],
    category: "Seasons"
  },
  rainy: {
    name: "Rainy Day",
    colors: ["#90A4AE", "#B0BEC5", "#78909C", "#607D8B", "#263238"],
    keywords: ["rainy", "rain", "cloud", "wet", "storm"],
    category: "Seasons"
  },
  luxury: {
    name: "Luxury Gold",
    colors: ["#FFD700", "#C0C0C0", "#B8860B", "#8B8000", "#FFF8DC"],
    keywords: ["luxury", "gold", "rich", "elegant", "wealth"],
    category: "Classic"
  },
  playful: {
    name: "Playful Fun",
    colors: ["#FFEB3B", "#FF4081", "#536DFE", "#00E676", "#FF9100"],
    keywords: ["playful", "fun", "joy", "happy", "bright"],
    category: "Feelings"
  },
  serene: {
    name: "Serene Calm",
    colors: ["#B3E5FC", "#B2DFDB", "#C8E6C9", "#FFF9C4", "#FFECB3"],
    keywords: ["serene", "calm", "peaceful", "quiet", "soft"],
    category: "Feelings"
  },
  mystic: {
    name: "Mystic Night",
    colors: ["#4A148C", "#6A1B9A", "#283593", "#1565C0", "#00838F"],
    keywords: ["mystic", "night", "mystery", "deep", "dream"],
    category: "Trendy"
  },
  bold: {
    name: "Bold Statement",
    colors: ["#D50000", "#C51162", "#AA00FF", "#304FFE", "#00B8D4"],
    keywords: ["bold", "statement", "loud", "vivid", "striking"],
    category: "Trendy"
  },
  retro: {
    name: "Retro Pop",
    colors: ["#FF5252", "#FFEB3B", "#40C4FF", "#69F0AE", "#FFD740"],
    keywords: ["retro", "pop", "old", "classic", "vintage"],
    category: "Classic"
  },
  brown1: {
    name: "Cocoa Comfort",
    colors: ["#7B3F00", "#A0522D", "#D2B48C", "#8B5C2A", "#C19A6B"],
    keywords: ["brown", "cocoa", "warm", "earthy", "comfort"],
    category: "Feelings"
  },
  brown2: {
    name: "Rustic Earth",
    colors: ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F4A460"],
    keywords: ["brown", "rustic", "earth", "natural", "wood"],
    category: "Nature"
  },
  brown3: {
    name: "Vintage Leather",
    colors: ["#5C4033", "#8B5C2A", "#A67B5B", "#C9AE5D", "#E5C29F"],
    keywords: ["brown", "vintage", "leather", "classic", "retro"],
    category: "Classic"
  }
};

export function generateMoodPalette(mood: string): string[] {
  const normalizedMood = mood.toLowerCase().trim();
  
  // Direct match
  if (moodPalettes[normalizedMood]) {
    return moodPalettes[normalizedMood].colors;
  }
  
  // Fuzzy matching by keywords
  for (const [key, palette] of Object.entries(moodPalettes)) {
    if (palette.keywords.some(keyword => 
      normalizedMood.includes(keyword) || keyword.includes(normalizedMood)
    )) {
      return palette.colors;
    }
  }
  
  // Generate based on color keywords
  const colorMap: Record<string, string[]> = {
    red: ["#F44336", "#E91E63", "#FF5722", "#FF9800", "#FFEB3B"],
    blue: ["#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50"],
    green: ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107"],
    purple: ["#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4"],
    orange: ["#FF9800", "#FF5722", "#F44336", "#E91E63", "#9C27B0"],
    yellow: ["#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#F44336"],
    pink: ["#E91E63", "#F8BBD0", "#FCE4EC", "#F3E5F5", "#EDE7F6"],
  };
  
  for (const [color, palette] of Object.entries(colorMap)) {
    if (normalizedMood.includes(color)) {
      return palette;
    }
  }
  
  // Default fallback
  return moodPalettes.sunset.colors;
}

export function getAllMoodNames(): string[] {
  return Object.keys(moodPalettes);
}

export function searchMoodsByKeyword(keyword: string): MoodPalette[] {
  const normalizedKeyword = keyword.toLowerCase().trim();
  return Object.values(moodPalettes).filter(palette =>
    palette.keywords.some(k => k.includes(normalizedKeyword)) ||
    palette.name.toLowerCase().includes(normalizedKeyword)
  );
}