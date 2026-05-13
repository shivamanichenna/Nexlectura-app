'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating bilingual subtitles for lecture transcripts.
 *
 * - generateLectureBilingualSubtitles - A function that generates bilingual subtitles from a lecture transcript.
 * - LectureBilingualSubtitlesInput - The input type for the generateLectureBilingualSubtitles function.
 * - LectureBilingualSubtitlesOutput - The return type for the generateLectureBilingualSubtitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LectureBilingualSubtitlesInputSchema = z.object({
  lectureTranscript: z
    .string()
    .describe('The full transcript of the lecture in its original language.'),
  targetLanguage: z
    .string()
    .describe('The language to translate the transcript into (e.g., Telugu, Hindi).'),
  originalLanguage: z
    .string()
    .describe('The original language of the lecture (e.g., English).'),
});
export type LectureBilingualSubtitlesInput = z.infer<
  typeof LectureBilingualSubtitlesInputSchema
>;

const BilingualSegmentSchema = z.object({
  original: z.string().describe('A segment of the original lecture transcript.'),
  translated: z
    .string()
    .describe('The translated version of the segment in the target language.'),
});

const LectureBilingualSubtitlesOutputSchema = z.object({
  bilingualSegments: z
    .array(BilingualSegmentSchema)
    .describe('An array of bilingual segments, pairing original and translated text.'),
});
export type LectureBilingualSubtitlesOutput = z.infer<
  typeof LectureBilingualSubtitlesOutputSchema
>;

export async function generateLectureBilingualSubtitles(
  input: LectureBilingualSubtitlesInput
): Promise<LectureBilingualSubtitlesOutput> {
  return lectureBilingualSubtitlesFlow(input);
}

const lectureBilingualSubtitlesPrompt = ai.definePrompt({
  name: 'lectureBilingualSubtitlesPrompt',
  input: {schema: LectureBilingualSubtitlesInputSchema},
  output: {schema: LectureBilingualSubtitlesOutputSchema},
  prompt: `You are an expert bilingual transcriber and translator. Your task is to provide a bilingual breakdown of a lecture transcript.
The original lecture is in {{{originalLanguage}}} and needs to be translated into {{{targetLanguage}}}.

Please segment the lecture transcript into logical chunks, and for each chunk, provide the original text and its accurate translation.
Ensure the translation is natural and preserves the meaning of the original lecture, making it easy for students to understand complex concepts.

Lecture Transcript:
{{{lectureTranscript}}}`,
});

const lectureBilingualSubtitlesFlow = ai.defineFlow(
  {
    name: 'lectureBilingualSubtitlesFlow',
    inputSchema: LectureBilingualSubtitlesInputSchema,
    outputSchema: LectureBilingualSubtitlesOutputSchema,
  },
  async input => {
    const {output} = await lectureBilingualSubtitlesPrompt(input);
    return output!;
  }
);
