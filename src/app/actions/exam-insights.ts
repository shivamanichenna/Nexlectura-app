/**
 * Client-side exam insights using Gemini AI directly.
 */

import { generateStructuredOutput } from '@/ai/gemini-client';

interface FocusTopic {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  estimatedMinutes: number;
}

interface ExamInsightsOutput {
  readinessScore: number;
  focusTopics: FocusTopic[];
  overallAnalysis: string;
  studyPlanTitle: string;
}

export async function getExamInsightsAction(quizHistory: any[], progressData: any) {
  try {
    const prompt = `You are an AI Exam Readiness Coach for Nexlectra.
Analyze the following student performance data and provide actionable exam insights.

STUDENT PROGRESS:
${JSON.stringify(progressData)}

QUIZ HISTORY (Last 5 attempts):
${JSON.stringify(quizHistory)}

Your task:
1. Calculate a "Readiness Score" (0-100) based on average scores and consistency.
2. Identify exactly 3 "Focus Topics" where the student is struggling.
3. Provide a brief overall analysis of their current standing.
4. Suggest a title for their upcoming study marathon.

Respond as JSON with this exact structure:
{
  "readinessScore": number,
  "focusTopics": [{ "title": "string", "priority": "High|Medium|Low", "reason": "string", "estimatedMinutes": number }],
  "overallAnalysis": "string",
  "studyPlanTitle": "string"
}`;

    const data = await generateStructuredOutput<ExamInsightsOutput>(prompt);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error getting exam insights:', error);
    return { success: false, error: error.message };
  }
}
