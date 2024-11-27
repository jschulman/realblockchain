'use client';

import { useState } from 'react';
import { UserResponse, MethodologyResponse } from '@/types';
import dynamic from 'next/dynamic';

const DynamicMethodologyDisplay = dynamic(() => import('./MethodologyDisplay'), {
    ssr: false,
    loading: () => (
        <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
    )
});

const QUESTIONS = [
    {
        section: 'Technical Background',
        questions: [
            {
                question: 'What is your current role?',
                category: 'background',
                type: 'select',
                options: [
                    'Software Developer',
                    'Student',
                    'Business Professional',
                    'Entrepreneur',
                    'Other'
                ]
            },
            {
                question: 'What programming languages are you familiar with?',
                category: 'technical',
                type: 'multiSelect',
                options: [
                    'JavaScript/TypeScript',
                    'Python',
                    'Java',
                    'C++',
                    'Solidity',
                    'Rust',
                    'Go',
                    'None'
                ]
            }
        ]
    },
    {
        section: 'Blockchain Experience',
        questions: [
            {
                question: 'What is your experience level with blockchain?',
                category: 'technical',
                type: 'select',
                options: [
                    'Complete Beginner',
                    'Basic Understanding',
                    'Some Development Experience',
                    'Professional Experience'
                ]
            },
            {
                question: 'Which blockchain platforms interest you?',
                category: 'technical',
                type: 'multiSelect',
                options: [
                    'Ethereum',
                    'Solana',
                    'Polkadot',
                    'Cardano',
                    'Bitcoin',
                    'Other'
                ]
            }
        ]
    },
    {
        section: 'Learning Preferences',
        questions: [
            {
                question: 'How much time can you dedicate to learning per week?',
                category: 'preferences',
                type: 'select',
                options: [
                    '0-5 hours',
                    '5-10 hours',
                    '10-20 hours',
                    '20+ hours'
                ]
            },
            {
                question: 'What are your learning goals?',
                category: 'preferences',
                type: 'multiSelect',
                options: [
                    'Build DApps',
                    'Smart Contract Development',
                    'Blockchain Architecture',
                    'Cryptocurrency Trading',
                    'Web3 Business Development'
                ]
            }
        ]
    }
];

const Questionnaire: React.FC = () => {
    const [currentSection, setCurrentSection] = useState(0);
    const [responses, setResponses] = useState<Record<string, string | string[]>>({});
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [methodology, setMethodology] = useState<MethodologyResponse | null>(null);

    const handleNext = () => {
        const currentQuestions = QUESTIONS[currentSection].questions;
        const allAnswered = currentQuestions.every(q =>
            responses[q.question] &&
            (Array.isArray(responses[q.question]) ?
                (responses[q.question] as string[]).length > 0 :
                responses[q.question])
        );

        if (!allAnswered) {
            setError('Please answer all questions before proceeding');
            return;
        }

        setError(null);
        if (currentSection < QUESTIONS.length - 1) {
            setCurrentSection(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        setCurrentSection(prev => Math.max(0, prev - 1));
        setError(null);
    };

    const handleSubmit = async () => {
        const formattedResponses: UserResponse[] = Object.entries(responses).map(([question, answer]) => {
            const foundQuestion = QUESTIONS.flatMap(s => s.questions).find(q => q.question === question);
            const category = (foundQuestion?.category || 'preferences') as "background" | "technical" | "preferences";
            return {
                question,
                answer: Array.isArray(answer) ? answer.join(', ') : answer,
                category
            };
        });

        setIsLoading(true);
        try {
            const response = await fetch('/api/methodology', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedResponses),
            });

            if (!response.ok) {
                throw new Error('Failed to generate methodology');
            }

            const data = await response.json();
            setMethodology(data);
        } catch (error) {
            console.error('Error generating methodology:', error);
            setError('Failed to generate methodology. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = (question: string, value: string) => {
        setResponses(prev => ({
            ...prev,
            [question]: value
        }));
        setError(null);
    };

    const handleMultiSelectChange = (question: string, value: string, checked: boolean) => {
        setResponses(prev => {
            const current = (prev[question] as string[]) || [];
            const updated = checked
                ? [...current, value]
                : current.filter(v => v !== value);
            return {
                ...prev,
                [question]: updated
            };
        });
        setError(null);
    };

    const currentSectionData = QUESTIONS[currentSection];
    const progress = ((currentSection + 1) / QUESTIONS.length) * 100;

    if (methodology) {
        return <DynamicMethodologyDisplay methodology={methodology} />;
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-lg text-gray-600">
                    Generating your personalized learning path...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="h-2 bg-gray-200 rounded-full">
                    <div
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                    Step {currentSection + 1} of {QUESTIONS.length}
                </div>
            </div>

            {/* Section Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentSectionData.section}
            </h2>

            {/* Questions */}
            <div className="space-y-6">
                {currentSectionData.questions.map((q) => (
                    <div key={q.question} className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900">
                            {q.question}
                        </label>
                        {q.type === 'select' ? (
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={responses[q.question] as string || ''}
                                onChange={(e) => handleSelectChange(q.question, e.target.value)}
                            >
                                <option value="">Select an option</option>
                                {q.options.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="space-y-2">
                                {q.options.map((opt) => (
                                    <label key={opt} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            checked={Array.isArray(responses[q.question]) &&
                                                (responses[q.question] as string[])?.includes(opt)}
                                            onChange={(e) =>
                                                handleMultiSelectChange(q.question, opt, e.target.checked)
                                            }
                                        />
                                        <span className="text-gray-700">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
                <button
                    type="button"
                    onClick={handlePrevious}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${currentSection === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-700'
                        }`}
                    disabled={currentSection === 0}
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {currentSection === QUESTIONS.length - 1 ? 'Generate Learning Path' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default Questionnaire; 