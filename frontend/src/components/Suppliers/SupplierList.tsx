import React, { useState } from 'react';
import { Plus, Truck, Edit2, Eye, Phone, Mail, MapPin, Trash2 } from 'lucide-react';
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

  // ✅ Filtrar proveedores
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

      {/* SEARCH */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar proveedores por nombre, contacto o RUC..."
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  supplier.isActive ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Truck size={24} className={supplier.isActive ? 'text-green-600' : 'text-gray-500'} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                  <p className="text-sm text-gray-500">RUC: {supplier.ruc}</p>
                </div>
              </div>

              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {supplier.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* INFO */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{supplier.phone}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{supplier.email}</span>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-600 line-clamp-2">{supplier.address}</span>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Contacto:</span> {supplier.contactPerson || '-'}
                </p>
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
              

              {canEdit && (
                <button
                  onClick={() => handleEdit(supplier.id)}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit2 size={16} />
                  <span className="text-sm">Editar</span>
                </button>
              )}

            </div>

          </div>
        ))}
      </div>

      {/* EMPTY */}
      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Truck size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron proveedores</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? 'Intenta ajustar los términos de búsqueda'
              : 'Comienza agregando tu primer proveedor'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
