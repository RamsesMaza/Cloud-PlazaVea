import React, { useState } from 'react';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { alerts } = useInventory();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 relative z-50">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PV</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Plaza Vea</h1>
            <p className="text-xs text-gray-500">Sistema de Inventario</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notificaciones</h3>
              </div>
              {unreadAlerts.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500">
                  No tienes notificaciones nuevas
                </div>
              ) : (
                unreadAlerts.map(alert => (
                  <div key={alert.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === 'high' ? 'bg-red-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;