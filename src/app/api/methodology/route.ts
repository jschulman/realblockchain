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
        console.log('Received request body:', body);

        // Validate input
        const userResponses = z.array(UserResponseSchema).parse(body);
        console.log('Validated user responses:', userResponses);

        // Extract selected categories from responses
        const selectedCategories = Array.from(new Set(userResponses.map(r => r.category)));
        console.log('Selected categories:', selectedCategories);

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
    "learningPath": "string describing the overall learning path",
    "timeStrategy": "string describing time allocation strategy",
    "recommendations": [
        {
            "category": "string (must be one of: ${selectedCategories.join(', ')})",
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
6. Make recommendations highly specific to the user's background and goals
7. Ensure all JSON keys and values are properly quoted
8. Do not include any explanatory text outside the JSON structure`;

        console.log('Sending prompt to OpenAI...');
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4",
            temperature: 0.7,
            max_tokens: 2000
        });

        const rawResponse = completion.choices[0].message.content || '{}';
        console.log('Received raw response from OpenAI:', rawResponse);

        try {
            const parsedResponse = JSON.parse(rawResponse);
            console.log('Successfully parsed JSON response');

            // Validate output
            const methodology = MethodologyResponseSchema.parse(parsedResponse);
            console.log('Successfully validated methodology schema');

            return NextResponse.json(methodology);
        } catch (error) {
            console.error('Error parsing or validating OpenAI response:', error);

            if (error instanceof z.ZodError) {
                const details = error.errors.map(e => ({
                    message: e.message,
                    path: e.path.join('.'),
                    received: e.received
                }));
                console.error('Zod validation errors:', details);

                return NextResponse.json(
                    {
                        error: 'Invalid methodology format',
                        details
                    },
                    { status: 400 }
                );
            }

            if (error instanceof SyntaxError) {
                console.error('JSON parsing error:', error);
                return NextResponse.json(
                    { error: 'Invalid JSON response from AI' },
                    { status: 500 }
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
            const details = error.errors.map(e => ({
                message: e.message,
                path: e.path.join('.'),
                received: e.received
            }));
            console.error('Input validation errors:', details);

            return NextResponse.json(
                { error: 'Invalid request data', details },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 