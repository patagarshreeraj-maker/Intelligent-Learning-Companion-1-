import React from "react";
import {
  Menu,
  Flame,
  Award,
  Sparkles,
  Search,
  Brain,
  Clock,
  Plus,
} from "lucide-react";
import { StudentProfile } from "../types";

interface HeaderProps {
  activeTab: string;
  profile: StudentProfile;
  theme: "light" | "dark";
  onOpenMobileMenu: () => void;
  onNavigate: (tab: string, state?: any) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  profile,
  theme,
  onOpenMobileMenu,
  onNavigate,
  onOpenProfile,
}) => {
  const isDark = theme === "dark";

  const tabTitles: Record<string, { name: string; category: string }> = {
    dashboard: { name: "Dashboard & Analytics", category: "Workspace" },
    tutor: { name: "AI Doubt Solver", category: "AI Intelligence" },
    pdf: { name: "PDF & OCR Studio", category: "AI Intelligence" },
    roadmap: { name: "Learning Path", category: "Practice & Mastery" },
    flashcards: { name: "Flashcards Studio", category: "Practice & Mastery" },
    quiz: { name: "AI Quiz & Weakness Radar", category: "Practice & Mastery" },
    exam: { name: "Exam & Answer Evaluator", category: "Practice & Mastery" },
    viva: { name: "Viva Oral Interview", category: "Practice & Mastery" },
    math: { name: "Math & STEM Solver", category: "Tools & Utilities" },
    planner: { name: "Planner & Focus Studio", category: "Tools & Utilities" },
    notes: { name: "Notes & Summaries", category: "Tools & Utilities" },
  };

  const currentInfo = tabTitles[activeTab] || { name: "Workspace", category: "Platform" };

  // Calculate Days to Exam
  const examDaysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(profile.examDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <header
      className={`sticky top-0 z-30 h-16 border-b transition-colors backdrop-blur-md px-4 sm:px-6 flex items-center justify-between ${
        isDark
          ? "bg-slate-950/80 border-slate-800/80 text-slate-100"
          : "bg-white/80 border-slate-200 text-slate-900"
      }`}
    >
      {/* Left Title & Mobile Menu Trigger */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-400">
            <span>{currentInfo.category}</span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentInfo.name}</span>
          </div>
          <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            {currentInfo.name}
          </h1>
        </div>
      </div>

      {/* Center Search / Search Trigger */}
      <div className="hidden lg:flex items-center max-w-xs w-full">
        <div
          onClick={() => onNavigate("tutor", { prompt: "Explain concept: " })}
          className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors ${
            isDark
              ? "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700"
              : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 truncate">Ask AI Tutor or search topics...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Quick Badges & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Streak Pill */}
        <div
          className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-xl border text-xs font-bold ${
            isDark
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
          title={`${profile.streakDays} Day Active Study Streak`}
        >
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{profile.streakDays}d</span>
        </div>

        {/* XP & Level Pill */}
        <div
          className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-xl border text-xs font-semibold ${
            isDark
              ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
              : "bg-purple-50 text-purple-800 border-purple-200"
          }`}
          title={`Level ${profile.level} (${profile.xp} XP)`}
        >
          <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="font-bold">Lvl {profile.level}</span>
        </div>

        {/* Exam Countdown Pill */}
        <div
          onClick={onOpenProfile}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
            isDark
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
          title="Click to edit exam target date"
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{examDaysLeft}d to Exams</span>
        </div>

        {/* Quick Ask CTA Button */}
        <button
          onClick={() => onNavigate("tutor")}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors shrink-0"
        >
          <Brain className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>
    </header>
  );
};
