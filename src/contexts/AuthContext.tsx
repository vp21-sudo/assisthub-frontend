import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface AuthContextType {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_ID_KEY = 'spur_user_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load or create userId on mount
    const initializeUser = async () => {
      const storedUserId = localStorage.getItem(USER_ID_KEY);
      
      if (storedUserId) {
        setUserIdState(storedUserId);
        setIsLoading(false);
      } else {
        // Create a new anonymous user
        try {
          const response = await api.createUser();
          const newUserId = response.userId;
          localStorage.setItem(USER_ID_KEY, newUserId);
          setUserIdState(newUserId);
        } catch (error) {
          console.error('Failed to create user:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
          toast.error('Error', {
            description: errorMessage,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeUser();
  }, []);

  const setUserId = (newUserId: string | null) => {
    setUserIdState(newUserId);
    if (newUserId) {
      localStorage.setItem(USER_ID_KEY, newUserId);
    } else {
      localStorage.removeItem(USER_ID_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, setUserId, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

