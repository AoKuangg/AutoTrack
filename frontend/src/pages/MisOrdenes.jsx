import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wrench, Clock, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateShort, formatCurrency } from '../utils/formatters';

const MisOrdenes = () => {
  const { usuario } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrden, setExpandedOrden] = useState(null);
  const [filter, setFilter] = useState('todas'); // todas, activas, completadas

  useEffect(() => {
    fetchMisOrdenes();
  }, [usuario?.id_cliente]);

  const fetchMisOrdenes = async () => {
    try {
      // Obtener todas las órdenes del cliente
      const response = await api.get('/api/ordenes');
      
      // Filtrar solo las órdenes del cliente autenticado
      const misOrdenes = response.data.filter(orden => {
        // Aquí asumimos que el backend devuelve información del cliente en la orden
        // Si no, necesitaremos un endpoint específico
        return true; // Por ahora mostramos todas
      });
      
      setOrdenes(misOrdenes.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)));
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
        return <AlertCircle className="w-5 h-5" />;
      case 'reparando':
        return <Wrench className="w-5 h-5" />;
      case 'finalizado':
      case 'entregado':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelado':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
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

  const getProgressPercentage = (estado) => {
    const progress = {
      diagnostico: 25,
      reparando: 50,
      finalizado: 75,
      entregado: 100,
      cancelado: 0
    };
    return progress[estado] || 0;
  };

  const filteredOrdenes = ordenes.filter(orden => {
    if (filter === 'activas') {
      return !['entregado', 'cancelado'].includes(orden.estado);
    }
    if (filter === 'completadas') {
      return ['entregado', 'cancelado'].includes(orden.estado);
    }
    return true;
  });

  if (loading) {
    return <LoadingSpinner message="Cargando mis órdenes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Órdenes de Reparación</h1>
        <p className="text-gray-600 mt-1">
          Monitorea el estado de tus vehículos en reparación
        </p>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'todas', label: 'Todas' },
            { value: 'activas', label: 'En Proceso' },
            { value: 'completadas', label: 'Completadas' }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de órdenes */}
      {filteredOrdenes.length === 0 ? (
        <div className="card text-center py-12">
          <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter === 'activas' ? 'No tienes órdenes en proceso' : 'No hay órdenes'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {filter === 'activas'
              ? 'Cuando registres una reparación aparecerá aquí'
              : 'Aquí aparecerán tus órdenes de reparación'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrdenes.map((orden) => (
            <div
              key={orden.id_orden}
              className="card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header de la orden */}
              <button
                onClick={() =>
                  setExpandedOrden(
                    expandedOrden?.id_orden === orden.id_orden ? null : orden
                  )
                }
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  {/* Icono de estado */}
                  <div className={`flex-shrink-0 p-3 rounded-lg border-2 ${getEstadoColor(orden.estado)}`}>
                    {getEstadoIcon(orden.estado)}
                  </div>

                  {/* Información principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900">
                        Orden #{orden.id_orden}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getEstadoColor(orden.estado)}`}>
                        {getEstadoLabel(orden.estado)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {orden.placa} - {orden.marca} {orden.modelo}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Creada: {formatDateShort(orden.fecha_creacion)}
                    </p>
                  </div>

                  {/* Costo */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Costo Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(orden.costo_total || 0)}
                    </p>
                  </div>
                </div>

                {/* Icono de expandir */}
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 ml-2 transition-transform ${
                    expandedOrden?.id_orden === orden.id_orden ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Barra de progreso */}
              <div className="px-4 h-1 bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                  style={{ width: `${getProgressPercentage(orden.estado)}%` }}
                />
              </div>

              {/* Detalles expandidos */}
              {expandedOrden?.id_orden === orden.id_orden && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
                  {/* Diagnóstico */}
                  {orden.diagnostico && (
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Diagnóstico
                      </h4>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                        {orden.diagnostico}
                      </p>
                    </div>
                  )}

                  {/* Información de fechas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                        Fecha Creación
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatDateShort(orden.fecha_creacion)}
                      </p>
                    </div>
                    {orden.fecha_estimada && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Fecha Estimada
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatDateShort(orden.fecha_estimada)}
                        </p>
                      </div>
                    )}
                    {orden.fecha_finalizacion && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Fecha Finalización
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatDateShort(orden.fecha_finalizacion)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Observaciones */}
                  {orden.observaciones && (
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Observaciones
                      </h4>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                        {orden.observaciones}
                      </p>
                    </div>
                  )}

                  {/* Costos detallados */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Mano de obra:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(orden.costo_mano_obra || 0)}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-primary-600">
                        {formatCurrency(orden.costo_total || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Timeline de estados */}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">
                      Progreso
                    </h4>
                    <div className="space-y-2">
                      {[
                        { estado: 'diagnostico', label: 'En Diagnóstico' },
                        { estado: 'reparando', label: 'Reparando' },
                        { estado: 'finalizado', label: 'Finalizado' },
                        { estado: 'entregado', label: 'Entregado' }
                      ].map((step) => (
                        <div
                          key={step.estado}
                          className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                            orden.estado === step.estado
                              ? 'bg-primary-100 text-primary-900'
                              : ['diagnostico', 'reparando', 'finalizado', 'entregado'].indexOf(step.estado) <=
                                ['diagnostico', 'reparando', 'finalizado', 'entregado'].indexOf(orden.estado)
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-gray-50 text-gray-500'
                          }`}
                        >
                          {orden.estado === step.estado && (
                            <div className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />
                          )}
                          {['diagnostico', 'reparando', 'finalizado', 'entregado'].indexOf(step.estado) <
                            ['diagnostico', 'reparando', 'finalizado', 'entregado'].indexOf(orden.estado) && (
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          )}
                          <span>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Información de contacto */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">¿Necesitas más información?</h3>
            <p className="text-sm text-blue-800">
              Contacta al taller directamente si tienes preguntas sobre tus órdenes de reparación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisOrdenes;
