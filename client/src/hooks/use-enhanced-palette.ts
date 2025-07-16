import { useState, useCallback } from 'react';
import { generateRandomPalette } from '@/lib/color-utils';
import { generateMoodPalette } from '@/lib/mood-palettes';
import { usePaletteHistory } from '@/hooks/use-palette-history';

export function useEnhancedPalette() {
  const [currentPalette, setCurrentPalette] = useState<string[]>(() => 
    generateRandomPalette(5)
  );
  const [lockedColors, setLockedColors] = useState<boolean[]>(() => 
    new Array(5).fill(false)
  );
  
  const { addToHistory, undo, redo, canUndo, canRedo } = usePaletteHistory();

  const generateRandomPaletteCallback = useCallback(() => {
    const newPalette = currentPalette.map((color, index) => 
      lockedColors[index] ? color : generateRandomPalette(1)[0]
    );
    setCurrentPalette(newPalette);
    addToHistory(newPalette, 'Random generation');
  }, [currentPalette, lockedColors, addToHistory]);

  const applyMoodPalette = useCallback((mood: string) => {
    const moodColors = generateMoodPalette(mood);
    // Always use 5 colors, fallback to sunset if not enough
    const fallback = generateMoodPalette('sunset');
    const fullMoodColors = Array(5).fill(null).map((_, i) => moodColors[i] || fallback[i]);
    const newPalette = currentPalette.map((color, index) => 
      lockedColors[index] ? color : (fullMoodColors[index] || color)
    );
    setCurrentPalette(newPalette);
    addToHistory(newPalette, `Mood: ${mood}`);
  }, [currentPalette, lockedColors, addToHistory]);

  const loadPalette = useCallback((colors: string[]) => {
    setCurrentPalette(colors);
    setLockedColors(new Array(colors.length).fill(false));
    addToHistory(colors, 'Palette loaded');
  }, [addToHistory]);

  const setPalette = useCallback((colors: string[]) => {
    setCurrentPalette(colors);
    addToHistory(colors, 'Palette updated');
  }, [addToHistory]);

  const editColor = useCallback((index: number, newColor: string) => {
    const newPalette = [...currentPalette];
    newPalette[index] = newColor;
    setCurrentPalette(newPalette);
    addToHistory(newPalette, `Color ${index + 1} edited`);
  }, [currentPalette, addToHistory]);

  const toggleColorLock = useCallback((index: number) => {
    const newLockedColors = [...lockedColors];
    newLockedColors[index] = !newLockedColors[index];
    setLockedColors(newLockedColors);
  }, [lockedColors]);

  const reorderPalette = useCallback((newColors: string[], newLockedColors: boolean[]) => {
    setCurrentPalette(newColors);
    setLockedColors(newLockedColors);
    addToHistory(newColors, 'Colors reordered');
  }, [addToHistory]);

  const undoCallback = useCallback(() => {
    const previousPalette = undo();
    if (previousPalette) {
      setCurrentPalette(previousPalette);
    }
  }, [undo]);

  const redoCallback = useCallback(() => {
    const nextPalette = redo();
    if (nextPalette) {
      setCurrentPalette(nextPalette);
    }
  }, [redo]);

  return {
    currentPalette,
    lockedColors,
    generateRandomPalette: generateRandomPaletteCallback,
    applyMoodPalette,
    loadPalette,
    setPalette,
    editColor,
    toggleColorLock,
    reorderPalette,
    undo: undoCallback,
    redo: redoCallback,
    canUndo,
    canRedo,
  };
}