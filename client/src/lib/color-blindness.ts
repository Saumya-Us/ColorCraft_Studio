// Color blindness simulation utilities
export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'normal';

export interface ColorBlindnessSimulation {
  name: string;
  description: string;
  type: ColorBlindnessType;
}

export const colorBlindnessTypes: ColorBlindnessSimulation[] = [
  {
    name: "Normal Vision",
    description: "Standard color vision without any deficiencies",
    type: "normal"
  },
  {
    name: "Protanopia",
    description: "Red-blind - difficulty distinguishing red from green",
    type: "protanopia"
  },
  {
    name: "Deuteranopia", 
    description: "Green-blind - difficulty distinguishing red from green",
    type: "deuteranopia"
  },
  {
    name: "Tritanopia",
    description: "Blue-blind - difficulty distinguishing blue from yellow",
    type: "tritanopia"
  }
];

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

function rgbToHex(r: number, g: number, b: number): string {
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

export function simulateColorBlindness(color: string, type: ColorBlindnessType): string {
  if (type === 'normal') return color;
  
  const { r, g, b } = hexToRgb(color);
  
  // Convert to linear RGB
  const rLinear = Math.pow(r / 255, 2.2);
  const gLinear = Math.pow(g / 255, 2.2);
  const bLinear = Math.pow(b / 255, 2.2);
  
  let rSim: number, gSim: number, bSim: number;
  
  switch (type) {
    case 'protanopia':
      // Protanopia transformation matrix
      rSim = 0.567 * rLinear + 0.433 * gLinear + 0 * bLinear;
      gSim = 0.558 * rLinear + 0.442 * gLinear + 0 * bLinear;
      bSim = 0 * rLinear + 0.242 * gLinear + 0.758 * bLinear;
      break;
      
    case 'deuteranopia':
      // Deuteranopia transformation matrix
      rSim = 0.625 * rLinear + 0.375 * gLinear + 0 * bLinear;
      gSim = 0.7 * rLinear + 0.3 * gLinear + 0 * bLinear;
      bSim = 0 * rLinear + 0.3 * gLinear + 0.7 * bLinear;
      break;
      
    case 'tritanopia':
      // Tritanopia transformation matrix
      rSim = 0.95 * rLinear + 0.05 * gLinear + 0 * bLinear;
      gSim = 0 * rLinear + 0.433 * gLinear + 0.567 * bLinear;
      bSim = 0 * rLinear + 0.475 * gLinear + 0.525 * bLinear;
      break;
      
    default:
      return color;
  }
  
  // Convert back to sRGB
  const rFinal = Math.pow(Math.max(0, Math.min(1, rSim)), 1/2.2) * 255;
  const gFinal = Math.pow(Math.max(0, Math.min(1, gSim)), 1/2.2) * 255;
  const bFinal = Math.pow(Math.max(0, Math.min(1, bSim)), 1/2.2) * 255;
  
  return rgbToHex(rFinal, gFinal, bFinal);
}

export function simulatePaletteColorBlindness(colors: string[], type: ColorBlindnessType): string[] {
  return colors.map(color => simulateColorBlindness(color, type));
}