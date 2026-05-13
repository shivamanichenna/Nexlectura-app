'use server';
/**
 * @fileOverview A Genkit flow for generating dynamic quizzes tailored to student's weak topics and learning gaps.
 *
 * - generateDynamicQuiz - A function that handles the quiz generation process.
 * - GenerateDynamicQuizInput - The input type for the generateDynamicQuiz function.
 * - GenerateDynamicQuizOutput - The return type for the generateDynamicQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The text of the quiz question.'),
  options: z.array(z.string()).describe('An array of possible answer options.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
  explanation: z.string().describe('A brief explanation for the correct answer.'),
});

const GenerateDynamicQuizInputSchema = z.object({
  weakTopics: z.array(z.string()).describe('A list of topics the student struggles with.'),
  conceptsToCover: z.array(z.string()).describe('A list of specific concepts to include in the quiz.'),
  language: z.string().default('English').describe('The desired language for the quiz questions and answers (e.g., "English", "Telugu").'),
  numberOfQuestions: z.number().int().min(1).max(20).default(5).describe('The number of questions to generate for the quiz.'),
});
export type GenerateDynamicQuizInput = z.infer<typeof GenerateDynamicQuizInputSchema>;

const GenerateDynamicQuizOutputSchema = z.array(QuizQuestionSchema).describe('An array of generated quiz questions.');
export type GenerateDynamicQuizOutput = z.infer<typeof GenerateDynamicQuizOutputSchema>;

export async function generateDynamicQuiz(input: GenerateDynamicQuizInput): Promise<GenerateDynamicQuizOutput> {
  return dynamicAiQuizzesFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateDynamicQuizInputSchema },
  output: { schema: GenerateDynamicQuizOutputSchema },
  prompt: `You are an AI-powered quiz generator for students. Your task is to create a quiz based on the provided weak topics and concepts.

Generate {{numberOfQuestions}} multiple-choice questions. For each question, provide 4 options, identify the correct answer, and give a short explanation for why it's correct.

Focus the questions on the following:

Weak Topics: {{#each weakTopics}}- {{{this}}}
{{/each}}

Concepts to Cover: {{#each conceptsToCover}}- {{{this}}}
{{/each}}

Ensure the quiz is in {{language}}.

Output the quiz in a JSON array format, where each object represents a question with 'question', 'options' (an array of strings), 'correctAnswer', and 'explanation' fields.`, 
});

const dynamicAiQuizzesFlow = ai.defineFlow(
  {
    name: 'dynamicAiQuizzesFlow',
    inputSchema: GenerateDynamicQuizInputSchema,
    outputSchema: GenerateDynamicQuizOutputSchema,
  },
  async (input) => {
    const { output } = await generateQuizPrompt(input);
    return output!;
  }
);
