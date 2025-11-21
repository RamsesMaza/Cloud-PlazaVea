import React, { useState } from 'react';
import { UserCheck, Calendar, Filter, Eye, Download } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

const AuditList: React.FC = () => {
  const { movements, products } = useInventory();
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filterUser, setFilterUser] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  // Mock audit data based on movements
  const auditLogs = movements.map(movement => ({
    id: movement.id,
    timestamp: movement.createdAt,
    userId: movement.userId,
    action: movement.type === 'entry' ? 'PRODUCT_ENTRY' : 'PRODUCT_EXIT',
    resource: 'PRODUCT',
    resourceId: movement.productId,
    details: {
      productName: products.find(p => p.id === movement.productId)?.name || 'Producto eliminado',
      quantity: movement.quantity,
      reason: movement.reason,
      reference: movement.reference
    },
    ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }));

  // Filter audit logs
  let filteredLogs = auditLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return logDate >= startDate && logDate <= endDate;
  });

  if (filterUser !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.userId === filterUser);
  }

  if (filterAction !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.action === filterAction);
  }

  // Sort by timestamp (newest first)
  filteredLogs = [...filteredLogs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const uniqueUsers = [...new Set(auditLogs.map(log => log.userId))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'PRODUCT_ENTRY':
        return 'bg-green-100 text-green-800';
      case 'PRODUCT_EXIT':
        return 'bg-red-100 text-red-800';
      case 'USER_LOGIN':
        return 'bg-blue-100 text-blue-800';
      case 'USER_LOGOUT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'PRODUCT_ENTRY':
        return 'Entrada de Producto';
      case 'PRODUCT_EXIT':
        return 'Salida de Producto';
      case 'USER_LOGIN':
        return 'Inicio de Sesión';
      case 'USER_LOGOUT':
        return 'Cierre de Sesión';
      default:
        return action;
    }
  };

  const handleExportAudit = () => {
    const csvContent = [
      ['Fecha', 'Usuario', 'Acción', 'Recurso', 'Detalles', 'IP'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString('es-PE'),
        log.userId,
        getActionLabel(log.action),
        log.resource,
        JSON.stringify(log.details),
        log.ipAddress
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `auditoria_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auditoría del Sistema</h1>
          <p className="text-gray-600">Registro de actividades y cambios</p>
        </div>
        <button
          onClick={handleExportAudit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Exportar Auditoría</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserCheck size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Eventos</p>
              <p className="text-2xl font-bold text-gray-900">{filteredLogs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Entradas</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredLogs.filter(log => log.action === 'PRODUCT_ENTRY').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <UserCheck size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Salidas</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredLogs.filter(log => log.action === 'PRODUCT_EXIT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <UserCheck size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueUsers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
            >
              <option value="all">Todos los usuarios</option>
              {uniqueUsers.map(userId => (
                <option key={userId} value={userId}>Usuario {userId}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Acción</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="all">Todas las acciones</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{getActionLabel(action)}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter size={16} />
              <span>{filteredLogs.length} eventos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Registro de Auditoría</h3>
        </div>
        
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay eventos de auditoría</h3>
            <p className="text-gray-500">
              No se encontraron eventos en el rango de fechas seleccionado
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Fecha y Hora</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Usuario</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Acción</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Recurso</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Detalles</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">IP</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleString('es-PE')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">Usuario {log.userId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{log.resource}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 truncate">{log.details.productName}</p>
                        <p className="text-xs text-gray-500">
                          Cantidad: {log.details.quantity} | {log.details.reason}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 font-mono">{log.ipAddress}</span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditList;