import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { useInventory } from '../context/InventoryContext';

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL usada por frontend:", API_URL);

export default function Dashboard() {

  console.log("DASHBOARD RENDER");

  useEffect(() => {
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  }, []);

  return (
    <div>dashboard</div>
  );
}


interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { refreshAllData } = useInventory();

  const handleInitialLoad = useCallback(async () => {
    const storedUser = localStorage.getItem('plaza_vea_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        await refreshAllData();

      } catch (e) {
        localStorage.removeItem('plaza_vea_user');
      }
    }
    setIsLoading(false);
  }, [refreshAllData]);

  useEffect(() => {
    handleInitialLoad();
  }, [handleInitialLoad]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {

      // 🔥 USO CORRECTO DE API_URL (Azure lo inyecta)
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.error('Error login:', response.statusText);
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      const userFound = data.user || data;

      if (userFound) {
        setUser(userFound);
        localStorage.setItem('plaza_vea_user', JSON.stringify(userFound));

        await refreshAllData();

        setIsLoading(false);
        return true;
      }
      return false;

    } catch (error) {
      console.error('Error de conexión:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('plaza_vea_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
