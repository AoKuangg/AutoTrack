import api from './api';

const usuarioService = {
  // Obtener todos los usuarios (solo Admin)
  getAll: async () => {
    try {
      const response = await api.get('/api/usuarios');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener usuarios' };
    }
  },

  // Obtener un usuario por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener usuario' };
    }
  },

  // Crear usuario (solo Admin)
  create: async (usuarioData) => {
    try {
      const response = await api.post('/api/usuarios', usuarioData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear usuario' };
    }
  },

  // Actualizar usuario (solo Admin)
  update: async (id, usuarioData) => {
    try {
      const response = await api.put(`/api/usuarios/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar usuario' };
    }
  },

  // Resetear contraseña (solo Admin)
  resetPassword: async (id, nuevaPassword) => {
    try {
      const response = await api.post(`/api/usuarios/${id}/reset-password`, {
        nuevaPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al resetear contraseña' };
    }
  },

  // Desactivar usuario (solo Admin)
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al desactivar usuario' };
    }
  },

  // Reactivar usuario (solo Admin)
  activate: async (id) => {
    try {
      const response = await api.patch(`/api/usuarios/${id}/activate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al reactivar usuario' };
    }
  }
};

export default usuarioService;