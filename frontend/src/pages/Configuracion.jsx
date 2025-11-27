import { useState } from 'react';
import { Settings, Bell, Shield, Database, Info, Save } from 'lucide-react';

const Configuracion = () => {
  const [notificaciones, setNotificaciones] = useState({
    email: true,
    estadoOrdenes: true,
    repuestosBajoStock: true,
    facturas: false
  });

  const [preferencias, setPreferencias] = useState({
    idioma: 'es',
    moneda: 'COP',
    formatoFecha: 'DD/MM/YYYY',
    horaInicio: '08:00',
    horaFin: '18:00'
  });

  const [saved, setSaved] = useState(false);

  const handleNotificacionChange = (key) => {
    setNotificaciones({
      ...notificaciones,
      [key]: !notificaciones[key]
    });
  };

  const handlePreferenciaChange = (e) => {
    setPreferencias({
      ...preferencias,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Aquí guardarías en localStorage o enviarías al backend
    localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
    localStorage.setItem('preferencias', JSON.stringify(preferencias));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-8 h-8" />
          Configuración
        </h1>
        <p className="text-gray-600 mt-1">
          Personaliza tu experiencia en AutoTrackPro
        </p>
      </div>

      {/* Mensaje de guardado */}
      {saved && (
        <div className="card bg-green-50 border-green-200 animate-fadeIn">
          <p className="text-green-800 font-medium">
            ✅ Configuración guardada exitosamente
          </p>
        </div>
      )}

      {/* Notificaciones */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notificaciones</h2>
            <p className="text-sm text-gray-600">
              Configura qué notificaciones deseas recibir
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Notificaciones por Email</p>
              <p className="text-sm text-gray-600">Recibir notificaciones en tu correo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificaciones.email}
                onChange={() => handleNotificacionChange('email')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Cambios de Estado en Órdenes</p>
              <p className="text-sm text-gray-600">
                Notificar cuando cambie el estado de una orden
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificaciones.estadoOrdenes}
                onChange={() => handleNotificacionChange('estadoOrdenes')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Alerta de Repuestos Bajo Stock</p>
              <p className="text-sm text-gray-600">
                Notificar cuando el inventario esté bajo
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificaciones.repuestosBajoStock}
                onChange={() => handleNotificacionChange('repuestosBajoStock')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Facturas Generadas</p>
              <p className="text-sm text-gray-600">
                Notificar cuando se genere una nueva factura
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificaciones.facturas}
                onChange={() => handleNotificacionChange('facturas')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preferencias */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Preferencias del Sistema</h2>
            <p className="text-sm text-gray-600">
              Ajusta cómo funciona el sistema
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Idioma</label>
            <select
              name="idioma"
              value={preferencias.idioma}
              onChange={handlePreferenciaChange}
              className="input"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="label">Moneda</label>
            <select
              name="moneda"
              value={preferencias.moneda}
              onChange={handlePreferenciaChange}
              className="input"
            >
              <option value="COP">Peso Colombiano (COP)</option>
              <option value="USD">Dólar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>

          <div>
            <label className="label">Formato de Fecha</label>
            <select
              name="formatoFecha"
              value={preferencias.formatoFecha}
              onChange={handlePreferenciaChange}
              className="input"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="label">Zona Horaria</label>
            <select className="input" disabled>
              <option>América/Bogotá (GMT-5)</option>
            </select>
          </div>

          <div>
            <label className="label">Horario de Inicio</label>
            <input
              type="time"
              name="horaInicio"
              value={preferencias.horaInicio}
              onChange={handlePreferenciaChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Horario de Cierre</label>
            <input
              type="time"
              name="horaFin"
              value={preferencias.horaFin}
              onChange={handlePreferenciaChange}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Seguridad y Privacidad</h2>
            <p className="text-sm text-gray-600">
              Configuración de seguridad del sistema
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Sesión Activa</p>
              <p className="text-sm text-gray-600">Duración: 24 horas</p>
            </div>
            <span className="badge badge-success">Activa</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Autenticación de Dos Factores</p>
              <p className="text-sm text-gray-600">
                Mayor seguridad para tu cuenta
              </p>
            </div>
            <button className="btn btn-sm btn-secondary" disabled>
              Próximamente
            </button>
          </div>
        </div>
      </div>

      {/* Información del Sistema */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Información del Sistema</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Versión</p>
            <p className="font-medium">AutoTrackPro v1.0.0</p>
          </div>
          <div>
            <p className="text-gray-600">Base de Datos</p>
            <p className="font-medium">PostgreSQL 14</p>
          </div>
          <div>
            <p className="text-gray-600">Último Backup</p>
            <p className="font-medium">No disponible</p>
          </div>
          <div>
            <p className="text-gray-600">Estado del Servidor</p>
            <p className="font-medium text-green-600">● En línea</p>
          </div>
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default Configuracion;