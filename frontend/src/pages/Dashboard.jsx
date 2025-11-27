import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Car, Wrench, DollarSign, TrendingUp, Clock, CheckCircle, Package, UserCog } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, formatDateShort } from '../utils/formatters';

const Dashboard = () => {
  const { usuario, isAdmin, isMecanicoOrAdmin, isMecanico, isCliente } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrdenes, setRecentOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentOrdenes();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/estadisticas');
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const fetchRecentOrdenes = async () => {
    try {
      const response = await api.get('/api/ordenes');
      // Obtener las 5 órdenes más recientes
      const recent = response.data
        .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
        .slice(0, 5);
      setRecentOrdenes(recent);
    } catch (error) {
      console.error('Error al cargar órdenes recientes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular "hace cuánto tiempo"
  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return formatDateShort(date);
  };

  const getEstadoColor = (estado) => {
    const colors = {
      diagnostico: 'text-yellow-600',
      reparando: 'text-blue-600',
      finalizado: 'text-green-600',
      entregado: 'text-gray-600',
      cancelado: 'text-red-600'
    };
    return colors[estado] || 'text-gray-600';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      diagnostico: 'Diagnóstico',
      reparando: 'Reparando',
      finalizado: 'Finalizado',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return labels[estado] || estado;
  };

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  // Stats cards para Admin
  const adminStats = [
    {
      title: 'Total Clientes',
      value: stats?.total_clientes || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Órdenes',
      value: stats?.total_ordenes || 0,
      icon: Wrench,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Órdenes Activas',
      value: stats?.ordenes_activas || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(stats?.ingresos_mes || 0),
      icon: DollarSign,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Bienvenido, {usuario?.nombre}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Aquí tienes un resumen de la actividad del taller
        </p>
      </div>

      {/* Stats Grid - Solo para Admin */}
      {isAdmin() && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgLight} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Accesos rápidos - DIFERENTES SEGÚN ROL */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Accesos Rápidos
        </h2>
        
        {/* ADMIN */}
        {isAdmin() && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/clientes"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <Users className="w-8 h-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Gestionar Clientes
              </h3>
              <p className="text-sm text-gray-600">
                Ver y administrar clientes
              </p>
            </a>

            <a
              href="/vehiculos"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <Car className="w-8 h-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Vehículos
              </h3>
              <p className="text-sm text-gray-600">
                Registrar y consultar vehículos
              </p>
            </a>

            <a
              href="/ordenes"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <Wrench className="w-8 h-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Órdenes
              </h3>
              <p className="text-sm text-gray-600">
                Ver y crear órdenes de servicio
              </p>
            </a>

            <a
              href="/repuestos"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <TrendingUp className="w-8 h-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Repuestos
              </h3>
              <p className="text-sm text-gray-600">
                Gestionar inventario de repuestos
              </p>
            </a>

            <a
              href="/facturas"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <DollarSign className="w-8 h-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Facturas
              </h3>
              <p className="text-sm text-gray-600">
                Generar y administrar facturas
              </p>
            </a>

            <a
              href="/usuarios"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <UserCog className="w-8 h-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Usuarios
              </h3>
              <p className="text-sm text-gray-600">
                Gestionar usuarios del sistema
              </p>
            </a>
          </div>
        )}

        {/* MECANICO */}
        {isMecanico() && !isAdmin() && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/ordenes"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <Wrench className="w-8 h-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Órdenes
              </h3>
              <p className="text-sm text-gray-600">
                Ver y actualizar órdenes de servicio
              </p>
            </a>

            <a
              href="/repuestos"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <Package className="w-8 h-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Repuestos
              </h3>
              <p className="text-sm text-gray-600">
                Ver inventario de repuestos
              </p>
            </a>
          </div>
        )}

        {/* CLIENTE */}
        {isCliente() && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/mis-vehiculos"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <Car className="w-8 h-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Mis Vehículos
              </h3>
              <p className="text-sm text-gray-600">
                Ver mi flota de vehículos
              </p>
            </a>

            <a
              href="/mis-ordenes"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <Wrench className="w-8 h-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Mis Órdenes
              </h3>
              <p className="text-sm text-gray-600">
                Ver estado de mis reparaciones
              </p>
            </a>
          </div>
        )}
      </div>

      {/* Actividad reciente */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-3">
          {recentOrdenes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
          ) : (
            recentOrdenes.map((orden) => (
              <div
                key={orden.id_orden}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/ordenes`}
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Orden #{orden.id_orden} - {orden.placa}
                  </p>
                  <p className={`text-xs ${getEstadoColor(orden.estado)}`}>
                    Estado: {getEstadoLabel(orden.estado)}
                  </p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {getTimeAgo(orden.fecha_creacion)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;