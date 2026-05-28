/**
 * @fileOverview Client-side bilingual subtitle generation using Gemini directly.
 */

import { generateStructuredOutput } from '@/ai/gemini-client';

export type LectureBilingualSubtitlesInput = {
  lectureTranscript: string;
  targetLanguage: string;
  originalLanguage: string;
};

export type LectureBilingualSubtitlesOutput = {
  bilingualSegments: Array<{ original: string; translated: string }>;
};

export async function generateLectureBilingualSubtitles(
  input: LectureBilingualSubtitlesInput
): Promise<LectureBilingualSubtitlesOutput> {
  const prompt = `You are an expert bilingual transcriber and translator. Your task is to provide a bilingual breakdown of a lecture transcript.
The original lecture is in ${input.originalLanguage} and needs to be translated into ${input.targetLanguage}.

Please segment the lecture transcript into logical chunks, and for each chunk, provide the original text and its accurate translation.
Ensure the translation is natural and preserves the meaning of the original lecture, making it easy for students to understand complex concepts.

Lecture Transcript:
${input.lectureTranscript}

Respond with a JSON object: { "bilingualSegments": [{ "original": "...", "translated": "..." }] }`;

  return generateStructuredOutput<LectureBilingualSubtitlesOutput>(prompt);
}
