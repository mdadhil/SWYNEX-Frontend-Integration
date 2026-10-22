import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  user: UserData;
  fetchUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState<UserData>({
    name: 'Loading...',
    email: '',
    role: 'User',
    avatar: '?',
  });

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const fetchUser = async () => {
    if (!isAuthenticated) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/settings/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User';
        let init = '?';
        if (data.first_name) init = data.first_name.charAt(0).toUpperCase();
        
        setUser({
          name: fullName,
          email: data.email || '',
          role: data.role || 'User',
          avatar: data.profile_photo || init,
        });
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchUser();
  }, [isAuthenticated]);

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode, isAuthenticated, setIsAuthenticated, user, fetchUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

