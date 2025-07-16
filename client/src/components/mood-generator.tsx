import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { generateMoodPalette, getAllMoodNames, searchMoodsByKeyword, moodPalettes } from "@/lib/mood-palettes";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Search, Info, Shuffle, HelpCircle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AnimatePresence, motion as framerMotion } from "framer-motion";

interface MoodGeneratorProps {
  onPaletteGenerated: (colors: string[]) => void;
}

export function MoodGenerator({ onPaletteGenerated }: MoodGeneratorProps) {
  const [moodInput, setMoodInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const presetMoods = getAllMoodNames();
  const suggestedMoods = moodInput.length > 2 ? searchMoodsByKeyword(moodInput) : [];

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{season?: string; vibe?: string; color?: string}>({});
  // Helper to reset quiz state
  const resetQuiz = () => {
    setShowQuiz(false);
    setQuizStep(0);
    setQuizAnswers({});
  };

  // Quiz questions and options
  const quizQuestions = [
    {
      question: "Pick a season:",
      options: ["Spring", "Summer", "Autumn", "Winter"]
    },
    {
      question: "Pick a vibe:",
      options: ["Calm", "Energetic", "Cozy", "Bold", "Playful", "Minimal"]
    },
    {
      question: "Pick a color family:",
      options: ["Blue", "Green", "Red", "Yellow", "Purple", "Neutral"]
    }
  ];

  // Map quiz answers to moods
  function getMoodFromQuiz(answers: {season?: string; vibe?: string; color?: string}): string {
    // Simple mapping logic for demo; can be improved
    if (answers.season === "Spring") return "spring";
    if (answers.season === "Summer") return "tropical";
    if (answers.season === "Autumn") return "autumn";
    if (answers.season === "Winter") return "ice";
    if (answers.vibe === "Calm") return "serene";
    if (answers.vibe === "Energetic") return "energetic";
    if (answers.vibe === "Cozy") return "cozy";
    if (answers.vibe === "Bold") return "bold";
    if (answers.vibe === "Playful") return "playful";
    if (answers.vibe === "Minimal") return "minimal";
    if (answers.color === "Blue") return "ocean";
    if (answers.color === "Green") return "forest";
    if (answers.color === "Red") return "retro";
    if (answers.color === "Yellow") return "luxury";
    if (answers.color === "Purple") return "mystic";
    if (answers.color === "Neutral") return "monochrome";
    return "sunset";
  }

  function handleQuizOption(option: string) {
    if (quizStep === 0) setQuizAnswers(a => ({...a, season: option}));
    if (quizStep === 1) setQuizAnswers(a => ({...a, vibe: option}));
    if (quizStep === 2) setQuizAnswers(a => ({...a, color: option}));
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz complete
      const mood = getMoodFromQuiz({...quizAnswers, [quizQuestions[quizStep].question.toLowerCase().includes('season') ? 'season' : quizQuestions[quizStep].question.toLowerCase().includes('vibe') ? 'vibe' : 'color']: option});
      setShowQuiz(false);
      setQuizStep(0);
      setQuizAnswers({});
      setMoodInput(mood);
      handleGenerateMood(mood);
    }
  }

  function handleQuizClose() {
    setShowQuiz(false);
    setQuizStep(0);
    setQuizAnswers({});
  }

  const handleGenerateMood = async (mood: string) => {
    setIsGenerating(true);
    
    try {
      const colors = generateMoodPalette(mood);
      onPaletteGenerated(mood); // Pass the mood string, not just colors
      
      // Check if the returned palette is the default (sunset)
      const isDefault = colors.every((c, i) => c === generateMoodPalette('sunset')[i]);
      if (isDefault && mood.toLowerCase().trim() !== 'sunset') {
        toast({
          title: "Mood not recognized",
          description: `No match for "${mood}". Showing default palette instead.`,
          variant: "destructive",
        });
      } else {
      toast({
        title: "Mood palette generated",
        description: `Created a "${mood}" inspired palette`,
      });
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate mood-based palette",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSurpriseMe = () => {
    const moods = getAllMoodNames();
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    setMoodInput(randomMood);
    handleGenerateMood(randomMood);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && moodInput.trim()) {
      handleGenerateMood(moodInput.trim());
    }
  };

  // Visual grid of moods
  const moodList = Object.entries(moodPalettes);
  const categories = Array.from(new Set(moodList.map(([_, mood]) => mood.category)));
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const filteredMoodList = selectedCategory === 'All'
    ? moodList
    : moodList.filter(([_, mood]) => mood.category === selectedCategory);

  // Trending moods state
  const [recentMoods, setRecentMoods] = useState<string[]>([]);
  const defaultTrending = ["sunset", "ocean", "autumn", "neon"];

  // Update trending moods when a mood is generated
  useEffect(() => {
    if (moodInput && getAllMoodNames().includes(moodInput)) {
      setRecentMoods((prev) => {
        const filtered = prev.filter((m) => m !== moodInput);
        return [moodInput, ...filtered].slice(0, 4);
      });
    }
  }, [moodInput]);

  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-500" size={24} />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">AI Mood Generator</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-slate-400 dark:text-slate-500 cursor-pointer">
                <Info size={18} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span>Generate palettes by mood, keyword, or inspiration</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-8 px-6 pb-6 pt-4">
        <TooltipProvider>
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-2">
            <div className="relative w-full sm:w-2/3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    value={moodInput}
                    onChange={(e) => setMoodInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a mood or keyword (e.g., sunset, retro, calm)"
                    className="pl-10 py-4 text-lg border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span>Type a mood, keyword, or color (e.g., 'cozy', 'neon', 'blue') and hit Generate!</span>
                </TooltipContent>
              </Tooltip>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        </div>
          <Button
            onClick={() => moodInput.trim() && handleGenerateMood(moodInput.trim())}
            disabled={!moodInput.trim() || isGenerating}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-lg px-8 py-4 shadow-lg"
              size="lg"
              aria-label="Generate mood palette"
          >
              {isGenerating ? <Sparkles className="animate-spin mr-2" size={20} /> : <Sparkles className="mr-2" size={20} />}
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>
          <div className="flex flex-row gap-3 mb-6 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleSurpriseMe}
              disabled={isGenerating}
              className="flex items-center gap-2"
              aria-label="Surprise Me with a random mood palette"
            >
              <Shuffle size={18} />
              Surprise Me
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowQuiz(true)}
              className="flex items-center gap-2"
              aria-label="Open mood quiz"
            >
              <HelpCircle size={18} />
              Feeling Lucky?
          </Button>
        </div>
        </TooltipProvider>
        
        {/* Suggested moods based on input */}
        {suggestedMoods.length > 0 && (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedMoods.slice(0, 4).map((mood, index) => (
                <motion.div
                  key={mood.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                    onClick={() => {
                      setMoodInput(mood.name);
                      handleGenerateMood(mood.name);
                    }}
                  >
                    {mood.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Preset mood tags */}
        <div className="space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">Popular moods:</p>
          <div className="flex flex-wrap gap-2">
            {presetMoods.slice(0, 8).map((mood, index) => (
              <motion.div
                key={mood}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => {
                    setMoodInput(mood);
                    handleGenerateMood(mood);
                  }}
                >
                  {mood}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trending/Popular Moods */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Trending moods:</p>
          <div className="flex flex-wrap gap-2">
            {(recentMoods.length > 0 ? recentMoods : defaultTrending).map((mood) => (
              <Tooltip key={mood}>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    onClick={() => {
                      setMoodInput(mood);
                      handleGenerateMood(mood);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Generate trending mood palette: ${moodPalettes[mood]?.name || mood}`}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setMoodInput(mood);
                        handleGenerateMood(mood);
                      }
                    }}
                    aria-pressed="false"
                  >
                    <div className="flex gap-0.5">
                      {moodPalettes[mood]?.colors?.slice(0, 3).map((color, i) => (
                        <span
                          key={color + i}
                          className="w-3 h-3 rounded-full border border-white dark:border-slate-800"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {moodPalettes[mood]?.name || mood}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{moodPalettes[mood]?.name || mood}</span>
                    <span className="text-xs text-slate-500">{moodPalettes[mood]?.keywords?.join(", ")}</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Quiz Button */}
        {/* Quiz Modal */}
        {showQuiz && (
          <Dialog open={showQuiz} onOpenChange={(open) => {
            setShowQuiz(open);
            if (!open) {
              setQuizStep(0);
              setQuizAnswers({});
            }
          }}>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 max-w-sm w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mood Quiz</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Step {quizStep + 1} of {quizQuestions.length}</span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <framerMotion.div
                    key={quizStep}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="mb-6 text-slate-700 dark:text-slate-300 text-base font-medium text-center">{quizQuestions[quizStep].question}</p>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      {quizQuestions[quizStep].options.map(option => (
                        <Button
                          key={option}
                          variant="outline"
                          className="w-full py-3 text-lg rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all"
                          onClick={() => handleQuizOption(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </framerMotion.div>
                </AnimatePresence>
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" onClick={resetQuiz} className="text-base">Cancel</Button>
                </div>
              </div>
            </div>
          </Dialog>
        )}

        {/* Visual Mood Grid with Category Filter */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium border ${selectedCategory === 'All' ? 'bg-purple-500 text-white border-purple-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'}`}
              onClick={() => setSelectedCategory('All')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full text-sm font-medium border ${selectedCategory === cat ? 'bg-purple-500 text-white border-purple-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Browse moods{selectedCategory !== 'All' ? `: ${selectedCategory}` : ''}:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMoodList.map(([key, mood]) => (
              <motion.div
                key={key}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 cursor-pointer hover:shadow-xl transition-all group relative focus-within:ring-2 focus-within:ring-purple-400"
                whileHover={{ scale: 1.04 }}
                tabIndex={0}
                role="button"
                aria-label={`Preview mood palette: ${mood.name}`}
                aria-pressed="false"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setMoodInput(key);
                    handleGenerateMood(key);
                  }
                }}
              >
                <div className="font-bold text-slate-900 dark:text-white mb-2 text-base flex items-center gap-2">
                  {mood.name}
                  <span className="text-xs font-normal text-slate-400">({mood.category})</span>
                </div>
                {/* Palette Preview Bar */}
                <div className="flex w-full h-4 rounded-lg overflow-hidden mb-2 border border-slate-200 dark:border-slate-700">
                  {mood.colors.map((color, i) => (
                    <div
                      key={color + i}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-1 mb-2">
                  {mood.colors.map((color, i) => (
                    <div
                      key={color + i}
                      className="w-6 h-6 rounded-lg border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {mood.keywords.slice(0, 3).map((kw, i) => (
                    <span key={kw + i} className="text-xs bg-slate-200 dark:bg-slate-700 rounded px-2 py-0.5 text-slate-600 dark:text-slate-300">
                      {kw}
                    </span>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setMoodInput(key);
                    handleGenerateMood(key);
                  }}
                  aria-label={`Preview mood palette: ${mood.name}`}
                >
                  Preview
                </Button>
                <div
                  className="absolute inset-0"
                  onClick={() => {
                    setMoodInput(key);
                    handleGenerateMood(key);
                  }}
                  style={{ zIndex: 1 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}