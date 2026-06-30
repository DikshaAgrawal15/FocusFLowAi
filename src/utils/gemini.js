import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateTaskBreakdown(task, description, category) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = `
You are an AI productivity assistant.

Break the following task into exactly 5 short actionable subtasks.

Task:
${task}

Description:
${description}

Category:
${category}

Return ONLY a numbered list.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}
