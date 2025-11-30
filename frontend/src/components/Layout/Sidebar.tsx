import React from 'react';
import { 
  Home, 
  Package, 
  ArrowUpDown, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Truck,
  Search,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onToggle: () => void; // 👈 nuevo método para abrir/cerrar sidebar en móvil
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen, onToggle }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'manager', 'employee'] },
    { id: 'products', label: 'Productos', icon: Package, roles: ['admin', 'manager', 'employee'] },
    { id: 'movements', label: 'Movimientos', icon: ArrowUpDown, roles: ['admin', 'manager', 'employee'] },
    { id: 'requests', label: 'Solicitudes', icon: FileText, roles: ['admin', 'manager', 'employee'] },
    { id: 'suppliers', label: 'Proveedores', icon: Truck, roles: ['admin', 'manager'] },
    { id: 'reports', label: 'Reportes', icon: BarChart3, roles: ['admin', 'manager'] },
    { id: 'search', label: 'Buscar', icon: Search, roles: ['admin', 'manager', 'employee'] },
    { id: 'users', label: 'Usuarios', icon: Users, roles: ['admin'] },
    { id: 'settings', label: 'Configuración', icon: Settings, roles: ['admin'] }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <>
      {/* Botón hamburguesa visible SOLO en móviles */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow border border-gray-200"
      >
        <Menu size={22} className="text-gray-700" />
      </button>

      <aside
        className={`fixed md:static top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40
        ${isOpen ? 'w-64' : 'w-16'} 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    if (window.innerWidth < 768) onToggle(); // auto-cierra en móvil
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-red-50 text-red-600 border-r-2 border-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon size={20} className={`${isActive ? 'text-red-600' : 'text-gray-500'} flex-shrink-0`} />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
