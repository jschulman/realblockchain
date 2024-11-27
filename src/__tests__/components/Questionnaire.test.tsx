import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Questionnaire } from '@/components/Questionnaire';
import { UserResponse } from '@/types';

describe('Questionnaire Component', () => {
    const mockOnComplete = jest.fn();

    beforeEach(() => {
        mockOnComplete.mockClear();
    });

    it('renders all questions', () => {
        render(<Questionnaire onComplete={mockOnComplete} />);

        expect(screen.getByText(/current role/i)).toBeInTheDocument();
        expect(screen.getByText(/technical background/i)).toBeInTheDocument();
        expect(screen.getByText(/learning goals/i)).toBeInTheDocument();
    });

    it('handles form submission correctly', async () => {
        render(<Questionnaire onComplete={mockOnComplete} />);

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/current role/i), {
            target: { value: 'Software Developer' },
        });

        // Select technical background
        const techBackgroundCheckbox = screen.getByLabelText(/web development/i);
        fireEvent.click(techBackgroundCheckbox);

        // Select learning goals
        const learningGoalCheckbox = screen.getByLabelText(/blockchain developer/i);
        fireEvent.click(learningGoalCheckbox);

        // Submit the form
        fireEvent.click(screen.getByText(/submit/i));

        await waitFor(() => {
            expect(mockOnComplete).toHaveBeenCalledTimes(1);
            const submittedData: UserResponse[] = mockOnComplete.mock.calls[0][0];
            expect(submittedData).toHaveLength(3);
            expect(submittedData[0].answer).toBe('Software Developer');
        });
    });

    it('shows validation errors for empty required fields', async () => {
        render(<Questionnaire onComplete={mockOnComplete} />);

        // Try to submit without filling anything
        fireEvent.click(screen.getByText(/submit/i));

        await waitFor(() => {
            expect(screen.getByText(/please select at least one option/i)).toBeInTheDocument();
        });

        expect(mockOnComplete).not.toHaveBeenCalled();
    });
}); 