/**
 * @fileOverview Client-side lecture notes summary using Gemini directly.
 */

import { generateStructuredOutput } from '@/ai/gemini-client';

export type AutoLectureNotesSummaryInput = {
  lectureTranscript: string;
};

export type AutoLectureNotesSummaryOutput = {
  revisionNotes: string;
  keyPoints: string[];
  examSummary: string;
};

export async function autoLectureNotesSummary(
  input: AutoLectureNotesSummaryInput
): Promise<AutoLectureNotesSummaryOutput> {
  const prompt = `You are an intelligent AI assistant specialized in creating study materials from lecture transcripts.
Your task is to analyze the provided lecture transcript and generate the following:

1. Structured Revision Notes: Comprehensive notes suitable for detailed study.
2. Key Points: A bulleted list of the most critical information.
3. Exam-Focused Summary: A short summary highlighting concepts crucial for exams.

Use the following lecture transcript:

Lecture Transcript:
"""${input.lectureTranscript}"""

Please ensure the output is well-organized, accurate, and directly relevant to the lecture content.

Respond with a JSON object: { "revisionNotes": "...", "keyPoints": ["...", "..."], "examSummary": "..." }`;

  return generateStructuredOutput<AutoLectureNotesSummaryOutput>(prompt);
}
