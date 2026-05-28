/**
 * @fileOverview Client-side flashcard generation using Gemini directly.
 */

import { generateStructuredOutput } from '@/ai/gemini-client';

export type LectureContentInput = {
  lectureText: string;
};

export type AIGeneratedFlashcardsOutput = {
  flashcards: Array<{ question: string; answer: string }>;
};

export async function generateFlashcards(
  input: LectureContentInput
): Promise<AIGeneratedFlashcardsOutput> {
  const prompt = `You are an AI assistant specialized in creating effective flashcards for students using spaced-repetition learning principles.
Your task is to generate a set of question-and-answer flashcards from the provided lecture content.
Each flashcard should consist of a clear question and a concise, accurate answer directly derived from the lecture text.
Focus on key concepts, definitions, and important details that a student would need to memorize for long-term retention.

Lecture Content:
${input.lectureText}

Respond with a JSON object: { "flashcards": [{ "question": "...", "answer": "..." }] }`;

  return generateStructuredOutput<AIGeneratedFlashcardsOutput>(prompt);
}
