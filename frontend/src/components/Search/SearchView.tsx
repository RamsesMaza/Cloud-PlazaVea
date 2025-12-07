import React, { useState } from 'react';
import { Search, Package, Filter, Eye, Edit2 } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';

const SearchView: React.FC = () => {
  const { products, searchProducts } = useInventory();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(products);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStockStatus, setFilterStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  const handleSearch = () => {
    let results = searchQuery ? searchProducts(searchQuery) : products;
    
    // Apply filters
    if (filterCategory !== 'all') {
      results = results.filter(p => p.category === filterCategory);
    }

    if (filterStockStatus !== 'all') {
      results = results.filter(p => {
        switch (filterStockStatus) {
          case 'low':
            return p.stock <= p.minStock;
          case 'normal':
            return p.stock > p.minStock && p.stock < p.maxStock;
          case 'high':
            return p.stock >= p.maxStock;
          case 'out':
            return p.stock === 0;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'sku':
          return a.sku.localeCompare(b.sku);
        case 'stock':
          return b.stock - a.stock;
        case 'price':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setSearchResults(results);
  };

  React.useEffect(() => {
    handleSearch();
  }, [searchQuery, filterCategory, filterStockStatus, sortBy, products]);

  const getStockStatus = (product: any) => {
    if (product.stock === 0) return { status: 'out', color: 'bg-red-100 text-red-800', label: 'Agotado' };
    if (product.stock <= product.minStock) return { status: 'low', color: 'bg-orange-100 text-orange-800', label: 'Stock Bajo' };
    if (product.stock >= product.maxStock) return { status: 'high', color: 'bg-blue-100 text-blue-800', label: 'Stock Alto' };
    return { status: 'normal', color: 'bg-green-100 text-green-800', label: 'Normal' };
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Búsqueda de Productos</h1>
          <p className="text-gray-600">Encuentra productos rápidamente</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o categoría..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Stock</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={filterStockStatus}
                onChange={(e) => setFilterStockStatus(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="out">Agotado</option>
                <option value="low">Stock bajo</option>
                <option value="normal">Stock normal</option>
                <option value="high">Stock alto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Nombre</option>
                <option value="sku">SKU</option>
                <option value="stock">Stock</option>
                <option value="price">Precio</option>
                <option value="category">Categoría</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Filter size={16} />
                <span>{searchResults.length} resultados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Resultados de Búsqueda ({searchResults.length})
          </h3>
        </div>

        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <Search size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">
              Intenta ajustar los términos de búsqueda o filtros
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Producto</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">SKU</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Categoría</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Stock</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Precio</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Ubicación</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {searchResults.map((product) => {
                  const stockStatus = getStockStatus(product);
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-gray-900">{product.sku}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">{product.category}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-medium text-gray-900">{product.stock}</span>
                          <span className="text-sm text-gray-500 ml-1">{product.unit}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                  <span className="font-medium text-gray-900">S/ {(typeof product.price === 'number' ? product.price : parseFloat(product.price)).toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">{product.location}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {searchResults.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Productos</p>
            <p className="text-xl font-bold text-gray-900">{searchResults.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Stock Total</p>
            <p className="text-xl font-bold text-gray-900">
              {searchResults.reduce((sum, p) => sum + p.stock, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Valor Total</p>
            <p className="text-xl font-bold text-gray-900">
              S/ {searchResults.reduce((sum, p) => sum + (p.stock * p.price), 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Stock Bajo</p>
            <p className="text-xl font-bold text-red-600">
              {searchResults.filter(p => p.stock <= p.minStock).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchView;