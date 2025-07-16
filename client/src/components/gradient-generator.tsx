import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  generateGradientCSS, 
  generateGradientPresets, 
  exportGradientAsPNG,
  gradientDirections,
  type GradientConfig,
  type GradientType,
  type GradientDirection 
} from "@/lib/gradient-utils";
import { Palette, Download, Copy, Info, HelpCircle, ArrowRightLeft, Circle } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface GradientGeneratorProps {
  colors: string[];
}

export function GradientGenerator({ colors }: GradientGeneratorProps) {
  const [selectedGradient, setSelectedGradient] = useState<GradientConfig>({
    type: 'linear',
    direction: 'to-right',
    colors: colors.slice(0, 2),
  });
  const { toast } = useToast();
  
  // Sanitize input colors for presets
  const sanitizedColors = Array.from(new Set(colors.filter(Boolean)));
  const presets = generateGradientPresets(sanitizedColors);
  const gradientCSS = generateGradientCSS(selectedGradient);

  // Ensure at least 2 colors are always selected
  const ensureTwoColors = (colorArr: string[]) => {
    if (colorArr.length >= 2) return colorArr;
    if (colors.length >= 2) return colors.slice(0, 2);
    if (colors.length === 1) return [colors[0], colors[0]];
    return [];
  };

  // When switching type, ensure at least 2 colors and reset direction if needed
  const handleTypeChange = (value: GradientType) => {
    setSelectedGradient(prev => ({
      ...prev,
      type: value,
      direction: value === 'linear' ? (prev.direction || 'to-right') : undefined,
      colors: ensureTwoColors(prev.colors),
    }));
  };

  // When parent colors change, sync if needed
  // (optional, but helps keep in sync with palette)
  // useEffect(() => {
  //   setSelectedGradient(prev => ({
  //     ...prev,
  //     colors: ensureTwoColors(prev.colors.filter(c => colors.includes(c))),
  //   }));
  // }, [colors]);

  const handleCopyCSS = async () => {
    try {
      await navigator.clipboard.writeText(`background: ${gradientCSS};`);
      toast({
        title: "CSS copied",
        description: "Gradient CSS copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy CSS to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleExportPNG = () => {
    try {
      exportGradientAsPNG(gradientCSS);
      toast({
        title: "Export started",
        description: "Gradient PNG export initiated",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export gradient as PNG",
        variant: "destructive",
      });
    }
  };

  const updateGradientColors = (newColors: string[]) => {
    setSelectedGradient(prev => ({
      ...prev,
      colors: newColors,
    }));
  };

  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Palette className="inline text-orange-500" size={20} />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-0">Gradient Generator</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="text-slate-400 cursor-pointer" size={18} />
            </TooltipTrigger>
            <TooltipContent side="right">
              <span>Create beautiful CSS gradients from your palette. Choose a type, direction, and colors, then copy the CSS or export as PNG!</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="mb-4 text-slate-600 dark:text-slate-300 text-sm">
        Gradients blend two or more colors smoothly. Use this tool to design backgrounds, buttons, and more. Hover <Info className="inline text-slate-400" size={14} /> for tips.
      </p>
      <div className="space-y-6">
        {/* Gradient Preview */}
        <div className="mb-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
            Preview
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-slate-400 cursor-pointer" size={14} />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>See a live preview of your gradient here.</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
        <div 
          className="w-full h-32 rounded-lg border border-slate-200 dark:border-slate-600 shadow-inner"
            style={{ backgroundImage: gradientCSS }}
        />
        </div>
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              Gradient Type
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="text-slate-400 cursor-pointer" size={14} />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <span>Linear gradients blend colors in a line; radial gradients blend from the center out.</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Select 
              value={selectedGradient.type} 
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">
                  <ArrowRightLeft className="inline mr-1 text-blue-500" size={16} /> Linear
                </SelectItem>
                <SelectItem value="radial">
                  <Circle className="inline mr-1 text-pink-500" size={16} /> Radial
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedGradient.type === 'linear' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                Direction
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="text-slate-400 cursor-pointer" size={14} />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <span>Choose the direction the gradient flows (e.g., left to right, top to bottom).</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Select 
                value={selectedGradient.direction} 
                onValueChange={(value: GradientDirection) => 
                  setSelectedGradient(prev => ({ ...prev, direction: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gradientDirections.map(direction => (
                    <SelectItem key={direction.value} value={direction.value}>
                      {direction.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {/* Color Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
            Selected Colors
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-slate-400 cursor-pointer" size={14} />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>Click colors to add or remove them from the gradient. At least two colors are needed for a gradient.</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color, index) => (
              <motion.div
                key={index}
                className={`aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                  selectedGradient.colors.includes(color) 
                    ? 'border-blue-500 scale-105' 
                    : 'border-slate-200 dark:border-slate-600'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  const isSelected = selectedGradient.colors.includes(color);
                  if (isSelected) {
                    updateGradientColors(selectedGradient.colors.filter(c => c !== color));
                  } else {
                    updateGradientColors([...selectedGradient.colors, color]);
                  }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Toggle color ${color} in gradient`}
                tabIndex={0}
                role="button"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    const isSelected = selectedGradient.colors.includes(color);
                    if (isSelected) {
                      updateGradientColors(selectedGradient.colors.filter(c => c !== color));
                    } else {
                      updateGradientColors([...selectedGradient.colors, color]);
                    }
                  }
                }}
              />
            ))}
          </div>
          {selectedGradient.colors.length < 2 && (
            <div className="text-xs text-red-500 mt-1">Select at least two colors for a gradient.</div>
          )}
        </div>
        {/* Preset Gradients */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
            Quick Presets
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-slate-400 cursor-pointer" size={14} />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>Try these ready-made gradients using your palette colors.</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {presets.map((preset, index) => {
              const previewCSS = generateGradientCSS(preset);
              // Debug: log the generated CSS
              console.log('Preset', index, preset, previewCSS);
              // Check if the preview is blank (all colors the same or empty)
              const isBlank = !preset.colors || preset.colors.length < 2 || new Set(preset.colors).size === 1;
              // Fallback for testing
              const fallbackGradient = 'linear-gradient(to right, red, yellow, green, blue)';
              return (
              <motion.div
                key={index}
                  className="space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex"
                onClick={() => setSelectedGradient(preset)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Apply preset gradient ${index + 1}`}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedGradient(preset);
                    }
                  }}
              >
                <div 
                  className="w-16 h-8 rounded border border-slate-200 dark:border-slate-600"
                    style={{
                      backgroundImage: isBlank ? 'repeating-linear-gradient(45deg, #eee, #eee 6px, #ccc 6px, #ccc 12px)' : previewCSS,
                      backgroundColor: 'unset',
                      minWidth: 64,
                      minHeight: 32,
                    }}
                  >
                    {isBlank && (
                      <span className="text-xs text-slate-400">No Preview</span>
                    )}
                  </div>
                <div className="flex-1">
                  <p className="font-medium text-sm capitalize">
                    {preset.type} {preset.direction && `(${preset.direction.replace('to-', '').replace('-', ' ')})`}
                  </p>
                  <div className="flex space-x-1 mt-1">
                    {preset.colors.map((color, colorIndex) => (
                        <Badge key={`${color}-${colorIndex}`} variant="outline" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
        {/* Actions */}
        <div className="flex space-x-3">
          <Button onClick={handleCopyCSS} className="flex-1" aria-label="Copy gradient CSS" disabled={selectedGradient.colors.length < 2}>
            <Copy className="w-4 h-4 mr-2" />
            Copy CSS
          </Button>
          <Button onClick={handleExportPNG} variant="outline" className="flex-1" aria-label="Export gradient as PNG" disabled={selectedGradient.colors.length < 2}>
            <Download className="w-4 h-4 mr-2" />
            Export PNG
          </Button>
        </div>
        {/* CSS Output */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
            CSS Output
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-slate-400 cursor-pointer" size={14} />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>Copy and paste this CSS into your project to use the gradient.</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <code className="text-sm font-mono text-slate-800 dark:text-slate-200">
              background: {gradientCSS};
            </code>
          </div>
        </div>
        <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-right">
          <a href="https://cssgradient.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">Learn more about CSS gradients</a>
        </div>
      </div>
    </motion.div>
  );
}