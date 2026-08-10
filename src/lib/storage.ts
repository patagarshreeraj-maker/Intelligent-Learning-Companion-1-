import {
  StudentProfile,
  Subject,
  Flashcard,
  Note,
  QuizResult,
  WeakTopic,
  StudySession,
  Achievement,
  AIProvider,
} from "../types";

const PROFILE_KEY = "studymate_profile_v1";
const SUBJECTS_KEY = "studymate_subjects_v1";
const FLASHCARDS_KEY = "studymate_flashcards_v1";
const NOTES_KEY = "studymate_notes_v1";
const QUIZ_RESULTS_KEY = "studymate_quiz_results_v1";
const WEAK_TOPICS_KEY = "studymate_weak_topics_v1";
const SESSIONS_KEY = "studymate_sessions_v1";
const PROVIDER_KEY = "studymate_ai_provider_v1";

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_quiz",
    title: "First Quiz Completed",
    description: "Completed your first AI-generated assessment test.",
    icon: "🎯",
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "flashcard_master",
    title: "Flashcard Scholar",
    description: "Reviewed over 25 Spaced Repetition flashcards.",
    icon: "🃏",
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "streak_5",
    title: "5 Day Study Streak",
    description: "Logged study sessions for 5 consecutive days.",
    icon: "🔥",
    isUnlocked: true,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: "deep_focus",
    title: "Deep Work Master",
    description: "Completed a 50+ minute uninterrupted study timer session.",
    icon: "⏱️",
    isUnlocked: false,
  },
  {
    id: "pdf_scholar",
    title: "PDF Assistant Master",
    description: "Extracted and synthesized revision notes from 3 uploaded study PDFs.",
    icon: "📄",
    isUnlocked: false,
  },
];

const DEFAULT_PROFILE: StudentProfile = {
  name: "Shreeraj",
  course: "BCA (Bachelor of Computer Applications)",
  semester: "Semester 2",
  subjects: ["Python Programming", "Database Management (DBMS)", "Java Core", "Computer Networks"],
  dailyGoalHours: 2.5,
  examDate: new Date(Date.now() + 86400000 * 38).toISOString().split("T")[0],
  learningGoal: "Score 85%+ in Semester Exams & Build Strong Coding Fundamentals",
  xp: 340,
  level: 3,
  streakDays: 5,
  lastStudyDate: new Date().toISOString().split("T")[0],
  achievements: DEFAULT_ACHIEVEMENTS,
};

