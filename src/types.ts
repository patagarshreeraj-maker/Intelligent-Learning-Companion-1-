export type AIProvider = "gemini" | "ollama";

export interface StudentProfile {
  name: string;
  course: string;
  semester: string;
  subjects: string[];
  dailyGoalHours: number;
  examDate: string; // ISO date string YYYY-MM-DD
  learningGoal: string;
  xp: number;
  level: number;
  streakDays: number;
  lastStudyDate: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface Topic {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "weak" | "unstarted";
  notesCount: number;
  flashcardsCount: number;
  quizScorePct?: number;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string;
  icon: string;
  topics: Topic[];
  progressPct: number;
}

export interface Flashcard {
  id: string;
  subjectId: string;
  topicId?: string;
  front: string;
  back: string;
  difficulty: "Easy" | "Medium" | "Hard";
  hint?: string;
  lastReviewed?: string;
  nextReviewDate?: string;
  reviewCount: number;
}

export interface Note {
  id: string;
  subjectId: string;
  topicName: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subtopic?: string;
}

export interface QuizResult {
  id: string;
  subjectId: string;
  topicName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  weakSubtopics: string[];
}

export interface WeakTopic {
  id: string;
  subjectName: string;
  topicName: string;
  averageScorePct: number;
  attempts: number;
  recommendedAction: string;
  lastTestedDate: string;
}

export interface StudySession {
  id: string;
  subjectName: string;
  topicName: string;
  durationMins: number;
  mode: "Pomodoro" | "Deep Study" | "Deep Work" | "Revision";
  date: string;
  xpEarned: number;
}

export interface LearningPathNode {
  id: string;
  title: string;
  category: "Basics" | "Core" | "Advanced" | "Project";
  description: string;
  keyTopics: string[];
  isCompleted?: boolean;
}

export interface LearningPath {
  subjectName: string;
  overview: string;
  estimatedHours: number;
  nodes: LearningPathNode[];
}

export interface AnswerEvaluation {
  scoreAwarded: number;
  maxMarks: number;
  percentage: number;
  correctConcepts: string[];
  missingPoints: string[];
  feedbackSummary: string;
  sampleIdealAnswer: string;
}

export interface StudyScheduleItem {
  dayName: string;
  focusSubject: string;
  targetTopic: string;
  durationMins: number;
  activityType: string;
  isWeakTopicFocus: boolean;
}

export interface AIStudyPlan {
  title: string;
  summary: string;
  weeklyGoal: string;
  dailySchedule: StudyScheduleItem[];
  recommendations: string[];
}
