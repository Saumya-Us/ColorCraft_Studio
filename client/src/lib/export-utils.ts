export function exportPaletteAsJSON(colors: string[]): void {
  const palette = {
    name: 'ColorCraft Palette',
    colors: colors,
    created: new Date().toISOString(),
    format: 'hex',
  };
  
  const dataStr = JSON.stringify(palette, null, 2);
  downloadFile(dataStr, 'palette.json', 'application/json');
}

export function exportPaletteAsPNG(colors: string[]): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  const colorWidth = 200;
  const colorHeight = 200;
  
  canvas.width = colorWidth * colors.length;
  canvas.height = colorHeight;
  
  colors.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(index * colorWidth, 0, colorWidth, colorHeight);
  });
  
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'palette.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, 'image/png');
}

export function exportPaletteAsSCSS(colors: string[]): void {
  let scss = '// ColorCraft Palette\n';
  scss += '// Generated on ' + new Date().toLocaleString() + '\n\n';
  
  colors.forEach((color, index) => {
    scss += `$color-${index + 1}: ${color};\n`;
  });
  
  scss += '\n// Usage example:\n';
  scss += '// .my-element {\n';
  scss += '//   background-color: $color-1;\n';
  scss += '//   color: $color-2;\n';
  scss += '// }\n';
  
  downloadFile(scss, 'palette.scss', 'text/plain');
}

function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
