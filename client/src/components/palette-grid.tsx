import { Button } from "@/components/ui/button";
import { ColorCard } from "@/components/color-card";
import { exportPaletteAsJSON, exportPaletteAsPNG, exportPaletteAsSCSS } from "@/lib/export-utils";
import { useToast } from "@/hooks/use-toast";
import { Share, Download, Image, Code } from "lucide-react";

interface PaletteGridProps {
  colors: string[];
  onColorEdit: (index: number, color: string) => void;
  onShare: () => void;
}

export function PaletteGrid({ colors, onColorEdit, onShare }: PaletteGridProps) {
  const { toast } = useToast();

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
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {colors.map((color, index) => (
          <ColorCard
            key={index}
            color={color}
            index={index}
            onEdit={onColorEdit}
          />
        ))}
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={onShare} className="bg-green-500 hover:bg-green-600 text-white">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button onClick={() => handleExport('json')} className="bg-purple-500 hover:bg-purple-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          JSON
        </Button>
        <Button onClick={() => handleExport('png')} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Image className="w-4 h-4 mr-2" />
          PNG
        </Button>
        <Button onClick={() => handleExport('scss')} className="bg-pink-500 hover:bg-pink-600 text-white">
          <Code className="w-4 h-4 mr-2" />
          SCSS
        </Button>
      </div>
    </div>
  );
}
