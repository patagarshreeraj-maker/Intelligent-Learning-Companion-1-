import React, { useState } from "react";
import {
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Award,
  AlertCircle,
  Play,
  RotateCcw,
  ArrowRight,
  Brain,
  XCircle,
  Check,
} from "lucide-react";
import { Subject, QuizQuestion, WeakTopic } from "../types";
import { addXP } from "../lib/storage";

interface QuizSystemProps {
  subjects: Subject[];
  weakTopics: WeakTopic[];
  initialSubject?: string;
  initialTopic?: string;
  onUpdateWeakTopics: (topics: WeakTopic[]) => void;
  onNavigateTutor: (prompt: string) => void;
}

export const QuizSystem: React.FC<QuizSystemProps> = ({
  subjects,
  weakTopics,
  initialSubject,
  initialTopic,
  onUpdateWeakTopics,
  onNavigateTutor,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || subjects[0]?.name || "Python Programming");
  const [selectedTopic, setSelectedTopic] = useState(initialTopic || "General Topic");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [quizState, setQuizState] = useState<"idle" | "loading" | "active" | "results">("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleStartQuiz = async () => {
    setQuizState("loading");
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQIndex(0);
    setSelectedOption(null);

    try {
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: selectedTopic,
          count: questionCount,
          difficulty,
        }),
      });

      const data = await res.json();
      if (data.quiz && Array.isArray(data.quiz)) {
        setQuestions(data.quiz);
        setQuizState("active");
      } else {
        throw new Error("Invalid quiz format received.");
      }
    } catch (err) {
      console.error("Quiz generation error:", err);
      setQuizState("idle");
      alert("Failed to generate quiz. Please check internet connection or switch AI provider.");
    }
  };

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    const newAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Finish Quiz
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (answers: number[]) => {
    setQuizState("results");
    let score = 0;
    const missedSubtopics: string[] = [];

    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) {
        score += 1;
      } else {
        if (q.subtopic) missedSubtopics.push(q.subtopic);
      }
    });

    const percentage = Math.round((score / questions.length) * 100);

    // Award XP
    const xpGained = score * 15;
    addXP(xpGained);

    // Trigger Weak Topic Detector if percentage < 60%
    if (percentage < 60 || missedSubtopics.length > 0) {
      const existing = weakTopics.find(
        (w) => w.subjectName === selectedSubject && w.topicName === selectedTopic
      );

      let updatedList: WeakTopic[];
      if (existing) {
        updatedList = weakTopics.map((w) =>
          w.id === existing.id
            ? {
                ...w,
                averageScorePct: Math.round((w.averageScorePct + percentage) / 2),
                attempts: w.attempts + 1,
                lastTestedDate: new Date().toISOString(),
              }
            : w
        );
      } else {
        const newWT: WeakTopic = {
          id: `wt_${Date.now()}`,
          subjectName: selectedSubject,
          topicName: selectedTopic,
          averageScorePct: percentage,
          attempts: 1,
          recommendedAction: `Score was ${percentage}%. Solve 5 Spaced Repetition flashcards & read notes.`,
          lastTestedDate: new Date().toISOString(),
        };
        updatedList = [newWT, ...weakTopics];
      }
      onUpdateWeakTopics(updatedList);
    }
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Quiz Generator & Performance Engine</h1>
            <p className="text-xs text-slate-400">
              Interactive MCQ assessments with automated Weak Topic Detection.
            </p>
          </div>
        </div>
      </div>

      {/* State 1: IDLE / CONFIG */}
      {quizState === "idle" && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            Quiz Setup Parameters
          </h2>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  📘 {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Topic / Chapter</label>
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="e.g. Normalization, OSI 7-Layer, OOP Inheritance..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="Easy">Easy (Fundamentals)</option>
                <option value="Medium">Medium (Exam Standard)</option>
                <option value="Hard">Hard (Advanced Reasoning)</option>
              </select>
            </div>

            {/* Questions count */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Questions Count</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value={3}>3 Questions (Quick Test)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={10}>10 Questions (Full Assessment)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Generate & Start Quiz</span>
          </button>
        </div>
      )}

      {/* State 2: LOADING */}
      {quizState === "loading" && (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3 shadow-xl">
          <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
          <div className="text-sm font-semibold text-slate-200">
            Intelligent Learning Companion is drafting custom questions for {selectedSubject} ({selectedTopic})...
          </div>
        </div>
      )}

      {/* State 3: ACTIVE QUIZ */}
      {quizState === "active" && currentQ && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Top Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Question {currentQIndex + 1} of {questions.length}</span>
              <span className="text-emerald-400">{selectedSubject}</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Box */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                    selectedOption === i
                      ? "bg-emerald-600/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-slate-400 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-800">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {selectedOption === i && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-colors"
            >
              <span>{currentQIndex + 1 === questions.length ? "Finish Test" : "Next Question"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* State 4: RESULTS */}
      {quizState === "results" && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl font-bold">
              🏆
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Quiz Completed!</h2>
              <p className="text-xs text-slate-400 mt-0.5">Subject: {selectedSubject} • Topic: {selectedTopic}</p>
            </div>

            <div className="flex justify-center items-center gap-6 py-2">
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-400">
                  {userAnswers.filter((ans, i) => ans === questions[i]?.correctIndex).length} / {questions.length}
                </div>
                <div className="text-[11px] text-slate-400">Correct Answers</div>
              </div>

              <div className="text-center border-l border-slate-800 pl-6">
                <div className="text-3xl font-black text-amber-400">
                  +{userAnswers.filter((ans, i) => ans === questions[i]?.correctIndex).length * 15} XP
                </div>
                <div className="text-[11px] text-slate-400">Awarded</div>
              </div>
            </div>

            <button
              onClick={() => setQuizState("idle")}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Another Quiz</span>
            </button>
          </div>

          {/* Question-by-Question Detailed AI Explanations */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Detailed Answer Key & AI Explanations</h3>
            {questions.map((q, i) => {
              const isCorrect = userAnswers[i] === q.correctIndex;
              return (
                <div
                  key={i}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-md space-y-3 ${
                    isCorrect ? "border-emerald-500/30" : "border-rose-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-100">
                      Q{i + 1}. {q.question}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        isCorrect
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {isCorrect ? "✓ Correct" : "✕ Incorrect"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      Your answer: <strong className={isCorrect ? "text-emerald-400" : "text-rose-400"}>
                        {q.options[userAnswers[i]] || "None"}
                      </strong>
                    </div>
                    {!isCorrect && (
                      <div>
                        Correct answer: <strong className="text-emerald-400">{q.options[q.correctIndex]}</strong>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed bg-indigo-950/30 border border-indigo-500/20 p-3 rounded-xl">
                    <strong className="text-indigo-300 font-semibold">💡 AI Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
