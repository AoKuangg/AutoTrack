import api from './api';

const clienteService = {
  // Obtener todos los clientes
  getAll: async () => {
    try {
      const response = await api.get('/api/clientes');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener clientes' };
    }
  },

  // Obtener un cliente por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/clientes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener cliente' };
    }
  },

  // Crear cliente
  create: async (clienteData) => {
    try {
      const response = await api.post('/api/clientes', clienteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear cliente' };
    }
  },

  // Actualizar cliente
  update: async (id, clienteData) => {
    try {
      const response = await api.put(`/api/clientes/${id}`, clienteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar cliente' };
    }
  },

  // Eliminar cliente
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/clientes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al eliminar cliente' };
    }
  }
};

export default clienteService;