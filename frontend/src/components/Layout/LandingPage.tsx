import React from 'react';
import { LogIn, Package } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- Header / Navigation --- */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PV</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Plaza Vea Inventario</h1>
          </div>
          
          {/* Botón Administrador / Login */}
          <button
            onClick={onLoginClick}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2 shadow-md"
          >
            <LogIn size={20} />
            <span>Administrador / Login</span>
          </button>
        </div>
      </header>

      {/* --- Contenido Principal (Hero Section) --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <Package size={80} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Sistema de Gestión de Inventario Mayorista
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Optimiza la cadena de suministro, rastrea movimientos y genera reportes en tiempo real para la eficiencia total de tu almacén.
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={onLoginClick}
              className="bg-red-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-red-700 transition-colors shadow-lg transform hover:scale-105"
            >
              Acceso al Sistema
            </button>
            <a 
              href="#features"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-gray-300 transition-colors shadow-md"
            >
              Ver Características
            </a>
          </div>
        </div>

        {/* --- Sección de Características --- */}
        <section id="features" className="mt-24">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">Control Total del Almacén</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <FeatureCard 
              title="Inventario en Tiempo Real" 
              description="Rastrea cada unidad de producto, entradas, salidas y stock mínimo para evitar desabastecimiento."
            />
            <FeatureCard 
              title="Reportes Analíticos" 
              description="Genera informes detallados de movimientos y valor total de inventario por rango de fechas."
            />
            <FeatureCard 
              title="Gestión de Solicitudes" 
              description="Administra pedidos de reposición y garantiza que la logística cumpla con los tiempos establecidos."
            />
          </div>
        </section>
      </main>
      
      {/* --- Footer --- */}
      <footer className="bg-gray-800 text-white py-6">
        <p className="text-center text-sm">© {new Date().getFullYear()} Plaza Vea Inventario. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

// Componente auxiliar para la sección de características
const FeatureCard: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-red-100 transform hover:shadow-xl transition-shadow">
        <Package size={32} className="text-red-500 mb-4" />
        <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default LandingPage;