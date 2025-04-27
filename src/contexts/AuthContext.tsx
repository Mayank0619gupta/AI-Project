
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

type User = {
  regNumber: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (regNumber: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, regNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated database of users
const USERS_STORAGE_KEY = 'startup_vision_users';
const CURRENT_USER_KEY = 'startup_vision_current_user';

const loadUsers = (): Record<string, User & { password: string }> => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  return storedUsers ? JSON.parse(storedUsers) : {};
};

const saveUsers = (users: Record<string, User & { password: string }>) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Load user from local storage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (regNumber: string, password: string): Promise<boolean> => {
    const users = loadUsers();
    
    // Check if user exists and password matches
    if (users[regNumber] && users[regNumber].password === password) {
      const userWithoutPassword = { ...users[regNumber] };
      delete (userWithoutPassword as any).password;
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid registration number or password",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const signup = async (name: string, email: string, regNumber: string, password: string): Promise<boolean> => {
    const users = loadUsers();
    
    // Check if registration number is already taken
    if (users[regNumber]) {
      toast({
        title: "Registration failed",
        description: "Registration number already taken",
        variant: "destructive",
      });
      
      return false;
    }
    
    // Add new user
    const newUser = { name, email, regNumber, password };
    users[regNumber] = newUser;
    saveUsers(users);
    
    // Log in the new user
    const userWithoutPassword = { name, email, regNumber };
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    toast({
      title: "Registration successful",
      description: `Welcome, ${name}!`,
    });
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(CURRENT_USER_KEY);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    
    const users = loadUsers();
    const regNumber = user.regNumber;
    
    if (!users[regNumber]) return;
    
    const updatedUser = { ...user, ...data };
    users[regNumber] = { ...users[regNumber], ...data };
    
    saveUsers(users);
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
