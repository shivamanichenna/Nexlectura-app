import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  
  // The API doesn't have a direct listModels exposed in the JS SDK in some versions,
  // let's just fetch it via REST.
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`);
  const data = await response.json();
  console.log(data.models.map((m: any) => m.name));
}

listModels();
