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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen }) => {
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
    <aside className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    } h-full overflow-hidden`}>
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-red-50 text-red-600 border-r-2 border-red-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon size={20} className={`${isActive ? 'text-red-600' : 'text-gray-500'} flex-shrink-0`} />
                {isOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;