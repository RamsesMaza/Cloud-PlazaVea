import React, { useState } from 'react';
import { Plus, Truck, Edit2, Eye, Phone, Mail, MapPin } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import SupplierForm from './SupplierForm';

const SupplierList: React.FC = () => {
  const { suppliers } = useInventory();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  const filteredSuppliers = searchQuery
    ? suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (supplier.contactPerson || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.ruc.includes(searchQuery)
      )
    : suppliers;

  const activeSuppliers = suppliers.filter(s => s.isActive).length;
  const inactiveSuppliers = suppliers.filter(s => !s.isActive).length;

  const handleEdit = (supplierId: string) => {
    setEditingSupplier(supplierId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  if (showForm) {
    return (
      <SupplierForm
        supplierId={editingSupplier}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-gray-600">Gestiona la información de proveedores</p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo Proveedor</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Truck size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Proveedores</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Truck size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{activeSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Truck size={24} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">{inactiveSuppliers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <input
          type="text"
          placeholder="Buscar proveedores..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                <p className="text-sm text-gray-500">RUC: {supplier.ruc}</p>
              </div>

              <span className={`px-2 py-1 rounded text-xs ${
                supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {supplier.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                {supplier.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                {supplier.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                {supplier.address}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-gray-100 px-3 py-2 rounded-lg">
                <Eye size={16} />
              </button>

              {canEdit && (
                <button
                  onClick={() => handleEdit(supplier.id)}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierList;
