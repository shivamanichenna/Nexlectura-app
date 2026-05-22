/**
 * Nexlectra — Firestore Data Types
 * Single source of truth for all collection schemas.
 */

// ─── Users ────────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'lecturer';

export interface UserDoc {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string; // ISO string
}

// ─── Students ─────────────────────────────────────────────────────────────────

export interface StudentProfile {
  id?: string;
  name: string;
  email?: string;
  college: string;
  collegeId: string;
  department: string;
  semester: string;
  section: string;
  studentId: string;
  createdAt: string;
  // Gamification
  xp?: number;
  level?: number;
  streak?: number;
  lastActiveDate?: string;
}

// ─── Lecturers ────────────────────────────────────────────────────────────────

export interface LecturerProfile {
  id?: string;
  name: string;
  email?: string;
  college: string;
  department: string;
  subjects: string[];
  lecturerId: string;
  createdAt: string;
}

// ─── Lectures ─────────────────────────────────────────────────────────────────

export interface Lecture {
  id?: string;
  title: string;
  subject: string;
  semester: string;
  section: string;
  department: string;
  lecturerId: string;
  lecturerName: string;
  /** Firebase Storage download URL */
  videoUrl?: string;
  audioUrl?: string;
  /** Raw transcript from speech-to-text */
  transcript?: string;
  /** AI-generated notes (from auto-lecture-notes-summary flow) */
  notesData?: any;
  /** Bilingual subtitle data (from lecture-bilingual-subtitles flow) */
  subtitleData?: any;
  duration?: number; // in seconds
  language?: 'english' | 'telugu' | 'hindi' | 'telglish' | 'hinglish';
  createdAt: FirestoreTimestamp | string;
  status?: string;
}

export interface BilingualSubtitle {
  startTime: number;
  endTime: number;
  textEn: string;
  textLocal: string;
}

// ─── Chat / Doubt Messages ────────────────────────────────────────────────────

export interface ChatMessage {
  id?: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: FirestoreTimestamp | string;
  lectureId?: string;
  lectureTitle?: string;
}

// ─── Flashcards ───────────────────────────────────────────────────────────────

export interface FlashcardSet {
  id?: string;
  lectureId: string;
  lectureTitle: string;
  subject: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface Flashcard {
  front: string;
  back: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// ─── Quizzes / Tests ──────────────────────────────────────────────────────────

export interface Quiz {
  id?: string;
  lectureId: string;
  lectureTitle: string;
  subject: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index into options
  explanation?: string;
}

export interface QuizAttempt {
  id?: string;
  quizId: string;
  lectureId: string;
  subject: string;
  score: number;        // 0-100
  totalQuestions: number;
  correctAnswers: number;
  answers: number[];   // selected option indices
  completedAt: string;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface StudentProgress {
  id?: string; // uid
  completedLectureIds: string[];
  weakTopics: string[];
  subjectMastery: Record<string, number>; // subject → percentage
  totalXp: number;
  streak: number;
  lastActiveDate: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface AppNotification {
  id?: string;
  title: string;
  body: string;
  type: 'lecture' | 'quiz' | 'reminder' | 'announcement';
  read: boolean;
  createdAt: string;
  lectureId?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Firestore Timestamp shape (seconds + nanoseconds) */
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export function tsToDate(ts: FirestoreTimestamp | string | undefined): Date {
  if (!ts) return new Date();
  if (typeof ts === 'string') return new Date(ts);
  return new Date(ts.seconds * 1000);
}

export function tsToRelative(ts: FirestoreTimestamp | string | undefined): string {
  const d = tsToDate(ts);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
