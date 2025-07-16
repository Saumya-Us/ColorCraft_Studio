import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload } from "lucide-react";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorsExtracted: (colors: string[]) => void;
}

export function ImageUploadModal({ isOpen, onClose, onColorsExtracted }: ImageUploadModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const colors = extractColorsFromImageData(imageData);
      
      onColorsExtracted(colors);
      onClose();
      
      toast({
        title: "Colors extracted",
        description: "Successfully extracted colors from image",
      });
    } catch (error) {
      toast({
        title: "Error processing image",
        description: "Failed to extract colors from image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractColorsFromImageData = (imageData: ImageData | undefined): string[] => {
    if (!imageData) return [];
    
    const data = imageData.data;
    const colorMap = new Map<string, number>();
    
    // Sample pixels (every 10th pixel for performance)
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
    }
    
    // Get top 5 most frequent colors
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => color);
    
    return sortedColors;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Extract Colors from Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              Drop an image here or click to browse
            </p>
            <Button variant="outline" size="sm" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Browse Files"}
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileSelect(file);
              }
            }}
          />
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
