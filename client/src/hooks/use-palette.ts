import { useState, useCallback } from 'react';
import { generateRandomPalette } from '@/lib/color-utils';

export function usePalette() {
  const [currentPalette, setCurrentPalette] = useState<string[]>(() => 
    generateRandomPalette(5)
  );

  const generateRandomPaletteCallback = useCallback(() => {
    setCurrentPalette(generateRandomPalette(5));
  }, []);

  const loadPalette = useCallback((colors: string[]) => {
    setCurrentPalette(colors);
  }, []);

  const setPalette = useCallback((colors: string[]) => {
    setCurrentPalette(colors);
  }, []);

  return {
    currentPalette,
    generateRandomPalette: generateRandomPaletteCallback,
    loadPalette,
    setPalette,
  };
}
