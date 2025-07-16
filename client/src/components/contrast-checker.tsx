import { useState, useEffect } from "react";
import { getContrastRatio } from "@/lib/contrast";
import { getColorName } from "@/lib/color-names";
import { Eye, Info, Copy } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ContrastCheckerProps {
  colors: string[];
}

// Helper for swatch tooltip
function SwatchTooltip({ color, children, label }: { color: string, children: React.ReactNode, label: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top">
          <span>{label}: {color}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ContrastChecker({ colors }: ContrastCheckerProps) {
  const { toast } = useToast();
  const [bgColor, setBgColor] = useState(colors[0] || '#FF6B6B');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [animateGrade, setAnimateGrade] = useState(false);

  const contrastRatio = getContrastRatio(bgColor, textColor);
  const wcagGrade = contrastRatio >= 7 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : contrastRatio >= 3 ? 'A' : 'F';
  const gradeColor = contrastRatio >= 4.5 ? 'green' : contrastRatio >= 3 ? 'yellow' : 'red';

  // Animate grade box when grade changes
  useEffect(() => {
    setAnimateGrade(true);
    const timeout = setTimeout(() => setAnimateGrade(false), 600);
    return () => clearTimeout(timeout);
  }, [wcagGrade]);

  // Suggest all palette colors (and white/black) that pass AA if current fails
  let suggestions: string[] = [];
  if (wcagGrade === 'F' || wcagGrade === 'A') {
    suggestions = colors.filter(c => getContrastRatio(bgColor, c) >= 4.5);
    // Add white/black if they pass and aren't already in the palette
    if (getContrastRatio(bgColor, '#FFFFFF') >= 4.5 && !suggestions.includes('#FFFFFF')) suggestions.push('#FFFFFF');
    if (getContrastRatio(bgColor, '#000000') >= 4.5 && !suggestions.includes('#000000')) suggestions.push('#000000');
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        <Eye className="inline mr-2 text-blue-500" size={20} />
        Contrast Checker
      </h3>
      
      <div className="space-y-4">
        {/* Preset combo buttons */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-medium border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => { setBgColor('#FFFFFF'); setTextColor('#000000'); }}
            aria-label="Black text on white background"
            tabIndex={0}
            role="button"
          >
            Black on White
          </button>
          <button
            className="px-3 py-1 rounded bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-slate-100 text-sm font-medium border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => { setBgColor('#000000'); setTextColor('#FFFFFF'); }}
            aria-label="White text on black background"
            tabIndex={0}
            role="button"
          >
            White on Black
          </button>
          <button
            className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 text-sm font-medium border border-blue-200 dark:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => { setBgColor(colors[0] || '#FF6B6B'); setTextColor('#FFFFFF'); }}
            aria-label="Palette default colors"
            tabIndex={0}
            role="button"
          >
            Palette Default
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Background
            </label>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg border-2 border-slate-200 dark:border-slate-600 cursor-pointer"
                style={{ backgroundColor: bgColor }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'color';
                  input.value = bgColor;
                  input.onchange = (e) => setBgColor((e.target as HTMLInputElement).value);
                  input.click();
                }}
                aria-label="Pick background color"
                tabIndex={0}
              />
              <div>
                <p className="font-mono text-sm text-slate-900 dark:text-white">{bgColor}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{getColorName(bgColor)}</p>
              </div>
            </div>
            {/* Palette swatches for background */}
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color, i) => (
                <SwatchTooltip key={color + i} color={color} label="Background swatch">
                  <button
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none ${bgColor === color ? 'border-blue-500 ring-2 ring-blue-400' : 'border-slate-200 dark:border-slate-600'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBgColor(color)}
                    aria-label={`Set background color to ${color}`}
                    tabIndex={0}
                    role="button"
                  />
                </SwatchTooltip>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Text
            </label>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg border-2 border-slate-200 dark:border-slate-600 cursor-pointer"
                style={{ backgroundColor: textColor }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'color';
                  input.value = textColor;
                  input.onchange = (e) => setTextColor((e.target as HTMLInputElement).value);
                  input.click();
                }}
                aria-label="Pick text color"
                tabIndex={0}
              />
              <div>
                <p className="font-mono text-sm text-slate-900 dark:text-white">{textColor}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{getColorName(textColor)}</p>
              </div>
            </div>
            {/* Palette swatches for text */}
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color, i) => (
                <SwatchTooltip key={color + i} color={color} label="Text swatch">
                  <button
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none ${textColor === color ? 'border-blue-500 ring-2 ring-blue-400' : 'border-slate-200 dark:border-slate-600'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                    aria-label={`Set text color to ${color}`}
                    tabIndex={0}
                    role="button"
                  />
                </SwatchTooltip>
              ))}
            </div>
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <p className="font-medium">Sample text with this color combination</p>
          <p className="text-sm opacity-90">The quick brown fox jumps over the lazy dog</p>
        </div>
        {/* Copy to clipboard button */}
        <div className="flex justify-end mt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex items-center gap-1 px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-medium border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={async () => {
                    const css = `background-color: ${bgColor}; color: ${textColor};`;
                    try {
                      await navigator.clipboard.writeText(css);
                      toast({ title: "Copied!", description: "CSS color combo copied to clipboard." });
                    } catch {
                      toast({ title: "Copy failed", description: "Could not copy to clipboard.", variant: "destructive" });
                    }
                  }}
                  aria-label="Copy color combination as CSS"
                  tabIndex={0}
                  role="button"
                >
                  <Copy size={16} />
                  Copy CSS
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span>Copy the current background/text color as CSS</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {/* Actionable suggestion if contrast fails */}
        {(wcagGrade === 'F' || wcagGrade === 'A') && suggestions.length > 0 && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-yellow-600 dark:text-yellow-300">Try a more accessible color:</span>
            {suggestions.map((sugg, i) => (
              <SwatchTooltip key={sugg + i} color={sugg} label="Accessible suggestion">
                <button
                  className="w-8 h-8 rounded-full border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ backgroundColor: sugg }}
                  onClick={() => setTextColor(sugg)}
                  aria-label={`Set text color to suggested accessible color ${sugg}`}
                  tabIndex={0}
                  role="button"
                />
              </SwatchTooltip>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className={`text-center p-3 bg-${gradeColor}-50 dark:bg-${gradeColor}-900/20 rounded-lg`}>
            <div className={`text-2xl font-bold text-${gradeColor}-600 dark:text-${gradeColor}-400`}>
              {contrastRatio.toFixed(1)}
            </div>
            <div className={`text-sm text-${gradeColor}-700 dark:text-${gradeColor}-300`}>
              Contrast Ratio
            </div>
          </div>
          <div className={`text-center p-3 bg-${gradeColor}-50 dark:bg-${gradeColor}-900/20 rounded-lg transition-all duration-500 ${animateGrade ? 'ring-4 ring-blue-400/40 animate-pulse-gentle' : ''}`}
            aria-live="polite"
          > 
            <div className="flex items-center justify-center gap-1">
              <div className={`text-2xl font-bold text-${gradeColor}-600 dark:text-${gradeColor}-400`}>
                {wcagGrade}
              </div>
             <TooltipProvider>
               <Tooltip>
                 <TooltipTrigger asChild>
                   <span className="text-slate-400 dark:text-slate-500 cursor-pointer">
                     <Info size={16} />
                   </span>
                 </TooltipTrigger>
                 <TooltipContent side="top">
                   <span>
                     <b>WCAG Grades:</b><br/>
                     AAA: Excellent (7.0+)<br/>
                     AA: Good (4.5+)<br/>
                     A: Minimum (3.0+)<br/>
                     F: Fails standard
                   </span>
                 </TooltipContent>
               </Tooltip>
             </TooltipProvider>
            </div>
            <div className={`text-sm text-${gradeColor}-700 dark:text-${gradeColor}-300`}>
              WCAG Grade
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