const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "sub_python",
    name: "Python Programming",
    code: "BCA-101",
    color: "from-amber-500 to-orange-600",
    icon: "🐍",
    progressPct: 68,
    topics: [
      { id: "p1", name: "Variables & Data Types", status: "completed", notesCount: 2, flashcardsCount: 6, quizScorePct: 90 },
      { id: "p2", name: "Control Structures & Loops", status: "completed", notesCount: 1, flashcardsCount: 5, quizScorePct: 85 },
      { id: "p3", name: "Functions & Recursion", status: "in_progress", notesCount: 2, flashcardsCount: 4, quizScorePct: 70 },
      { id: "p4", name: "Object-Oriented Programming (OOP)", status: "weak", notesCount: 1, flashcardsCount: 6, quizScorePct: 45 },
      { id: "p5", name: "File I/O & Exception Handling", status: "unstarted", notesCount: 0, flashcardsCount: 0 },
    ],
  },
  {
    id: "sub_dbms",
    name: "Database Management (DBMS)",
    code: "BCA-102",
    color: "from-blue-600 to-indigo-700",
    icon: "🗄️",
    progressPct: 52,
    topics: [
      { id: "d1", name: "ER Diagram & Relational Model", status: "completed", notesCount: 2, flashcardsCount: 5, quizScorePct: 88 },
      { id: "d2", name: "SQL Queries & Joins", status: "in_progress", notesCount: 3, flashcardsCount: 8, quizScorePct: 75 },
      { id: "d3", name: "Normalization (1NF, 2NF, 3NF, BCNF)", status: "weak", notesCount: 1, flashcardsCount: 7, quizScorePct: 40 },
      { id: "d4", name: "Transactions & ACID Properties", status: "in_progress", notesCount: 1, flashcardsCount: 4, quizScorePct: 60 },
    ],
  },
  {
    id: "sub_java",
    name: "Java Core",
    code: "BCA-103",
    color: "from-emerald-500 to-teal-700",
    icon: "☕",
    progressPct: 75,
    topics: [
      { id: "j1", name: "JVM Architecture & Memory", status: "completed", notesCount: 1, flashcardsCount: 4, quizScorePct: 92 },
      { id: "j2", name: "Inheritance & Polymorphism", status: "completed", notesCount: 2, flashcardsCount: 6, quizScorePct: 84 },
      { id: "j3", name: "Interfaces & Abstract Classes", status: "in_progress", notesCount: 1, flashcardsCount: 5, quizScorePct: 78 },
      { id: "j4", name: "Multithreading & Concurrency", status: "weak", notesCount: 0, flashcardsCount: 3, quizScorePct: 50 },
    ],
  },
  {
    id: "sub_networks",
    name: "Computer Networks",
    code: "BCA-104",
    color: "from-purple-600 to-pink-600",
    icon: "🌐",
    progressPct: 40,
    topics: [
      { id: "n1", name: "OSI 7-Layer Architecture", status: "in_progress", notesCount: 2, flashcardsCount: 7, quizScorePct: 65 },
      { id: "n2", name: "TCP/IP Protocol Suite", status: "weak", notesCount: 1, flashcardsCount: 5, quizScorePct: 42 },
      { id: "n3", name: "IP Addressing & Subnetting", status: "weak", notesCount: 1, flashcardsCount: 6, quizScorePct: 38 },
      { id: "n4", name: "Routing Algorithms (RIP, OSPF)", status: "unstarted", notesCount: 0, flashcardsCount: 0 },
    ],
  },
];

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: "fc_1",
    subjectId: "sub_python",
    front: "What is the key difference between a List and a Tuple in Python?",
    back: "Lists are mutable (can be altered using append/pop), defined with []. Tuples are immutable (cannot be changed after creation), defined with ().",
    difficulty: "Easy",
    hint: "Think about mutability and brackets vs parentheses.",
    reviewCount: 3,
  },
  {
    id: "fc_2",
    subjectId: "sub_python",
    front: "What does the '__init__' method do in Python classes?",
    back: "It is the constructor method in Python OOP that automatically executes when a new object instance is created to initialize instance attributes.",
    difficulty: "Medium",
    hint: "Executes during instantiation.",
    reviewCount: 2,
  },
  {
    id: "fc_3",
    subjectId: "sub_dbms",
    front: "Define 3rd Normal Form (3NF) in DBMS.",
    back: "A relation is in 3NF if it is in 2NF and contains NO transitive dependencies (non-prime attribute depending on another non-prime attribute).",
    difficulty: "Hard",
    hint: "No transitive functional dependencies.",
    reviewCount: 4,
  },
  {
    id: "fc_4",
    subjectId: "sub_dbms",
    front: "What are the 4 ACID properties of a Database Transaction?",
    back: "Atomicity (All or nothing), Consistency (Valid state preserved), Isolation (Concurrent execution protection), Durability (Committed changes persist).",
    difficulty: "Medium",
    hint: "A.C.I.D.",
    reviewCount: 5,
  },
  {
    id: "fc_5",
    subjectId: "sub_networks",
    front: "Which layer of the OSI model handles logical IP addressing?",
    back: "Layer 3 — The Network Layer (handles IP packets, routing, and subnetting).",
    difficulty: "Medium",
    hint: "Layer 3.",
    reviewCount: 1,
  },
  {
    id: "fc_6",
    subjectId: "sub_java",
    front: "What is the difference between Method Overloading and Method Overriding?",
    back: "Overloading happens in the same class (same name, different parameter signature). Overriding happens in sub-class (same method signature redefined).",
    difficulty: "Medium",
    hint: "Compile time vs Runtime polymorphism.",
    reviewCount: 3,
  },
];

