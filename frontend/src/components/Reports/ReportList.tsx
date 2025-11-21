import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

const ReportList: React.FC = () => {
  const { movements, products, generateReport, exportToExcel } = useInventory();
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState<any[]>([]);
  const [showReport, setShowReport] = useState(false);

  const handleGenerateReport = () => {
    const data = generateReport(dateRange.start, dateRange.end);
    setReportData(data);
    setShowReport(true);
  };

  const handleExportExcel = () => {
    exportToExcel();
  };

  // CRÍTICO: Cálculo Seguro (Aseguramos que m.cost sea un número o 0)
  const totalMovements = movements.length;
  const totalEntries = movements.filter(m => m.type === 'entry').length;
  const totalExits = movements.filter(m => m.type === 'exit').length;
  const totalValue = movements.reduce((sum, m) => sum + (Number(m.cost) || 0), 0); // Fija el cálculo inicial

  const reportMovements = showReport ? reportData : movements.slice(-10);
  const reportEntries = reportMovements.filter(m => m.type === 'entry').length;
  const reportExits = reportMovements.filter(m => m.type === 'exit').length;
  const reportValue = reportMovements.reduce((sum, m) => sum + (Number(m.cost) || 0), 0); // Fija el cálculo del reporte

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600">Genera reportes de movimientos e inventario</p>
        </div>
        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Exportar Inventario</span>
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Movimientos</p>
              <p className="text-2xl font-bold text-gray-900">{totalMovements}</p>
            </div>
          </div>
        </div>

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
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Package size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              {/* FIX 1: Renderizado Seguro */}
              <p className="text-2xl font-bold text-gray-900">S/ {Number(totalValue || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generar Reporte de Movimientos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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

          <div>
            <button
              onClick={handleGenerateReport}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <BarChart3 size={16} />
              <span>Generar Reporte</span>
            </button>
          </div>

          <div>
            <button
              onClick={() => setShowReport(false)}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Ver Todos
            </button>
          </div>
        </div>
      </div>

      {/* Report Results */}
      {showReport && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reporte del {new Date(dateRange.start).toLocaleDateString('es-PE')} al {new Date(dateRange.end).toLocaleDateString('es-PE')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-600">Entradas</p>
              <p className="text-xl font-bold text-green-900">{reportEntries}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-red-600">Salidas</p>
              <p className="text-xl font-bold text-red-900">{reportExits}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-600">Valor Total</p>
              {/* FIX 2: Renderizado Seguro */}
              <p className="text-xl font-bold text-blue-900">S/ {Number(reportValue || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Movements Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {showReport ? 'Movimientos del Reporte' : 'Movimientos Recientes'}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Fecha</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Producto</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Tipo</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Cantidad</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Motivo</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Costo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportMovements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay movimientos</h3>
                    <p className="text-gray-500">
                      {showReport 
                        ? 'No se encontraron movimientos en el rango de fechas seleccionado'
                        : 'Aún no se han registrado movimientos'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                reportMovements.map((movement) => {
                  const product = products.find(p => p.id === movement.productId);
                  
                  return (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {new Date(movement.createdAt).toLocaleDateString('es-PE')}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{product?.name || 'Producto eliminado'}</p>
                          <p className="text-sm text-gray-500">{product?.sku}</p>
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
                        <span className="text-gray-900">
                          {movement.cost ? `S/ ${Number(movement.cost).toFixed(2)}` : '-'}
                        </span>
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

export default ReportList;