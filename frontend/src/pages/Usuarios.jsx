import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Key, UserCheck } from 'lucide-react';
import usuarioService from '../services/usuarioService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../components/common/ToastContainer';
import { formatDateShort } from '../utils/formatters';
import { ROLES, ROLES_LABELS, ROLES_COLORS } from '../utils/constants';

const Usuarios = () => {
  const { success, error: showError } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showConfirmDeactivate, setShowConfirmDeactivate] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [resetUsuario, setResetUsuario] = useState(null);
  const [usuarioToDeactivate, setUsuarioToDeactivate] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'cliente'
  });
  const [resetPassword, setResetPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUsuario(usuario);
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        password: '', // No mostramos la contraseña
        rol: usuario.rol
      });
    } else {
      setEditingUsuario(null);
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'cliente'
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
    setError('');
  };

  const handleOpenResetModal = (usuario) => {
    setResetUsuario(usuario);
    setResetPassword('');
    setError('');
    setShowResetModal(true);
  };

  const handleCloseResetModal = () => {
    setShowResetModal(false);
    setResetUsuario(null);
    setResetPassword('');
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingUsuario) {
        // Al editar, no enviamos password si está vacío
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) {
          delete dataToUpdate.password;
        }
        await usuarioService.update(editingUsuario.id_usuario, dataToUpdate);
      } else {
        await usuarioService.create(formData);
      }
      fetchUsuarios();
      handleCloseModal();
    } catch (error) {
      setError(error.error || 'Error al guardar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await usuarioService.resetPassword(resetUsuario.id_usuario, resetPassword);
      success('✅ Contraseña reseteada exitosamente');
      handleCloseResetModal();
    } catch (error) {
      setError(error.error || 'Error al resetear contraseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (usuario) => {
    setUsuarioToDeactivate(usuario);
    setShowConfirmDeactivate(true);
  };

  const handleConfirmDeactivate = async () => {
    if (!usuarioToDeactivate) return;

    try {
      await usuarioService.delete(usuarioToDeactivate.id_usuario);
      success('✅ Usuario desactivado exitosamente');
      fetchUsuarios();
      setShowConfirmDeactivate(false);
      setUsuarioToDeactivate(null);
    } catch (error) {
      showError(error.error || 'Error al desactivar usuario');
    }
  };

  const handleActivate = async (id) => {
    try {
      await usuarioService.activate(id);
      success('✅ Usuario reactivado exitosamente');
      fetchUsuarios();
    } catch (error) {
      showError(error.error || 'Error al reactivar usuario');
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Cargando usuarios..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      {/* Búsqueda */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha Registro</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id_usuario} className={!usuario.activo ? 'opacity-50' : ''}>
                    <td className="font-medium">{usuario.nombre}</td>
                    <td className="text-gray-600">{usuario.email}</td>
                    <td>
                      <span className={`badge ${ROLES_COLORS[usuario.rol]}`}>
                        {ROLES_LABELS[usuario.rol]}
                      </span>
                    </td>
                    <td className="text-gray-600">
                      {formatDateShort(usuario.fecha_registro)}
                    </td>
                    <td>
                      {usuario.activo ? (
                        <span className="badge badge-success">Activo</span>
                      ) : (
                        <span className="badge badge-gray">Inactivo</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {usuario.activo ? (
                          <>
                            <button
                              onClick={() => handleOpenModal(usuario)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenResetModal(usuario)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Resetear contraseña"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(usuario)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Desactivar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleActivate(usuario.id_usuario)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Reactivar"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
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
              <div>
                <label className="label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  required
                  disabled={editingUsuario}
                />
              </div>

              <div>
                <label className="label">
                  Contraseña {!editingUsuario && '*'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder={editingUsuario ? 'Dejar vacío para no cambiar' : '••••••••'}
                  required={!editingUsuario}
                  minLength="6"
                />
                {!editingUsuario && (
                  <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                )}
              </div>

              <div>
                <label className="label">Rol *</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value={ROLES.ADMIN}>{ROLES_LABELS[ROLES.ADMIN]}</option>
                  <option value={ROLES.MECANICO}>{ROLES_LABELS[ROLES.MECANICO]}</option>
                  <option value={ROLES.CLIENTE}>{ROLES_LABELS[ROLES.CLIENTE]}</option>
                </select>
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

      {/* Modal Resetear Contraseña */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Resetear Contraseña</h2>
              <button
                onClick={handleCloseResetModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Resetear contraseña de: <strong>{resetUsuario?.nombre}</strong>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="label">Nueva Contraseña *</label>
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseResetModal}
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
                  {submitting ? 'Reseteando...' : 'Resetear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Desactivar */}
      {showConfirmDeactivate && usuarioToDeactivate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar desactivación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas desactivar al usuario <span className="font-bold">{usuarioToDeactivate.nombre}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmDeactivate(false);
                  setUsuarioToDeactivate(null);
                }}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeactivate}
                className="btn btn-danger"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;