import React, { useState } from "react";
import logoImg from "../assets/images/intelligent_learning_logo_1786341664093.jpg";
import {
  Brain,
  Sparkles,
  BookOpen,
  FileText,
  Clock,
  Award,
  Layers,
  Settings,
  Flame,
  Zap,
  CheckCircle2,
  FileSearch,
  Compass,
  GraduationCap,
  Calculator,
  Mic,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
} from "lucide-react";
import { StudentProfile, AIProvider } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile;
  provider: AIProvider;
  setProvider: (p: AIProvider) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenProfile: () => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (m: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  provider,
  setProvider,
  theme,
  onToggleTheme,
  onOpenProfile,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const isDark = theme === "dark";

  const navGroups = [
    {
      title: "Workspace",
      items: [
        { id: "dashboard", label: "Dashboard", icon: BookOpen, badge: null },
        { id: "tutor", label: "AI Doubt Solver", icon: Brain, badge: "AI" },
        { id: "pdf", label: "PDF & OCR Studio", icon: FileSearch, badge: "OCR" },
      ],
    },
    {
      title: "Practice & Mastery",
      items: [
        { id: "roadmap", label: "Learning Path", icon: Compass, badge: null },
        { id: "flashcards", label: "Flashcards Studio", icon: Layers, badge: null },
        { id: "quiz", label: "AI Quiz & Weakness", icon: CheckCircle2, badge: null },
        { id: "exam", label: "Exam Evaluator", icon: GraduationCap, badge: "PRO" },
        { id: "viva", label: "Viva Oral Practice", icon: Mic, badge: "VOICE" },
      ],
    },
    {
      title: "Tools & Utilities",
      items: [
        { id: "math", label: "Math & STEM Solver", icon: Calculator, badge: null },
        { id: "planner", label: "Planner & Focus", icon: Clock, badge: null },
        { id: "notes", label: "Notes & Summaries", icon: FileText, badge: null },
      ],
    },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 border-r ${
          isDark
            ? "bg-slate-900 border-slate-800/80 text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        } ${
          collapsed ? "w-20" : "w-64"
        } ${
          mobileOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Branding & Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
          <div
            onClick={() => handleSelectTab("dashboard")}
            className="flex items-center space-x-3 cursor-pointer overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-indigo-500/30 p-0.5 bg-indigo-950/20 shrink-0 shadow-xs">
              <img
                src={logoImg}
                alt="Logo"
                className="w-full h-full object-cover rounded-[9px]"
                referrerPolicy="no-referrer"
              />
            </div>
            {!collapsed && (
              <div className="leading-tight truncate">
                <div className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                  Intelligent Learning
                </div>
                <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Companion v2.5
                </div>
              </div>
            )}
          </div>

          {/* Collapse Button Desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Close Button Mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      collapsed ? "justify-center px-0" : "justify-between px-3"
                    } py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-xs"
                        : isDark
                        ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Settings & Footer Panel */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2 shrink-0 bg-slate-50/50 dark:bg-slate-950/30">
          {/* AI Engine Switcher */}
          {!collapsed ? (
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>AI Engine</span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-semibold">
                <button
                  onClick={() => setProvider("gemini")}
                  className={`px-2 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    provider === "gemini"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>Cloud</span>
                </button>
                <button
                  onClick={() => setProvider("ollama")}
                  className={`px-2 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    provider === "ollama"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>Offline</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setProvider(provider === "gemini" ? "ollama" : "gemini")}
              className="w-full py-2 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-indigo-600 dark:text-indigo-400"
              title={`Switch AI Mode (Current: ${provider})`}
            >
              <Zap className="w-4 h-4" />
            </button>
          )}

          {/* Theme & Profile Bar */}
          <div className="flex items-center justify-between gap-1">
            <button
              onClick={onOpenProfile}
              className={`flex-1 flex items-center space-x-2 p-1.5 rounded-xl border transition-colors ${
                isDark
                  ? "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200"
                  : "bg-white hover:bg-slate-100 border-slate-200 text-slate-800"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {profile.name.charAt(0)}
              </div>
              {!collapsed && (
                <div className="text-left leading-tight truncate flex-1">
                  <div className="text-xs font-bold truncate">{profile.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">Lvl {profile.level} Student</div>
                </div>
              )}
              {!collapsed && <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all shrink-0 ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
