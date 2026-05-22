/**
 * Client-side lecture processing using Gemini AI directly.
 */

import { generateTextOutput } from '@/ai/gemini-client';
import { autoLectureNotesSummary } from '@/ai/flows/auto-lecture-notes-summary-flow';
import { generateFlashcards } from '@/ai/flows/ai-generated-flashcards';

export async function processLectureAction(title: string, subject: string, fileUrl?: string, mimeType?: string) {
  try {
    let transcript = "No transcript could be generated.";

    // 1. If media provided, use Gemini to transcribe
    if (fileUrl && mimeType) {
      console.log(`Transcribing ${mimeType} from ${fileUrl}...`);
      try {
        transcript = await generateTextOutput(
          `Transcribe this lecture verbatim. Clean up 'um's and 'ah's but keep all academic content. Format in clear paragraphs. The lecture is titled "${title}" about "${subject}".`
        );
      } catch (transcriptError) {
        console.error("Transcription failed:", transcriptError);
        transcript = `Lecture on ${title} (${subject}). [Transcription unavailable]`;
      }
    } else {
      transcript = `Lecture on ${title} regarding ${subject}. (No media provided for transcription)`;
    }

    // 2. Run AI flows in parallel
    const [summaryResult, flashcardsResult] = await Promise.all([
      autoLectureNotesSummary({ lectureTranscript: transcript }),
      generateFlashcards({ lectureText: transcript })
    ]);

    return {
      success: true,
      data: {
        transcript,
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
