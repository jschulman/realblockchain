import { Question } from '../types/questionnaire';

export const questions: Question[] = [
    // Professional Context
    {
        id: 'prof_1',
        category: 'professionalContext',
        text: 'What is your primary professional role?',
        type: 'text'
    },
    {
        id: 'prof_2',
        category: 'teachBackground',
        text: 'How would you describe your background?',
        type: 'select',
        options: [
            'Developer',
            'Architect',
            'Data Science',
            'Finance/Accounting',
            'Cybersecurity',
            'No Technical Background'
        ]
    },
    {
        id: 'prof_3',
        category: 'learningGoal',
        text: 'What are your main learning goals?',
        type: 'select',
        options: [
            'Become a Blockchain Developer',
            'Understand Blockchain Technology',
            'Blockchain Finance and Accounting',
            'Blockchain Product Management',
            'Blockchain Consulting',
            'Teacher/Professor',
            'Other'
        ]
    },
    {
        id: 'prof_4',
        category: 'learningStyle',
        text: 'What are your main learning style preferences?',
        type: 'multiSelect',
        options: [
            'Self-paced',
            'Instructor-led',
            'Interactive',
            'Hands-on',
            'Project-based',
            'Other'
        ]
    },

    {
        id: 'prof_5',
        category: 'timePreference',
        text: 'How much time do you have to dedicate to learning?',
        type: 'select',
        options: [
            '1-2 hours per week',
            '3-5 hours per week',
            '5-10 hours per week',
            '10+ hours per week'
        ]
    },
    {
        id: 'prof_6',
        category: 'formatPreference',
        text: 'What learning platforms do you prefer?',
        type: 'multiSelect',
        options: [
            'Books',
            'YouTube',
            'Podcasts',
            'Online Courses',
            'Bootcamps',
            'Other'
        ]
    }
]; 