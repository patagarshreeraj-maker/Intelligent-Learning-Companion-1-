import React, { useState, useRef } from "react";
import { Calculator, Upload, Sparkles, Image as ImageIcon, Copy, Check, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const MathSolver: React.FC = () => {
  const [problemText, setProblemText] = useState("");
  const [domain, setDomain] = useState("Calculus / Math");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const domains = [
    "Calculus / Math",
    "Algebra & Trigonometry",
    "Probability & Statistics",
    "Physics Mechanics & Equations",
    "Chemistry Stoichiometry & Reactions",
    "Discrete Mathematics & Logic",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (!problemText.trim() && !imagePreview) return;

    setIsSolving(true);
    setSolution(null);

    try {
      const res = await fetch("/api/ai/math-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: problemText,
          topic: domain,
          image: imagePreview,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to solve problem.");
      setSolution(data.solution);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSolving(false);
    }
  };

  const handleCopy = () => {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Math & STEM Problem Solver</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Step-by-step solutions with concepts, formulas, and common pitfalls for STEM subjects.
            </p>
          </div>
        </div>

        {/* Domain Selector */}
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-cyan-500 shadow-xs"
        >
          {domains.map((d) => (
            <option key={d} value={d}>
              🧮 {d}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Pane */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Enter Equation or Upload Problem Photo
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Problem Statement / Expression:</label>
            <textarea
              rows={6}
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="e.g. Find the integral of ∫ (3x^2 + 2x) dx from x=0 to 5, or paste Physics kinematics equation..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-xs"
            ></textarea>
          </div>

          {/* Image Upload Option */}
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden max-h-36 border border-cyan-500/40">
                <img src={imagePreview} alt="Problem Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload Photo of Math Formula / Question Paper</span>
              </button>
            )}
          </div>

          <button
            onClick={handleSolve}
            disabled={isSolving || (!problemText.trim() && !imagePreview)}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            {isSolving ? <Sparkles className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
            <span>{isSolving ? "Solving Step-by-Step..." : "Solve Problem"}</span>
          </button>
        </div>

        {/* Output Solution Pane */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Step-by-Step Solution Breakdown
            </h3>
            {solution && (
              <button
                onClick={handleCopy}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Solution"}</span>
              </button>
            )}
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 overflow-y-auto max-h-[450px]">
            {isSolving ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-spin" />
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Deriving formulas, executing steps, and checking final answers...
                </div>
              </div>
            ) : solution ? (
              <div className="prose dark:prose-invert prose-sm max-w-none text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                <ReactMarkdown>{solution}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <Calculator className="w-10 h-10 stroke-1" />
                <p className="text-xs">Enter a problem statement or photo on the left to see the step-by-step solution.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
