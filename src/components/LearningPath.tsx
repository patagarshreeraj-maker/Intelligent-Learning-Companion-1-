import React, { useState, useEffect } from "react";
import { Compass, Sparkles, CheckCircle2, Circle, ArrowRight, BookOpen, Layers, Play } from "lucide-react";
import { Subject, LearningPath } from "../types";

interface LearningPathProps {
  subjects: Subject[];
  initialSubject?: string;
  onNavigateQuiz: (subject: string, topic: string) => void;
  onNavigateTutor: (prompt: string) => void;
}

export const LearningPathView: React.FC<LearningPathProps> = ({
  subjects,
  initialSubject,
  onNavigateQuiz,
  onNavigateTutor,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || subjects[0]?.name || "Python Programming");
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLearningPath(selectedSubject);
  }, [selectedSubject]);

  const fetchLearningPath = async (subjectName: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subjectName, currentLevel: "Beginner" }),
      });
      const data = await res.json();
      setLearningPath(data);
    } catch (err) {
      console.error("Error fetching learning path:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryColors = {
    Basics: "border-indigo-300 dark:border-indigo-500/40 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300",
    Core: "border-purple-300 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-500/10 text-purple-800 dark:text-purple-300",
    Advanced: "border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300",
    Project: "border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Learning Path & Subject Roadmap</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Structured visual node hierarchy tracking your mastery from Basics to Projects.
            </p>
          </div>
        </div>

        {/* Subject Selector */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 shadow-xs"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                📘 {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 shadow-xs">
          <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Generating AI Learning Path for {selectedSubject}...</div>
        </div>
      ) : learningPath ? (
        <div className="space-y-6">
          {/* Overview Box */}
          <div className="bg-indigo-50/60 dark:bg-gradient-to-r dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{learningPath.subjectName} Roadmap</h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded-lg">
                ~{learningPath.estimatedHours || 15} Estimated Hours
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{learningPath.overview}</p>
          </div>

          {/* Visual Roadmap Nodes Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-300 dark:before:bg-indigo-500/30">
            {learningPath.nodes.map((node, index) => (
              <div key={node.id || index} className="relative group">
                {/* Node Icon Circle */}
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-950 border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shadow-xs">
                  {index + 1}
                </div>

                {/* Node Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40 rounded-2xl p-5 shadow-xs space-y-3 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${categoryColors[node.category] || categoryColors.Basics}`}>
                        {node.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{node.title}</h3>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onNavigateQuiz(selectedSubject, node.title)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Quiz Node</span>
                      </button>
                      <button
                        onClick={() => onNavigateTutor(`Teach me ${node.title} in ${selectedSubject} step by step with code and diagram explanations.`)}
                        className="px-3 py-1 bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-100 dark:hover:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded-lg text-xs font-medium transition-colors"
                      >
                        <span>Ask AI Tutor</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">{node.description}</p>

                  {/* Key Topics List */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {node.keyTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
                      >
                        • {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
