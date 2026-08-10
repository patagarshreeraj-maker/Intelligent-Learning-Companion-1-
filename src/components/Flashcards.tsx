import React, { useState } from "react";
import { Layers, RotateCcw, Sparkles, Plus, Check, HelpCircle, ArrowLeft, ArrowRight, Brain } from "lucide-react";
import { Flashcard, Subject } from "../types";

interface FlashcardsProps {
  cards: Flashcard[];
  subjects: Subject[];
  initialSubjectId?: string;
  onUpdateCards: (cards: Flashcard[]) => void;
  onAddFlashcards: (cards: Flashcard[]) => void;
}

export const FlashcardsView: React.FC<FlashcardsProps> = ({
  cards,
  subjects,
  initialSubjectId,
  onUpdateCards,
  onAddFlashcards,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubjectId || subjects[0]?.id || "sub_python"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genTopic, setGenTopic] = useState("");

  const filteredCards = cards.filter((c) => c.subjectId === selectedSubjectId);
  const currentCard = filteredCards[currentIndex] || null;

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredCards.length));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % Math.max(1, filteredCards.length));
  };

  const handleRateCard = (difficulty: "Easy" | "Medium" | "Hard") => {
    if (!currentCard) return;
    const updated = cards.map((c) =>
      c.id === currentCard.id
        ? {
            ...c,
            difficulty,
            reviewCount: c.reviewCount + 1,
            lastReviewed: new Date().toISOString(),
          }
        : c
    );
    onUpdateCards(updated);
    handleNext();
  };

  const handleGenerateCards = async () => {
    if (!genTopic.trim()) return;
    const activeSub = subjects.find((s) => s.id === selectedSubjectId);
    if (!activeSub) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: activeSub.name,
          topic: genTopic,
          count: 8,
        }),
      });
      const data = await res.json();
      if (data.flashcards && Array.isArray(data.flashcards)) {
        const newCards: Flashcard[] = data.flashcards.map((fc: any, i: number) => ({
          id: `fc_gen_${Date.now()}_${i}`,
          subjectId: selectedSubjectId,
          front: fc.front,
          back: fc.back,
          difficulty: fc.difficulty || "Medium",
          hint: fc.hint,
          reviewCount: 0,
        }));
        onAddFlashcards(newCards);
        setGenTopic("");
      }
    } catch (err) {
      console.error("Error generating flashcards:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Spaced Repetition Flashcards</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active recall deck designed for exam memory retention.
            </p>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Subject:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 shadow-xs"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Card Generator Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
          <Sparkles className="w-4 h-4" />
          <span>AI Deck Builder:</span>
        </div>
        <input
          type="text"
          value={genTopic}
          onChange={(e) => setGenTopic(e.target.value)}
          placeholder="Enter topic e.g. Normalization, OSI Layers, Lambda Functions..."
          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-xs"
        />
        <button
          onClick={handleGenerateCards}
          disabled={isGenerating || !genTopic.trim()}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          {isGenerating ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isGenerating ? "Generating..." : "Generate Cards"}</span>
        </button>
      </div>

      {/* Flashcard Stage Area */}
      {currentCard ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Card Counter & Progress */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Card {currentIndex + 1} of {filteredCards.length}</span>
            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
              currentCard.difficulty === "Easy"
                ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                : currentCard.difficulty === "Hard"
                ? "bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                : "bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
            }`}>
              {currentCard.difficulty} Recall
            </span>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative h-80 w-full cursor-pointer perspective group"
          >
            <div
              className={`w-full h-full rounded-2xl bg-white dark:bg-slate-900 border-2 ${
                isFlipped ? "border-amber-500/60 bg-amber-50/20 dark:bg-slate-950" : "border-indigo-300 dark:border-indigo-500/40 hover:border-indigo-500"
              } p-8 shadow-xs dark:shadow-2xl flex flex-col justify-between transition-all duration-300 transform select-none`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {isFlipped ? "ANSWER / BACK" : "QUESTION / FRONT"}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Click card to flip 🔄</span>
              </div>

              {/* Card Body Text */}
              <div className="flex-1 flex items-center justify-center text-center p-4">
                <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
              </div>

              {/* Hint Bar if front */}
              {!isFlipped && currentCard.hint && (
                <div className="text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHint(!showHint);
                    }}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? `Hint: ${currentCard.hint}` : "Show Hint"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Controls: Rating & Navigation */}
          {isFlipped ? (
            <div className="space-y-2 text-center animate-in fade-in duration-200">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">How well did you remember this concept?</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleRateCard("Hard")}
                  className="py-2.5 bg-rose-50 dark:bg-rose-600/20 hover:bg-rose-100 dark:hover:bg-rose-600/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-xl text-xs font-bold transition-colors"
                >
                  🔴 Hard (Review Soon)
                </button>
                <button
                  onClick={() => handleRateCard("Medium")}
                  className="py-2.5 bg-amber-50 dark:bg-amber-600/20 hover:bg-amber-100 dark:hover:bg-amber-600/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded-xl text-xs font-bold transition-colors"
                >
                  🟡 Medium (Review Tomorrow)
                </button>
                <button
                  onClick={() => handleRateCard("Easy")}
                  className="py-2.5 bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-xs font-bold transition-colors"
                >
                  🟢 Easy (Mastered)
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => setIsFlipped(true)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Flip Card
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-3 shadow-xs">
          <Layers className="w-12 h-12 stroke-1 mx-auto text-slate-400 dark:text-slate-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Flashcards in this Subject Deck</h3>
          <p className="text-xs">Use the AI Deck Builder above or upload a PDF to auto-generate cards.</p>
        </div>
      )}
    </div>
  );
};
