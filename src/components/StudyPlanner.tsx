import React, { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw, Sparkles, Calendar, CheckCircle2, Flame, Volume2, VolumeX, Plus } from "lucide-react";
import { StudentProfile, Subject, WeakTopic, AIStudyPlan, StudySession } from "../types";
import { addXP, saveStoredSessions } from "../lib/storage";

interface StudyPlannerProps {
  profile: StudentProfile;
  subjects: Subject[];
  weakTopics: WeakTopic[];
  sessions: StudySession[];
  onUpdateSessions: (sessions: StudySession[]) => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  profile,
  subjects,
  weakTopics,
  sessions,
  onUpdateSessions,
}) => {
  const [activeTab, setActiveTab] = useState<"timer" | "plan">("timer");

  // Focus Timer State
  const [timerMode, setTimerMode] = useState<"Pomodoro" | "Deep Study" | "Deep Work">("Pomodoro");
  const [durationSeconds, setDurationSeconds] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "Python Programming");
  const [selectedTopic, setSelectedTopic] = useState("Core Concepts Revision");
  const [isMuted, setIsMuted] = useState(true);

  // AI Planner State
  const [studyPlan, setStudyPlan] = useState<AIStudyPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleModeChange = (mode: "Pomodoro" | "Deep Study" | "Deep Work") => {
    setTimerMode(mode);
    setIsRunning(false);
    const minutes = mode === "Pomodoro" ? 25 : mode === "Deep Study" ? 50 : 90;
    setDurationSeconds(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const handleSessionComplete = () => {
    const minsStudied = Math.round(durationSeconds / 60);
    const xpGained = minsStudied * 2;
    addXP(xpGained);

    const newSession: StudySession = {
      id: `sess_${Date.now()}`,
      subjectName: selectedSubject,
      topicName: selectedTopic,
      durationMins: minsStudied,
      mode: timerMode,
      date: new Date().toISOString(),
      xpEarned: xpGained,
    };

    const updated = [newSession, ...sessions];
    onUpdateSessions(updated);
    saveStoredSessions(updated);

    alert(`🎉 Great job! Session complete! You studied ${minsStudied} mins of ${selectedSubject} and earned +${xpGained} XP!`);
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    setStudyPlan(null);

    const examDays = Math.max(1, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    try {
      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: profile.name,
          subjects: profile.subjects,
          examDaysLeft: examDays,
          dailyHoursGoal: profile.dailyGoalHours,
          weakTopics: weakTopics.map((w) => w.topicName),
        }),
      });

      const data = await res.json();
      setStudyPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Study Planner & Focus Timer</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized schedule generator & Pomodoro focus timer with streak tracking.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab("timer")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "timer" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            ⏱️ Focus Clock
          </button>
          <button
            onClick={() => setActiveTab("plan")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "plan" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            📅 AI Schedule Plan
          </button>
        </div>
      </div>

      {/* TAB 1: FOCUS CLOCK */}
      {activeTab === "timer" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Clock Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 flex flex-col items-center justify-center text-center">
            {/* Modes Bar */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <button
                onClick={() => handleModeChange("Pomodoro")}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  timerMode === "Pomodoro" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                25m Pomodoro
              </button>
              <button
                onClick={() => handleModeChange("Deep Study")}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  timerMode === "Deep Study" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                50m Deep Study
              </button>
              <button
                onClick={() => handleModeChange("Deep Work")}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  timerMode === "Deep Work" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                90m Deep Work
              </button>
            </div>

            {/* Subject Context Selector */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md w-full">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500 shadow-xs"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    📘 {s.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="Topic being studied..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 min-w-[150px]"
              />
            </div>

            {/* Giant Timer Display */}
            <div className="relative my-4">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-emerald-500/30 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center shadow-inner">
                <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-widest font-mono">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">{selectedSubject}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{selectedTopic}</div>
              </div>
            </div>

            {/* Clock Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(durationSeconds);
                }}
                className="p-3 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold shadow-xs flex items-center gap-2 transition-transform active:scale-95"
              >
                {isRunning ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                <span>{isRunning ? "Pause Session" : "Start Focus Session"}</span>
              </button>
            </div>
          </div>

          {/* Session History Sidebar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Recent Focus Sessions Log
              </h3>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{sess.subjectName}</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">+{sess.xpEarned} XP</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px]">{sess.topicName}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    {sess.durationMins} mins • {sess.mode}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI SCHEDULE PLAN */}
      {activeTab === "plan" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Generate Personalized Study Schedule</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI synthesizes weak topics, target exam date, and daily study hours into an actionable weekly plan.
              </p>
            </div>
            <button
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 shrink-0 transition-colors"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{isGeneratingPlan ? "Generating Plan..." : "Generate AI Plan"}</span>
            </button>
          </div>

          {studyPlan ? (
            <div className="space-y-6">
              <div className="bg-emerald-50/50 dark:bg-gradient-to-r dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 shadow-xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{studyPlan.title}</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300">{studyPlan.summary}</p>
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 pt-1">
                  🎯 Weekly Milestone: {studyPlan.weeklyGoal}
                </div>
              </div>

              {/* Timetable Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studyPlan.dailySchedule.map((item, i) => (
                  <div
                    key={i}
                    className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs space-y-2 ${
                      item.isWeakTopicFocus ? "border-amber-400/60 dark:border-amber-500/40" : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.dayName}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-md">
                        {item.durationMins} mins
                      </span>
                    </div>

                    <div className="text-sm font-bold text-indigo-600 dark:text-indigo-300">{item.focusSubject}</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">{item.targetTopic}</div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px]">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Activity: {item.activityType}</span>
                      {item.isWeakTopicFocus && (
                        <span className="text-amber-600 dark:text-amber-400 font-bold">🔥 Weak Topic Focus</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
              <Calendar className="w-12 h-12 stroke-1 mx-auto text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Active AI Study Schedule</h3>
              <p className="text-xs">Click "Generate AI Plan" above to create a custom study timetable.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
