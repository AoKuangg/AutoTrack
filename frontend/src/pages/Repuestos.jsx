import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Package, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import repuestoService from '../services/repuestoService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, formatDateShort } from '../utils/formatters';

const Repuestos = () => {
  const { isAdmin } = useAuth();
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRepuesto, setEditingRepuesto] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    marca: '',
    precio_unitario: '',
    stock_actual: 0,
    stock_minimo: 5,
    unidad_medida: 'unidad'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const fetchRepuestos = async () => {
    try {
      const data = await repuestoService.getAll();
      setRepuestos(data);
    } catch (error) {
      console.error('Error al cargar repuestos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (repuesto = null) => {
    if (repuesto) {
      setEditingRepuesto(repuesto);
      setFormData({
        codigo: repuesto.codigo,
        nombre: repuesto.nombre,
        descripcion: repuesto.descripcion || '',
        marca: repuesto.marca || '',
        precio_unitario: repuesto.precio_unitario,
        stock_actual: repuesto.stock_actual,
        stock_minimo: repuesto.stock_minimo,
        unidad_medida: repuesto.unidad_medida || 'unidad'
      });
    } else {
      setEditingRepuesto(null);
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        marca: '',
        precio_unitario: '',
        stock_actual: 0,
        stock_minimo: 5,
        unidad_medida: 'unidad'
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRepuesto(null);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['precio_unitario', 'stock_actual', 'stock_minimo'].includes(name)
        ? parseFloat(value) || 0
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingRepuesto) {
        await repuestoService.update(editingRepuesto.id_repuesto, formData);
      } else {
        await repuestoService.create(formData);
      }
      fetchRepuestos();
      handleCloseModal();
    } catch (error) {
      setError(error.error || 'Error al guardar repuesto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este repuesto?')) return;

    try {
      await repuestoService.delete(id);
      fetchRepuestos();
    } catch (error) {
      alert(error.error || 'Error al eliminar repuesto');
    }
  };

  const filteredRepuestos = repuestos.filter(repuesto =>
    repuesto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const repuestosBajoStock = repuestos.filter(r => r.stock_actual <= r.stock_minimo);

  if (loading) {
    return <LoadingSpinner message="Cargando repuestos..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Repuestos</h1>
          <p className="text-gray-600 mt-1">Gestiona el inventario de repuestos</p>
        </div>
        {isAdmin() && (
          <button
            onClick={() => handleOpenModal()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Repuesto
          </button>
        )}
      </div>

      {/* Alerta de stock bajo */}
      {repuestosBajoStock.length > 0 && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                Alerta de Stock Bajo
              </h3>
              <p className="text-sm text-yellow-800">
                Hay {repuestosBajoStock.length} repuesto(s) con stock bajo o agotado
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Búsqueda */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por código, nombre o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Tabla de repuestos */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                {isAdmin() && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRepuestos.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin() ? "7" : "6"} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No se encontraron repuestos' : 'No hay repuestos registrados'}
                  </td>
                </tr>
              ) : (
                filteredRepuestos.map((repuesto) => {
                  const stockBajo = repuesto.stock_actual <= repuesto.stock_minimo;
                  return (
                    <tr key={repuesto.id_repuesto} className={stockBajo ? 'bg-yellow-50' : ''}>
                      <td className="font-medium">{repuesto.codigo}</td>
                      <td>
                        <div>
                          <div className="font-medium">{repuesto.nombre}</div>
                          {repuesto.descripcion && (
                            <div className="text-xs text-gray-500">{repuesto.descripcion}</div>
                          )}
                        </div>
                      </td>
                      <td className="text-gray-600">{repuesto.marca || '-'}</td>
                      <td className="font-medium">{formatCurrency(repuesto.precio_unitario)}</td>
                      <td>
                        <div className="text-sm">
                          <div className={stockBajo ? 'text-red-600 font-semibold' : 'font-medium'}>
                            {repuesto.stock_actual} {repuesto.unidad_medida}
                          </div>
                          <div className="text-xs text-gray-500">
                            Mín: {repuesto.stock_minimo}
                          </div>
                        </div>
                      </td>
                      <td>
                        {stockBajo ? (
                          <span className="badge badge-warning">Stock Bajo</span>
                        ) : (
                          <span className="badge badge-success">Disponible</span>
                        )}
                      </td>
                      {isAdmin() && (
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenModal(repuesto)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(repuesto.id_repuesto)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingRepuesto ? 'Editar Repuesto' : 'Nuevo Repuesto'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Código *</label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    className="input uppercase"
                    placeholder="REP001"
                    required
                    disabled={editingRepuesto}
                  />
                </div>

                <div>
                  <label className="label">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="input"
                    placeholder="Filtro de aceite"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="input"
                    rows="2"
                    placeholder="Descripción detallada del repuesto"
                  />
                </div>

                <div>
                  <label className="label">Marca</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="input"
                    placeholder="Bosch"
                  />
                </div>

                <div>
                  <label className="label">Precio Unitario *</label>
                  <input
                    type="number"
                    name="precio_unitario"
                    value={formData.precio_unitario}
                    onChange={handleChange}
                    className="input"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="label">Stock Actual *</label>
                  <input
                    type="number"
                    name="stock_actual"
                    value={formData.stock_actual}
                    onChange={handleChange}
                    className="input"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="label">Stock Mínimo *</label>
                  <input
                    type="number"
                    name="stock_minimo"
                    value={formData.stock_minimo}
                    onChange={handleChange}
                    className="input"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="label">Unidad de Medida</label>
                  <select
                    name="unidad_medida"
                    value={formData.unidad_medida}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="unidad">Unidad</option>
                    <option value="litro">Litro</option>
                    <option value="galon">Galón</option>
                    <option value="juego">Juego</option>
                    <option value="paquete">Paquete</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
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
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repuestos;