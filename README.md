# Productivity Methodology Generator

A personalized productivity methodology generator that creates custom schedules and recommendations based on your work style and preferences.

## Features

- 10-Minute Intelligent Questionnaire
- AI-Generated Productivity Methodology
- Personalized Weekly Schedule
- PDF Export Functionality
- Mobile-Responsive Design

## Tech Stack

- Frontend: Next.js (React)
- Backend: Next.js API Routes
- Database: Supabase
- AI: OpenAI GPT-4
- Styling: Tailwind CSS
- Deployment: Netlify

## Local Development

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment to Netlify

1. Push your code to GitHub (make sure to exclude sensitive files using .gitignore)

2. Connect your repository to Netlify:
   - Go to Netlify and click "New site from Git"
   - Choose your repository
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. Set up environment variables in Netlify:
   - Go to Site settings > Build & deploy > Environment
   - Add the following environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `OPENAI_API_KEY`

4. Install the Netlify Next.js plugin:
   - Go to Site settings > Build & deploy > Deploy settings
   - Find "Build plugins" section
   - Add "@netlify/plugin-nextjs"

5. Deploy your site:
   - Netlify will automatically deploy when you push to your main branch
   - You can also trigger manual deploys from the Netlify dashboard

## Environment Variables

The following environment variables are required:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

## Security Notes

- Never commit your `.env`, `.env.local`, or any other files containing secrets to Git
- Always use environment variables for sensitive information
- The `.gitignore` file is set up to exclude sensitive files
- Use Netlify's environment variables feature for production deployment
