import { Lightbulb } from "lucide-react";
import { useState } from "react";
import { Shuffle, Dice5 } from "lucide-react";

interface ColorTheoryTipsProps {
  onApplyHarmonyPalette?: (harmony: string) => void;
}

export function ColorTheoryTips({ onApplyHarmonyPalette }: ColorTheoryTipsProps) {
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const [showRandom, setShowRandom] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [tipsState, setTipsState] = useState<Array<any> | null>(null);

  const tips = [
    {
      title: "Analogous Colors",
      description: "Colors that are next to each other on the color wheel. They create serene and comfortable designs.",
      color: "blue",
      swatch: ["#4F8EF7", "#4FF7D3", "#4FF77A"]
    },
    {
      title: "Complementary Colors",
      description: "Colors opposite each other on the color wheel. They create vibrant and high-contrast designs.",
      color: "purple",
      swatch: ["#A259F7", "#F7A259"]
    },
    {
      title: "Triadic Colors",
      description: "Three colors evenly spaced on the color wheel. They offer strong visual contrast while maintaining harmony.",
      color: "green",
      swatch: ["#4FF77A", "#F7D24F", "#4F8EF7"]
    },
    {
      title: "Monochromatic",
      description: "Different shades, tints, and tones of a single color. Creates a cohesive and elegant look.",
      color: "red",
      swatch: ["#FFCCCC", "#FF6666", "#CC0000"]
    },
    {
      title: "Tetradic (Double Complementary)",
      description: "Two complementary color pairs. Offers plenty of possibilities for color variation.",
      color: "yellow",
      swatch: ["#F7D24F", "#4F8EF7", "#A259F7", "#4FF77A"]
    },
    {
      title: "Split-Complementary",
      description: "A base color and two colors adjacent to its complement. High contrast with less tension than complementary.",
      color: "orange",
      swatch: ["#FFA259", "#4F8EF7", "#A259F7"]
    },
    {
      title: "Warm Colors",
      description: "Colors from red through yellow. They evoke warmth and energy.",
      color: "amber",
      swatch: ["#FF6666", "#FFA259", "#F7D24F"]
    },
    {
      title: "Cool Colors",
      description: "Colors from blue through green. They evoke calm and relaxation.",
      color: "cyan",
      swatch: ["#4F8EF7", "#4FF7D3", "#4FF77A"]
    },
    {
      title: "Neutral Colors",
      description: "Grays, whites, blacks, and browns. Useful for backgrounds and balancing vibrant palettes.",
      color: "gray",
      swatch: ["#F5F5F5", "#B0B0B0", "#333333"]
    }
  ];

  // Shuffle utility
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Determine which tips to show
  let tipsToShow = tips;
  if (showRandom && tipsState && tipsState.length > 0) {
    tipsToShow = [tipsState[0]];
  } else if (shuffled && tipsState) {
    tipsToShow = tipsState;
  }

  // Tailwind-safe color class mapping
  const colorClassMap: Record<string, {
    bg: string;
    text: string;
    ring: string;
    border: string;
    title: string;
    applied: string;
  }> = {
    blue:    { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-800 dark:text-blue-200", ring: "focus:ring-blue-400", border: "hover:border-blue-400 focus:border-blue-400", title: "text-blue-900 dark:text-blue-300", applied: "text-blue-700 dark:text-blue-200" },
    purple:  { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-800 dark:text-purple-200", ring: "focus:ring-purple-400", border: "hover:border-purple-400 focus:border-purple-400", title: "text-purple-900 dark:text-purple-300", applied: "text-purple-700 dark:text-purple-200" },
    green:   { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-800 dark:text-green-200", ring: "focus:ring-green-400", border: "hover:border-green-400 focus:border-green-400", title: "text-green-900 dark:text-green-300", applied: "text-green-700 dark:text-green-200" },
    red:     { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-800 dark:text-red-200", ring: "focus:ring-red-400", border: "hover:border-red-400 focus:border-red-400", title: "text-red-900 dark:text-red-300", applied: "text-red-700 dark:text-red-200" },
    yellow:  { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-800 dark:text-yellow-200", ring: "focus:ring-yellow-400", border: "hover:border-yellow-400 focus:border-yellow-400", title: "text-yellow-900 dark:text-yellow-300", applied: "text-yellow-700 dark:text-yellow-200" },
    orange:  { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-800 dark:text-orange-200", ring: "focus:ring-orange-400", border: "hover:border-orange-400 focus:border-orange-400", title: "text-orange-900 dark:text-orange-300", applied: "text-orange-700 dark:text-orange-200" },
    amber:   { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-800 dark:text-amber-200", ring: "focus:ring-amber-400", border: "hover:border-amber-400 focus:border-amber-400", title: "text-amber-900 dark:text-amber-300", applied: "text-amber-700 dark:text-amber-200" },
    cyan:    { bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-800 dark:text-cyan-200", ring: "focus:ring-cyan-400", border: "hover:border-cyan-400 focus:border-cyan-400", title: "text-cyan-900 dark:text-cyan-300", applied: "text-cyan-700 dark:text-cyan-200" },
    gray:    { bg: "bg-gray-100 dark:bg-slate-700", text: "text-gray-800 dark:text-gray-100", ring: "focus:ring-gray-400", border: "hover:border-gray-400 focus:border-gray-400", title: "text-gray-900 dark:text-gray-100", applied: "text-gray-700 dark:text-gray-100" },
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        <Lightbulb className="inline mr-2 text-yellow-500" size={20} />
        Color Theory Tips
      </h3>
      <div className="flex gap-2 mb-4">
        <button
          className="flex items-center gap-1 px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition text-sm font-medium border border-blue-200 dark:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => {
            if (showRandom) {
              setShowRandom(false);
              setTipsState(null);
            } else {
              const randomTip = tips[Math.floor(Math.random() * tips.length)];
              setTipsState([randomTip]);
              setShowRandom(true);
              setShuffled(false);
            }
          }}
          aria-label={showRandom ? "Show all tips" : "Show a random tip"}
        >
          <Dice5 className="w-4 h-4 mr-1" />
          {showRandom ? "Show All Tips" : "Show Random Tip"}
        </button>
        <button
          className="flex items-center gap-1 px-3 py-1 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 transition text-sm font-medium border border-purple-200 dark:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onClick={() => {
            if (shuffled) {
              setShuffled(false);
              setTipsState(null);
            } else {
              setTipsState(shuffleArray(tips));
              setShuffled(true);
              setShowRandom(false);
            }
          }}
          aria-label={shuffled ? "Show tips in original order" : "Shuffle tips"}
        >
          <Shuffle className="w-4 h-4 mr-1" />
          {shuffled ? "Show Original Order" : "Shuffle Tips"}
        </button>
      </div>
      <div className="space-y-4">
        {tipsToShow.map((tip, index) => {
          const colorClasses = colorClassMap[tip.color] || colorClassMap.gray;
          return (
            <button
              key={index}
              className={`w-full text-left p-4 ${colorClasses.bg} rounded-lg transition-all border-2 focus:ring-2 ${colorClasses.ring} border-transparent ${colorClasses.border} mb-1 outline-none group ${activeTip === tip.title ? 'ring-2 ' + colorClasses.ring.replace('focus:', '') : ''}`}
              onClick={() => {
                setActiveTip(tip.title);
                if (onApplyHarmonyPalette) onApplyHarmonyPalette(tip.title);
                setTimeout(() => setActiveTip(null), 1200);
              }}
              tabIndex={0}
              aria-label={`Generate palette for ${tip.title}`}
              role="button"
            >
              <h4 className={`font-semibold ${colorClasses.title} mb-2 flex items-center gap-2`}>
                {tip.title}
                {activeTip === tip.title && (
                  <span className={`ml-2 text-xs font-medium ${colorClasses.applied}`}>Palette applied!</span>
                )}
              </h4>
              {/* Swatch row */}
              <div className="flex items-center gap-2 mb-2" aria-label={`Example colors for ${tip.title}`}> 
                {tip.swatch && tip.swatch.map((color, i) => (
                  <span
                    key={color + i}
                    className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700"
                    style={{ backgroundColor: color }}
                    aria-label={`Color swatch: ${color}`}
                    title={color}
                    role="img"
                  />
                ))}
              </div>
              <p className={`text-sm ${colorClasses.text}`}>
                {tip.description}
              </p>
            </button>
          );
        })}
      </div>
      {/* Single Learn More link at bottom */}
      <div className="mt-6 flex justify-center">
        <a
          href="https://www.canva.com/colors/color-wheel/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-base text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-white inline-flex items-center gap-1 font-medium"
          aria-label="Learn more about color theory (opens in new tab)"
        >
          Learn more about color theory
          <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" /></svg>
        </a>
      </div>
    </div>
  );
}
