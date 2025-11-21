import React from 'react';
import { AlertTriangle, CheckCircle, Package, Clock } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

const AlertList: React.FC = () => {
  const { alerts, products, markAlertAsRead } = useInventory();

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const readAlerts = alerts.filter(alert => alert.isRead);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle size={20} className="text-red-500" />;
      case 'medium':
        return <Clock size={20} className="text-yellow-500" />;
      case 'low':
        return <Package size={20} className="text-blue-500" />;
      default:
        return <AlertTriangle size={20} className="text-gray-500" />;
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    markAlertAsRead(alertId);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertas del Sistema</h1>
          <p className="text-gray-600">Notificaciones importantes del inventario</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {unreadAlerts.length} sin leer
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Críticas</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.severity === 'high').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Moderadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.severity === 'medium').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Informativas</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.severity === 'low').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Leídas</p>
              <p className="text-2xl font-bold text-gray-900">{readAlerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unread Alerts */}
      {unreadAlerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertas Pendientes</h2>
          <div className="space-y-4">
            {unreadAlerts.map((alert) => {
              const product = products.find(p => p.id === alert.productId);
              
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{alert.message}</h3>
                        {product && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p><strong>Producto:</strong> {product.name}</p>
                            <p><strong>SKU:</strong> {product.sku}</p>
                            <p><strong>Stock actual:</strong> {product.stock} {product.unit}</p>
                            <p><strong>Stock mínimo:</strong> {product.minStock} {product.unit}</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(alert.createdAt).toLocaleString('es-PE')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="ml-4 bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                    >
                      Marcar como leída
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Alerts */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Todas las Alertas</h3>
        </div>
        
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle size={48} className="text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas</h3>
            <p className="text-gray-500">El sistema está funcionando correctamente</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {alerts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((alert) => {
                const product = products.find(p => p.id === alert.productId);
                
                return (
                  <div
                    key={alert.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      alert.isRead ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(alert.severity)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{alert.message}</h3>
                            {!alert.isRead && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                Nueva
                              </span>
                            )}
                          </div>
                          {product && (
                            <p className="text-sm text-gray-600 mt-1">
                              {product.name} - SKU: {product.sku}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(alert.createdAt).toLocaleString('es-PE')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity === 'high' ? 'Crítica' :
                           alert.severity === 'medium' ? 'Moderada' : 'Informativa'}
                        </span>
                        
                        {!alert.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(alert.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Marcar como leída
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertList;