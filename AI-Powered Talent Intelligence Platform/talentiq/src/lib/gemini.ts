import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('[gemini] ⚠️  GEMINI_API_KEY is not defined. AI features will not work.');
} else if (!apiKey.startsWith('AIza')) {
  console.warn(
    '[gemini] ⚠️  GEMINI_API_KEY does not look like a valid Google AI Studio key. ' +
    'Valid keys start with "AIza". Get your key at: https://aistudio.google.com/app/apikey'
  );
}

// Initialize the Gemini client
export const ai = new GoogleGenAI({
  apiKey: apiKey || 'dummy_key',
});
