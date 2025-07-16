import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Share, Trash2 } from "lucide-react";

interface SavedPaletteCardProps {
  palette: {
    id: string;
    name: string;
    colors: string[];
    created: string;
  };
  onLoad: () => void;
  onDelete: () => void;
}

export function SavedPaletteCard({ palette, onLoad, onDelete }: SavedPaletteCardProps) {
  const handleShare = () => {
    // Create a simple share URL with colors
    const colorString = palette.colors.join(',');
    const shareUrl = `${window.location.origin}/palette/${btoa(colorString)}`;
    
    if (navigator.share) {
      navigator.share({
        title: palette.name,
        text: `Check out this color palette: ${palette.name}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white truncate">{palette.name}</h3>
        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleShare}
            className="text-slate-400 hover:text-blue-500 transition-colors"
          >
            <Share className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {palette.colors.map((color, index) => (
          <div
            key={index}
            className="aspect-square rounded-lg"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Created {formatDistanceToNow(new Date(palette.created))} ago
        </span>
        <Button
          size="sm"
          onClick={onLoad}
          className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          variant="ghost"
        >
          Load
        </Button>
      </div>
    </div>
  );
}
