/**
 * Client-side classroom insights using Gemini AI directly.
 */

import { generateStructuredOutput } from '@/ai/gemini-client';

interface ClassroomInsight {
  topic: string;
  type: 'Confusion Spike' | 'Success' | 'Engagement';
  message: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface ClassroomAnalysisOutput {
  insights: ClassroomInsight[];
  overallEngagement: number;
  totalStudentsActive: number;
}

export async function getClassroomInsightsAction(quizAttempts: any[], classMetadata: any) {
  try {
    const prompt = `You are an AI Education Consultant for Nexlectra.
Analyze the following classroom performance data for the lecturer.

CLASS METADATA:
${JSON.stringify(classMetadata)}

STUDENT PERFORMANCE (Recent Quiz Attempts):
${JSON.stringify(quizAttempts)}

Your task:
1. Identify "Confusion Spikes": Specific topics where students consistently score low.
2. Identify "Successes": Where scores are improving.
3. Calculate an Overall Engagement % (0-100).
4. Provide exactly 2-3 short, actionable insights for the lecturer's dashboard.

Respond as JSON with this exact structure:
{
  "insights": [{ "topic": "string", "type": "Confusion Spike|Success|Engagement", "message": "string", "priority": "High|Medium|Low" }],
  "overallEngagement": number,
  "totalStudentsActive": number
}`;

    const data = await generateStructuredOutput<ClassroomAnalysisOutput>(prompt);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error getting classroom insights:', error);
    return { success: false, error: error.message };
  }
}
