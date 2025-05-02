import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/navbar/Navbar'
import { AuthProvider } from '../context/AuthContext'

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  ),
})