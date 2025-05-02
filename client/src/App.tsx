import { AuthProvider } from './context/AuthContext';
import { LoginTest } from './components/auth/LoginTest';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Authentication Test</h1>
          <LoginTest />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App; 