// app/api/generate-meal-plan/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  // Extract parameters from the request body
  const { dietType, calories, allergies, cuisine, snacks } = await request.json();

  // Build the prompt
  const prompt = `Generate a 7-day meal plan for an individual following a ${dietType} diet aiming for ${calories} calories per day.
Allergies: ${allergies || 'none'}
Cuisine: ${cuisine || 'any'}
Include Snacks: ${snacks ? 'yes' : 'no'}

Return the result as a valid JSON object with keys for each day (e.g., "Monday", "Tuesday", etc.) and sub-keys for meals ("breakfast", "lunch", "dinner", and optionally "snacks").`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // Await the text extraction
    // Remove any markdown formatting Gemini might add
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const mealPlan = JSON.parse(cleanedText);
    return NextResponse.json({ mealPlan });
  } catch (error: any) {
    console.error('Error generating meal plan:', error);
    // Always return an object as error payload
    return NextResponse.json({ error: 'Meal plan generation failed' }, { status: 500 });
  }
}
