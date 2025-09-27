Gemini Developer API
Get a Gemini API Key
Get a Gemini API key and make your first API request in minutes.

Python
JavaScript
Go
Java
REST

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

await main();