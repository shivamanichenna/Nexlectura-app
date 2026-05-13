'use server';
/**
 * @fileOverview A Genkit flow for generating flashcards from lecture content.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - LectureContentInput - The input type for the generateFlashcards function.
 * - AIGeneratedFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LectureContentInputSchema = z.object({
  lectureText: z.string().describe('The full text content of the lecture from which flashcards should be generated.')
});
export type LectureContentInput = z.infer<typeof LectureContentInputSchema>;

const FlashcardSchema = z.object({
  question: z.string().describe('A question derived from the lecture content, suitable for testing understanding.'),
  answer: z.string().describe('The concise answer to the question, directly from the lecture content.')
});

const AIGeneratedFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('A list of AI-generated flashcards, each containing a question and its corresponding answer.')
});
export type AIGeneratedFlashcardsOutput = z.infer<typeof AIGeneratedFlashcardsOutputSchema>;

export async function generateFlashcards(input: LectureContentInput): Promise<AIGeneratedFlashcardsOutput> {
  return aiGeneratedFlashcardsFlow(input);
}

const flashcardPrompt = ai.definePrompt({
  name: 'flashcardGeneratorPrompt',
  input: {schema: LectureContentInputSchema},
  output: {schema: AIGeneratedFlashcardsOutputSchema},
  prompt: `You are an AI assistant specialized in creating effective flashcards for students using spaced-repetition learning principles.
Your task is to generate a set of question-and-answer flashcards from the provided lecture content.
Each flashcard should consist of a clear question and a concise, accurate answer directly derived from the lecture text.
Focus on key concepts, definitions, and important details that a student would need to memorize for long-term retention.

Lecture Content:
{{{lectureText}}}
`
});

const aiGeneratedFlashcardsFlow = ai.defineFlow(
  {
    name: 'aiGeneratedFlashcardsFlow',
    inputSchema: LectureContentInputSchema,
    outputSchema: AIGeneratedFlashcardsOutputSchema,
  },
  async (input) => {
    const {output} = await flashcardPrompt(input);
    if (!output) {
      throw new Error("Failed to generate flashcards: No output from prompt.");
    }
    return output;
  }
);
