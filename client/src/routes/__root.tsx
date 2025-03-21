import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/navbar/Navbar'

export const Route = createRootRoute({
  component: () => (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100svh' }}>
        <Navbar />
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <Outlet />
        </div>
      </div>
    </>
  ),
})