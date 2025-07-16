import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getColorName } from "@/lib/color-names";
import { isLightColor } from "@/lib/color-utils";
import { getContrastRatio } from "@/lib/contrast";
import { Palette, Edit, Check, X } from "lucide-react";

interface ColorCardProps {
  color: string;
  index: number;
  onEdit: (index: number, color: string) => void;
}

export function ColorCard({ color, index, onEdit }: ColorCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
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

  const handleEditColor = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = color;
    input.onchange = (e) => {
      const newColor = (e.target as HTMLInputElement).value;
      onEdit(index, newColor);
      setIsEditing(false);
    };
    input.click();
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
      style={{ backgroundColor: color }}
      onClick={handleCopyColor}
    >
      <div className="aspect-square p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className={`${iconBg} backdrop-blur-sm rounded-lg p-2`}>
            <Palette className={`${textColor} w-5 h-5`} />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className={`${iconBg} backdrop-blur-sm rounded-lg p-2 hover:bg-white/30`}
              onClick={(e) => {
                e.stopPropagation();
                handleEditColor();
              }}
            >
              <Edit className={`${textColor} w-4 h-4`} />
            </Button>
          </div>
        </div>
        <div className={textColor}>
          <p className="font-medium text-lg">{color}</p>
          <p className="text-sm opacity-90">{colorName}</p>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4">
        <div className="flex items-center justify-between text-white text-sm">
          <span>Click to copy</span>
          <div className="flex items-center space-x-2">
            {contrastIcon === Check ? (
              <Check className={contrastIconColor} size={16} />
            ) : (
              <X className={contrastIconColor} size={16} />
            )}
            <span>{contrastGrade}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
