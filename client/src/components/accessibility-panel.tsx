import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { simulatePaletteColorBlindness, colorBlindnessTypes, type ColorBlindnessType } from "@/lib/color-blindness";
import { getContrastRatio, getWCAGGrade } from "@/lib/contrast";
import { Eye, AlertTriangle, CheckCircle, Info, XCircle, HelpCircle } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface AccessibilityPanelProps {
  colors: string[];
  onSuggestedAlternative?: (index: number, newColor: string) => void;
}

export function AccessibilityPanel({ colors, onSuggestedAlternative }: AccessibilityPanelProps) {
  const [selectedSimulation, setSelectedSimulation] = useState<ColorBlindnessType>('normal');
  
  const simulatedColors = simulatePaletteColorBlindness(colors, selectedSimulation);
  
  // Generate accessibility suggestions
  const accessibilityIssues = colors.map((color, index) => {
    const whiteContrast = getContrastRatio(color, '#FFFFFF');
    const blackContrast = getContrastRatio(color, '#000000');
    const whiteGrade = getWCAGGrade(whiteContrast);
    const blackGrade = getWCAGGrade(blackContrast);
    
    return {
      index,
      color,
      whiteContrast: Math.round(whiteContrast * 10) / 10,
      blackContrast: Math.round(blackContrast * 10) / 10,
      whiteGrade,
      blackGrade,
      hasIssue: whiteGrade === 'F' && blackGrade === 'F',
    };
  });

  const generateAlternativeColor = (originalColor: string): string => {
    // Simple algorithm to suggest a more accessible alternative
    const rgb = hexToRgb(originalColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    
    if (brightness > 128) {
      // Make darker
      return `#${Math.max(0, rgb.r - 40).toString(16).padStart(2, '0')}${Math.max(0, rgb.g - 40).toString(16).padStart(2, '0')}${Math.max(0, rgb.b - 40).toString(16).padStart(2, '0')}`;
    } else {
      // Make lighter
      return `#${Math.min(255, rgb.r + 40).toString(16).padStart(2, '0')}${Math.min(255, rgb.g + 40).toString(16).padStart(2, '0')}${Math.min(255, rgb.b + 40).toString(16).padStart(2, '0')}`;
    }
  };

  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Eye className="inline text-blue-500" size={20} />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-0">Accessibility Check</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="text-slate-400 cursor-pointer" size={18} />
            </TooltipTrigger>
            <TooltipContent side="right">
              <span>Check if your palette is readable for everyone, including people with color blindness or low vision. We'll show you how your colors look and suggest improvements!</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="mb-4 text-slate-600 dark:text-slate-300 text-sm">
        This tool helps you make sure your colors are easy to read and accessible to all users. Hover over <Info className="inline text-slate-400" size={14} /> icons for more info.
      </p>
      <div className="space-y-6">
        {/* Color Blindness Simulation */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
            Color Blindness Simulation
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-slate-400 cursor-pointer" size={14} />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>See how your palette looks to people with different types of color blindness.</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Select value={selectedSimulation} onValueChange={(value: ColorBlindnessType) => setSelectedSimulation(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorBlindnessTypes.map((type) => (
                <SelectItem key={type.type} value={type.type}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="grid grid-cols-5 gap-2">
            {simulatedColors.map((color, index) => (
              <motion.div
                key={index}
                className="aspect-square rounded-lg border border-slate-200 dark:border-slate-600"
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
          
          {selectedSimulation !== 'normal' && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {colorBlindnessTypes.find(t => t.type === selectedSimulation)?.description}
            </p>
          )}
        </div>
        
        {/* Contrast Analysis */}
        <div className="mt-6">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
            Contrast Analysis
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-slate-400 cursor-pointer" size={14} />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>Checks if your colors have enough contrast to be readable on white or black backgrounds, following accessibility standards (WCAG).</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {accessibilityIssues.map((issue, index) => (
              <motion.div
                key={issue.color + index}
                className="rounded-lg p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded border border-slate-300" style={{ backgroundColor: issue.color }} />
                    <span className="font-mono text-sm">{issue.color}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">vs White:</span>
                    <Badge variant={issue.whiteGrade === 'F' ? 'destructive' : issue.whiteGrade === 'AAA' ? 'default' : 'secondary'}>
                      {issue.whiteContrast}:1 ({issue.whiteGrade})
                    </Badge>
                    {issue.whiteGrade !== 'F' ? (
                      <CheckCircle className="text-green-500" size={16} aria-label="Pass" />
                    ) : (
                      <XCircle className="text-red-500" size={16} aria-label="Fail" />
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="text-slate-400 cursor-pointer" size={14} />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <span>
                            {issue.whiteGrade !== 'F'
                              ? 'Good contrast! This color is readable on a white background.'
                              : 'Low contrast. This color may be hard to read on white. Try making it darker or more saturated.'}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">vs Black:</span>
                    <Badge variant={issue.blackGrade === 'F' ? 'destructive' : issue.blackGrade === 'AAA' ? 'default' : 'secondary'}>
                      {issue.blackContrast}:1 ({issue.blackGrade})
                    </Badge>
                    {issue.blackGrade !== 'F' ? (
                      <CheckCircle className="text-green-500" size={16} aria-label="Pass" />
                    ) : (
                      <XCircle className="text-red-500" size={16} aria-label="Fail" />
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="text-slate-400 cursor-pointer" size={14} />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <span>
                            {issue.blackGrade !== 'F'
                              ? 'Good contrast! This color is readable on a black background.'
                              : 'Low contrast. This color may be hard to read on black. Try making it lighter or more saturated.'}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                {issue.hasIssue && onSuggestedAlternative && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Suggested improvement:</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const alternative = generateAlternativeColor(issue.color);
                          onSuggestedAlternative(issue.index, alternative);
                        }}
                      >
                        Apply Fix
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {issue.whiteGrade === 'F' || issue.blackGrade === 'F'
                        ? 'We suggest adjusting this color for better readability. Click "Apply Fix" to try an improved version.'
                        : ''}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-right">
        <a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">Learn more about color accessibility</a>
      </div>
    </motion.div>
  );
}