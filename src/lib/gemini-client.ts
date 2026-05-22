import { GoogleGenerativeAI } from "@google/generative-ai";

// We use the environment variable for the API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function processLectureClient(title: string, subject: string, fileUrl?: string, mimeType?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let transcript = `Lecture on ${title} regarding ${subject}.`;

    if (fileUrl && mimeType) {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const fileDataPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
      });

      const fileData = await fileDataPromise;

      const result = await model.generateContent([
        {
          inlineData: {
            data: fileData,
            mimeType: mimeType
          }
        },
        { text: "Transcribe this lecture verbatim. Clean up 'um's and 'ah's but keep all academic content. Format in clear paragraphs." }
      ]);
      
      transcript = result.response.text();
    }

    const analysisPrompt = `
      Analyze the following lecture transcript:
      "${transcript}"
      
      Provide a JSON response with:
      1. "summary": A detailed set of lecture notes.
      2. "flashcards": An array of objects with "question" and "answer".
      
      Respond ONLY with valid JSON.
    `;

    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisText = analysisResult.response.text();
    
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: transcript, flashcards: [] };

    return {
      success: true,
      data: {
        transcript,
        notesData: parsedData.summary,
        flashcards: parsedData.flashcards
      }
    };
  } catch (error: any) {
    console.error("AI Client Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getExamInsightsClient(quizHistory: any[], progressData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze the following student performance data and provide actionable exam insights.
      
      STUDENT PROGRESS:
      ${JSON.stringify(progressData)}
      
      QUIZ HISTORY (Last 5 attempts):
      ${JSON.stringify(quizHistory)}
      
      Your task:
      1. Calculate a "Readiness Score" (0-100).
      2. Identify 3 "Focus Topics" (title, priority, reason, estimatedMinutes).
      3. Provide a brief "overallAnalysis".
      4. Suggest a "studyPlanTitle".
      
      Respond ONLY with valid JSON in this format:
      {
        "readinessScore": number,
        "focusTopics": [{"title": string, "priority": "High"|"Medium"|"Low", "reason": string, "estimatedMinutes": number}],
        "overallAnalysis": string,
        "studyPlanTitle": string
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    return {
      success: true,
      data: jsonMatch ? JSON.parse(jsonMatch[0]) : null
    };
  } catch (error: any) {
    console.error("Exam Analysis Client Error:", error);
    return { success: false, error: error.message };
  }
}

