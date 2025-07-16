import { useState, useCallback } from 'react';

export interface PaletteHistoryEntry {
  palette: string[];
  timestamp: number;
  action: string;
}

export function usePaletteHistory() {
  const [history, setHistory] = useState<PaletteHistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback((palette: string[], action: string) => {
    const entry: PaletteHistoryEntry = {
      palette: [...palette],
      timestamp: Date.now(),
      action,
    };

    setHistory(prev => {
      // Remove any entries after current index (when undoing then making new changes)
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(entry);
      
      // Keep only last 50 entries to prevent memory issues
      const trimmedHistory = newHistory.slice(-50);
      return trimmedHistory;
    });
    
    setCurrentIndex(prev => Math.min(prev + 1, 49));
  }, [currentIndex]);

  const undo = useCallback((): string[] | null => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      return history[newIndex].palette;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback((): string[] | null => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      return history[newIndex].palette;
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const getCurrentPalette = useCallback((): string[] | null => {
    if (currentIndex >= 0 && currentIndex < history.length) {
      return history[currentIndex].palette;
    }
    return null;
  }, [currentIndex, history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    getCurrentPalette,
    clearHistory,
    history: history.slice(0, currentIndex + 1), // Only show history up to current index
  };
}