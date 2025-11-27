import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Car as CarIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import vehiculoService from '../services/vehiculoService';
import clienteService from '../services/clienteService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateShort } from '../utils/formatters';
import { TIPOS_VEHICULO } from '../utils/constants';

const Vehiculos = () => {
  const { isAdmin } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    color: '',
    tipo_vehiculo: '',
    kilometraje: 0,
    id_cliente: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vehiculosData, clientesData] = await Promise.all([
        vehiculoService.getAll(),
        clienteService.getAll()
      ]);
      setVehiculos(vehiculosData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (vehiculo = null) => {
    if (vehiculo) {
      setEditingVehiculo(vehiculo);
      setFormData({
        placa: vehiculo.placa,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        anio: vehiculo.anio,
        color: vehiculo.color || '',
        tipo_vehiculo: vehiculo.tipo_vehiculo || '',
        kilometraje: vehiculo.kilometraje || 0,
        id_cliente: vehiculo.id_cliente
      });
    } else {
      setEditingVehiculo(null);
      setFormData({
        placa: '',
        marca: '',
        modelo: '',
        anio: new Date().getFullYear(),
        color: '',
        tipo_vehiculo: '',
        kilometraje: 0,
        id_cliente: ''
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehiculo(null);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'anio' || name === 'kilometraje' || name === 'id_cliente' 
        ? parseInt(value) || 0 
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingVehiculo) {
        await vehiculoService.update(editingVehiculo.id_vehiculo, formData);
      } else {
        await vehiculoService.create(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      setError(error.error || 'Error al guardar vehículo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;

    try {
      await vehiculoService.delete(id);
      fetchData();
    } catch (error) {
      alert(error.error || 'Error al eliminar vehículo');
    }
  };

  const filteredVehiculos = vehiculos.filter(vehiculo =>
    vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Cargando vehículos..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-gray-600 mt-1">Gestiona los vehículos registrados</p>
        </div>
        {isAdmin() && (
          <button
            onClick={() => handleOpenModal()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Vehículo
          </button>
        )}
      </div>

      {/* Búsqueda */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por placa, marca, modelo o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Grid de vehículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehiculos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <CarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'No se encontraron vehículos' : 'No hay vehículos registrados'}
            </p>
          </div>
        ) : (
          filteredVehiculos.map((vehiculo) => (
            <div key={vehiculo.id_vehiculo} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <CarIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{vehiculo.placa}</h3>
                    <p className="text-sm text-gray-600">{vehiculo.marca} {vehiculo.modelo}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Año:</span>
                  <span className="font-medium">{vehiculo.anio}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-medium">{vehiculo.color || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium capitalize">{vehiculo.tipo_vehiculo || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kilometraje:</span>
                  <span className="font-medium">{vehiculo.kilometraje?.toLocaleString()} km</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">Cliente:</p>
                  <p className="font-medium">{vehiculo.cliente_nombre}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {isAdmin() && (
                  <>
                    <button
                      onClick={() => handleOpenModal(vehiculo)}
                      className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(vehiculo.id_vehiculo)}
                      className="btn btn-danger flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
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
                  <label className="label">Placa *</label>
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    className="input uppercase"
                    placeholder="ABC123"
                    required
                    disabled={editingVehiculo}
                  />
                </div>

                <div>
                  <label className="label">Cliente *</label>
                  <select
                    name="id_cliente"
                    value={formData.id_cliente}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id_cliente} value={cliente.id_cliente}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Marca *</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="input"
                    placeholder="Toyota"
                    required
                  />
                </div>

                <div>
                  <label className="label">Modelo *</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="input"
                    placeholder="Corolla"
                    required
                  />
                </div>

                <div>
                  <label className="label">Año *</label>
                  <input
                    type="number"
                    name="anio"
                    value={formData.anio}
                    onChange={handleChange}
                    className="input"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div>
                  <label className="label">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="input"
                    placeholder="Blanco"
                  />
                </div>

                <div>
                  <label className="label">Tipo de Vehículo</label>
                  <select
                    name="tipo_vehiculo"
                    value={formData.tipo_vehiculo}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Seleccionar tipo</option>
                    {TIPOS_VEHICULO.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Kilometraje</label>
                  <input
                    type="number"
                    name="kilometraje"
                    value={formData.kilometraje}
                    onChange={handleChange}
                    className="input"
                    min="0"
                    placeholder="0"
                  />
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

export default Vehiculos;