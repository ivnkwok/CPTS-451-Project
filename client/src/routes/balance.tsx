import { createFileRoute } from '@tanstack/react-router';
import StudentBalanceCheck from '../components/balance/StudentBalanceCheck';
import { useAuth } from '../context/AuthContext';

export const Route = createFileRoute('/balance')({
    component: BalanceRoute,
});

function BalanceRoute() {
    const { user } = useAuth();

    if (!user) {
        return <div>Please log in to access this page.</div>;
    }

    if (user.profile.role !== 'staff' && user.profile.role !== 'admin') {
        return <div>You do not have permission to access this page.</div>;
    }

    return (
        <div className="balance-page">
            <h1>Student Balance Check</h1>
            <StudentBalanceCheck />
        </div>
    );
} 