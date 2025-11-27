import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Wrench, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateShort } from '../utils/formatters';

const MisVehiculos = () => {
  const { usuario } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [ordenesMap, setOrdenesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  useEffect(() => {
    fetchMisVehiculos();
    fetchMisOrdenes();
  }, [usuario?.id_cliente]);

  const fetchMisVehiculos = async () => {
    try {
      // Obtener vehículos del cliente autenticado
      const response = await api.get(`/api/clientes/${usuario?.id_cliente}/vehiculos`);
      setVehiculos(response.data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
    }
  };

  const fetchMisOrdenes = async () => {
    try {
      // Obtener todas las órdenes del cliente
      const response = await api.get('/api/ordenes');
      
      // Crear un mapa de órdenes por vehículo
      const mapa = {};
      response.data.forEach(orden => {
        if (!mapa[orden.id_vehiculo]) {
          mapa[orden.id_vehiculo] = [];
        }
        mapa[orden.id_vehiculo].push(orden);
      });
      
      setOrdenesMap(mapa);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      diagnostico: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      reparando: 'bg-blue-100 text-blue-800 border-blue-300',
      finalizado: 'bg-green-100 text-green-800 border-green-300',
      entregado: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'diagnostico':
        return <AlertCircle className="w-4 h-4" />;
      case 'reparando':
        return <Wrench className="w-4 h-4" />;
      case 'finalizado':
        return <CheckCircle className="w-4 h-4" />;
      case 'entregado':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelado':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      diagnostico: 'En Diagnóstico',
      reparando: 'Reparando',
      finalizado: 'Finalizado - Listo para recoger',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return labels[estado] || estado;
  };

  if (loading) {
    return <LoadingSpinner message="Cargando mis vehículos..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Vehículos</h1>
        <p className="text-gray-600 mt-1">
          Visualiza tu flota de vehículos y el estado de sus reparaciones
        </p>
      </div>

      {/* Vehículos Grid */}
      {vehiculos.length === 0 ? (
        <div className="card text-center py-12">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No tienes vehículos registrados</p>
          <p className="text-sm text-gray-400 mt-2">
            Contacta con el taller para registrar tus vehículos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehiculos.map((vehiculo) => {
            const ordenes = ordenesMap[vehiculo.id_vehiculo] || [];
            const ordenesActivas = ordenes.filter(
              o => !['entregado', 'cancelado'].includes(o.estado)
            );
            const ultimaOrden = ordenes[0];

            return (
              <div
                key={vehiculo.id_vehiculo}
                className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedVehiculo(selectedVehiculo?.id_vehiculo === vehiculo.id_vehiculo ? null : vehiculo)}
              >
                {/* Header del vehículo */}
                <div className="bg-primary-50 p-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {vehiculo.placa}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del vehículo */}
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Color</p>
                      <p className="text-sm font-medium text-gray-900">
                        {vehiculo.color}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Placa</p>
                      <p className="text-sm font-medium text-gray-900">
                        {vehiculo.placa}
                      </p>
                    </div>
                  </div>

                  {/* Estado de órdenes */}
                  <div className="pt-2 border-t border-gray-200">
                    {ordenesActivas.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                          Estado de Reparación
                        </p>
                        {ultimaOrden && (
                          <div className={`p-2 rounded-lg border flex items-center gap-2 ${getEstadoColor(ultimaOrden.estado)}`}>
                            {getEstadoIcon(ultimaOrden.estado)}
                            <span className="text-sm font-medium">
                              {getEstadoLabel(ultimaOrden.estado)}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Orden #{ultimaOrden?.id_orden || '-'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-sm text-gray-600">
                          No hay reparaciones en proceso
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Botón para expandir */}
                  {ordenes.length > 0 && (
                    <button
                      onClick={() => setSelectedVehiculo(selectedVehiculo?.id_vehiculo === vehiculo.id_vehiculo ? null : vehiculo)}
                      className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2 mt-2"
                    >
                      {selectedVehiculo?.id_vehiculo === vehiculo.id_vehiculo
                        ? 'Ver menos órdenes'
                        : `Ver todas las órdenes (${ordenes.length})`}
                    </button>
                  )}
                </div>

                {/* Expandir órdenes */}
                {selectedVehiculo?.id_vehiculo === vehiculo.id_vehiculo && ordenes.length > 0 && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">Historial de Órdenes</h4>
                    {ordenes.map((orden) => (
                      <div key={orden.id_orden} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-600">
                            Orden #{orden.id_orden}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getEstadoColor(orden.estado)}`}>
                            {getEstadoLabel(orden.estado)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          {orden.diagnostico && (
                            <p>
                              <span className="font-medium">Diagnóstico:</span> {orden.diagnostico}
                            </p>
                          )}
                          <p>
                            <span className="font-medium">Fecha Creación:</span>{' '}
                            {formatDateShort(orden.fecha_creacion)}
                          </p>
                          {orden.fecha_estimada && (
                            <p>
                              <span className="font-medium">Fecha Estimada:</span>{' '}
                              {formatDateShort(orden.fecha_estimada)}
                            </p>
                          )}
                          {orden.fecha_finalizacion && (
                            <p>
                              <span className="font-medium">Fecha Finalización:</span>{' '}
                              {formatDateShort(orden.fecha_finalizacion)}
                            </p>
                          )}
                          {orden.observaciones && (
                            <p>
                              <span className="font-medium">Observaciones:</span>{' '}
                              {orden.observaciones}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Información adicional */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Estados de Reparación</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                <span className="font-medium">En Diagnóstico:</span> Tu vehículo está siendo evaluado
              </li>
              <li>
                <span className="font-medium">Reparando:</span> Se están realizando las reparaciones
              </li>
              <li>
                <span className="font-medium">Finalizado - Listo para recoger:</span> Tu vehículo está listo, puedes venir a recogerlo
              </li>
              <li>
                <span className="font-medium">Entregado:</span> Ya has recogido tu vehículo
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisVehiculos;
