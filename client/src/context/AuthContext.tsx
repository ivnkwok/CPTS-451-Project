import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Define the shape of your auth context
type User = {
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch user from session (if already logged in)
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/user/", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await axios.post(
      "http://localhost:8000/auth/login/",
      { username, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post(
      "http://localhost:8000/auth/logout/",
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for child components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
