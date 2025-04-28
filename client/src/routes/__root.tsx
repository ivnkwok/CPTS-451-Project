import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/navbar/Navbar'
import { useBalance, BalanceProvider } from '../components/balance/BalanceContext'; // Import context
import LowBalanceNotification from '../components/balance/LowBalanceNotification'; // Import notification component


function RootLayout() {
  const {isLowBalance} = useBalance()
  return (<>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100svh' }}>
      <Navbar />
      {isLowBalance && <LowBalanceNotification/>}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <Outlet />
      </div>
    </div>
  </>)
}

export const Route = createRootRoute({
  component: () => (
    <BalanceProvider> 
      <RootLayout />
    </BalanceProvider>
  ),
})