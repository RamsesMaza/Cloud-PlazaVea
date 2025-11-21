import React, { useState } from 'react';
import { ArrowLeft, Save, X, Package } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';

interface MovementFormProps {
  onClose: () => void;
}

const MovementForm: React.FC<MovementFormProps> = ({ onClose }) => {
  const { products, addMovement } = useInventory();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    productId: '',
    type: 'entry' as 'entry' | 'exit',
    quantity: 0,
    reason: '',
    reference: '',
    cost: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedProduct = products.find(p => p.id === formData.productId);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) newErrors.productId = 'Debe seleccionar un producto';
    if (formData.quantity <= 0) newErrors.quantity = 'La cantidad debe ser mayor a 0';
    if (!formData.reason.trim()) newErrors.reason = 'El motivo es requerido';
    
    // Validate stock for exit movements
    if (formData.type === 'exit' && selectedProduct && formData.quantity > selectedProduct.stock) {
      newErrors.quantity = `Stock insuficiente. Disponible: ${selectedProduct.stock}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (!user) return;

    addMovement({
      ...formData,
      userId: user.id,
      cost: formData.cost > 0 ? formData.cost : undefined
    });

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

  const commonReasons = {
    entry: [
      'Compra a proveedor',
      'Devolución de cliente',
      'Ajuste de inventario (aumento)',
      'Transferencia entre almacenes',
      'Producción interna'
    ],
    exit: [
      'Venta a cliente',
      'Transferencia a sucursal',
      'Producto dañado',
      'Producto vencido',
      'Ajuste de inventario (reducción)',
      'Muestra gratuita'
    ]
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Movimiento</h1>
            <p className="text-gray-600">Registra una entrada o salida de producto</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto *
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.productId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar producto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.sku} (Stock: {product.stock})
                  </option>
                ))}
              </select>
              {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
            </div>

            {/* Selected Product Info */}
            {selectedProduct && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package size={24} className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-600">Stock actual: {selectedProduct.stock} {selectedProduct.unit}</p>
                    <p className="text-sm text-gray-600">Ubicación: {selectedProduct.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Movement Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Movimiento *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'entry', reason: '' }))}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.type === 'entry'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">+</div>
                    <div className="text-sm font-medium">Entrada</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'exit', reason: '' }))}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.type === 'exit'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">-</div>
                    <div className="text-sm font-medium">Salida</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                step="1"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              {selectedProduct && (
                <p className="text-sm text-gray-600 mt-1">
                  Unidad: {selectedProduct.unit}
                </p>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo *
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.reason ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar motivo</option>
                {commonReasons[formData.type].map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
                <option value="other">Otro (especificar en referencia)</option>
              </select>
              {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
            </div>

            {/* Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencia
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Número de orden, factura, etc."
              />
              <p className="text-sm text-gray-600 mt-1">
                Opcional: Número de orden, factura, o cualquier referencia adicional
              </p>
            </div>

            {/* Cost (for entries) */}
            {formData.type === 'entry' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo Total (S/)
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="0.00"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Opcional: Costo total de la compra o entrada
                </p>
              </div>
            )}

            {/* Preview */}
            {selectedProduct && formData.quantity > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Vista Previa</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-800">
                    <span className="font-medium">Producto:</span> {selectedProduct.name}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Movimiento:</span> {formData.type === 'entry' ? 'Entrada' : 'Salida'} de {formData.quantity} {selectedProduct.unit}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Stock resultante:</span> {
                      formData.type === 'entry' 
                        ? selectedProduct.stock + formData.quantity
                        : selectedProduct.stock - formData.quantity
                    } {selectedProduct.unit}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <X size={16} />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Registrar Movimiento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementForm;