import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("PASTE_YOUR_API_KEY_HERE");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

async function run() {
  try {
    const result = await model.generateContent("Say Hello");
    console.log(result.response.text());
  } catch (e) {
    console.log(e);
  }
}

run();
