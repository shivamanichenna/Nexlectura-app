'use server';
/**
 * @fileOverview A conversational AI tutor interface for students to get context-aware, bilingual explanations about lecture content.
 *
 * - aiDoubtAssistant - A function that handles student questions about lecture content.
 * - AIDoubtAssistantInput - The input type for the aiDoubtAssistant function.
 * - AIDoubtAssistantOutput - The return type for the aiDoubtAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AIDoubtAssistantInputSchema = z.object({
  question: z.string().describe("The student's question about the lecture content."),
  lectureContent: z.string().describe("The content of the lecture relevant to the question."),
  userLearningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'reading/writing', 'mixed']).describe("The student's preferred learning style to tailor explanations."),
  preferredLanguage: z.string().describe("The student's preferred language for explanations (e.g., 'English', 'Telugu', 'Hindi', 'English-Telugu mix')."),
  // Chat history should be formatted as an array of strings, e.g., ["User: Hello", "AI: Hi there!"]
  chatHistory: z.array(z.string()).optional().describe("Previous messages in the conversation, formatted as 'Role: Content' to maintain context.")
});
export type AIDoubtAssistantInput = z.infer<typeof AIDoubtAssistantInputSchema>;

// Output Schema
const AIDoubtAssistantOutputSchema = z.object({
  answer: z.string().describe("The AI tutor's explanation or answer to the student's question."),
  suggestedFollowUpQuestions: z.array(z.string()).optional().describe("A list of suggested follow-up questions the student might ask.")
});
export type AIDoubtAssistantOutput = z.infer<typeof AIDoubtAssistantOutputSchema>;

// Wrapper function
export async function aiDoubtAssistant(input: AIDoubtAssistantInput): Promise<AIDoubtAssistantOutput> {
  return aiDoubtAssistantFlow(input);
}

// Prompt definition
const aiDoubtAssistantPrompt = ai.definePrompt({
  name: 'aiDoubtAssistantPrompt',
  input: {schema: AIDoubtAssistantInputSchema},
  output: {schema: AIDoubtAssistantOutputSchema},
  prompt: `You are Vani, a friendly, patient, and knowledgeable AI tutor designed to help students understand their lecture content.\nYour goal is to provide clear, concise, and personalized explanations.\n\nHere is the relevant lecture content for context:\n--- LECTURE CONTENT START ---\n{{{lectureContent}}}\n--- LECTURE CONTENT END ---\n\nThe student's learning style is: "{{{userLearningStyle}}}\n".\nThe student's preferred language for explanation is: "{{{preferredLanguage}}}".\n\nFollow these strict guidelines for your response:\n1. Refer to the provided LECTURE CONTENT to answer the student's question. Do not invent information not present in the lecture. If the answer cannot be found or inferred from the lecture content, state that gracefully.\n2. If the answer is directly available, provide it. If the answer requires synthesizing information, do so clearly.\n3. Tailor your explanation to the student's 'userLearningStyle'. For example, for 'visual' learners, suggest creating a diagram in their mind; for 'auditory', suggest thinking about how it sounds; for 'kinesthetic', suggest how they might act it out; for 'reading/writing', provide clear textual explanations.\n4. Respond primarily in the 'preferredLanguage' of the student. If the student's question mixes languages, respond in a similar mixed-language style if appropriate and natural.\n5. After providing the answer, you MUST suggest 1-3 highly relevant follow-up questions that could further deepen the student's understanding of the topic. These should be distinct questions.\n\nHere is the previous conversation history, if any, to maintain context. Each entry specifies the role (e.g., "User: " or "AI: "):\n--- CHAT HISTORY START ---\n{{#if chatHistory}}\n{{#each chatHistory}}\n  {{{this}}}\n{{/each}}\n{{else}}\n  No prior conversation.\n{{/if}}\n--- CHAT HISTORY END ---\n\nStudent's current question: "{{{question}}}"\n`
});

// Flow definition
const aiDoubtAssistantFlow = ai.defineFlow(
  {
    name: 'aiDoubtAssistantFlow',
    inputSchema: AIDoubtAssistantInputSchema,
    outputSchema: AIDoubtAssistantOutputSchema
  },
  async (input) => {
    const {output} = await aiDoubtAssistantPrompt(input);
    return output!;
  }
);
