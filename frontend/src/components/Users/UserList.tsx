import React, { useState } from 'react';
import { Users, UserCheck, Shield, User, Edit } from 'lucide-react';

// ==============================
// COMPONENTE PRINCIPAL
// ==============================
const UserList: React.FC = () => {
  const [users, setUsers] = useState([
    { id: '1', name: 'Administrador Sistema', email: 'admin@plazavea.com', role: 'admin', isActive: true, lastLogin: '2024-01-15T10:30:00Z' },
    { id: '2', name: 'Gerente Inventario', email: 'manager@plazavea.com', role: 'manager', isActive: true, lastLogin: '2024-01-15T09:15:00Z' },
    { id: '3', name: 'Empleado Almacén', email: 'employee@plazavea.com', role: 'employee', isActive: true, lastLogin: '2024-01-15T08:45:00Z' }
  ]);

  const [editingUser, setEditingUser] = useState<any>(null);

  const startEdit = (user: any) => {
    setEditingUser({ ...user });
  };

  const saveEdit = () => {
    setUsers(prev =>
      prev.map(u => (u.id === editingUser.id ? editingUser : u))
    );
    setEditingUser(null);
  };

  const cancelEdit = () => setEditingUser(null);

  const getRoleLabel = (r: string) =>
    r === 'admin' ? 'Administrador' : r === 'manager' ? 'Gerente' : r === 'employee' ? 'Empleado' : 'Usuario';

  const getRoleColor = (role: string) =>
    role === 'admin' ? 'bg-red-100 text-red-800' :
    role === 'manager' ? 'bg-blue-100 text-blue-800' :
    role === 'employee' ? 'bg-green-100 text-green-800' :
    'bg-gray-100 text-gray-800';

  const getRoleIcon = (role: string) =>
    role === 'admin' ? <Shield size={18} className="text-red-600" /> :
    role === 'manager' ? <UserCheck size={18} className="text-blue-600" /> :
    <User size={18} className="text-green-600" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Gestión de Usuarios</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-6 text-left">Usuario</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Rol</th>
              <th className="py-3 px-6 text-left">Estado</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{u.name}</td>
                <td className="py-4 px-6">{u.email}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 text-sm rounded-full ${getRoleColor(u.role)}`}>
                    {getRoleLabel(u.role)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                    onClick={() => startEdit(u)}
                  >
                    <Edit size={16} />
                    <span>Editar</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================
          MODAL DE EDICIÓN
      ======================== */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full sm:w-96 shadow-lg space-y-4">

            <h2 className="text-xl font-semibold text-gray-900">Editar Usuario</h2>

            <input
              type="text"
              value={editingUser.name}
              onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Nombre"
            />

            <input
              type="email"
              value={editingUser.email}
              onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Correo"
            />

            <select
              value={editingUser.role}
              onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="admin">Administrador</option>
              <option value="manager">Gerente</option>
              <option value="employee">Empleado</option>
            </select>

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={editingUser.isActive}
                onChange={() => setEditingUser({ ...editingUser, isActive: !editingUser.isActive })}
              />
              <span>Usuario Activo</span>
            </label>

            <div className="flex justify-end space-x-3 pt-2">
              <button className="px-4 py-2 bg-gray-200 rounded-lg" onClick={cancelEdit}>
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={saveEdit}>
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
