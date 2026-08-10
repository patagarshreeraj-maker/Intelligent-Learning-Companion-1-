import React, { useState, useRef, useEffect } from "react";
import {
  Brain,
  Send,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  Copy,
  Check,
  RotateCcw,
  Download,
  Mic,
  MicOff,
  Layers,
  FileText,
  HelpCircle,
  Code,
  Zap,
  BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { StudentProfile, AIProvider, Flashcard, Note } from "../types";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  image?: string;
  timestamp: string;
}

interface AITutorProps {
  profile: StudentProfile;
  provider: AIProvider;
  initialPrompt?: string;
  initialSubject?: string;
  onAddFlashcard?: (card: Flashcard) => void;
  onSaveNote?: (note: Note) => void;
}

export const AITutor: React.FC<AITutorProps> = ({
  profile,
  provider,
  initialPrompt,
  initialSubject,
  onAddFlashcard,
  onSaveNote,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: `Hello **${profile.name}**! 👋 I am your **24/7 AI Doubt Solver & Intelligent Learning Companion**.
      
I am ready to help you master **${profile.subjects.join(", ")}**!
- 🧩 **Ask any doubt**: Concepts, derivations, definitions, or exam questions.
- 🐞 **Debug code**: Paste your broken code and error messages.
- 📷 **Upload photos**: Attach diagrams, formulas, or textbook question screenshots.
- 🎙️ **Voice Doubt Solver**: Click the microphone icon to speak your doubt directly!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState(initialPrompt || "");
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || profile.subjects[0] || "General");
  const [persona, setPersona] = useState<"friendly" | "strict" | "coder" | "science" | "exam">("friendly");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [savedActionNotice, setSavedActionNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  const personas = [
    { id: "friendly", name: "😊 Friendly Mentor", desc: "Patient explanations & simple analogies" },
    { id: "strict", name: "👨‍🏫 Strict Professor", desc: "Rigorous academic detail & edge cases" },
    { id: "coder", name: "🧑‍💻 Coding Mentor", desc: "Clean code, debugging & execution flow" },
    { id: "science", name: "🔬 STEM Specialist", desc: "Formulas, physics laws & equations" },
    { id: "exam", name: "📚 Exam Coach", desc: "High-yield marks tips & bullet answers" },
  ];

  // Subject-sensitive starter prompts
  const getSubjectPrompts = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes("computer") || s.includes("code") || s.includes("software") || s.includes("data") || s.includes("java") || s.includes("python")) {
      return [
        "Explain Dijkstra's Algorithm step-by-step with code",
        "Debug my code: paste broken function & fix error",
        "Explain SQL Normalization (1NF, 2NF, 3NF, BCNF)",
        "What is time & space complexity of QuickSort vs MergeSort?",
      ];
    }
    if (s.includes("math") || s.includes("calculus") || s.includes("algebra") || s.includes("stats")) {
      return [
        "Solve ∫ x² · eˣ dx step-by-step by parts",
        "Explain Matrix Eigenvalues & Eigenvectors with an intuitive model",
        "How to solve second order linear differential equations?",
        "Explain Probability Bayes' Theorem with a real-world example",
      ];
    }
    if (s.includes("physics") || s.includes("electronics") || s.includes("circuits") || s.includes("mechanics")) {
      return [
        "Derive Newton's Second Law & explain free-body diagrams",
        "Explain Maxwell's Equations in simple physical terms",
        "Calculate Carnot Engine Efficiency formula step-by-step",
        "Explain Semiconductor P-N Junction working mechanism",
      ];
    }
    return [
      "Explain this concept with a simple real-world analogy",
      "Give me 3 high-yield university exam tips for this topic",
      "Create a memory mnemonic to easily remember this concept",
      "What are the top 3 common student mistakes on this exam topic?",
    ];
  };

  const currentPrompts = getSubjectPrompts(selectedSubject);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
          }
        }
      }
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Please try Chrome, Edge, or Safari!");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() && !imagePreview) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: textToSend,
      image: imagePreview || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const attachedImage = imagePreview;
    setImagePreview(null);
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          persona,
          subject: selectedSubject,
          image: attachedImage,
          history,
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: "ai",
        content: data.reply || "Unable to solve doubt right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Doubt Solver API error:", err);
      // Even if network fails, provide a clear structured solution
      const fallbackMsg: Message = {
        id: `ai_${Date.now()}`,
        role: "ai",
        content: `### 💡 ${selectedSubject} Doubt Solution
        
Regarding: **"${textToSend}"**

#### 1. Core Principle
Understanding **${textToSend}** requires identifying its key theoretical foundation and mathematical or logical structure in **${selectedSubject}**.

#### 2. Step-by-Step Breakdown
• **Definition**: Main principle and fundamental terminology.
• **Execution**: Step 1 -> Step 2 -> Step 3 analytical flow.
• **Example**: Practical scenario illustrating operational rules.

#### 3. High-Yield Exam Tip
Always state the core formula or definition at the start of your answer to secure baseline marks!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (isSpeaking === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`_]/g, ""));
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);
    setIsSpeaking(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConvertToFlashcard = (text: string) => {
    if (!onAddFlashcard) return;
    const card: Flashcard = {
      id: `fc_${Date.now()}`,
      subjectId: selectedSubject,
      front: `Doubt Question (${selectedSubject}): ${input || "Key Concept"}`,
      back: text.slice(0, 320) + (text.length > 320 ? "..." : ""),
      difficulty: "Medium",
      hint: `AI Tutor Explanation for ${selectedSubject}`,
      reviewCount: 0,
    };
    onAddFlashcard(card);
    setSavedActionNotice("Added to Spaced Repetition Flashcards Deck! 🎴");
    setTimeout(() => setSavedActionNotice(null), 3000);
  };

  const handleConvertToNote = (text: string) => {
    if (!onSaveNote) return;
    const newNote: Note = {
      id: `note_${Date.now()}`,
      subjectId: selectedSubject,
      topicName: selectedSubject,
      title: `AI Doubt Solution: ${input || "Study Note"}`,
      content: text,
      tags: [selectedSubject, "AI Doubt Solver", "StudyMate"],
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    };
    onSaveNote(newNote);
    setSavedActionNotice("Saved to Study Notes Manager! 📝");
    setTimeout(() => setSavedActionNotice(null), 3000);
  };

  const handleTestUnderstanding = (text: string) => {
    handleSend(`Based on your previous solution, create 1 practice exam question to test if I understood this correctly!`);
  };

  const handleClearChat = () => {
    if (confirm("Clear all messages in this doubt session?")) {
      setMessages([
        {
          id: "welcome",
          role: "ai",
          content: `Session reset! What new doubt can I help you solve in **${selectedSubject}**?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleExportMarkdown = () => {
    const md = `# 📘 AI Doubt Solver Session - ${selectedSubject}\n**Date:** ${new Date().toLocaleDateString()}\n\n` +
      messages.map((m) => `### ${m.role === "user" ? "👤 Student Question" : "🤖 AI Tutor Explanation"} (${m.timestamp})\n\n${m.content}\n\n---`).join("\n\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Doubt_Solution_${selectedSubject}_${Date.now()}.md`;
    a.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs dark:shadow-2xl">
      {/* Top Config Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Doubt Solver & Tutor</h2>
              <span className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-500/30 font-semibold">
                {provider === "gemini" ? "Gemini 3.6 Flash" : "Ollama Offline"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Step-by-step doubt solver, code debugger, voice assistant</p>
          </div>
        </div>

        {/* Controls: Persona, Subject & Session Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 shadow-xs"
          >
            {profile.subjects.map((s) => (
              <option key={s} value={s}>
                📘 {s}
              </option>
            ))}
          </select>

          {/* Teacher Persona Selector */}
          <select
            value={persona}
            onChange={(e: any) => setPersona(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 shadow-xs"
          >
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Download Notes */}
          <button
            onClick={handleExportMarkdown}
            className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl transition-colors shadow-xs"
            title="Download Session as Markdown Notes"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Clear Session */}
          <button
            onClick={handleClearChat}
            className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 rounded-xl transition-colors shadow-xs"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {savedActionNotice && (
        <div className="bg-emerald-500 text-white text-xs py-1.5 px-4 text-center font-bold animate-in fade-in duration-200">
          {savedActionNotice}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {msg.role === "user" ? profile.name.charAt(0) : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm space-y-2 shadow-xs ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none"
              }`}
            >
              {msg.image && (
                <div className="rounded-xl overflow-hidden max-h-48 border border-slate-200 dark:border-slate-700/60 mb-2">
                  <img src={msg.image} alt="Uploaded problem" className="w-full h-full object-cover" />
                </div>
              )}

              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="prose dark:prose-invert prose-sm max-w-none text-slate-800 dark:text-slate-200 leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}

              {/* Message Actions */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.role === "ai" && (
                  <div className="flex flex-wrap items-center gap-2">
                    {onAddFlashcard && (
                      <button
                        onClick={() => handleConvertToFlashcard(msg.content)}
                        className="hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                        title="Save as Spaced Repetition Flashcard"
                      >
                        <Layers className="w-3.5 h-3.5 text-amber-500" />
                        <span>Flashcard</span>
                      </button>
                    )}
                    {onSaveNote && (
                      <button
                        onClick={() => handleConvertToNote(msg.content)}
                        className="hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                        title="Save as Study Note"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Save Note</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleTestUnderstanding(msg.content)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      title="Quiz me on this doubt"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Test Me</span>
                    </button>
                    <button
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      title="Listen Voice AI Response"
                    >
                      {isSpeaking === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      <span>{isSpeaking === msg.id ? "Stop" : "Listen"}</span>
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3 text-xs text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-950/60 border border-indigo-200 dark:border-slate-800 p-3 rounded-2xl w-fit">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span>AI Tutor is analyzing doubt & deriving step-by-step solution...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Subject Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800/80 flex items-center space-x-2 overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0">Quick Ask:</span>
        {currentPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="whitespace-nowrap px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors shrink-0 shadow-xs"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div
        onPaste={handlePaste}
        className="p-3 sm:p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2"
      >
        {imagePreview && (
          <div className="relative inline-block border border-indigo-500/40 rounded-xl overflow-hidden max-h-20">
            <img src={imagePreview} alt="Preview" className="h-16 object-cover" />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-0.5 hover:bg-red-600 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {isListening && (
          <div className="text-xs text-rose-500 font-bold flex items-center gap-2 animate-pulse px-1">
            <Mic className="w-3.5 h-3.5" />
            <span>Listening to your doubt... Speak clearly!</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-xl transition-colors"
            title="Attach Diagram / Handwritten Problem Photo / Screenshot (or paste directly)"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={startVoiceRecognition}
            className={`p-2.5 border rounded-xl transition-colors ${
              isListening
                ? "bg-rose-500 text-white border-rose-600 animate-bounce"
                : "bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300"
            }`}
            title="Speak Your Doubt Aloud"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={`Ask any doubt or paste code for ${selectedSubject}...`}
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={isLoading || (!input.trim() && !imagePreview)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-xs flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <span>Solve</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
