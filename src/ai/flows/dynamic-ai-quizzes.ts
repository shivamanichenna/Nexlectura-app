/**
 * @fileOverview Client-side dynamic quiz generation using Gemini directly.
 */

import { generateStructuredOutput } from '@/ai/gemini-client';

export type GenerateDynamicQuizInput = {
  weakTopics: string[];
  conceptsToCover: string[];
  language?: string;
  numberOfQuestions?: number;
};

export type GenerateDynamicQuizOutput = Array<{
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}>;

export async function generateDynamicQuiz(
  input: GenerateDynamicQuizInput
): Promise<GenerateDynamicQuizOutput> {
  const lang = input.language ?? 'English';
  const count = input.numberOfQuestions ?? 5;
  const weakTopicsList = input.weakTopics.map(t => `- ${t}`).join('\n');
  const conceptsList = input.conceptsToCover.map(c => `- ${c}`).join('\n');

  const prompt = `You are an AI-powered quiz generator for students. Your task is to create a quiz based on the provided weak topics and concepts.

Generate ${count} multiple-choice questions. For each question, provide 4 options, identify the correct answer, and give a short explanation for why it's correct.

Focus the questions on the following:

Weak Topics:
${weakTopicsList}

Concepts to Cover:
${conceptsList}

Ensure the quiz is in ${lang}.

Respond with a JSON array: [{ "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "..." }]`;

  return generateStructuredOutput<GenerateDynamicQuizOutput>(prompt);
}
