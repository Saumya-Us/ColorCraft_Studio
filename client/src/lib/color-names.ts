// Color name database with AI-like naming
const colorNames: Record<string, string> = {
  // Common colors
  '#FF0000': 'Pure Red',
  '#00FF00': 'Pure Green',
  '#0000FF': 'Pure Blue',
  '#FFFF00': 'Pure Yellow',
  '#FF00FF': 'Pure Magenta',
  '#00FFFF': 'Pure Cyan',
  '#FFFFFF': 'Pure White',
  '#000000': 'Pure Black',
  
  // Reds
  '#FF6B6B': 'Coral Red',
  '#DC143C': 'Crimson',
  '#B22222': 'Fire Brick',
  '#8B0000': 'Dark Red',
  '#FA8072': 'Salmon',
  '#E9967A': 'Dark Salmon',
  '#CD5C5C': 'Indian Red',
  
  // Blues
  '#4ECDC4': 'Turquoise',
  '#45B7D1': 'Sky Blue',
  '#1E90FF': 'Dodger Blue',
  '#0000CD': 'Medium Blue',
  '#000080': 'Navy Blue',
  '#4169E1': 'Royal Blue',
  '#6495ED': 'Cornflower Blue',
  '#87CEEB': 'Sky Blue',
  
  // Greens
  '#90EE90': 'Light Green',
  '#32CD32': 'Lime Green',
  '#00FF7F': 'Spring Green',
  '#00FA9A': 'Medium Spring Green',
  '#98FB98': 'Pale Green',
  '#8FBC8F': 'Dark Sea Green',
  '#228B22': 'Forest Green',
  
  // Yellows
  '#F7DC6F': 'Honey Gold',
  '#FFD700': 'Gold',
  '#FFFFE0': 'Light Yellow',
  '#FFFACD': 'Lemon Chiffon',
  '#F0E68C': 'Khaki',
  '#BDB76B': 'Dark Khaki',
  '#DAA520': 'Goldenrod',
  
  // Purples
  '#BB8FCE': 'Lavender',
  '#9370DB': 'Medium Purple',
  '#8A2BE2': 'Blue Violet',
  '#9400D3': 'Violet',
  '#9932CC': 'Dark Orchid',
  '#BA55D3': 'Medium Orchid',
  '#DDA0DD': 'Plum',
  '#EE82EE': 'Violet',
  
  // Oranges
  '#FFA500': 'Orange',
  '#FF8C00': 'Dark Orange',
  '#FF7F50': 'Coral',
  '#FF6347': 'Tomato',
  '#FF4500': 'Orange Red',
  '#FFA07A': 'Light Salmon',
  '#FFDAB9': 'Peach Puff',
  '#FFE4B5': 'Moccasin',
  
  // Pinks
  '#FFC0CB': 'Pink',
  '#FFB6C1': 'Light Pink',
  '#FF69B4': 'Hot Pink',
  '#FF1493': 'Deep Pink',
  '#C71585': 'Medium Violet Red',
  '#DB7093': 'Pale Violet Red',
  
  // Browns
  '#8B4513': 'Saddle Brown',
  '#A0522D': 'Sienna',
  '#D2691E': 'Chocolate',
  '#CD853F': 'Peru',
  '#DEB887': 'Burlywood',
  '#F4A460': 'Sandy Brown',
  '#D2B48C': 'Tan',
  '#BC8F8F': 'Rosy Brown',
  
  // Grays
  '#808080': 'Gray',
  '#A9A9A9': 'Dark Gray',
  '#C0C0C0': 'Silver',
  '#D3D3D3': 'Light Gray',
  '#DCDCDC': 'Gainsboro',
  '#F5F5F5': 'White Smoke',
  '#696969': 'Dim Gray',
  '#2F4F4F': 'Dark Slate Gray',
};

export function getColorName(hex: string): string {
  const upperHex = hex.toUpperCase();
  
  // Direct match
  if (colorNames[upperHex]) {
    return colorNames[upperHex];
  }
  
  // Try to find similar color
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  return generateColorName(hsl);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number, l: number;
  
  l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    
    h /= 6;
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function generateColorName(hsl: { h: number; s: number; l: number }): string {
  const { h, s, l } = hsl;
  
  // Determine lightness prefix
  let lightnessPrefix = '';
  if (l < 20) lightnessPrefix = 'Dark ';
  else if (l < 40) lightnessPrefix = 'Deep ';
  else if (l > 80) lightnessPrefix = 'Light ';
  else if (l > 60) lightnessPrefix = 'Pale ';
  
  // Determine saturation prefix
  let saturationPrefix = '';
  if (s < 20) saturationPrefix = 'Gray ';
  else if (s < 40) saturationPrefix = 'Muted ';
  else if (s > 80) saturationPrefix = 'Vibrant ';
  
  // Determine base color name
  let baseName = '';
  if (h < 30 || h >= 330) baseName = 'Red';
  else if (h < 60) baseName = 'Orange';
  else if (h < 90) baseName = 'Yellow';
  else if (h < 150) baseName = 'Green';
  else if (h < 210) baseName = 'Cyan';
  else if (h < 270) baseName = 'Blue';
  else if (h < 330) baseName = 'Purple';
  
  return `${saturationPrefix}${lightnessPrefix}${baseName}`.trim();
}
