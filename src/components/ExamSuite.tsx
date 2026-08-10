import React, { useState } from "react";
import { GraduationCap, FileText, CheckCircle2, Sparkles, Copy, Check, Download, AlertCircle, Play } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Subject, AnswerEvaluation } from "../types";

interface ExamSuiteProps {
  subjects: Subject[];
}

export const ExamSuite: React.FC<ExamSuiteProps> = ({ subjects }) => {
  const [activeTab, setActiveTab] = useState<"generator" | "evaluator">("generator");

  // Question Paper State
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "Database Management (DBMS)");
  const [totalMarks, setTotalMarks] = useState(50);
  const [durationMins, setDurationMins] = useState(120);
  const [difficulty, setDifficulty] = useState("Medium");
  const [paperMarkdown, setPaperMarkdown] = useState<string | null>(null);
  const [isGeneratingPaper, setIsGeneratingPaper] = useState(false);

  // Answer Evaluator State
  const [evalQuestion, setEvalQuestion] = useState("Explain Normalization in DBMS. Differentiate between 2NF and 3NF with examples.");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [maxMarks, setMaxMarks] = useState(10);
  const [evalResult, setEvalResult] = useState<AnswerEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleGeneratePaper = async () => {
    setIsGeneratingPaper(true);
    setPaperMarkdown(null);

    try {
      const res = await fetch("/api/ai/question-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          totalMarks,
          durationMins,
          difficulty,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate paper.");
      setPaperMarkdown(data.paperMarkdown);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsGeneratingPaper(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!evalQuestion.trim() || !studentAnswer.trim()) return;

    setIsEvaluating(true);
    setEvalResult(null);

    try {
      const res = await fetch("/api/ai/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: evalQuestion,
          studentAnswer,
          maxMarks,
          subject: selectedSubject,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluation failed.");
      setEvalResult(data);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyPaper = () => {
    if (!paperMarkdown) return;
    navigator.clipboard.writeText(paperMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Exam Suite & Answer Evaluator</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate university exam question papers or grade student written responses with detailed feedback.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "generator"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            📝 Question Paper Generator
          </button>
          <button
            onClick={() => setActiveTab("evaluator")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "evaluator"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            🎯 AI Answer Evaluator
          </button>
        </div>
      </div>

      {/* TAB 1: QUESTION PAPER GENERATOR */}
      {activeTab === "generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Paper Configuration
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    📘 {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total Marks</label>
                <select
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 shadow-xs"
                >
                  <option value={25}>25 Marks (Mid-Term)</option>
                  <option value={50}>50 Marks (Standard Exam)</option>
                  <option value={100}>100 Marks (Final Paper)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Time Duration</label>
                <select
                  value={durationMins}
                  onChange={(e) => setDurationMins(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 shadow-xs"
                >
                  <option value={60}>1 Hour (60m)</option>
                  <option value={120}>2 Hours (120m)</option>
                  <option value={180}>3 Hours (180m)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium (University Standard)</option>
                <option value="Hard">Hard (Gate/Competitive Level)</option>
              </select>
            </div>

            <button
              onClick={handleGeneratePaper}
              disabled={isGeneratingPaper}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {isGeneratingPaper ? <Sparkles className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
              <span>{isGeneratingPaper ? "Drafting Question Paper..." : "Generate Question Paper"}</span>
            </button>
          </div>

          {/* Paper Output */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Generated Question Paper & Solutions
              </h3>
              {paperMarkdown && (
                <button
                  onClick={handleCopyPaper}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Paper"}</span>
                </button>
              )}
            </div>

            <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 overflow-y-auto max-h-[500px]">
              {isGeneratingPaper ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Structuring Section A, B, and C with marking schemes...
                  </div>
                </div>
              ) : paperMarkdown ? (
                <div className="prose dark:prose-invert prose-sm max-w-none text-slate-800 dark:text-slate-200">
                  <ReactMarkdown>{paperMarkdown}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400 dark:text-slate-500 space-y-2">
                  <GraduationCap className="w-10 h-10 stroke-1" />
                  <p className="text-xs">Configure parameters on the left to generate an exam paper.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI ANSWER EVALUATOR */}
      {activeTab === "evaluator" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Submit Question & Written Response
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Exam Question</label>
              <textarea
                rows={3}
                value={evalQuestion}
                onChange={(e) => setEvalQuestion(e.target.value)}
                placeholder="Paste the exam question..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Student's Written Answer</label>
              <textarea
                rows={8}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type or paste student answer here..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              ></textarea>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Max Marks:</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  className="w-16 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-2 py-1 text-center text-xs"
                />
              </div>

              <button
                onClick={handleEvaluateAnswer}
                disabled={isEvaluating || !studentAnswer.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                {isEvaluating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>{isEvaluating ? "Evaluating..." : "Grade Answer"}</span>
              </button>
            </div>
          </div>

          {/* Result Score Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
              AI Evaluation & Mark Sheet
            </h3>

            {isEvaluating ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Checking answer correctness, missing key terms, and conceptual accuracy...
                </div>
              </div>
            ) : evalResult ? (
              <div className="space-y-4 text-xs">
                {/* Score Banner */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {evalResult.scoreAwarded} / {evalResult.maxMarks} Marks
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 font-medium">Score: {evalResult.percentage}%</div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded-full">
                    {evalResult.percentage >= 70 ? "Passed" : "Needs Improvement"}
                  </span>
                </div>

                {/* Correct Concepts */}
                <div className="space-y-1.5">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">✅ Correct Concepts Included:</div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    {evalResult.correctConcepts.map((cc, i) => (
                      <li key={i}>{cc}</li>
                    ))}
                  </ul>
                </div>

                {/* Missing Points */}
                <div className="space-y-1.5">
                  <div className="font-bold text-rose-700 dark:text-rose-400">❌ Missing Points / Pitfalls:</div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    {evalResult.missingPoints.map((mp, i) => (
                      <li key={i}>{mp}</li>
                    ))}
                  </ul>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-indigo-600 dark:text-indigo-300">Feedback:</strong> {evalResult.feedbackSummary}
                </div>

                {/* Ideal Sample Answer */}
                <div className="space-y-1.5">
                  <div className="font-bold text-indigo-700 dark:text-indigo-300">💡 Sample Ideal 10/10 Response:</div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {evalResult.sampleIdealAnswer}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <CheckCircle2 className="w-10 h-10 stroke-1" />
                <p className="text-xs">Submit an answer on the left to evaluate marks and feedback.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
