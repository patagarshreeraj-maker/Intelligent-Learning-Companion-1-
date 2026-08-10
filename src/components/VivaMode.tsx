import React, { useState } from "react";
import { Mic, MicOff, Brain, Send, Sparkles, Award, RotateCcw, Volume2 } from "lucide-react";
import { Subject } from "../types";

interface VivaModeProps {
  subjects: Subject[];
}

interface VivaMessage {
  role: "ai" | "user";
  content: string;
}

export const VivaMode: React.FC<VivaModeProps> = ({ subjects }) => {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "Python Programming");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [messages, setMessages] = useState<VivaMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qCount, setQCount] = useState(0);

  const startVivaSession = async () => {
    setSessionStarted(true);
    setMessages([]);
    setQCount(1);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/viva-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          history: [],
          userResponse: `Hello Examiner. I am ready for my oral viva exam in ${selectedSubject}. Please ask my Question 1.`,
        }),
      });

      const data = await res.json();
      setMessages([{ role: "ai", content: data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResponse = async () => {
    if (!userInput.trim()) return;

    const newMsgs: VivaMessage[] = [...messages, { role: "user", content: userInput }];
    setMessages(newMsgs);
    const textToSend = userInput;
    setUserInput("");
    setIsLoading(true);

    try {
      const history = newMsgs.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai/viva-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          history,
          userResponse: textToSend,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
      setQCount((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser version. You can type your answers directly!");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setIsRecording(true);
    recognition.start();

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setUserInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Viva & Technical Interview Mode</h1>
            <p className="text-xs text-slate-400">
              Simulates oral university viva exams with real-time feedback and technical depth scoring.
            </p>
          </div>
        </div>

        {!sessionStarted && (
          <div className="flex items-center space-x-2 shrink-0">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  📘 {s.name}
                </option>
              ))}
            </select>
            <button
              onClick={startVivaSession}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition-colors"
            >
              Start Viva Exam
            </button>
          </div>
        )}
      </div>

      {sessionStarted ? (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
            <span>Subject: <strong className="text-purple-300">{selectedSubject}</strong></span>
            <span>Question {qCount}</span>
            <button
              onClick={() => setSessionStarted(false)}
              className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl text-xs sm:text-sm space-y-1 ${
                  m.role === "ai"
                    ? "bg-slate-950 border border-purple-500/30 text-slate-100"
                    : "bg-purple-600 text-white ml-8"
                }`}
              >
                <div className="font-bold text-[10px] opacity-70 uppercase tracking-wider">
                  {m.role === "ai" ? "👨‍🏫 AI Examiner" : "👤 You"}
                </div>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-purple-400 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Examiner is evaluating your answer and formulating next question...</span>
              </div>
            )}
          </div>

          {/* Answer Controls */}
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-xl border transition-colors ${
                isRecording
                  ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                  : "bg-slate-950 text-slate-300 border-slate-800 hover:text-white"
              }`}
              title="Voice Input (Speech to Text)"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendResponse()}
              placeholder="Speak or type your oral answer..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />

            <button
              onClick={handleSendResponse}
              disabled={isLoading || !userInput.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 flex items-center gap-1 transition-colors"
            >
              <span>Submit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Mic className="w-12 h-12 stroke-1 mx-auto text-purple-400" />
          <h3 className="text-sm font-bold text-slate-200">Ready for your Oral Viva Exam?</h3>
          <p className="text-xs max-w-md mx-auto">
            Select your subject above and click "Start Viva Exam" to begin interactive oral Q&A practice with instant technical scoring.
          </p>
        </div>
      )}
    </div>
  );
};
