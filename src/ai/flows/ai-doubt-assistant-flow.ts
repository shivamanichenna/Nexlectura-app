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
  answer: z.string().describe("The AI tutor's explanation or answer to the student's question. Use a friendly 'Vani' persona."),
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
  prompt: `You are Vani, a friendly, patient, and knowledgeable AI tutor designed to help students understand their lecture content. 
You are like a helpful classmate or a supportive teacher who speaks the student's local language.

Here is the relevant lecture content for context:
--- LECTURE CONTENT START ---
{{{lectureContent}}}
--- LECTURE CONTENT END ---

The student's learning style is: "{{{userLearningStyle}}}".
The student's preferred language for explanation is: "{{{preferredLanguage}}}".

Follow these strict guidelines for your response:
1. Refer to the provided LECTURE CONTENT to answer the student's question. Do not invent information not present in the lecture. 
2. PERSONALITY: Be friendly and encouraging. Use phrases like "Good question!" or "Let me simplify this for you."
3. BILINGUAL SUPPORT: Respond primarily in the 'preferredLanguage'. If it's a mix (like Telglish or Hinglish), use English for technical terms but explain the concepts using the local language structure. 
   Example for Telglish: "Process synchronization ante multiple processes ni properly manage cheyadam, sync lo unchadam."
4. Tailor your explanation to the student's 'userLearningStyle'.
5. After providing the answer, suggest 2-3 relevant follow-up questions.

--- CHAT HISTORY START ---
{{#if chatHistory}}
{{#each chatHistory}}
  {{{this}}}
{{/each}}
{{else}}
  No prior conversation.
{{/if}}
--- CHAT HISTORY END ---

Student's current question: "{{{question}}}"`
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
