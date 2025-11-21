import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import LoginForm from './components/Auth/LoginForm';
// IMPORTAR EL NUEVO COMPONENTE DE PÁGINA DE INICIO
import LandingPage from './components/Layout/LandingPage'; 
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Products/ProductList';
import MovementList from './components/Movements/MovementList';
import RequestList from './components/Requests/RequestList';
import SupplierList from './components/Suppliers/SupplierList';
import ReportList from './components/Reports/ReportList';
import AlertList from './components/Alerts/AlertList';
import SearchView from './components/Search/SearchView';
import UserList from './components/Users/UserList';
import AuditList from './components/Audit/AuditList';
import Settings from './components/Settings/Settings';

// Este componente decide qué vista mostrar
const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  // NUEVO ESTADO: Controla si estamos en la landing, el login o la app
  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'app'>(user ? 'app' : 'landing');
  
  // Mantenemos el estado de la aplicación interna
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Si hay usuario logueado, forzamos el modo 'app' (evita que se quede en login después de recargar)
  if (user && viewMode !== 'app') {
      setViewMode('app');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PV</span>
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  // LÓGICA DE VISTA PÚBLICA
  if (!user) {
      if (viewMode === 'landing') {
          // Muestra la Landing Page
          return <LandingPage onLoginClick={() => setViewMode('login')} />;
      }
      // Si viewMode es 'login', muestra el LoginForm
      return <LoginForm />; 
  }
  
  // LÓGICA DE VISTA PRIVADA (DASHBOARD y Navegación)
  if (viewMode === 'app') {
      const renderView = () => {
          switch (activeView) {
            case 'dashboard':
              return <Dashboard />;
            case 'products':
              return <ProductList />;
            case 'movements':
              return <MovementList />;
            case 'requests':
              return <RequestList />;
            case 'suppliers':
              return <SupplierList />;
            case 'reports':
              return <ReportList />;
            case 'alerts':
              return <AlertList />;
            case 'search':
              return <SearchView />;
            case 'users':
              return <UserList />;
            case 'audit':
              return <AuditList />;
            case 'settings':
              return <Settings />;
            default:
              return <Dashboard />;
          }
      };

      return (
          <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
              activeView={activeView}
              onViewChange={setActiveView}
              isOpen={isSidebarOpen}
            />
            <div className="flex-1 flex flex-col">
              <Header
                onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              />
              <main className="flex-1 overflow-auto">
                {renderView()}
              </main>
            </div>
          </div>
      );
  }

  return null; 
};

// Componente principal que establece el orden de los Providers
const App: React.FC = () => {
  return (
    <InventoryProvider>    {/* 1. PADRE (Provee refreshAllData) */}
      <AuthProvider>         {/* 2. HIJO (Usa refreshAllData) */}
        <AppContent />
      </AuthProvider>
    </InventoryProvider>
  );
};

export default App;