import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StudentBalanceCheck from '../components/balance/StudentBalanceCheck';
import { AuthProvider } from '../context/AuthContext';

// Mock the fetch function
global.fetch = vi.fn();

describe('StudentBalanceCheck Component', () => {
    const mockToken = 'test-token';
    const mockUser = {
        id: 1,
        username: 'teststaff',
        email: 'staff@example.com',
        is_staff: true,
        profile: {
            role: 'staff',
            balance: 0.00
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <MemoryRouter>
                <AuthProvider>
                    <StudentBalanceCheck />
                </AuthProvider>
            </MemoryRouter>
        );
    };

    it('renders the balance check form', () => {
        renderComponent();
        expect(screen.getByLabelText(/Student ID/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Check Balance/i })).toBeInTheDocument();
    });

    it('shows error message when student ID is not found', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        renderComponent();
        
        const input = screen.getByLabelText(/Student ID/i);
        const button = screen.getByRole('button', { name: /Check Balance/i });

        fireEvent.change(input, { target: { value: '99999' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Failed to check balance/i)).toBeInTheDocument();
        });
    });

    it('displays student balance information when found', async () => {
        const mockResponse = {
            student_id: '12345',
            name: 'John Doe',
            balance: 100.00
        };

        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        renderComponent();
        
        const input = screen.getByLabelText(/Student ID/i);
        const button = screen.getByRole('button', { name: /Check Balance/i });

        fireEvent.change(input, { target: { value: '12345' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Balance Information/i)).toBeInTheDocument();
            expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
            expect(screen.getByText(/12345/i)).toBeInTheDocument();
            expect(screen.getByText(/\$100.00/i)).toBeInTheDocument();
        });
    });

    it('handles network errors gracefully', async () => {
        (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

        renderComponent();
        
        const input = screen.getByLabelText(/Student ID/i);
        const button = screen.getByRole('button', { name: /Check Balance/i });

        fireEvent.change(input, { target: { value: '12345' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Failed to check balance/i)).toBeInTheDocument();
        });
    });
}); 