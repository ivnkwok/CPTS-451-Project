import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import Navbar from '../components/navbar/Navbar'
import { useBalance, BalanceProvider } from '../components/balance/BalanceContext';
import LowBalanceNotification from '../components/balance/LowBalanceNotification';
import { AuthProvider } from '../context/AuthContext';


function RootLayout() {
  const { isLowBalance } = useBalance()
  return (<>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100svh' }}>
      <AuthProvider>
        <Navbar />
        {isLowBalance && <LowBalanceNotification />}
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <Outlet />
        </div>
      </AuthProvider>
    </div>
    <Link
      to="/feedback"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 1000,
      }}
    >
      Feedback
    </Link>
  </>)
}

export const Route = createRootRoute({
  component: () => (
    <BalanceProvider>
      <RootLayout />
    </BalanceProvider>
  ),
})