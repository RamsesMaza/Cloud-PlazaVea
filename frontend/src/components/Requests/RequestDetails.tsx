import React from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, Package, User, Calendar } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

interface RequestDetailsProps {
  requestId: string;
  onClose: () => void;
  onApprove?: (requestId: string) => void;
  onDeny?: (requestId: string, reason: string) => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ 
  requestId, 
  onClose, 
  onApprove, 
  onDeny 
}) => {
  const { requests, products } = useInventory();
  
  const request = requests.find(r => r.id === requestId);
  const product = request ? products.find(p => p.id === request.productId) : null;

  if (!request) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Solicitud no encontrada</p>
        <button onClick={onClose} className="mt-4 text-blue-600 hover:underline">
          Volver
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'denied':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'approved':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'denied':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-gray-600" />;
    }
  };

  const handleDeny = () => {
    const reason = prompt('Motivo de denegación:');
    if (reason && onDeny) {
      onDeny(requestId, reason);
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
            <h1 className="text-2xl font-bold text-gray-900">Detalles de Solicitud</h1>
            <p className="text-gray-600">Información completa de la solicitud</p>
          </div>
        </div>
        
        {onApprove && onDeny && request.status === 'pending' && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onApprove(requestId)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle size={16} />
              <span>Aprobar</span>
            </button>
            <button
              onClick={handleDeny}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <XCircle size={16} />
              <span>Denegar</span>
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Estado de la Solicitud</h2>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="font-medium capitalize">
                  {request.status === 'pending' ? 'Pendiente' : 
                   request.status === 'approved' ? 'Aprobada' : 'Denegada'}
                </span>
              </div>
            </div>
            
            {request.notes && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Notas</h3>
                <p className="text-gray-700">{request.notes}</p>
              </div>
            )}
          </div>

          {/* Product Information */}
          {product && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Producto Solicitado</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Package size={32} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">SKU:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.sku}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Categoría:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock Actual:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.stock} {product.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Precio Unitario:</span>
                      <span className="ml-2 font-medium text-gray-900">S/ {product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Request Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la Solicitud</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Cantidad Solicitada</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {request.quantity} {product?.unit}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Valor Estimado</label>
                  <p className="text-lg font-semibold text-gray-900">
                    S/ {product ? (product.price * request.quantity).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Motivo</label>
                <p className="text-gray-900 mt-1">{request.reason}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar size={20} className="mr-2" />
              Cronología
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Solicitud Creada</p>
                  <p className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {request.status !== 'pending' && (
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Solicitud {request.status === 'approved' ? 'Aprobada' : 'Denegada'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.updatedAt).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Requester Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User size={20} className="mr-2" />
              Solicitante
            </h3>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">ID: {request.requestedBy}</p>
              <p className="text-sm text-gray-600">
                Fecha: {new Date(request.createdAt).toLocaleDateString('es-PE')}
              </p>
            </div>
          </div>

          {/* Approval Info */}
          {request.status !== 'pending' && request.approvedBy && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {request.status === 'approved' ? 'Aprobado por' : 'Denegado por'}
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">ID: {request.approvedBy}</p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(request.updatedAt).toLocaleDateString('es-PE')}
                </p>
              </div>
            </div>
          )}

          {/* Stock Impact */}
          {product && request.status === 'approved' && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Impacto en Stock</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Actual:</span>
                  <span className="font-medium">{product.stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cantidad Aprobada:</span>
                  <span className="font-medium text-red-600">-{request.quantity}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Stock Resultante:</span>
                  <span className="font-medium">{product.stock - request.quantity}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;