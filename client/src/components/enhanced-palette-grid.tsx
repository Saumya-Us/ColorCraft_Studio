import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EnhancedColorCard } from "@/components/enhanced-color-card";
import { exportPaletteAsJSON, exportPaletteAsPNG, exportPaletteAsSCSS } from "@/lib/export-utils";
import { useToast } from "@/hooks/use-toast";
import { Share, Download, Image, Code, Undo, Redo, History } from "lucide-react";

interface EnhancedPaletteGridProps {
  colors: string[];
  lockedColors: boolean[];
  onColorEdit: (index: number, color: string) => void;
  onColorReorder: (newColors: string[], newLockedColors: boolean[]) => void;
  onLockToggle: (index: number) => void;
  onShare: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function EnhancedPaletteGrid({ 
  colors, 
  lockedColors,
  onColorEdit, 
  onColorReorder,
  onLockToggle,
  onShare,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}: EnhancedPaletteGridProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newColors = Array.from(colors);
    const newLockedColors = Array.from(lockedColors);
    
    // Reorder both arrays
    const [reorderedColor] = newColors.splice(sourceIndex, 1);
    const [reorderedLocked] = newLockedColors.splice(sourceIndex, 1);
    
    newColors.splice(destinationIndex, 0, reorderedColor);
    newLockedColors.splice(destinationIndex, 0, reorderedLocked);

    onColorReorder(newColors, newLockedColors);
    
    toast({
      title: "Colors reordered",
      description: "Palette order has been updated",
    });
  };

  const handleExport = (format: 'json' | 'png' | 'scss') => {
    try {
      switch (format) {
        case 'json':
          exportPaletteAsJSON(colors);
          break;
        case 'png':
          exportPaletteAsPNG(colors);
          break;
        case 'scss':
          exportPaletteAsSCSS(colors);
          break;
      }
      toast({
        title: "Export successful",
        description: `Palette exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export palette",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DragDropContext 
        onDragEnd={handleDragEnd}
        onDragStart={() => setIsDragging(true)}
      >
        <Droppable droppableId="palette" direction="horizontal">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6 transition-all duration-300 ${
                snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl' : ''
              }`}
            >
              <AnimatePresence>
                {colors.map((color, index) => (
                  <Draggable 
                    key={`${color}-${index}`} 
                    draggableId={`${color}-${index}`} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <EnhancedColorCard
                          color={color}
                          index={index}
                          isLocked={lockedColors[index]}
                          onEdit={onColorEdit}
                          onLockToggle={onLockToggle}
                          isDragging={snapshot.isDragging}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {/* History Controls */}
        {(onUndo || onRedo) && (
          <div className="flex space-x-2">
            <Button 
              onClick={onUndo} 
              disabled={!canUndo}
              variant="outline"
              size="sm"
              className="text-slate-600 hover:text-slate-800"
            >
              <Undo className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button 
              onClick={onRedo} 
              disabled={!canRedo}
              variant="outline"
              size="sm"
              className="text-slate-600 hover:text-slate-800"
            >
              <Redo className="w-4 h-4 mr-1" />
              Redo
            </Button>
          </div>
        )}
        
        {/* Main Actions */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            onClick={onShare} 
            className="bg-green-500 hover:bg-green-600 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button 
            onClick={() => handleExport('json')} 
            className="bg-purple-500 hover:bg-purple-600 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4 mr-2" />
            JSON
          </Button>
          
          <Button 
            onClick={() => handleExport('png')} 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image className="w-4 h-4 mr-2" />
            PNG
          </Button>
          
          <Button 
            onClick={() => handleExport('scss')} 
            className="bg-pink-500 hover:bg-pink-600 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Code className="w-4 h-4 mr-2" />
            SCSS
          </Button>
        </motion.div>
      </div>
      
      {isDragging && (
        <motion.div
          className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Drag and drop to reorder colors. Locked colors will maintain their lock state.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}