import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, DollarSign, Calendar, CheckCircle, Clock, AlertCircle, Download, Search } from 'lucide-react';
import factureService from '../services/factureService';
import ordenService from '../services/ordenService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../components/common/ToastContainer';
import { formatCurrency, formatDateShort } from '../utils/formatters';

const MisFacturas = () => {
  const { usuario } = useAuth();
  const { error: showError } = useToast();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [ordenDetalle, setOrdenDetalle] = useState(null);

  useEffect(() => {
    fetchMisFacturas();
  }, [usuario?.id_cliente]);

  const fetchMisFacturas = async () => {
    try {
      const data = await factureService.getAll();
      setFacturas(data);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (factura) => {
    try {
      setSelectedFactura(factura);
      // Obtener detalles de la orden
      const data = await ordenService.getById(factura.id_orden);
      setOrdenDetalle(data);
    } catch (error) {
      showError('Error al cargar detalles de la factura');
    }
  };

  const handleCloseDetail = () => {
    setSelectedFactura(null);
    setOrdenDetalle(null);
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      pagada: 'bg-green-100 text-green-800 border-green-300',
      anulada: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <Clock className="w-5 h-5" />;
      case 'pagada':
        return <CheckCircle className="w-5 h-5" />;
      case 'anulada':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      pendiente: 'Pendiente de Pago',
      pagada: 'Pagada',
      anulada: 'Anulada'
    };
    return labels[estado] || estado;
  };

  const filteredFacturas = facturas.filter(factura => {
    const matchSearch = 
      factura.numero_factura?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = !filterEstado || factura.estado === filterEstado;

    return matchSearch && matchEstado;
  });

  if (loading) {
    return <LoadingSpinner message="Cargando mis facturas..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Facturas</h1>
        <p className="text-gray-600 mt-1">
          Consulta el estado de tus facturas y comprobantes de pago
        </p>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número de factura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="input"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente de Pago</option>
            <option value="pagada">Pagada</option>
            <option value="anulada">Anulada</option>
          </select>
        </div>
      </div>

      {/* Lista de facturas */}
      {filteredFacturas.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm || filterEstado ? 'No se encontraron facturas' : 'No tienes facturas registradas'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFacturas.map((factura) => (
            <div
              key={factura.id_factura}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleOpenDetail(factura)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Información principal */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-bold text-gray-900">
                      Factura #{factura.numero_factura}
                    </h3>
                    <span className={`badge border ${getEstadoColor(factura.estado)}`}>
                      {getEstadoLabel(factura.estado)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Orden: </span>
                      <span className="font-medium">#{factura.id_orden}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {formatDateShort(factura.fecha_emision)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-primary-600" />
                      <span className="font-bold text-primary-600">
                        {formatCurrency(factura.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Icono de estado */}
                <div className={`flex-shrink-0 p-3 rounded-lg border-2 ${getEstadoColor(factura.estado)}`}>
                  {getEstadoIcon(factura.estado)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detalle */}
      {selectedFactura && ordenDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Factura #{selectedFactura.numero_factura}</h2>
                <span className={`badge border mt-2 ${getEstadoColor(selectedFactura.estado)}`}>
                  {getEstadoLabel(selectedFactura.estado)}
                </span>
              </div>
              <button
                onClick={handleCloseDetail}
                className="p-2 hover:bg-gray-100 rounded-lg text-2xl"
              >
                ×
              </button>
            </div>

            {/* Información de la factura */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="card">
                <p className="text-xs text-gray-500 uppercase mb-1">Número de Factura</p>
                <p className="text-lg font-bold text-gray-900">{selectedFactura.numero_factura}</p>
              </div>
              <div className="card">
                <p className="text-xs text-gray-500 uppercase mb-1">Fecha de Emisión</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDateShort(selectedFactura.fecha_emision)}
                </p>
              </div>
            </div>

            {/* Detalles de la orden */}
            <div className="card mb-6">
              <h3 className="font-bold text-lg mb-3">Información de la Orden</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Orden #:</span>
                  <span className="font-medium">{ordenDetalle.id_orden}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehículo:</span>
                  <span className="font-medium">
                    {ordenDetalle.placa} - {ordenDetalle.marca} {ordenDetalle.modelo}
                  </span>
                </div>
                {ordenDetalle.diagnostico && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diagnóstico:</span>
                    <span className="font-medium">{ordenDetalle.diagnostico}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Resumen de costos */}
            <div className="card bg-gray-50 mb-6">
              <h3 className="font-bold text-lg mb-3">Resumen de Costos</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Mano de Obra:</span>
                  <span className="font-medium">{formatCurrency(selectedFactura.monto_mano_obra)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Repuestos:</span>
                  <span className="font-medium">{formatCurrency(selectedFactura.monto_repuestos)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(selectedFactura.subtotal)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-primary-600">
                  <span>Total (IVA incluido):</span>
                  <span>{formatCurrency(selectedFactura.total)}</span>
                </div>
              </div>
            </div>

            {/* Información de pago */}
            {selectedFactura.estado === 'pagada' && (
              <div className="card bg-green-50 border border-green-200 mb-6">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Pago Confirmado</h4>
                    <p className="text-sm text-green-800">
                      Tu factura ha sido pagada correctamente. Gracias por tu preferencia.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedFactura.estado === 'pendiente' && (
              <div className="card bg-yellow-50 border border-yellow-200 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Pendiente de Pago</h4>
                    <p className="text-sm text-yellow-800">
                      Esta factura está pendiente de pago. Por favor, comunícate con nosotros si tienes alguna pregunta.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseDetail}
                className="btn btn-secondary flex-1"
              >
                Cerrar
              </button>
              <button
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">¿Necesitas ayuda?</h3>
            <p className="text-sm text-blue-800">
              Si tienes dudas sobre tus facturas o necesitas una copia, no dudes en contactarnos. Estamos aquí para ayudarte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisFacturas;
