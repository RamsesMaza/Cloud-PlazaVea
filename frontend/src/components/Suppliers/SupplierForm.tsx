import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

interface SupplierFormProps {
  supplierId?: string | null;
  onClose: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplierId, onClose }) => {
  const { suppliers, addSupplier, updateSupplier } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    ruc: '',
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!supplierId;
  const supplier = isEditing ? suppliers.find(s => s.id === supplierId) : null;

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        ruc: supplier.ruc,
        isActive: supplier.isActive
      });
    }
  }, [supplier]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'El contacto es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!formData.ruc.trim()) newErrors.ruc = 'El RUC es requerido';
    else if (!/^\d{11}$/.test(formData.ruc)) newErrors.ruc = 'El RUC debe tener 11 dígitos';

    // Check if RUC is unique (only for new suppliers or if RUC changed)
    if (!isEditing || (supplier && supplier.ruc !== formData.ruc)) {
      const existingRuc = suppliers.find(s => s.ruc === formData.ruc);
      if (existingRuc) newErrors.ruc = 'Este RUC ya existe';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (isEditing && supplierId) {
      updateSupplier(supplierId, formData);
    } else {
      addSupplier(formData);
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Modifica la información del proveedor' : 'Agrega un nuevo proveedor'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="space-y-6">
            {/* Company Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Empresa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Alicorp S.A."
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUC *
                  </label>
                  <input
                    type="text"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleChange}
                    maxLength={11}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.ruc ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="20100055237"
                  />
                  {errors.ruc && <p className="text-red-500 text-sm mt-1">{errors.ruc}</p>}
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Proveedor Activo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Persona de Contacto *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.contactPerson ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="contacto@empresa.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="01-315-0000"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Av. Argentina 4793, Callao"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>
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
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Proveedor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;