'use server';
/**
 * @fileOverview A Genkit flow for generating structured revision notes, key points, and exam-focused summaries from lecture transcripts.
 *
 * - autoLectureNotesSummary - A function that handles the generation of lecture notes and summaries.
 * - AutoLectureNotesSummaryInput - The input type for the autoLectureNotesSummary function.
 * - AutoLectureNotesSummaryOutput - The return type for the autoLectureNotesSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AutoLectureNotesSummaryInputSchema = z.object({
  lectureTranscript: z
    .string()
    .describe('The full transcript of a lecture, provided as text.'),
});
export type AutoLectureNotesSummaryInput = z.infer<
  typeof AutoLectureNotesSummaryInputSchema
>;

const AutoLectureNotesSummaryOutputSchema = z.object({
  revisionNotes: z
    .string()
    .describe('Detailed, structured revision notes derived from the lecture transcript.'),
  keyPoints: z
    .array(z.string())
    .describe('A bulleted list of the most important key points from the lecture.'),
  examSummary: z
    .string()
    .describe(
      'A concise, exam-focused summary highlighting concepts most likely to appear in assessments.'
    ),
});
export type AutoLectureNotesSummaryOutput = z.infer<
  typeof AutoLectureNotesSummaryOutputSchema
>;

export async function autoLectureNotesSummary(
  input: AutoLectureNotesSummaryInput
): Promise<AutoLectureNotesSummaryOutput> {
  return autoLectureNotesSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoLectureNotesSummaryPrompt',
  input: { schema: AutoLectureNotesSummaryInputSchema },
  output: { schema: AutoLectureNotesSummaryOutputSchema },
  prompt: `You are an intelligent AI assistant specialized in creating study materials from lecture transcripts.
Your task is to analyze the provided lecture transcript and generate the following:

1.  Structured Revision Notes: Comprehensive notes suitable for detailed study.
2.  Key Points: A bulleted list of the most critical information.
3.  Exam-Focused Summary: A short summary highlighting concepts crucial for exams.

Use the following lecture transcript:

Lecture Transcript:
"""{{{lectureTranscript}}}"""

Please ensure the output is well-organized, accurate, and directly relevant to the lecture content.`, 
});

const autoLectureNotesSummaryFlow = ai.defineFlow(
  {
    name: 'autoLectureNotesSummaryFlow',
    inputSchema: AutoLectureNotesSummaryInputSchema,
    outputSchema: AutoLectureNotesSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
