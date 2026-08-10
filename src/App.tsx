/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { AITutor } from "./components/AITutor";
import { PDFAssistant } from "./components/PDFAssistant";
import { LearningPathView } from "./components/LearningPath";
import { FlashcardsView } from "./components/Flashcards";
import { QuizSystem } from "./components/QuizSystem";
import { ExamSuite } from "./components/ExamSuite";
import { VivaMode } from "./components/VivaMode";
import { MathSolver } from "./components/MathSolver";
import { StudyPlanner } from "./components/StudyPlanner";
import { NotesManager } from "./components/NotesManager";
import { ProfileModal } from "./components/ProfileModal";

import {
  StudentProfile,
  Subject,
  Flashcard,
  Note,
  WeakTopic,
  StudySession,
  AIProvider,
} from "./types";

import {
  getStoredProfile,
  saveStoredProfile,
  getStoredSubjects,
  saveStoredSubjects,
  getStoredFlashcards,
  saveStoredFlashcards,
  getStoredNotes,
  saveStoredNotes,
  getStoredWeakTopics,
  saveStoredWeakTopics,
  getStoredSessions,
  saveStoredSessions,
  getStoredAIProvider,
  saveStoredAIProvider,
  getStoredTheme,
  saveStoredTheme,
} from "./lib/storage";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState<"light" | "dark">(getStoredTheme());
  const [profile, setProfile] = useState<StudentProfile>(getStoredProfile());
  const [subjects, setSubjects] = useState<Subject[]>(getStoredSubjects());
  const [flashcards, setFlashcards] = useState<Flashcard[]>(getStoredFlashcards());
  const [notes, setNotes] = useState<Note[]>(getStoredNotes());
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>(getStoredWeakTopics());
  const [sessions, setSessions] = useState<StudySession[]>(getStoredSessions());
  const [provider, setProvider] = useState<AIProvider>(getStoredAIProvider());

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    saveStoredTheme(nextTheme);
  };

  // Navigation state params
  const [navigationState, setNavigationState] = useState<{
    subject?: string;
    subjectId?: string;
    topic?: string;
    prompt?: string;
  }>({});

  const handleNavigate = (tab: string, extraState?: any) => {
    if (extraState) {
      setNavigationState(extraState);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProfile = (updated: StudentProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleUpdateSubjects = (updated: Subject[]) => {
    setSubjects(updated);
    saveStoredSubjects(updated);
  };

  const handleUpdateFlashcards = (updated: Flashcard[]) => {
    setFlashcards(updated);
    saveStoredFlashcards(updated);
  };

  const handleAddFlashcards = (newCards: Flashcard[]) => {
    const updated = [...newCards, ...flashcards];
    setFlashcards(updated);
    saveStoredFlashcards(updated);
  };

  const handleSaveNote = (note: Note) => {
    const exists = notes.some((n) => n.id === note.id);
    let updated: Note[];
    if (exists) {
      updated = notes.map((n) => (n.id === note.id ? note : n));
    } else {
      updated = [note, ...notes];
    }
    setNotes(updated);
    saveStoredNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveStoredNotes(updated);
  };

  const handleUpdateWeakTopics = (topics: WeakTopic[]) => {
    setWeakTopics(topics);
    saveStoredWeakTopics(topics);
  };

  const handleUpdateSessions = (sess: StudySession[]) => {
    setSessions(sess);
    saveStoredSessions(sess);
  };

  const handleSetProvider = (p: AIProvider) => {
    setProvider(p);
    saveStoredAIProvider(p);
  };

  return (
    <div
      className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100 dark"
          : "bg-[#F8FAFC] text-slate-900 light"
      }`}
    >
      {/* Left Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        provider={provider}
        setProvider={handleSetProvider}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenProfile={() => setIsProfileOpen(true)}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Stage with Dynamic Left Margin */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Top Header Bar */}
        <Header
          activeTab={activeTab}
          profile={profile}
          theme={theme}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={handleNavigate}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Viewport Canvas */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === "dashboard" && (
            <Dashboard
              profile={profile}
              subjects={subjects}
              weakTopics={weakTopics}
              sessions={sessions}
              onNavigate={handleNavigate}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          )}

          {activeTab === "tutor" && (
            <AITutor
              profile={profile}
              provider={provider}
              initialPrompt={navigationState.prompt}
              initialSubject={navigationState.subject}
              onAddFlashcard={(card) => handleAddFlashcards([card])}
              onSaveNote={handleSaveNote}
            />
          )}

          {activeTab === "pdf" && (
            <PDFAssistant
              profile={profile}
              subjects={subjects}
              onSaveNote={handleSaveNote}
              onAddFlashcards={handleAddFlashcards}
              onLaunchQuiz={(sub, top) => handleNavigate("quiz", { subject: sub, topic: top })}
            />
          )}

          {activeTab === "roadmap" && (
            <LearningPathView
              subjects={subjects}
              initialSubject={navigationState.subject}
              onNavigateQuiz={(sub, top) => handleNavigate("quiz", { subject: sub, topic: top })}
              onNavigateTutor={(p) => handleNavigate("tutor", { prompt: p })}
            />
          )}

          {activeTab === "flashcards" && (
            <FlashcardsView
              cards={flashcards}
              subjects={subjects}
              initialSubjectId={navigationState.subjectId}
              onUpdateCards={handleUpdateFlashcards}
              onAddFlashcards={handleAddFlashcards}
            />
          )}

          {activeTab === "quiz" && (
            <QuizSystem
              subjects={subjects}
              weakTopics={weakTopics}
              initialSubject={navigationState.subject}
              initialTopic={navigationState.topic}
              onUpdateWeakTopics={handleUpdateWeakTopics}
              onNavigateTutor={(p) => handleNavigate("tutor", { prompt: p })}
            />
          )}

          {activeTab === "exam" && <ExamSuite subjects={subjects} />}

          {activeTab === "viva" && <VivaMode subjects={subjects} />}

          {activeTab === "math" && <MathSolver />}

          {activeTab === "planner" && (
            <StudyPlanner
              profile={profile}
              subjects={subjects}
              weakTopics={weakTopics}
              sessions={sessions}
              onUpdateSessions={handleUpdateSessions}
            />
          )}

          {activeTab === "notes" && (
            <NotesManager
              notes={notes}
              subjects={subjects}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
            />
          )}
        </main>
      </div>

      {/* Student Profile Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        subjects={subjects}
        onUpdateSubjects={handleUpdateSubjects}
      />
    </div>
  );
}
