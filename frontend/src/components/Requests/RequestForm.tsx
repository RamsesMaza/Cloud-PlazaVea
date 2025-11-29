import React, { useState } from 'react';
import { ArrowLeft, Save, X, Package } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';

interface RequestFormProps {
  onClose: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onClose }) => {
  const { products, createRequest } = useInventory();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    reason: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedProduct = products.find(p => p.id === formData.productId);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) newErrors.productId = 'Debe seleccionar un producto';
    if (formData.quantity <= 0) newErrors.quantity = 'La cantidad debe ser mayor a 0';
    if (!formData.reason.trim()) newErrors.reason = 'El motivo es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    if (!user) return;

    createRequest({
      ...formData,
      requestedBy: user.id,
      status: 'pending'
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

  const commonReasons = [
    'Stock bajo en sucursal',
    'Reposición de inventario',
    'Pedido especial de cliente',
    'Promoción o campaña',
    'Transferencia entre almacenes',
    'Evento especial',
    'Temporada alta',
    'Producto agotado'
  ];

  // Función de ayuda para obtener un precio numérico seguro
  const getSafePrice = (price: any): number => {
    const parsedPrice = parseFloat(price);
    return isNaN(parsedPrice) ? 0 : parsedPrice;
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
            <h1 className="text-2xl font-bold text-gray-900">Nueva Solicitud</h1>
            <p className="text-gray-600">Solicita productos del inventario</p>
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
                    <p className="text-sm text-gray-600">Stock disponible: {selectedProduct.stock} {selectedProduct.unit}</p>
                    <p className="text-sm text-gray-600">Ubicación: {selectedProduct.location}</p>
                    {/* ❌ CORRECCIÓN 1: Precio individual */}
                    <p className="text-sm text-gray-600">Precio: S/ {getSafePrice(selectedProduct.price).toFixed(2)}</p>
                  </div>
                </div>

                {selectedProduct.stock <= selectedProduct.minStock && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-800 text-sm font-medium">
                      ⚠️ Este producto tiene stock bajo
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad Solicitada *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
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
                Motivo de la Solicitud *
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-3 ${
                  errors.reason ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar motivo</option>
                {commonReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
                <option value="other">Otro (especificar abajo)</option>
              </select>

              {formData.reason === 'other' && (
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.reason ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Especifica el motivo de tu solicitud..."
                />
              )}

              {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
            </div>

            {/* Preview */}
            {selectedProduct && formData.quantity > 0 && formData.reason && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Resumen de la Solicitud</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-800">
                    <span className="font-medium">Producto:</span> {selectedProduct.name}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Cantidad:</span> {formData.quantity} {selectedProduct.unit}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Motivo:</span> {formData.reason}
                  </p>
                  {/* ❌ CORRECCIÓN 2: Valor estimado */}
                  <p className="text-blue-800">
                    <span className="font-medium">Valor estimado:</span> S/ {(getSafePrice(selectedProduct.price) * formData.quantity).toFixed(2)}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Solicitado por:</span> {user?.name}
                  </p>
                </div>
              </div>
            )}

            {/* Important Notes */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Información Importante</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Las solicitudes deben ser aprobadas por un gerente o administrador</li>
                <li>• El tiempo de procesamiento puede variar según la disponibilidad</li>
                <li>• Recibirás una notificación cuando tu solicitud sea procesada</li>
                <li>• Asegúrate de que la cantidad solicitada sea necesaria</li>
              </ul>
            </div>
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
              <span>Enviar Solicitud</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;