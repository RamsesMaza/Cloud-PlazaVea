import React from 'react';
import { Users, UserCheck, Shield, User } from 'lucide-react';

const UserList: React.FC = () => {
  // Mock user data
  const users = [
    {
      id: '1',
      name: 'Administrador Sistema',
      email: 'admin@plazavea.com',
      role: 'admin',
      isActive: true,
      lastLogin: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Gerente Inventario',
      email: 'manager@plazavea.com',
      role: 'manager',
      isActive: true,
      lastLogin: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      name: 'Empleado Almacén',
      email: 'employee@plazavea.com',
      role: 'employee',
      isActive: true,
      lastLogin: '2024-01-15T08:45:00Z'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield size={20} className="text-red-600" />;
      case 'manager':
        return <UserCheck size={20} className="text-blue-600" />;
      case 'employee':
        return <User size={20} className="text-green-600" />;
      default:
        return <User size={20} className="text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'employee':
        return 'Empleado';
      default:
        return 'Usuario';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra usuarios y roles del sistema</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Shield size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserCheck size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Gerentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'manager').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <User size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Empleados</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'employee').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Usuarios</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Usuario</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Rol</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Estado</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Último Acceso</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{user.email}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">
                      {new Date(user.lastLogin).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions */}
      <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permisos por Rol</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Shield size={20} className="text-red-600" />
              <h4 className="font-medium text-red-900">Administrador</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Acceso completo al sistema</li>
              <li>• Gestión de usuarios</li>
              <li>• Configuración del sistema</li>
              <li>• Auditoría completa</li>
              <li>• Exportación de datos</li>
            </ul>
          </div>

          <div className="border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <UserCheck size={20} className="text-blue-600" />
              <h4 className="font-medium text-blue-900">Gerente</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Gestión de productos</li>
              <li>• Aprobación de solicitudes</li>
              <li>• Reportes y auditoría</li>
              <li>• Gestión de proveedores</li>
              <li>• Movimientos de inventario</li>
            </ul>
          </div>

          <div className="border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <User size={20} className="text-green-600" />
              <h4 className="font-medium text-green-900">Empleado</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Consulta de productos</li>
              <li>• Creación de solicitudes</li>
              <li>• Búsqueda de inventario</li>
              <li>• Ver alertas</li>
              <li>• Consulta de stock</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;