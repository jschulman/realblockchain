import OpenAI from 'openai';
import { env } from '../config/env';
import { MethodologyResponse, UserResponse } from '../types/questionnaire';

// Debug logging
console.log('Environment variables check:', {
  OPENAI_API_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
  OPENAI_API_KEY_LENGTH: process.env.OPENAI_API_KEY?.length,
  ENV_OPENAI_KEY_EXISTS: !!env.OPENAI_API_KEY,
  ENV_OPENAI_KEY_LENGTH: env.OPENAI_API_KEY?.length,
  NODE_ENV: process.env.NODE_ENV,
  ALL_ENV_KEYS: Object.keys(process.env),
});

if (!env.OPENAI_API_KEY) {
  console.error('OpenAI API key is missing. Environment state:', {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ENV_KEYS: Object.keys(process.env).filter(key => key.includes('OPENAI')),
    FULL_ENV: process.env
  });
  throw new Error('OpenAI API key is required');
}

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateMethodology(
  userResponses: UserResponse[]
): Promise<MethodologyResponse> {
  try {
    console.log('Generating methodology with OpenAI...', {
      apiKey: env.OPENAI_API_KEY ? 'Present' : 'Missing',
      responsesCount: userResponses.length
    });

    const prompt = `You are a world-class blockchain education expert and learning coach. Your task is to analyze a student's background and goals, and create a personalized blockchain learning methodology based on their responses.

Here are the user's responses:
<user_responses>
${JSON.stringify(userResponses, null, 2)}
</user_responses>

Carefully analyze the user's responses, paying attention to their technical background, specific blockchain learning goals, preferred learning styles, and available time commitment.

Based on this analysis, create a personalized blockchain learning methodology that includes:
1. A detailed learning path structure and pacing
2. A weekly time allocation strategy
3. Top 3 specific and unique learning recommendations for each category the user selected
4. Suggested detailed outline of resources and tools for each category the user selected
6. A detailed weekly schedule that:
   - Aligns with their available time commitment
   - Balances theoretical learning with practical exercises
   - Incorporates their preferred learning styles
   - Includes project work and hands-on practice
   - Allocates time for different learning formats (videos, reading, coding, etc.)
   - Provides flexibility for work/life balance
   - Ensures steady progression towards their blockchain goals

Ensure that your response is:
- Tailored to their technical background level
- Focused on their specific blockchain learning goals
- Aligned with their preferred learning styles
- Realistic for their time commitment
- Written in an encouraging, coaching tone

Format your response in JSON with the following structure:
{
  "learningPath": "string",
  "timeStrategy": "string",
  "recommendations": ["string", "string", "string"],
  "potentialChallenges": ["string", "string", "string"],
  "suggestedResources": ["string", "string", "string"],
  "weeklySchedule": {
    "schedule": [
      {
        "day": "Monday",
        "blocks": [
          {
            "startTime": "19:00",
            "endTime": "20:00",
            "activity": "Blockchain Fundamentals",
            "category": "learning",
            "description": "Watch curated video content on blockchain basics"
          }
        ]
      },
      {
        "day": "Saturday",
        "blocks": [
          {
            "startTime": "10:00",
            "endTime": "12:00",
            "activity": "Hands-on Project",
            "category": "practical",
            "description": "Work on smart contract development exercise"
          }
        ]
      }
    ],
    "notes": [
      "Schedule adapts to your available weekly hours",
      "Mix of theoretical and practical learning",
      "Flexibility to adjust based on progress and comfort level"
    ]
  }
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { "type": "json_object" },
    });

    const rawResponse = completion.choices[0].message.content || '{}';
    const parsedResponse = JSON.parse(rawResponse);

    return {
      ...parsedResponse,
      rawResponse,
    };
  } catch (error) {
    console.error('Error generating methodology:', error);
    throw new Error(`Failed to generate methodology: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 