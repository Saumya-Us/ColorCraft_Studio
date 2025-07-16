import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SavePaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  currentPalette: string[];
}

export function SavePaletteModal({ isOpen, onClose, onSave, currentPalette }: SavePaletteModalProps) {
  const [paletteName, setPaletteName] = useState("");

  const handleSave = () => {
    if (paletteName.trim()) {
      onSave(paletteName.trim());
      setPaletteName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Palette</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="palette-name">Palette Name</Label>
            <Input
              id="palette-name"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="My Awesome Palette"
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {currentPalette.map((color, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!paletteName.trim()}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
