import React, { useState } from 'react';
import { Plus, Truck, Edit2, Eye, Phone, Mail, MapPin, Trash2 } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import SupplierForm from './SupplierForm';

const SupplierList: React.FC = () => {
  const { suppliers, deleteSupplier } = useInventory();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const canDelete = user?.role === 'admin';

  // ✅ FILTRO SEGURO
  const filteredSuppliers = searchQuery
    ? suppliers.filter((supplier) => {
        const name = supplier.name?.toLowerCase() || '';
        const contact = supplier.contactPerson?.toLowerCase() || '';
        const ruc = supplier.ruc || '';
        const q = searchQuery.toLowerCase();

        return (
          name.includes(q) ||
          contact.includes(q) ||
          ruc.includes(q)
        );
      })
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

  // ✅ ELIMINAR COMO PRODUCTOS
  const handleDelete = (supplierId: string) => {
    if (confirm('¿Seguro que deseas eliminar este proveedor?')) {
      deleteSupplier(supplierId);
    }
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
      {/* HEADER */}
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

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Total Proveedores</p>
          <p className="text-2xl font-bold">{suppliers.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Activos</p>
          <p className="text-2xl font-bold">{activeSuppliers}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Inactivos</p>
          <p className="text-2xl font-bold">{inactiveSuppliers}</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <input
          type="text"
          placeholder="Buscar proveedores..."
          className="w-full px-4 py-3 border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl p-6 border shadow-sm">

            <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
            <p className="text-sm text-gray-500">RUC: {supplier.ruc}</p>

            <p className="text-sm mt-2">📞 {supplier.phone}</p>
            <p className="text-sm">✉️ {supplier.email}</p>
            <p className="text-sm">📍 {supplier.address}</p>

            <div className="flex gap-2 mt-4">
              {canEdit && (
                <button
                  onClick={() => handleEdit(supplier.id)}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg"
                >
                  <Edit2 size={16} />
                </button>
              )}

              {canDelete && (
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg"
                >
                  <Trash2 size={16} />
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
