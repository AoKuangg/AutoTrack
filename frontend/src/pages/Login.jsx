import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error capturado en handleSubmit:', err);
      setError(err.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Función para login rápido (solo para desarrollo)
  const quickLogin = async (email, password) => {
    setFormData({ email, password });
    setError('');
    setLoading(true);
        
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error en quick login:', err);
      setError(err.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Car className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AutoTrackPro</h1>
          <p className="text-primary-100">Sistema de Gestión de Taller Automotriz</p>
        </div>

        {/* Formulario */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">
                <Mail className="w-4 h-4 inline mr-2" />
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="ejemplo@email.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="label">
                <Lock className="w-4 h-4 inline mr-2" />
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Login rápido para desarrollo */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Acceso rápido (Demo):</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin@autotrackpro.com', 'admin123')}
                className="btn btn-sm bg-purple-100 text-purple-700 hover:bg-purple-200"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('cmendez@taller.com', 'mecanico123')}
                className="btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                Mecánico
              </button>
              <button
                onClick={() => quickLogin('jperez@email.com', 'cliente123')}
                className="btn btn-sm bg-green-100 text-green-700 hover:bg-green-200"
              >
                Cliente
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-primary-100 mt-6 text-sm">
          AutoTrackPro © 2025 - Proyecto Final UTS
        </p>
      </div>
    </div>
  );
};

export default Login;