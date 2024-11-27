import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { UserResponseSchema, MethodologyResponseSchema } from '@/types';
import { z } from 'zod';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const userResponses = z.array(UserResponseSchema).parse(body);

        // Extract selected categories from responses
        const selectedCategories = Array.from(new Set(userResponses.map(r => r.category)));

        const prompt = `You are a world-class blockchain education expert and learning coach. Your task is to analyze a student's background and goals, and create a personalized blockchain learning methodology based on their responses.

Here are the user's responses:
${JSON.stringify(userResponses, null, 2)}

Create a personalized blockchain learning methodology that includes:
1. A detailed learning path structure and pacing
2. A weekly time allocation strategy
3. For each category (${selectedCategories.join(', ')}), provide 3 specific and unique learning recommendations
4. Suggested detailed outline of resources and tools
5. A detailed weekly schedule

IMPORTANT: Your response must be a valid JSON object with the following structure:
{
    "learningPath": "string",
    "timeStrategy": "string",
    "recommendations": [
        {
            "category": "string (one of: ${selectedCategories.join(', ')})",
            "items": ["string", "string", "string"]
        }
    ],
    "suggestedResources": ["string"],
    "weeklySchedule": {
        "schedule": [
            {
                "day": "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
                "blocks": [
                    {
                        "startTime": "string (format: HH:MM)",
                        "endTime": "string (format: HH:MM)",
                        "activity": "string",
                        "category": "learning" | "practical" | "review" | "project",
                        "description": "string"
                    }
                ]
            }
        ],
        "notes": ["string"]
    }
}

IMPORTANT NOTES:
1. The "category" field in schedule blocks MUST be one of: "learning", "practical", "review", or "project"
2. The "day" field MUST be a valid day of the week (Monday through Sunday)
3. Times should be in 24-hour format (e.g., "09:00", "14:30")
4. Each array should contain at least one item
5. For recommendations, provide exactly 3 specific and actionable items for each category
6. Make recommendations highly specific to the user's background and goals`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4",
            temperature: 0.7,
            max_tokens: 2000
        });

        const rawResponse = completion.choices[0].message.content || '{}';
        try {
            const parsedResponse = JSON.parse(rawResponse);
            // Validate output
            const methodology = MethodologyResponseSchema.parse(parsedResponse);
            return NextResponse.json(methodology);
        } catch (error) {
            console.error('Error parsing OpenAI response:', error);
            if (error instanceof z.ZodError) {
                return NextResponse.json(
                    {
                        error: 'Invalid methodology format',
                        details: error.errors.map(e => ({
                            message: e.message,
                            path: e.path.join('.')
                        }))
                    },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { error: 'Failed to generate valid methodology' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error in methodology generation:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 