import React, { useState } from "react";
import { FileText, Plus, Search, Tag, Copy, Check, Trash2, Edit3, Save, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Note, Subject } from "../types";

interface NotesManagerProps {
  notes: Note[];
  subjects: Subject[];
  onSaveNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesManager: React.FC<NotesManagerProps> = ({
  notes,
  subjects,
  onSaveNote,
  onDeleteNote,
}) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredNotes = notes.filter((n) => {
    const matchesSubject = selectedSubjectId === "all" || n.subjectId === selectedSubjectId;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  const handleNewNote = () => {
    const newN: Note = {
      id: `note_${Date.now()}`,
      subjectId: subjects[0]?.id || "sub_python",
      topicName: "New Topic",
      title: "Untitled Revision Note",
      content: "# New Note\n\nWrite your revision notes here in markdown format...",
      tags: ["Notes"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveNote(newN);
    setSelectedNote(newN);
    setIsEditing(true);
    setEditTitle(newN.title);
    setEditContent(newN.content);
  };

  const handleStartEdit = () => {
    if (!selectedNote) return;
    setIsEditing(true);
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
  };

  const handleSaveEdit = () => {
    if (!selectedNote) return;
    const updated: Note = {
      ...selectedNote,
      title: editTitle,
      content: editContent,
      updatedAt: new Date().toISOString(),
    };
    onSaveNote(updated);
    setSelectedNote(updated);
    setIsEditing(false);
  };

  const handleCopy = () => {
    if (!selectedNote) return;
    navigator.clipboard.writeText(selectedNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Revision Notes Library</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Organized markdown notes, cheat sheets, and PDF extractions.
            </p>
          </div>
        </div>

        <button
          onClick={handleNewNote}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes Sidebar List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
          {/* Search & Subject Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes or tags..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 shadow-xs"
            >
              <option value="all">📚 All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredNotes.map((n) => {
              const isSelected = selectedNote?.id === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => handleSelectNote(n)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1 ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-600/20 border-indigo-300 dark:border-indigo-500 text-indigo-950 dark:text-white shadow-xs font-semibold"
                      : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="text-xs font-bold truncate">{n.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{n.topicName}</div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {n.tags.map((t, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note Reader / Editor */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          {selectedNote ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedNote.title}</h2>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedNote.topicName}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-1 font-medium transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {isEditing ? (
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartEdit}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteNote(selectedNote.id)}
                    className="p-2 bg-slate-100 dark:bg-slate-950 hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg border border-slate-200 dark:border-slate-800 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Note Body */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 overflow-y-auto max-h-[500px]">
                {isEditing ? (
                  <textarea
                    rows={18}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-200 focus:outline-none font-mono leading-relaxed resize-none"
                  ></textarea>
                ) : (
                  <div className="prose dark:prose-invert prose-sm max-w-none text-slate-800 dark:text-slate-200">
                    <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400 dark:text-slate-500 space-y-2">
              <FileText className="w-10 h-10 stroke-1" />
              <p className="text-xs">Select or create a note on the left to read or edit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
