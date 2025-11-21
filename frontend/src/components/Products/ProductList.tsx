import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  Eye
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import ProductForm from './ProductForm';
import ProductDetails from './ProductDetails';

const ProductList: React.FC = () => {
  const { products, deleteProduct, searchProducts } = useInventory();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [viewingProduct, setViewingProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStockStatus, setFilterStockStatus] = useState('all');

  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const canDelete = user?.role === 'admin';

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  // Filter products
  let filteredProducts = searchQuery ? searchProducts(searchQuery) : products;
  
  if (filterCategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === filterCategory);
  }

  if (filterStockStatus !== 'all') {
    filteredProducts = filteredProducts.filter(p => {
      switch (filterStockStatus) {
        case 'low':
          return p.stock <= p.minStock;
        case 'normal':
          return p.stock > p.minStock && p.stock < p.maxStock;
        case 'high':
          return p.stock >= p.maxStock;
        default:
          return true;
      }
    });
  }

  const handleEdit = (productId: string) => {
    setEditingProduct(productId);
    setShowForm(true);
  };

  const handleView = (productId: string) => {
    setViewingProduct(productId);
  };

  const handleDelete = (productId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProduct(productId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCloseDetails = () => {
    setViewingProduct(null);
  };

  const getStockStatus = (product: any) => {
    if (product.stock === 0) return { status: 'out', color: 'bg-red-100 text-red-800', label: 'Agotado' };
    if (product.stock <= product.minStock) return { status: 'low', color: 'bg-orange-100 text-orange-800', label: 'Stock Bajo' };
    if (product.stock >= product.maxStock) return { status: 'high', color: 'bg-blue-100 text-blue-800', label: 'Stock Alto' };
    return { status: 'normal', color: 'bg-green-100 text-green-800', label: 'Normal' };
  };

  if (showForm) {
    return (
      <ProductForm
        productId={editingProduct}
        onClose={handleCloseForm}
      />
    );
  }

  if (viewingProduct) {
    return (
      <ProductDetails
        productId={viewingProduct}
        onClose={handleCloseDetails}
        onEdit={canEdit ? handleEdit : undefined}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600">Gestiona el catálogo de productos</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo Producto</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category, index) => (
              <option key={category + index} value={category}>{category}</option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={filterStockStatus}
            onChange={(e) => setFilterStockStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="low">Stock bajo</option>
            <option value="normal">Stock normal</option>
            <option value="high">Stock alto</option>
          </select>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter size={16} />
            <span>{filteredProducts.length} productos</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          
          return (
            <div key={product.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package size={24} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="p-1 rounded-lg hover:bg-gray-100">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Precio:</span>
                  <span className="font-medium text-gray-900">S/ {(typeof product.price === 'number' ? product.price : parseFloat(product.price)).toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                    <span className="font-medium text-gray-900">{product.stock}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Categoría:</span>
                  <span className="text-sm text-gray-900">{product.category}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ubicación:</span>
                  <span className="text-sm text-gray-900">{product.location}</span>
                </div>

                {product.stock <= product.minStock && (
                  <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                    <AlertTriangle size={16} className="text-orange-500" />
                    <span className="text-sm text-orange-700">Stock mínimo alcanzado</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleView(product.id)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye size={16} />
                  <span className="text-sm">Ver</span>
                </button>
                
                {canEdit && (
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit2 size={16} />
                    <span className="text-sm">Editar</span>
                  </button>
                )}
                
                {canDelete && (
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterStockStatus !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer producto al inventario'
            }
          </p>
          {canEdit && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Agregar Producto
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;