import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getColorName } from "@/lib/color-names";
import { isLightColor } from "@/lib/color-utils";
import { getContrastRatio } from "@/lib/contrast";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette, Edit, Check, X, Lock, Unlock, GripVertical } from "lucide-react";

interface EnhancedColorCardProps {
  color: string;
  index: number;
  isLocked: boolean;
  onEdit: (index: number, color: string) => void;
  onLockToggle: (index: number) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export function EnhancedColorCard({ 
  color, 
  index, 
  isLocked,
  onEdit, 
  onLockToggle,
  isDragging = false,
  dragHandleProps 
}: EnhancedColorCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [hexValue, setHexValue] = useState(color);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const isLight = isLightColor(color);
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const iconBg = isLight ? 'bg-black/20' : 'bg-white/20';
  const colorName = getColorName(color);
  
  // Calculate contrast ratio with white text
  const whiteContrast = getContrastRatio(color, '#FFFFFF');
  const contrastGrade = whiteContrast >= 4.5 ? 'AA' : whiteContrast >= 3 ? 'A' : 'F';
  const contrastIcon = whiteContrast >= 4.5 ? Check : X;
  const contrastIconColor = whiteContrast >= 4.5 ? 'text-green-400' : 'text-red-400';

  const handleCopyColor = async () => {
    try {
      await navigator.clipboard.writeText(color);
      toast({
        title: "Color copied",
        description: `${color} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy color to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleColorChange = (newColor: string) => {
    setHexValue(newColor);
    onEdit(index, newColor);
  };

  const handleHexInputChange = (value: string) => {
    setHexValue(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onEdit(index, value);
    }
  };

  const handleHexInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (/^#[0-9A-Fa-f]{6}$/.test(hexValue)) {
        onEdit(index, hexValue);
        setIsEditing(false);
      } else {
        toast({
          title: "Invalid hex color",
          description: "Please enter a valid hex color (e.g., #FF0000)",
          variant: "destructive",
        });
      }
    } else if (e.key === 'Escape') {
      setHexValue(color);
      setIsEditing(false);
    }
  };

  return (
    <motion.div 
      className={`group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
        isDragging ? 'rotate-2 scale-105 z-50' : ''
      } ${isLocked ? 'ring-2 ring-yellow-400' : ''}`}
      style={{ backgroundColor: color }}
      onClick={!isEditing ? handleCopyColor : undefined}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Drag Handle */}
      <div 
        {...dragHandleProps}
        className={`absolute top-2 left-2 ${iconBg} backdrop-blur-sm rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10`}
      >
        <GripVertical className={`${textColor} w-4 h-4`} />
      </div>

      <div className="aspect-square p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className={`${iconBg} backdrop-blur-sm rounded-lg p-2`}>
            <Palette className={`${textColor} w-5 h-5`} />
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className={`${iconBg} backdrop-blur-sm rounded-lg p-2 hover:bg-white/30`}
              onClick={(e) => {
                e.stopPropagation();
                onLockToggle(index);
              }}
            >
              {isLocked ? (
                <Lock className={`${textColor} w-4 h-4`} />
              ) : (
                <Unlock className={`${textColor} w-4 h-4`} />
              )}
            </Button>
            <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`${iconBg} backdrop-blur-sm rounded-lg p-2 hover:bg-white/30`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowColorPicker(true);
                  }}
                >
                  <Edit className={`${textColor} w-4 h-4`} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" side="top">
                <div className="space-y-4">
                  <HexColorPicker color={color} onChange={handleColorChange} />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hex Value</label>
                    <Input
                      value={hexValue}
                      onChange={(e) => setHexValue(e.target.value)}
                      onKeyDown={handleHexInputKeyDown}
                      placeholder="#FF0000"
                      className="font-mono"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className={textColor}>
          {isEditing ? (
            <Input
              value={hexValue}
              onChange={(e) => handleHexInputChange(e.target.value)}
              onKeyDown={handleHexInputKeyDown}
              onBlur={() => setIsEditing(false)}
              className="font-mono text-lg bg-transparent border-white/30 text-inherit"
              autoFocus
            />
          ) : (
            <div 
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <p className="font-medium text-lg">{color}</p>
              <p className="text-sm opacity-90">{colorName}</p>
            </div>
          )}
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4"
        initial={{ y: 10 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center justify-between text-white text-sm">
          <span>{isLocked ? 'Locked' : 'Click to copy'}</span>
          <div className="flex items-center space-x-2">
            {contrastIcon === Check ? (
              <Check className={contrastIconColor} size={16} />
            ) : (
              <X className={contrastIconColor} size={16} />
            )}
            <span>{contrastGrade}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}