const DEFAULT_NOTES: Note[] = [
  {
    id: "note_1",
    subjectId: "sub_dbms",
    topicName: "Normalization (1NF, 2NF, 3NF, BCNF)",
    title: "Comprehensive DBMS Normalization Cheat Sheet",
    content: `# Database Normalization Guide

## Why Normalize?
1. Eliminate data redundancy.
2. Prevent insertion, update, and deletion anomalies.
3. Ensure logical data dependencies.

## Forms Overview
* **1NF (First Normal Form)**: Atomic column values. No repeating groups or arrays.
* **2NF (Second Normal Form)**: Must be in 1NF + NO partial functional dependencies (all non-key attributes fully depend on candidate key).
* **3NF (Third Normal Form)**: Must be in 2NF + NO transitive dependencies ($X \\rightarrow Y$, where $Y$ depends on non-key $X$).
* **BCNF (Boyce-Codd)**: Stricter 3NF. For every functional dependency $A \\rightarrow B$, $A$ MUST be a super key.`,
    tags: ["DBMS", "Normalization", "Exam High Yield"],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "note_2",
    subjectId: "sub_python",
    topicName: "Object-Oriented Programming (OOP)",
    title: "Python OOP Core Concepts & Code Patterns",
    content: `# Python OOP Essentials

## 4 Pillars
1. **Encapsulation**: Hiding private data using \`_protected\` or \`__private\` naming.
2. **Inheritance**: \`class Derived(Base):\`
3. **Polymorphism**: Duck typing & method overriding.
4. **Abstraction**: Using \`abc.ABC\` and \`@abstractmethod\`.

\`\`\`python
class Student:
    def __init__(self, name, roll_no):
        self.name = name
        self._roll_no = roll_no

    def display(self):
        return f"Student: {self.name} (#{self._roll_no})"
\`\`\``,
    tags: ["Python", "OOP", "Classes"],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const DEFAULT_WEAK_TOPICS: WeakTopic[] = [
  {
    id: "wt_1",
    subjectName: "Database Management (DBMS)",
    topicName: "Normalization (1NF, 2NF, 3NF, BCNF)",
    averageScorePct: 40,
    attempts: 2,
    recommendedAction: "Review 3NF Transitive Dependency Notes & Solve 5 Flashcards",
    lastTestedDate: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "wt_2",
    subjectName: "Computer Networks",
    topicName: "IP Addressing & Subnetting",
    averageScorePct: 38,
    attempts: 3,
    recommendedAction: "Practice Subnet Mask calculation steps & Take Revision Quiz",
    lastTestedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "wt_3",
    subjectName: "Python Programming",
    topicName: "Object-Oriented Programming (OOP)",
    averageScorePct: 45,
    attempts: 2,
    recommendedAction: "Read Inheritance & Polymorphism Code Examples",
    lastTestedDate: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

const DEFAULT_SESSIONS: StudySession[] = [
  {
    id: "sess_1",
    subjectName: "Python Programming",
    topicName: "Control Structures & Loops",
    durationMins: 25,
    mode: "Pomodoro",
    date: new Date().toISOString(),
    xpEarned: 25,
  },
  {
    id: "sess_2",
    subjectName: "Database Management (DBMS)",
    topicName: "SQL Queries & Joins",
    durationMins: 50,
    mode: "Deep Study",
    date: new Date(Date.now() - 86400000).toISOString(),
    xpEarned: 60,
  },
  {
    id: "sess_3",
    subjectName: "Computer Networks",
    topicName: "OSI 7-Layer Architecture",
    durationMins: 30,
    mode: "Revision",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    xpEarned: 30,
  },
];

export function getStoredProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: StudentProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getStoredSubjects(): Subject[] {
  try {
    const raw = localStorage.getItem(SUBJECTS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SUBJECTS;
  } catch {
    return DEFAULT_SUBJECTS;
  }
}

export function saveStoredSubjects(subjects: Subject[]) {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
}

export function getStoredFlashcards(): Flashcard[] {
  try {
    const raw = localStorage.getItem(FLASHCARDS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_FLASHCARDS;
  } catch {
    return DEFAULT_FLASHCARDS;
  }
}

export function saveStoredFlashcards(cards: Flashcard[]) {
  localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(cards));
}

export function getStoredNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_NOTES;
  } catch {
    return DEFAULT_NOTES;
  }
}

export function saveStoredNotes(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function getStoredWeakTopics(): WeakTopic[] {
  try {
    const raw = localStorage.getItem(WEAK_TOPICS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_WEAK_TOPICS;
  } catch {
    return DEFAULT_WEAK_TOPICS;
  }
}

export function saveStoredWeakTopics(topics: WeakTopic[]) {
  localStorage.setItem(WEAK_TOPICS_KEY, JSON.stringify(topics));
}

export function getStoredSessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SESSIONS;
  } catch {
    return DEFAULT_SESSIONS;
  }
}

export function saveStoredSessions(sessions: StudySession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getStoredAIProvider(): AIProvider {
  try {
    const raw = localStorage.getItem(PROVIDER_KEY);
    return (raw as AIProvider) || "gemini";
  } catch {
    return "gemini";
  }
}

export function saveStoredAIProvider(provider: AIProvider) {
  localStorage.setItem(PROVIDER_KEY, provider);
}

export function getStoredTheme(): "light" | "dark" {
  try {
    const raw = localStorage.getItem("studymate_theme_v2");
    return (raw as "light" | "dark") || "light";
  } catch {
    return "light";
  }
}

export function saveStoredTheme(theme: "light" | "dark") {
  localStorage.setItem("studymate_theme_v2", theme);
}

export function addXP(amount: number) {
  const profile = getStoredProfile();
  profile.xp += amount;
  // Level up calculation: Level = Math.floor(XP / 100) + 1
  const newLevel = Math.floor(profile.xp / 100) + 1;
  profile.level = newLevel;
  saveStoredProfile(profile);
}
