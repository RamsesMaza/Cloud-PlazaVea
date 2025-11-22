import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import LoginForm from './components/Auth/LoginForm';

// Páginas
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

// ==============================
// COMPONENTE PRINCIPAL INTERNO
// ==============================
const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Logs para verificar carga
  console.log("🔥 AppContent cargado — user:", user, "viewMode inicial:", user ? "app" : "landing");
  console.log("🌐 ENV desde AppContent:", import.meta.env.VITE_API_URL);

  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'app'>(
    user ? 'app' : 'landing'
  );

  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Forzar modo app si hay usuario
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

  // LOG para ver estado del flujo
  console.log("📌 Estado actual — user:", user, "viewMode:", viewMode);

  // =======================
  // Vista PÚBLICA
  // =======================
  if (!user) {
    if (viewMode === 'landing') {
      console.log("👀 Mostrando LandingPage");
      return <LandingPage onLoginClick={() => setViewMode('login')} />;
    }

    console.log("🔐 Mostrando LoginForm");
    return <LoginForm />;
  }

  // =======================
  // Vista PRIVADA
  // =======================
  if (viewMode === 'app') {
    console.log("🟩 Renderizando vista privada (Dashboard + Sidebar)");

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

// ==============================
// WRAPPER PRINCIPAL
// ==============================
const App: React.FC = () => {
  console.log("🧩 App.tsx principal cargado");
  console.log("🌐 ENV desde App.tsx:", import.meta.env.VITE_API_URL);

  return (
    <InventoryProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </InventoryProvider>
  );
};

export default App;
