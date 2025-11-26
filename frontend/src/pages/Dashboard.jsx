import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Car, Wrench, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const { usuario, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/estadisticas');
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
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

      {/* Accesos rápidos */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/ordenes"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
          >
            <Wrench className="w-8 h-8 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
              Nueva Orden
            </h3>
            <p className="text-sm text-gray-600">
              Crear orden de servicio
            </p>
          </a>

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
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Orden #{item} actualizada
                </p>
                <p className="text-xs text-gray-600">
                  Estado cambiado a "En reparación"
                </p>
              </div>
              <span className="text-xs text-gray-500">
                Hace {item}h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;