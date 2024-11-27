export type QuestionCategory =
    | 'professionalContext'
    | 'teachBackground'
    | 'learningGoal'
    | 'learningStyle'
    | 'timePreference'
    | 'formatPreference';

export type QuestionType = 'text' | 'select' | 'multiSelect';

export interface Question {
    id: string;
    category: QuestionCategory;
    text: string;
    type: QuestionType;
    options?: string[];
}

export interface UserResponse {
    questionId: string;
    category: QuestionCategory;
    response: string | string[];
}

type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimeBlock {
    startTime: string;
    endTime: string;
    activity: string;
    category: string;
    description: string;
}

export interface DaySchedule {
    day: DayName;
    blocks: TimeBlock[];
}

export interface WeeklySchedule {
    schedule: DaySchedule[];
    notes: string[];
}

export interface MethodologyResponse {
    learningPath: string;
    timeStrategy: string;
    recommendations: string[];
    potentialChallenges: string[];
    suggestedResources: string[];
    weeklySchedule: {
        schedule: DaySchedule[];
        notes: string[];
    };
    rawResponse?: string;
} 