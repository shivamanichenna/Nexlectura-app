/**
 * Client-side lecture processing using Gemini AI directly.
 */

import { generateTextOutput } from '@/ai/gemini-client';
import { autoLectureNotesSummary } from '@/ai/flows/auto-lecture-notes-summary-flow';
import { generateFlashcards } from '@/ai/flows/ai-generated-flashcards';

export async function processLectureAction(transcript: string) {
  try {
    // Run AI flows in parallel
    const [summaryResult, flashcardsResult] = await Promise.all([
      autoLectureNotesSummary({ lectureTranscript: transcript }),
      generateFlashcards({ lectureText: transcript })
    ]);

    return {
      success: true,
      data: {
        notesData: summaryResult,
        flashcards: flashcardsResult.flashcards,
      }
    };
  } catch (error: any) {
    console.error('Error processing lecture:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
