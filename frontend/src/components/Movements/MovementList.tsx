import React, { useState } from 'react';
import { Plus, ArrowUpDown, TrendingUp, TrendingDown, Calendar, Package } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import MovementForm from './MovementForm';

const MovementList: React.FC = () => {
  const { movements, products } = useInventory();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'entry' | 'exit'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const canCreateMovement = user?.role === 'admin' || user?.role === 'manager';

  // Filter movements
  let filteredMovements = movements;
  
  if (filterType !== 'all') {
    filteredMovements = filteredMovements.filter(m => m.type === filterType);
  }

  if (dateRange.start && dateRange.end) {
    filteredMovements = filteredMovements.filter(m => {
      const movementDate = new Date(m.createdAt);
      return movementDate >= new Date(dateRange.start) && movementDate <= new Date(dateRange.end);
    });
  }

  // Sort by date (newest first)
  filteredMovements = [...filteredMovements].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalEntries = movements.filter(m => m.type === 'entry').reduce((sum, m) => sum + m.quantity, 0);
  const totalExits = movements.filter(m => m.type === 'exit').reduce((sum, m) => sum + m.quantity, 0);
  
  // CORRECCIÓN CRÍTICA: Asegurar que la suma sea siempre un número
  const totalValue = movements.reduce((sum, m) => sum + (Number(m.cost) || 0), 0); 

  if (showForm) {
    return <MovementForm onClose={() => setShowForm(false)} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movimientos de Inventario</h1>
          <p className="text-gray-600">Gestiona entradas y salidas de productos</p>
        </div>
        {canCreateMovement && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo Movimiento</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entradas</p>
              <p className="text-2xl font-bold text-gray-900">{totalEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Salidas</p>
              <p className="text-2xl font-bold text-gray-900">{totalExits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ArrowUpDown size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              {/* CORRECCIÓN FINAL: Usar Number(totalValue || 0) para el toFixed */}
              <p className="text-2xl font-bold text-gray-900">S/ {Number(totalValue || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimiento</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'entry' | 'exit')}
            >
              <option value="all">Todos</option>
              <option value="entry">Entradas</option>
              <option value="exit">Salidas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterType('all');
                setDateRange({ start: '', end: '' });
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Producto</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Tipo</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Cantidad</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Motivo</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Referencia</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Costo</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <ArrowUpDown size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay movimientos</h3>
                    <p className="text-gray-500 mb-4">
                      {filterType !== 'all' || dateRange.start || dateRange.end
                        ? 'No se encontraron movimientos con los filtros aplicados'
                        : 'Aún no se han registrado movimientos de inventario'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMovements.map((movement) => {
                  const product = products.find(p => p.id === movement.productId);
                  
                  return (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product?.name || 'Producto eliminado'}</p>
                            <p className="text-sm text-gray-500">{product?.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            movement.type === 'entry' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className={`font-medium ${
                            movement.type === 'entry' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {movement.type === 'entry' ? 'Entrada' : 'Salida'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-medium ${
                          movement.type === 'entry' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.type === 'entry' ? '+' : '-'}{movement.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">{movement.reason}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600">{movement.reference || '-'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">
                          {movement.cost ? `S/ ${Number(movement.cost).toFixed(2)}` : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-gray-600">
                            {new Date(movement.createdAt).toLocaleDateString('es-PE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MovementList;