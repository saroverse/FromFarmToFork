import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Farmer } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  error: string;
  login: (email: string, pass: string) => void;
  register: (name: string, email: string, pass: string, role: UserRole) => void;
  logout: () => void;
  setError: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  
  // We need access to DataContext to refresh data upon login/register actions if needed, 
  // though storageService handles the persistence.
  // Ideally, DataContext refreshes on mount or when signaled.

  useEffect(() => {
    // Check session on mount
    const sessionId = storageService.getCurrentUserSession();
    if (sessionId) {
      const users = storageService.getUsers();
      const user = users.find(u => u.id === sessionId);
      if (user) setCurrentUser(user);
    }
  }, []);

  const login = (email: string, pass: string) => {
    const users = storageService.getUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    
    if (user) {
      setCurrentUser(user);
      storageService.setCurrentUserSession(user.id);
      setError('');
    } else {
      setError('Invalid email or password');
    }
  };

  const register = (name: string, email: string, pass: string, role: UserRole) => {
    const users = storageService.getUsers();
    if (users.find(u => u.email === email)) {
      setError('Email already registered');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password: pass,
      role: role
    };

    // If Seller, create a default Farm profile
    if (role === 'seller') {
      const newFarmer: Farmer = {
        id: Date.now().toString(),
        name: name,
        farmName: `${name}'s Farm`,
        description: 'Local sustainable farm.',
        products: [],
        schedule: [],
        isOpenNow: false,
        location: { lat: 50.8514, lng: 5.6910, address: 'Maastricht' },
        image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800'
      };
      newUser.farmerId = newFarmer.id;
      storageService.saveFarmer(newFarmer);
    }

    storageService.saveUser(newUser);
    setCurrentUser(newUser);
    storageService.setCurrentUserSession(newUser.id);
    setError('');
  };

  const logout = () => {
    setCurrentUser(null);
    storageService.clearSession();
  };

  return (
    <AuthContext.Provider value={{ currentUser, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};