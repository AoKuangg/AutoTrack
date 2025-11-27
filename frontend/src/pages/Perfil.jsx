import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Key, Save } from 'lucide-react';
import authService from '../services/authService';
import { formatDate, getInitials } from '../utils/formatters';
import { ROLES_LABELS, ROLES_COLORS } from '../utils/constants';

const Perfil = () => {
  const { usuario } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    passwordActual: '',
    passwordNueva: '',
    confirmarPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (passwordForm.passwordNueva.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordForm.passwordNueva !== passwordForm.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setSubmitting(true);

    try {
      await authService.changePassword(
        passwordForm.passwordActual,
        passwordForm.passwordNueva
      );
      setSuccess('Contraseña actualizada exitosamente');
      setPasswordForm({
        passwordActual: '',
        passwordNueva: '',
        confirmarPassword: ''
      });
      setTimeout(() => {
        setShowChangePassword(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError(error.error || 'Error al cambiar contraseña');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">Gestiona tu información personal y configuración</p>
      </div>

      {/* Card de Información Personal */}
      <div className="card">
        <div className="flex items-start gap-6 mb-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-white">
              {getInitials(usuario?.nombre)}
            </span>
          </div>

          {/* Info básica */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {usuario?.nombre}
            </h2>
            <span className={`badge ${ROLES_COLORS[usuario?.rol]} mb-4`}>
              {ROLES_LABELS[usuario?.rol]}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Correo Electrónico</p>
                  <p className="font-medium text-gray-900">{usuario?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Shield className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Rol en el Sistema</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {ROLES_LABELS[usuario?.rol]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <User className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">ID de Usuario</p>
                  <p className="font-medium text-gray-900">#{usuario?.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Miembro desde</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(new Date())}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seguridad - Cambiar Contraseña */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Seguridad
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Gestiona tu contraseña y configuración de seguridad
            </p>
          </div>
          {!showChangePassword && (
            <button
              onClick={() => setShowChangePassword(true)}
              className="btn btn-primary btn-sm"
            >
              Cambiar Contraseña
            </button>
          )}
        </div>

        {showChangePassword && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                  {success}
                </div>
              )}

              <div>
                <label className="label">Contraseña Actual *</label>
                <input
                  type="password"
                  name="passwordActual"
                  value={passwordForm.passwordActual}
                  onChange={handlePasswordChange}
                  className="input"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div>
                <label className="label">Nueva Contraseña *</label>
                <input
                  type="password"
                  name="passwordNueva"
                  value={passwordForm.passwordNueva}
                  onChange={handlePasswordChange}
                  className="input"
                  placeholder="••••••••"
                  required
                  minLength="6"
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              <div>
                <label className="label">Confirmar Nueva Contraseña *</label>
                <input
                  type="password"
                  name="confirmarPassword"
                  value={passwordForm.confirmarPassword}
                  onChange={handlePasswordChange}
                  className="input"
                  placeholder="••••••••"
                  required
                  minLength="6"
                  autoComplete="new-password"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordForm({
                      passwordActual: '',
                      passwordNueva: '',
                      confirmarPassword: ''
                    });
                    setError('');
                  }}
                  className="btn btn-secondary flex-1"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  <Save className="w-4 h-4" />
                  {submitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Información del Sistema */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Información del Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Versión del Sistema</p>
            <p className="font-medium">AutoTrackPro v1.0.0</p>
          </div>
          <div>
            <p className="text-gray-600">Última Sesión</p>
            <p className="font-medium">Ahora</p>
          </div>
        </div>
      </div>

      {/* Permisos según rol */}
      <div className="card bg-primary-50 border-primary-200">
        <h3 className="text-lg font-bold text-primary-900 mb-3">
          Permisos de tu Rol: {ROLES_LABELS[usuario?.rol]}
        </h3>
        <div className="space-y-2 text-sm text-primary-800">
          {usuario?.rol === 'administrador' && (
            <>
              <p>✅ Acceso total al sistema</p>
              <p>✅ Gestionar usuarios, clientes, vehículos y órdenes</p>
              <p>✅ Ver estadísticas y reportes</p>
              <p>✅ Generar facturas</p>
              <p>✅ Gestionar inventario de repuestos</p>
            </>
          )}
          {usuario?.rol === 'mecanico' && (
            <>
              <p>✅ Gestionar clientes y vehículos</p>
              <p>✅ Crear y actualizar órdenes de servicio</p>
              <p>✅ Agregar repuestos a órdenes</p>
              <p>✅ Ver inventario de repuestos</p>
              <p>❌ No puede gestionar usuarios</p>
              <p>❌ No puede generar facturas</p>
            </>
          )}
          {usuario?.rol === 'cliente' && (
            <>
              <p>✅ Ver sus propios vehículos</p>
              <p>✅ Ver el estado de sus órdenes</p>
              <p>✅ Ver sus facturas</p>
              <p>❌ No puede crear órdenes (lo hace el taller)</p>
              <p>❌ No puede ver datos de otros clientes</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;