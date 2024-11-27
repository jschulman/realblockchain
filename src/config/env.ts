export const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
} as const;

// Validate environment variables
Object.entries(env).forEach(([key, value]) => {
    if (!value) {
        console.error(`Environment variable ${key} is missing. Available env vars:`, process.env);
        throw new Error(`Missing environment variable: ${key}`);
    }
}); 