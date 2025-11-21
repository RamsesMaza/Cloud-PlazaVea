import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

interface ProductFormProps {
  productId?: string | null;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, onClose }) => {
  const { products, suppliers, addProduct, updateProduct } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    minStock: 0,
    maxStock: 0,
    supplierId: '',
    unit: '',
    location: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!productId;
  const product = isEditing ? products.find(p => p.id === productId) : null;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        description: product.description,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        supplierId: product.supplierId,
        unit: product.unit,
        location: product.location
      });
    }
  }, [product]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es requerido';
    if (!formData.category.trim()) newErrors.category = 'La categoría es requerida';
    if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (formData.minStock < 0) newErrors.minStock = 'El stock mínimo no puede ser negativo';
    if (formData.maxStock <= formData.minStock) newErrors.maxStock = 'El stock máximo debe ser mayor al mínimo';
    if (!formData.supplierId) newErrors.supplierId = 'Debe seleccionar un proveedor';
    if (!formData.unit.trim()) newErrors.unit = 'La unidad es requerida';
    if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida';

    // Check if SKU is unique (only for new products or if SKU changed)
    if (!isEditing || (product && product.sku !== formData.sku)) {
      const existingSku = products.find(p => p.sku === formData.sku);
      if (existingSku) newErrors.sku = 'Este SKU ya existe';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (isEditing && productId) {
      updateProduct(productId, formData);
    } else {
      addProduct(formData);
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const categories = ['Aceites', 'Granos', 'Lácteos', 'Carnes', 'Frutas', 'Verduras', 'Bebidas', 'Snacks', 'Limpieza', 'Otros'];
  const units = ['unidades', 'kilogramos', 'gramos', 'litros', 'mililitros', 'cajas', 'paquetes', 'sacos'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Modifica la información del producto' : 'Agrega un nuevo producto al inventario'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Aceite Primor 1L"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.sku ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: ACE001"
                />
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Descripción del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.supplierId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar proveedor</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </select>
                {errors.supplierId && <p className="text-red-500 text-sm mt-1">{errors.supplierId}</p>}
              </div>
            </div>

            {/* Stock and Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock y Precios</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Unitario (S/) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Actual *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.stock ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Mínimo *
                </label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.minStock ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.minStock && <p className="text-red-500 text-sm mt-1">{errors.minStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Máximo *
                </label>
                <input
                  type="number"
                  name="maxStock"
                  value={formData.maxStock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.maxStock ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.maxStock && <p className="text-red-500 text-sm mt-1">{errors.maxStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad de Medida *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.unit ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar unidad</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación en Almacén *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: A1-B2"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <X size={16} />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Produto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;