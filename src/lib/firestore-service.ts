/**
 * Nexlectra — Firestore Service Layer
 * All database read/write operations live here.
 * Import these functions in your pages/components instead of
 * calling Firestore directly.
 */

import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  increment,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';

import type {
  UserDoc,
  StudentProfile,
  LecturerProfile,
  Lecture,
  ChatMessage,
  FlashcardSet,
  Quiz,
  QuizAttempt,
  StudentProgress,
  AppNotification,
} from './types';

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUser(db: Firestore, uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

export async function updateUserProfile(
  db: Firestore,
  uid: string,
  data: Partial<UserDoc>
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data as any);
}

// ─── Students ─────────────────────────────────────────────────────────────────

export async function getStudentProfile(
  db: Firestore,
  uid: string
): Promise<StudentProfile | null> {
  const snap = await getDoc(doc(db, 'students', uid));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as StudentProfile) : null;
}

export async function updateStudentProfile(
  db: Firestore,
  uid: string,
  data: Partial<StudentProfile>
): Promise<void> {
  await updateDoc(doc(db, 'students', uid), data as any);
}

export async function addXp(db: Firestore, uid: string, xpAmount: number): Promise<void> {
  await updateDoc(doc(db, 'students', uid), {
    xp: increment(xpAmount),
  });
}

// ─── Lecturers ────────────────────────────────────────────────────────────────

export async function getLecturerProfile(
  db: Firestore,
  uid: string
): Promise<LecturerProfile | null> {
  const snap = await getDoc(doc(db, 'lecturers', uid));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as LecturerProfile) : null;
}

export async function updateLecturerProfile(
  db: Firestore,
  uid: string,
  data: Partial<LecturerProfile>
): Promise<void> {
  await updateDoc(doc(db, 'lecturers', uid), data as any);
}

// ─── Lectures ─────────────────────────────────────────────────────────────────

export async function createLecture(
  db: Firestore,
  lectureData: Omit<Lecture, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'lectures'), {
    ...lectureData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getLecture(
  db: Firestore,
  lectureId: string
): Promise<Lecture | null> {
  const snap = await getDoc(doc(db, 'lectures', lectureId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Lecture) : null;
}

export async function updateLecture(
  db: Firestore,
  lectureId: string,
  data: Partial<Lecture>
): Promise<void> {
  await updateDoc(doc(db, 'lectures', lectureId), data as any);
}

export async function deleteLecture(db: Firestore, lectureId: string): Promise<void> {
  await deleteDoc(doc(db, 'lectures', lectureId));
}

export async function getLecturesBySection(
  db: Firestore,
  section: string,
  semester: string
): Promise<Lecture[]> {
  const q = query(
    collection(db, 'lectures'),
    where('section', '==', section),
    where('semester', '==', semester),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Lecture));
}

export async function getLecturesByLecturer(
  db: Firestore,
  lecturerId: string
): Promise<Lecture[]> {
  const q = query(
    collection(db, 'lectures'),
    where('lecturerId', '==', lecturerId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Lecture));
}

// ─── Chat / Doubt Messages ────────────────────────────────────────────────────

export async function saveChatMessage(
  db: Firestore,
  uid: string,
  message: Omit<ChatMessage, 'id' | 'timestamp'>
): Promise<string> {
  const ref = await addDoc(
    collection(db, 'chats', uid, 'messages'),
    {
      ...message,
      timestamp: serverTimestamp(),
    }
  );
  return ref.id;
}

export function getChatMessagesQuery(db: Firestore, uid: string) {
  return query(
    collection(db, 'chats', uid, 'messages'),
    orderBy('timestamp', 'asc'),
    limit(100)
  );
}

export async function clearChatHistory(db: Firestore, uid: string): Promise<void> {
  const q = query(collection(db, 'chats', uid, 'messages'));
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
}

// ─── Flashcards ───────────────────────────────────────────────────────────────

export async function saveFlashcardSet(
  db: Firestore,
  uid: string,
  flashcardSet: Omit<FlashcardSet, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'flashcards', uid, 'sets'), {
    ...flashcardSet,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export function getFlashcardSetsQuery(db: Firestore, uid: string) {
  return query(
    collection(db, 'flashcards', uid, 'sets'),
    orderBy('createdAt', 'desc')
  );
}

// ─── Quizzes ──────────────────────────────────────────────────────────────────

export async function saveQuiz(
  db: Firestore,
  uid: string,
  quiz: Omit<Quiz, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'quizzes', uid, 'generated'), {
    ...quiz,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function saveQuizAttempt(
  db: Firestore,
  uid: string,
  attempt: Omit<QuizAttempt, 'id' | 'completedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'quizzes', uid, 'attempts'), {
    ...attempt,
    completedAt: new Date().toISOString(),
  });
  return ref.id;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function getStudentProgress(
  db: Firestore,
  uid: string
): Promise<StudentProgress | null> {
  const snap = await getDoc(doc(db, 'progress', uid));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as StudentProgress) : null;
}

export async function markLectureComplete(
  db: Firestore,
  uid: string,
  lectureId: string
): Promise<void> {
  const ref = doc(db, 'progress', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, {
      completedLectureIds: arrayUnion(lectureId),
      lastActiveDate: new Date().toISOString(),
    });
  } else {
    await setDoc(ref, {
      completedLectureIds: [lectureId],
      weakTopics: [],
      subjectMastery: {},
      totalXp: 10,
      streak: 1,
      lastActiveDate: new Date().toISOString(),
    } satisfies StudentProgress);
  }
}

export async function updateSubjectMastery(
  db: Firestore,
  uid: string,
  subject: string,
  score: number
): Promise<void> {
  await updateDoc(doc(db, 'progress', uid), {
    [`subjectMastery.${subject}`]: score,
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function createNotification(
  db: Firestore,
  uid: string,
  notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
): Promise<void> {
  await addDoc(collection(db, 'notifications', uid, 'items'), {
    ...notification,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export async function markNotificationRead(
  db: Firestore,
  uid: string,
  notificationId: string
): Promise<void> {
  await updateDoc(
    doc(db, 'notifications', uid, 'items', notificationId),
    { read: true }
  );
}

export function getNotificationsQuery(db: Firestore, uid: string) {
  return query(
    collection(db, 'notifications', uid, 'items'),
    orderBy('createdAt', 'desc'),
    limit(30)
  );
}
