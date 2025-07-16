// Gradient generation utilities
export type GradientType = 'linear' | 'radial';
export type GradientDirection = 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'to-bottom-right' | 'to-bottom-left' | 'to-top-right' | 'to-top-left';

export interface GradientConfig {
  type: GradientType;
  direction?: GradientDirection;
  colors: string[];
  stops?: number[];
}

export function generateGradientCSS(config: GradientConfig): string {
  const { type, direction = 'to-right', colors, stops } = config;
  
  let colorStops: string[];
  
  if (stops && stops.length === colors.length) {
    colorStops = colors.map((color, index) => `${color} ${stops[index]}%`);
  } else {
    // Evenly distribute colors
    const step = 100 / (colors.length - 1);
    colorStops = colors.map((color, index) => `${color} ${Math.round(index * step)}%`);
  }
  
  if (type === 'linear') {
    // Replace hyphens with spaces for valid CSS direction
    const cssDirection = direction.replace(/-/g, ' ');
    return `linear-gradient(${cssDirection}, ${colorStops.join(', ')})`;
  } else {
    return `radial-gradient(circle, ${colorStops.join(', ')})`;
  }
}

export function generateGradientPresets(colors: string[]): GradientConfig[] {
  // Remove duplicates and filter out falsy values
  const uniqueColors = Array.from(new Set(colors.filter(Boolean)));
  const fallback = ["#FF6B6B", "#4F8EF7", "#FFD93D", "#6BCB77", "#FF6F91"];
  // Always ensure at least 2 distinct colors
  let safeColors = uniqueColors.length >= 2 ? uniqueColors : [...uniqueColors, ...fallback].slice(0, 2);
  let safeColors3 = uniqueColors.length >= 3 ? uniqueColors : [...uniqueColors, ...fallback].slice(0, 3);
  let safeColorsAll = uniqueColors.length >= 2 ? uniqueColors : [...uniqueColors, ...fallback].slice(0, Math.max(2, uniqueColors.length));
  
  const presets: GradientConfig[] = [
    {
      type: 'linear',
      direction: 'to-right',
      colors: safeColors,
    },
    {
      type: 'linear', 
      direction: 'to-bottom',
      colors: safeColors3,
    },
    {
      type: 'linear',
      direction: 'to-bottom-right',
      colors: safeColors,
    },
    {
      type: 'radial',
      colors: safeColors3,
    },
    {
      type: 'linear',
      direction: 'to-right',
      colors: safeColorsAll,
    }
  ];
  return presets;
}

export function exportGradientAsPNG(gradient: string, width: number = 800, height: number = 200): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  canvas.width = width;
  canvas.height = height;
  
  // Create gradient fill
  const tempDiv = document.createElement('div');
  tempDiv.style.background = gradient;
  tempDiv.style.width = `${width}px`;
  tempDiv.style.height = `${height}px`;
  document.body.appendChild(tempDiv);
  
  // Use html2canvas to capture the gradient
  import('html2canvas').then(module => {
    module.default(tempDiv).then(canvas => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'gradient.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        document.body.removeChild(tempDiv);
      }, 'image/png');
    });
  });
}

export const gradientDirections: { value: GradientDirection; label: string }[] = [
  { value: 'to-right', label: 'Left to Right' },
  { value: 'to-left', label: 'Right to Left' },
  { value: 'to-bottom', label: 'Top to Bottom' },
  { value: 'to-top', label: 'Bottom to Top' },
  { value: 'to-bottom-right', label: 'Top-Left to Bottom-Right' },
  { value: 'to-bottom-left', label: 'Top-Right to Bottom-Left' },
  { value: 'to-top-right', label: 'Bottom-Left to Top-Right' },
  { value: 'to-top-left', label: 'Bottom-Right to Top-Left' },
];