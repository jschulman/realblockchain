import { ApiError } from '@/types';

export class AppError extends Error implements ApiError {
    constructor(
        message: string,
        public code: string,
        public status: number
    ) {
        super(message);
        this.name = 'AppError';
    }

    static badRequest(message: string): AppError {
        return new AppError(message, 'BAD_REQUEST', 400);
    }

    static unauthorized(message: string = 'Unauthorized'): AppError {
        return new AppError(message, 'UNAUTHORIZED', 401);
    }

    static forbidden(message: string = 'Forbidden'): AppError {
        return new AppError(message, 'FORBIDDEN', 403);
    }

    static notFound(message: string = 'Not found'): AppError {
        return new AppError(message, 'NOT_FOUND', 404);
    }

    static internal(message: string = 'Internal server error'): AppError {
        return new AppError(message, 'INTERNAL_SERVER_ERROR', 500);
    }
}

export function handleApiError(error: unknown): ApiError {
    if (error instanceof AppError) {
        return error;
    }

    console.error('Unhandled error:', error);
    return AppError.internal();
} 