import React from 'react';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

const Dashboard: React.FC = () => {
  const { products, movements, alerts, requests } = useInventory();

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  
  const recentMovements = movements.slice(-5);
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const activeAlerts = alerts.filter(a => !a.isRead).length;

  const entryMovements = movements.filter(m => m.type === 'entry').length;
  const exitMovements = movements.filter(m => m.type === 'exit').length;

  const stats = [
    {
      name: 'Total Productos',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Stock Bajo',
      value: lowStockProducts,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Valor Inventario',
      value: `S/ ${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Solicitudes Pendientes',
      value: pendingRequests,
      icon: Calendar,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  const movementStats = [
    {
      name: 'Entradas',
      value: entryMovements,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Salidas',
      value: exitMovements,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      name: 'Alertas Activas',
      value: activeAlerts,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen general del inventario</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('es-PE', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Movement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movementStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movements */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Movimientos Recientes</h3>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentMovements.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay movimientos recientes</p>
            ) : (
              recentMovements.map((movement) => {
                const product = products.find(p => p.id === movement.productId);
                return (
                  <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        movement.type === 'entry' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product?.name}</p>
                        <p className="text-xs text-gray-500">{movement.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        movement.type === 'entry' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.type === 'entry' ? '+' : '-'}{movement.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(movement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Productos con Stock Bajo</h3>
            <AlertTriangle size={20} className="text-orange-500" />
          </div>
          <div className="space-y-3">
            {products.filter(p => p.stock <= p.minStock).length === 0 ? (
              <p className="text-gray-500 text-center py-4">Todos los productos tienen stock suficiente</p>
            ) : (
              products
                .filter(p => p.stock <= p.minStock)
                .slice(0, 5)
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">
                        {product.stock} / {product.minStock}
                      </p>
                      <p className="text-xs text-orange-500">Stock bajo</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;