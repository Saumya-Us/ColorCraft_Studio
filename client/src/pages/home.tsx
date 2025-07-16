import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnhancedPalette } from "@/hooks/use-enhanced-palette";
import { EnhancedPaletteGrid } from "@/components/enhanced-palette-grid";
import { MoodGenerator } from "@/components/mood-generator";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { GradientGenerator } from "@/components/gradient-generator";
import { UIPreview } from "@/components/ui-preview";
import { SavedPaletteCard } from "@/components/saved-palette-card";
import { ContrastChecker } from "@/components/contrast-checker";
import { ColorTheoryTips } from "@/components/color-theory-tips";
import { SavePaletteModal } from "@/components/modals/save-palette-modal";
import { ImageUploadModal } from "@/components/modals/image-upload-modal";
import { EnhancedShareModal } from "@/components/enhanced-share-modal";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { Palette, Dice2, ImageIcon, SaveIcon, MoonIcon, SunIcon, Sparkles, Eye, Paintbrush, Monitor } from "lucide-react";

export default function Home() {
  const { shareId } = useParams();
  const { toast } = useToast();
  const { 
    currentPalette, 
    lockedColors,
    generateRandomPalette, 
    applyMoodPalette,
    loadPalette, 
    setPalette,
    editColor,
    toggleColorLock,
    reorderPalette,
    undo,
    redo,
    canUndo,
    canRedo
  } = useEnhancedPalette();
  const [savedPalettes, setSavedPalettes] = useLocalStorage<Array<{
    id: string;
    name: string;
    colors: string[];
    created: string;
  }>>('colorcraft-palettes', []);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('colorcraft-darkmode', false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Load shared palette if shareId is provided
  const { data: sharedPalette } = useQuery({
    queryKey: [`/api/palettes/share/${shareId}`],
    enabled: !!shareId,
  });

  useEffect(() => {
    if (sharedPalette) {
      setPalette(sharedPalette.colors);
      toast({
        title: "Palette loaded",
        description: `Loaded "${sharedPalette.name}" palette`,
      });
    }
  }, [sharedPalette, setPalette, toast]);

  useEffect(() => {
    // Apply dark mode class immediately for instant theme switching
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSavePalette = (name: string) => {
    const newPalette = {
      id: Date.now().toString(),
      name,
      colors: currentPalette,
      created: new Date().toISOString(),
    };
    setSavedPalettes([...savedPalettes, newPalette]);
    setShowSaveModal(false);
    toast({
      title: "Palette saved",
      description: `"${name}" has been saved successfully`,
    });
  };

  const handleDeletePalette = (id: string) => {
    setSavedPalettes(savedPalettes.filter(p => p.id !== id));
    toast({
      title: "Palette deleted",
      description: "Palette has been removed",
    });
  };

  const handleLoadSavedPalette = (colors: string[]) => {
    setPalette(colors);
    toast({
      title: "Palette loaded",
      description: "Palette has been loaded successfully",
    });
  };

  const clearAllPalettes = () => {
    setSavedPalettes([]);
    toast({
      title: "All palettes cleared",
      description: "All saved palettes have been removed",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Palette className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">ColorCraft</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Smart Color Palette Generator</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-slate-600" />
                )}
              </Button>
              
              <Button
                onClick={() => setShowSaveModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                Save Palette
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Enhanced Generator Section */}
        <section className="mb-12">
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Enhanced Palette Generator
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Create, edit, and reorder colors with advanced features
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  onClick={generateRandomPalette}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                >
                  <Dice2 className="w-4 h-4 mr-2" />
                  Generate
                </Button>
                <Button
                  onClick={() => setShowImageModal(true)}
                  variant="secondary"
                  className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  From Image
                </Button>
              </div>
            </div>
            
            <EnhancedPaletteGrid 
              colors={currentPalette} 
              lockedColors={lockedColors}
              onColorEdit={editColor}
              onColorReorder={reorderPalette}
              onLockToggle={toggleColorLock}
              onShare={() => setShowShareModal(true)}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </motion.div>
        </section>
        
        {/* Enhanced Tools Section */}
        <section className="mb-12">
          <Tabs defaultValue="generators" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="generators" className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Generators
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Accessibility
              </TabsTrigger>
              <TabsTrigger value="gradients" className="flex items-center">
                <Paintbrush className="w-4 h-4 mr-2" />
                Gradients
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center">
                <Monitor className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <TabsContent key="generators" value="generators">
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MoodGenerator onPaletteGenerated={applyMoodPalette} />
                  <div className="space-y-6">
                    <ContrastChecker colors={currentPalette} />
                    <ColorTheoryTips onApplyHarmonyPalette={applyMoodPalette} />
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent key="accessibility" value="accessibility">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AccessibilityPanel 
                    colors={currentPalette} 
                    onSuggestedAlternative={(index, newColor) => {
                      editColor(index, newColor);
                      toast({
                        title: "Color updated",
                        description: "Applied accessibility improvement",
                      });
                    }}
                  />
                </motion.div>
              </TabsContent>
              
              <TabsContent key="gradients" value="gradients">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GradientGenerator colors={currentPalette} />
                </motion.div>
              </TabsContent>
              
              <TabsContent key="preview" value="preview">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <UIPreview colors={currentPalette} />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </section>
        
        {/* Saved Palettes */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Palettes</h2>
            {savedPalettes.length > 0 && (
              <Button
                onClick={clearAllPalettes}
                variant="destructive"
              >
                Clear All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPalettes.map((palette) => (
              <SavedPaletteCard
                key={palette.id}
                palette={palette}
                onLoad={() => handleLoadSavedPalette(palette.colors)}
                onDelete={() => handleDeletePalette(palette.id)}
              />
            ))}
            
            {savedPalettes.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-slate-400 dark:text-slate-500 mb-4">
                  <Palette size={48} className="mx-auto" />
                </div>
                <p className="text-slate-600 dark:text-slate-400">No saved palettes yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">Save your favorite color combinations to access them later</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modals */}
      <SavePaletteModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSavePalette}
        currentPalette={currentPalette}
      />
      
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onColorsExtracted={setPalette}
      />
      
      <EnhancedShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        currentPalette={currentPalette}
      />
    </div>
  );
}
