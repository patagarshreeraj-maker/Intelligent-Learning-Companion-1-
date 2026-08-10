import React from "react";
import {
  Brain,
  Sparkles,
  Target,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers,
  FileText,
  Flame,
  BarChart3,
  Compass,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { StudentProfile, Subject, WeakTopic, StudySession, Achievement } from "../types";

interface DashboardProps {
  profile: StudentProfile;
  subjects: Subject[];
  weakTopics: WeakTopic[];
  sessions: StudySession[];
  onNavigate: (tab: string, extra?: any) => void;
  onOpenProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  subjects,
  weakTopics,
  sessions,
  onNavigate,
  onOpenProfile,
}) => {
  // Calculate Days Remaining
  const examDateObj = new Date(profile.examDate);
  const nowObj = new Date();
  const diffTime = examDateObj.getTime() - nowObj.getTime();
  const examDaysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Weekly study time data for Recharts
  const weeklyData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.0 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 4.0 },
    { day: "Fri", hours: 2.0 },
    { day: "Sat", hours: 3.5 },
    { day: "Sun", hours: 2.8 },
  ];

  // Subject Progress Pie Data
  const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#a855f7", "#f59e0b"];
  const subjectChartData = subjects.map((sub, i) => ({
    name: sub.name,
    progress: sub.progressPct,
    color: COLORS[i % COLORS.length],
  }));

  // Top Priority Weak Topic
  const topWeakTopic = weakTopics.length > 0 ? weakTopics[0] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{profile.course} • {profile.semester}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-indigo-300">{profile.name}</span>! 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your AI companion has synthesized your learning roadmap. Today's goal is <strong className="text-indigo-200">{profile.dailyGoalHours} hours</strong> of focused revision.
            </p>
          </div>

          {/* Exam Countdown Box */}
          <div className="flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:px-6 shadow-md min-w-[200px] text-center">
            <div className="text-3xl font-black text-amber-400">
              ⏳ {examDaysLeft} Days
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-1">Exam Countdown</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Target: {profile.examDate}</div>
            <button
              onClick={onOpenProfile}
              className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              Adjust Exam Date
            </button>
          </div>
        </div>
      </div>

      {/* Personalized AI Study Engine Banner */}
      {topWeakTopic && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/40 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  🧠 AI Recommendation Engine
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-md font-semibold">
                  Weak Topic Identified
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                {topWeakTopic.subjectName}: {topWeakTopic.topicName}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                Current accuracy: <strong className="text-rose-600 dark:text-rose-400">{topWeakTopic.averageScorePct}%</strong>. {topWeakTopic.recommendedAction}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigate("quiz", { subject: topWeakTopic.subjectName, topic: topWeakTopic.topicName })}
              className="flex-1 sm:flex-initial px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Practice Quiz Now</span>
            </button>
            <button
              onClick={() => onNavigate("tutor", { prompt: `Explain ${topWeakTopic.topicName} in ${topWeakTopic.subjectName} with simple examples and step-by-step breakdown.` })}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Streak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{profile.streakDays} Days</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Study Streak</div>
          </div>
        </div>

        {/* Card 2: Level & XP */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">Lvl {profile.level}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{profile.xp} Total XP</div>
          </div>
        </div>

        {/* Card 3: Subjects Enrolled */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{subjects.length} Subjects</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Active Course Modules</div>
          </div>
        </div>

        {/* Card 4: Weak Topics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{weakTopics.length} Focus Topics</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Needs Revision</div>
          </div>
        </div>
      </div>

      {/* Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study Time Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Weekly Study Hours Log</h2>
            </div>
            <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-2.5 py-1 rounded-lg">
              Goal: {profile.dailyGoalHours * 7}h / week
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
                  formatter={(val: any) => [`${val} Hours`, "Studied"]}
                />
                <Bar dataKey="hours" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Progress Pie / Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Subject Mastery %</h2>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="progress"
                >
                  {subjectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
                  formatter={(val: any) => [`${val}% Progress`, "Mastery"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subjects & Modules Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">My Study Modules</h2>
          </div>
          <button
            onClick={onOpenProfile}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            + Manage Subjects
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl">
                    {sub.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{sub.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{sub.code || "Core Subject"} • {sub.topics.length} Topics</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-lg">
                  {sub.progressPct}% Mastered
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${sub.progressPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Topics Pills */}
              <div className="flex flex-wrap gap-1.5">
                {sub.topics.slice(0, 3).map((t) => (
                  <span
                    key={t.id}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                      t.status === "completed"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : t.status === "weak"
                        ? "bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {t.name}
                  </span>
                ))}
                {sub.topics.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">
                    +{sub.topics.length - 3} more
                  </span>
                )}
              </div>

              {/* Quick Module Action Toolbar */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-semibold">
                <button
                  onClick={() => onNavigate("roadmap", { subject: sub.name })}
                  className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center gap-1 transition-colors"
                  title="View AI Learning Path"
                >
                  <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Roadmap</span>
                </button>
                <button
                  onClick={() => onNavigate("flashcards", { subjectId: sub.id })}
                  className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center gap-1 transition-colors"
                  title="Practice Flashcards"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Flashcards</span>
                </button>
                <button
                  onClick={() => onNavigate("quiz", { subject: sub.name })}
                  className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center gap-1 transition-colors"
                  title="Take AI Quiz"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Quiz</span>
                </button>
                <button
                  onClick={() => onNavigate("tutor", { subject: sub.name })}
                  className="p-1.5 bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-100 dark:hover:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded-lg flex items-center justify-center gap-1 transition-colors"
                  title="Ask AI Tutor"
                >
                  <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>AI Tutor</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Unlocked Achievements & Badges</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {profile.achievements.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center text-center space-y-1.5 ${
                badge.isUnlocked
                  ? "bg-purple-50/50 dark:bg-slate-950/80 border-purple-200 dark:border-purple-500/30 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/60 opacity-50 grayscale"
              }`}
            >
              <div className="text-2xl">{badge.icon}</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-200">{badge.title}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{badge.description}</div>
              {badge.isUnlocked && (
                <span className="text-[9px] text-purple-700 dark:text-purple-400 font-semibold px-2 py-0.5 bg-purple-100 dark:bg-purple-500/10 rounded-full border border-purple-200 dark:border-purple-500/20">
                  Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
