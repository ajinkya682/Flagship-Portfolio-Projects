import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const match = envFile.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1] : null;

async function main() {
  const ai = new GoogleGenAI({ apiKey });
  const tests = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'];
  
  for (const model of tests) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: "Hello"
      });
      console.log(`${model} worked:`, res.text);
    } catch (e) {
      console.error(`${model} error:`, e.message);
    }
  }
}
main();
