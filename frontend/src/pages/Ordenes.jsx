import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit2, Package, FileText } from 'lucide-react';
import ordenService from '../services/ordenService';
import vehiculoService from '../services/vehiculoService';
import repuestoService from '../services/repuestoService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, formatDateShort, formatDateTime } from '../utils/formatters';
import { ESTADOS_ORDEN, ESTADOS_LABELS, ESTADOS_COLORS } from '../utils/constants';

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [formData, setFormData] = useState({
    id_vehiculo: '',
    diagnostico: '',
    costo_mano_obra: 0,
    estado: 'diagnostico',
    observaciones: '',
    fecha_estimada: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordenesData, vehiculosData, repuestosData] = await Promise.all([
        ordenService.getAll(),
        vehiculoService.getAll(),
        repuestoService.getAll()
      ]);
      setOrdenes(ordenesData);
      setVehiculos(vehiculosData);
      setRepuestos(repuestosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormData({
      id_vehiculo: '',
      diagnostico: '',
      costo_mano_obra: 0,
      estado: 'diagnostico',
      observaciones: '',
      fecha_estimada: ''
    });
    setError('');
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setError('');
  };

  const handleOpenDetailModal = async (orden) => {
    try {
      const detalleOrden = await ordenService.getById(orden.id_orden);
      setSelectedOrden(detalleOrden);
      setShowDetailModal(true);
    } catch (error) {
      alert('Error al cargar detalles de la orden');
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrden(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'costo_mano_obra' || name === 'id_vehiculo' 
        ? parseFloat(value) || 0 
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await ordenService.create(formData);
      fetchData();
      handleCloseCreateModal();
    } catch (error) {
      setError(error.error || 'Error al crear orden');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEstado = async (idOrden, nuevoEstado) => {
    const observaciones = prompt('Observaciones (opcional):');
    if (observaciones === null) return; // Canceló

    try {
      await ordenService.updateEstado(idOrden, nuevoEstado, observaciones);
      fetchData();
      if (selectedOrden) {
        handleOpenDetailModal({ id_orden: idOrden });
      }
    } catch (error) {
      alert(error.error || 'Error al actualizar estado');
    }
  };

  const handleAddRepuesto = async (idOrden) => {
    // Aquí podríamos abrir un modal más complejo, pero por ahora usamos prompts
    const repuestoId = prompt('ID del repuesto a agregar:');
    if (!repuestoId) return;

    const cantidad = prompt('Cantidad:', '1');
    if (!cantidad) return;

    try {
      await ordenService.addRepuesto(idOrden, {
        id_repuesto: parseInt(repuestoId),
        cantidad: parseInt(cantidad)
      });
      fetchData();
      handleOpenDetailModal({ id_orden: idOrden });
    } catch (error) {
      alert(error.error || 'Error al agregar repuesto');
    }
  };

  const filteredOrdenes = ordenes.filter(orden => {
    const matchSearch = 
      orden.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.id_orden.toString().includes(searchTerm);
    
    const matchEstado = !filterEstado || orden.estado === filterEstado;

    return matchSearch && matchEstado;
  });

  if (loading) {
    return <LoadingSpinner message="Cargando órdenes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Órdenes de Servicio</h1>
          <p className="text-gray-600 mt-1">Gestiona las órdenes de reparación</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Orden
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por orden, placa o cliente..."
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
            {Object.entries(ESTADOS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrdenes.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || filterEstado ? 'No se encontraron órdenes' : 'No hay órdenes registradas'}
            </p>
          </div>
        ) : (
          filteredOrdenes.map((orden) => (
            <div key={orden.id_orden} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      Orden #{orden.id_orden}
                    </h3>
                    <span className={`badge ${ESTADOS_COLORS[orden.estado]}`}>
                      {ESTADOS_LABELS[orden.estado]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Vehículo: </span>
                      <span className="font-medium">{orden.placa} - {orden.marca} {orden.modelo}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cliente: </span>
                      <span className="font-medium">{orden.cliente_nombre}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ingreso: </span>
                      <span className="font-medium">{formatDateShort(orden.fecha_ingreso)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Costo Total: </span>
                      <span className="font-bold text-primary-600">{formatCurrency(orden.costo_total)}</span>
                    </div>
                  </div>

                  {orden.diagnostico && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      <strong>Diagnóstico:</strong> {orden.diagnostico}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenDetailModal(orden)}
                    className="btn btn-secondary btn-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </button>

                  {orden.estado !== 'finalizado' && orden.estado !== 'entregado' && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleUpdateEstado(orden.id_orden, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="input input-sm text-sm"
                      defaultValue=""
                    >
                      <option value="">Cambiar estado</option>
                      {Object.entries(ESTADOS_LABELS)
                        .filter(([key]) => key !== orden.estado)
                        .map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Crear Orden */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nueva Orden de Servicio</h2>
              <button onClick={handleCloseCreateModal} className="p-2 hover:bg-gray-100 rounded-lg">
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Vehículo *</label>
                <select
                  name="id_vehiculo"
                  value={formData.id_vehiculo}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Seleccionar vehículo</option>
                  {vehiculos.map(vehiculo => (
                    <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                      {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo} ({vehiculo.cliente_nombre})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Diagnóstico</label>
                <textarea
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleChange}
                  className="input"
                  rows="3"
                  placeholder="Descripción del problema..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Costo Mano de Obra</label>
                  <input
                    type="number"
                    name="costo_mano_obra"
                    value={formData.costo_mano_obra}
                    onChange={handleChange}
                    className="input"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="label">Fecha Estimada</label>
                  <input
                    type="date"
                    name="fecha_estimada"
                    value={formData.fecha_estimada}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  className="input"
                  rows="2"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="btn btn-secondary flex-1"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Creando...' : 'Crear Orden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle Orden */}
      {showDetailModal && selectedOrden && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Orden #{selectedOrden.id_orden}</h2>
                <span className={`badge ${ESTADOS_COLORS[selectedOrden.estado]} mt-2`}>
                  {ESTADOS_LABELS[selectedOrden.estado]}
                </span>
              </div>
              <button onClick={handleCloseDetailModal} className="p-2 hover:bg-gray-100 rounded-lg">
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Info del Vehículo */}
              <div className="card">
                <h3 className="font-bold text-lg mb-3">Información del Vehículo</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Placa:</strong> {selectedOrden.placa}</div>
                  <div><strong>Vehículo:</strong> {selectedOrden.marca} {selectedOrden.modelo} ({selectedOrden.anio})</div>
                  <div><strong>Color:</strong> {selectedOrden.color}</div>
                </div>
              </div>

              {/* Info del Cliente */}
              <div className="card">
                <h3 className="font-bold text-lg mb-3">Información del Cliente</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Nombre:</strong> {selectedOrden.cliente_nombre}</div>
                  <div><strong>Teléfono:</strong> {selectedOrden.cliente_telefono}</div>
                  <div><strong>Correo:</strong> {selectedOrden.cliente_correo}</div>
                </div>
              </div>
            </div>

            {/* Diagnóstico */}
            <div className="card mb-6">
              <h3 className="font-bold text-lg mb-3">Diagnóstico</h3>
              <p className="text-gray-700">{selectedOrden.diagnostico || 'Sin diagnóstico'}</p>
            </div>

            {/* Repuestos */}
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">Repuestos Utilizados</h3>
                <button
                  onClick={() => handleAddRepuesto(selectedOrden.id_orden)}
                  className="btn btn-sm btn-primary flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Agregar
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th>P. Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrden.repuestos?.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-gray-500">
                          No hay repuestos registrados
                        </td>
                      </tr>
                    ) : (
                      selectedOrden.repuestos?.map(rep => (
                        <tr key={rep.id_uso}>
                          <td>{rep.codigo}</td>
                          <td>{rep.nombre}</td>
                          <td>{rep.cantidad}</td>
                          <td>{formatCurrency(rep.precio_unitario)}</td>
                          <td className="font-medium">{formatCurrency(rep.subtotal)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumen de Costos */}
            <div className="card bg-gray-50">
              <h3 className="font-bold text-lg mb-3">Resumen de Costos</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Mano de Obra:</span>
                  <span className="font-medium">{formatCurrency(selectedOrden.costo_mano_obra)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Repuestos:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      selectedOrden.repuestos?.reduce((sum, r) => sum + parseFloat(r.subtotal), 0) || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-600 pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedOrden.costo_total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ordenes;