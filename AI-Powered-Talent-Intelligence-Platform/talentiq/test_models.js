const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({path: '.env.local'});
require('dotenv').config({path: '.env'});

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: "Hello"
    });
    console.log("1.5-flash worked:", res.text);
  } catch (e) {
    console.error("1.5-flash error:", e.message);
  }
}
main();
