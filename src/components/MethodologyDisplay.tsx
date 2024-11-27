'use client';

import { useState } from 'react';
import { MethodologyResponse } from '@/types';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface Props {
    methodology: MethodologyResponse;
}

// Define PDF styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30
    },
    section: {
        margin: 10,
        padding: 10
    },
    title: {
        fontSize: 24,
        marginBottom: 10
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 8,
        marginTop: 16
    },
    text: {
        fontSize: 12,
        marginBottom: 5
    },
    scheduleBlock: {
        marginLeft: 20,
        marginBottom: 8
    }
});

// PDF Document Component
const MethodologyPDF = ({ methodology }: Props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Your Blockchain Learning Path</Text>
                
                <Text style={styles.subtitle}>Learning Path</Text>
                <Text style={styles.text}>{methodology.learningPath}</Text>

                <Text style={styles.subtitle}>Time Strategy</Text>
                <Text style={styles.text}>{methodology.timeStrategy}</Text>

                <Text style={styles.subtitle}>Key Recommendations</Text>
                {methodology.recommendations.map((rec, index) => (
                    <Text key={index} style={styles.text}>• {rec}</Text>
                ))}

                <Text style={styles.subtitle}>Weekly Schedule</Text>
                {methodology.weeklySchedule.schedule.map((day, dayIndex) => (
                    <View key={dayIndex}>
                        <Text style={styles.text}>{day.day}</Text>
                        {day.blocks.map((block, blockIndex) => (
                            <Text key={blockIndex} style={styles.scheduleBlock}>
                                {block.startTime} - {block.endTime}: {block.activity}
                            </Text>
                        ))}
                    </View>
                ))}

                <Text style={styles.subtitle}>Suggested Resources</Text>
                {methodology.suggestedResources.map((resource, index) => (
                    <Text key={index} style={styles.text}>• {resource}</Text>
                ))}

                <Text style={styles.subtitle}>Potential Challenges</Text>
                {methodology.potentialChallenges.map((challenge, index) => (
                    <Text key={index} style={styles.text}>• {challenge}</Text>
                ))}
            </View>
        </Page>
    </Document>
);

export function MethodologyDisplay({ methodology }: Props) {
    const [activeSection, setActiveSection] = useState<string>('overview');

    const sections = [
        { id: 'overview', title: 'Overview' },
        { id: 'schedule', title: 'Weekly Schedule' },
        { id: 'resources', title: 'Resources' },
        { id: 'challenges', title: 'Challenges' }
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Download PDF Button */}
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-gray-900">Your Learning Path</h2>
                        <PDFDownloadLink
                            document={<MethodologyPDF methodology={methodology} />}
                            fileName="blockchain-learning-path.pdf"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {({ blob, url, loading, error }) =>
                                loading ? 'Preparing PDF...' : 'Download PDF'
                            }
                        </PDFDownloadLink>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`
                py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200
                ${activeSection === section.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
                            >
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Sections */}
                <div className="p-6">
                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Learning Path</h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {methodology.learningPath}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Time Strategy</h3>
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <p className="text-gray-700">{methodology.timeStrategy}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Recommendations</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {methodology.recommendations.map((rec, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                        >
                                            <p className="text-gray-700">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Schedule Section */}
                    {activeSection === 'schedule' && (
                        <div className="animate-fadeIn">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Weekly Schedule</h3>
                            <div className="space-y-6">
                                {methodology.weeklySchedule.schedule.map((day) => (
                                    <div
                                        key={day.day}
                                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                            <h4 className="text-lg font-semibold text-gray-900">{day.day}</h4>
                                        </div>
                                        <div className="divide-y divide-gray-200">
                                            {day.blocks.map((block, index) => (
                                                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-32 flex-shrink-0">
                                                            <div className="text-sm font-medium text-gray-500">
                                                                {block.startTime} - {block.endTime}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{block.activity}</div>
                                                            <div className="mt-1 text-sm text-gray-600">{block.description}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 space-y-2">
                                {methodology.weeklySchedule.notes.map((note, index) => (
                                    <p key={index} className="text-sm text-gray-600 italic">{note}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resources Section */}
                    {activeSection === 'resources' && (
                        <div className="animate-fadeIn">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Suggested Resources</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                {methodology.suggestedResources.map((resource, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                                    >
                                        <p className="text-gray-700">{resource}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Challenges Section */}
                    {activeSection === 'challenges' && (
                        <div className="animate-fadeIn">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Potential Challenges</h3>
                            <div className="space-y-4">
                                {methodology.potentialChallenges.map((challenge, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                    >
                                        <p className="text-gray-700">{challenge}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 