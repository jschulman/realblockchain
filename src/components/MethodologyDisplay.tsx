'use client';

import { useState } from 'react';
import { MethodologyResponse } from '@/types';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface MethodologyDisplayProps {
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
const MethodologyPDF = ({ methodology }: MethodologyDisplayProps) => (
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

const MethodologyDisplay: React.FC<MethodologyDisplayProps> = ({ methodology }) => {
    const [activeSection, setActiveSection] = useState<string>('overview');

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
                            {({ loading }) => loading ? 'Preparing PDF...' : 'Download PDF'}
                        </PDFDownloadLink>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {['overview', 'schedule', 'resources'].map((section) => (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeSection === section
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Sections */}
                <div className="p-6">
                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Path</h3>
                                <p className="text-gray-700">{methodology.learningPath}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Time Strategy</h3>
                                <p className="text-gray-700">{methodology.timeStrategy}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
                                <div className="space-y-6">
                                    {methodology.recommendations.map((rec, idx) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-lg font-medium text-gray-900 mb-3 capitalize">
                                                {rec.category} Recommendations
                                            </h4>
                                            <ul className="list-disc list-inside space-y-2">
                                                {rec.items.map((item, itemIdx) => (
                                                    <li key={itemIdx} className="text-gray-700">{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Schedule Section */}
                    {activeSection === 'schedule' && (
                        <div className="space-y-6">
                            {methodology.weeklySchedule.schedule.map((day, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">{day.day}</h3>
                                    <div className="space-y-3">
                                        {day.blocks.map((block, blockIdx) => (
                                            <div key={blockIdx} className="flex items-start space-x-4">
                                                <div className="w-32 flex-shrink-0">
                                                    <span className="text-gray-600">
                                                        {block.startTime} - {block.endTime}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{block.activity}</h4>
                                                    <p className="text-gray-700 text-sm">{block.description}</p>
                                                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                        {block.category}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Notes</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {methodology.weeklySchedule.notes.map((note, idx) => (
                                        <li key={idx} className="text-gray-700">{note}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Resources Section */}
                    {activeSection === 'resources' && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Suggested Resources</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {methodology.suggestedResources.map((resource, idx) => (
                                    <li key={idx} className="text-gray-700">{resource}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MethodologyDisplay; 