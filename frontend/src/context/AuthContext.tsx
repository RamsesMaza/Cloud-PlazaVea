import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { useInventory } from '../context/InventoryContext'; // Necesario para la persistencia

// Define la URL de la API usando la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
  
  // Llama al hook de InventoryContext y obtiene la función de recarga
  const { refreshAllData } = useInventory(); 

  // Función de carga inicial para manejar la autenticación y la recarga de datos
  const handleInitialLoad = useCallback(async () => {
    const storedUser = localStorage.getItem('plaza_vea_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // CRÍTICO: Recargar los datos si ya estamos logueados (ej: al refrescar la página)
        await refreshAllData(); 
        
      } catch (e) {
        localStorage.removeItem('plaza_vea_user');
      }
    }
    setIsLoading(false);
  }, [refreshAllData]); // Depende de refreshAllData

  useEffect(() => {
    handleInitialLoad(); // Se ejecuta al montar el componente
  }, [handleInitialLoad]); 

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Petición REAL al backend
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
        
        // CRÍTICO: Forzar la recarga de TODOS los datos después del login exitoso
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