import { createFileRoute } from '@tanstack/react-router';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import BalanceCheck from '../components/balance/BalanceCheck';

export const Route = createFileRoute('/balance')({
  component: () => (
    <ProtectedRoute>
      <BalanceCheck />
    </ProtectedRoute>
  ),
}); 