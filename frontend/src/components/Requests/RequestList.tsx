import React, { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import RequestForm from './RequestForm';
import RequestDetails from './RequestDetails';

const RequestList: React.FC = () => {
  const { requests, products, updateRequest } = useInventory();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');

  const canApprove = user?.role === 'admin' || user?.role === 'manager';
  const canCreate = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'employee';

  // Filter requests
  let filteredRequests = requests;
  if (filterStatus !== 'all') {
    filteredRequests = filteredRequests.filter(r => r.status === filterStatus);
  }

  // Sort by date (newest first)
  filteredRequests = [...filteredRequests].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleApprove = (requestId: string) => {
    if (!user) return;
    
    updateRequest(requestId, {
      status: 'approved',
      approvedBy: user.id,
      notes: 'Solicitud aprobada'
    });
  };

  const handleDeny = (requestId: string, reason: string) => {
    if (!user) return;
    
    updateRequest(requestId, {
      status: 'denied',
      approvedBy: user.id,
      notes: reason
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'approved':
        return <CheckCircle size={16} />;
      case 'denied':
        return <XCircle size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const deniedCount = requests.filter(r => r.status === 'denied').length;

  if (showForm) {
    return <RequestForm onClose={() => setShowForm(false)} />;
  }

  if (viewingRequest) {
    return (
      <RequestDetails
        requestId={viewingRequest}
        onClose={() => setViewingRequest(null)}
        onApprove={canApprove ? handleApprove : undefined}
        onDeny={canApprove ? handleDeny : undefined}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solicitudes</h1>
          <p className="text-gray-600">Gestiona solicitudes de productos</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nueva Solicitud</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Denegadas</p>
              <p className="text-2xl font-bold text-gray-900">{deniedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="denied">Denegadas</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
            <p className="text-gray-500 mb-4">
              {filterStatus !== 'all' 
                ? `No se encontraron solicitudes con estado: ${filterStatus}`
                : 'Aún no se han creado solicitudes'
              }
            </p>
            {canCreate && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Crear Primera Solicitud
              </button>
            
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => {
              const product = products.find(p => p.id === request.productId);
              
              return (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText size={24} className="text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {product?.name || 'Producto eliminado'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Cantidad solicitada: {request.quantity} {product?.unit}
                        </p>
                        <p className="text-sm text-gray-600">
                          Motivo: {request.reason}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Solicitado el {new Date(request.createdAt).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="capitalize">{request.status === 'pending' ? 'Pendiente' : request.status === 'approved' ? 'Aprobada' : 'Denegada'}</span>
                        </div>
                        {request.status !== 'pending' && request.approvedBy && (
                          <p className="text-xs text-gray-500 mt-1">
                            por {request.approvedBy}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewingRequest(request.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>

                        {canApprove && request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Motivo de denegación:');
                                if (reason) handleDeny(request.id, reason);
                              }}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                            >
                              Denegar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;