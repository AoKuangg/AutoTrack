import { useState, useEffect } from 'react';
import { Search, FileText, Eye, DollarSign, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, formatDateTime, formatDateShort } from '../utils/formatters';

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [ordenDetalle, setOrdenDetalle] = useState(null);

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    try {
      const response = await api.get('/api/facturas');
      setFacturas(response.data);
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
      const response = await api.get(`/api/ordenes/${factura.id_orden}`);
      setOrdenDetalle(response.data);
      setShowDetailModal(true);
    } catch (error) {
      alert('Error al cargar detalles de la factura');
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedFactura(null);
    setOrdenDetalle(null);
  };

  const handleUpdateEstado = async (idFactura, nuevoEstado) => {
    if (!window.confirm(`¿Marcar factura como ${nuevoEstado}?`)) return;

    try {
      await api.patch(`/api/facturas/${idFactura}/estado`, { estado: nuevoEstado });
      fetchFacturas();
      if (selectedFactura) {
        const updatedFactura = { ...selectedFactura, estado: nuevoEstado };
        setSelectedFactura(updatedFactura);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Error al actualizar estado');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pagada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'anulada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pagada':
        return <CheckCircle className="w-4 h-4" />;
      case 'pendiente':
        return <Clock className="w-4 h-4" />;
      case 'anulada':
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredFacturas = facturas.filter(factura => {
    const matchSearch = 
      factura.id_factura.toString().includes(searchTerm) ||
      factura.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = !filterEstado || factura.estado === filterEstado;

    return matchSearch && matchEstado;
  });

  // Calcular totales
  const totalFacturado = facturas.reduce((sum, f) => sum + parseFloat(f.total || 0), 0);
  const totalPagado = facturas
    .filter(f => f.estado === 'pagada')
    .reduce((sum, f) => sum + parseFloat(f.total || 0), 0);
  const totalPendiente = facturas
    .filter(f => f.estado === 'pendiente')
    .reduce((sum, f) => sum + parseFloat(f.total || 0), 0);

  if (loading) {
    return <LoadingSpinner message="Cargando facturas..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Facturas</h1>
        <p className="text-gray-600 mt-1">Gestiona las facturas del taller</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Facturado</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalFacturado)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pagado</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalPagado)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pendiente</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(totalPendiente)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por #factura, placa o cliente..."
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
            <option value="pendiente">Pendiente</option>
            <option value="pagada">Pagada</option>
            <option value="anulada">Anulada</option>
          </select>
        </div>
      </div>

      {/* Tabla de facturas */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>#Factura</th>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Fecha</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacturas.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500">
                    {searchTerm || filterEstado ? 'No se encontraron facturas' : 'No hay facturas generadas'}
                  </td>
                </tr>
              ) : (
                filteredFacturas.map((factura) => (
                  <tr key={factura.id_factura}>
                    <td className="font-medium">#{factura.id_factura}</td>
                    <td>#{factura.id_orden}</td>
                    <td>{factura.cliente_nombre}</td>
                    <td>{factura.placa}</td>
                    <td className="text-gray-600">{formatDateShort(factura.fecha_emision)}</td>
                    <td>{formatCurrency(factura.subtotal)}</td>
                    <td className="text-gray-600">{formatCurrency(factura.iva)}</td>
                    <td className="font-bold text-primary-600">{formatCurrency(factura.total)}</td>
                    <td>
                      <span className={`badge ${getEstadoColor(factura.estado)} flex items-center gap-1 w-fit`}>
                        {getEstadoIcon(factura.estado)}
                        <span className="capitalize">{factura.estado}</span>
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenDetail(factura)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {factura.estado === 'pendiente' && (
                          <button
                            onClick={() => handleUpdateEstado(factura.id_factura, 'pagada')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Marcar como pagada"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalle Factura */}
      {showDetailModal && selectedFactura && ordenDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
            {/* Header de la factura */}
            <div className="flex justify-between items-start mb-6 pb-6 border-b">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">FACTURA</h2>
                <p className="text-gray-600">#{selectedFactura.id_factura}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Fecha de Emisión</p>
                <p className="font-semibold">{formatDateTime(selectedFactura.fecha_emision)}</p>
                <span className={`badge ${getEstadoColor(selectedFactura.estado)} mt-2`}>
                  {selectedFactura.estado.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Info del cliente y vehículo */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">CLIENTE</h3>
                <p className="text-sm text-gray-600">Nombre: <span className="font-medium text-gray-900">{ordenDetalle.cliente_nombre}</span></p>
                <p className="text-sm text-gray-600">Teléfono: <span className="font-medium text-gray-900">{ordenDetalle.cliente_telefono}</span></p>
                <p className="text-sm text-gray-600">Email: <span className="font-medium text-gray-900">{ordenDetalle.cliente_correo}</span></p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">VEHÍCULO</h3>
                <p className="text-sm text-gray-600">Placa: <span className="font-medium text-gray-900">{ordenDetalle.placa}</span></p>
                <p className="text-sm text-gray-600">Marca/Modelo: <span className="font-medium text-gray-900">{ordenDetalle.marca} {ordenDetalle.modelo}</span></p>
                <p className="text-sm text-gray-600">Año: <span className="font-medium text-gray-900">{ordenDetalle.anio}</span></p>
              </div>
            </div>

            {/* Detalles del servicio */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">DETALLES DEL SERVICIO</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3">Descripción</th>
                    <th className="text-center p-3">Cantidad</th>
                    <th className="text-right p-3">Precio Unit.</th>
                    <th className="text-right p-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3">Mano de Obra</td>
                    <td className="text-center p-3">1</td>
                    <td className="text-right p-3">{formatCurrency(ordenDetalle.costo_mano_obra)}</td>
                    <td className="text-right p-3 font-medium">{formatCurrency(ordenDetalle.costo_mano_obra)}</td>
                  </tr>
                  {ordenDetalle.repuestos?.map((rep) => (
                    <tr key={rep.id_uso}>
                      <td className="p-3">{rep.nombre} ({rep.codigo})</td>
                      <td className="text-center p-3">{rep.cantidad}</td>
                      <td className="text-right p-3">{formatCurrency(rep.precio_unitario)}</td>
                      <td className="text-right p-3 font-medium">{formatCurrency(rep.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(selectedFactura.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA (19%):</span>
                    <span className="font-medium">{formatCurrency(selectedFactura.iva)}</span>
                  </div>
                  {selectedFactura.descuento > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Descuento:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(selectedFactura.descuento)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>TOTAL:</span>
                    <span className="text-primary-600">{formatCurrency(selectedFactura.total)}</span>
                  </div>
                </div>
              </div>

              {selectedFactura.metodo_pago && (
                <div className="mt-4 text-right text-sm text-gray-600">
                  Método de pago: <span className="font-medium capitalize">{selectedFactura.metodo_pago}</span>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button
                onClick={handleCloseDetail}
                className="btn btn-secondary flex-1"
              >
                Cerrar
              </button>
              {selectedFactura.estado === 'pendiente' && (
                <button
                  onClick={() => {
                    handleUpdateEstado(selectedFactura.id_factura, 'pagada');
                    handleCloseDetail();
                  }}
                  className="btn btn-success flex-1"
                >
                  Marcar como Pagada
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Facturas;