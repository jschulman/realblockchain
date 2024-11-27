import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import client components
const Questionnaire = dynamic(() => import('@/components/Questionnaire').then(mod => ({ default: mod.Questionnaire })), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-96 bg-gray-200 rounded-lg"></div>
    </div>
  )
});

const MethodologyDisplay = dynamic(() => import('@/components/MethodologyDisplay').then(mod => ({ default: mod.MethodologyDisplay })), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-96 bg-gray-200 rounded-lg"></div>
    </div>
  )
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Blockchain Learning Path
          </h1>
          <p className="text-xl text-gray-600">
            Answer a few questions and get a personalized learning path
            in under 15 minutes.
          </p>
        </div>

        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        }>
          <Questionnaire />
        </Suspense>
      </div>
    </main>
  );
}
