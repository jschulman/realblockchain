import { z } from 'zod';

// Zod schemas for validation
export const UserResponseSchema = z.object({
    question: z.string(),
    answer: z.string(),
    category: z.enum(['background', 'technical', 'preferences']),
});

export const MethodologyBlockSchema = z.object({
    startTime: z.string(),
    endTime: z.string(),
    activity: z.string(),
    category: z.enum(['learning', 'practical', 'review', 'project']),
    description: z.string(),
});

export const DayScheduleSchema = z.object({
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    blocks: z.array(MethodologyBlockSchema),
});

export const WeeklyScheduleSchema = z.object({
    schedule: z.array(DayScheduleSchema),
    notes: z.array(z.string()),
});

export const RecommendationSchema = z.object({
    category: z.string(),
    items: z.array(z.string()),
});

export const MethodologyResponseSchema = z.object({
    learningPath: z.string(),
    timeStrategy: z.string(),
    recommendations: z.array(RecommendationSchema),
    suggestedResources: z.array(z.string()),
    weeklySchedule: WeeklyScheduleSchema,
});

// TypeScript types derived from Zod schemas
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type MethodologyBlock = z.infer<typeof MethodologyBlockSchema>;
export type DaySchedule = z.infer<typeof DayScheduleSchema>;
export type WeeklySchedule = z.infer<typeof WeeklyScheduleSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type MethodologyResponse = z.infer<typeof MethodologyResponseSchema>;

// Store types
export interface AppState {
    methodology: MethodologyResponse | null;
    isLoading: boolean;
    error: string | null;
    setMethodology: (methodology: MethodologyResponse) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

// API types
export interface ApiError {
    message: string;
    code: string;
    status: number;
} 