/**
 * Client-side Gemini AI wrapper using @google/generative-ai SDK.
 * This replaces the server-side Genkit SDK for static export / Capacitor mobile builds.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * Helper to call Gemini with a structured JSON output schema.
 * Parses the response text as JSON.
 */
export async function generateStructuredOutput<T>(prompt: string): Promise<T> {
  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const responseText = result.response.text();
  return JSON.parse(responseText) as T;
}

/**
 * Helper to call Gemini with a plain text response.
 */
export async function generateTextOutput(prompt: string): Promise<string> {
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

/**
 * Helper to transcribe audio from a Blob in the browser.
 */
export async function generateTranscriptionFromBlob(audioBlob: Blob, prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        
        const result = await geminiModel.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: audioBlob.type,
            },
          },
        ]);
        
        resolve(result.response.text());
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
}
