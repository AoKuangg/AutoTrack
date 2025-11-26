import api from './api';

const repuestoService = {
  // Obtener todos los repuestos
  getAll: async () => {
    try {
      const response = await api.get('/api/repuestos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener repuestos' };
    }
  },

  // Obtener un repuesto por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/repuestos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener repuesto' };
    }
  },

  // Obtener repuestos con stock bajo
  getBajoStock: async () => {
    try {
      const response = await api.get('/api/repuestos/bajo-stock');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener repuestos con stock bajo' };
    }
  },

  // Crear repuesto
  create: async (repuestoData) => {
    try {
      const response = await api.post('/api/repuestos', repuestoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear repuesto' };
    }
  },

  // Actualizar repuesto
  update: async (id, repuestoData) => {
    try {
      const response = await api.put(`/api/repuestos/${id}`, repuestoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar repuesto' };
    }
  },

  // Actualizar solo el stock
  updateStock: async (id, stock_actual) => {
    try {
      const response = await api.patch(`/api/repuestos/${id}/stock`, { stock_actual });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar stock' };
    }
  },

  // Eliminar repuesto
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/repuestos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al eliminar repuesto' };
    }
  }
};

export default repuestoService;