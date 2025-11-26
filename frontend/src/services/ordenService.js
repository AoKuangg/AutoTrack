import api from './api';

const ordenService = {
  // Obtener todas las órdenes
  getAll: async () => {
    try {
      const response = await api.get('/api/ordenes');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener órdenes' };
    }
  },

  // Obtener una orden por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/ordenes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener orden' };
    }
  },

  // Crear orden
  create: async (ordenData) => {
    try {
      const response = await api.post('/api/ordenes', ordenData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear orden' };
    }
  },

  // Actualizar orden
  update: async (id, ordenData) => {
    try {
      const response = await api.put(`/api/ordenes/${id}`, ordenData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar orden' };
    }
  },

  // Actualizar estado de orden
  updateEstado: async (id, estado, observaciones = '') => {
    try {
      const response = await api.patch(`/api/ordenes/${id}/estado`, {
        estado,
        observaciones
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar estado' };
    }
  },

  // Agregar repuesto a orden
  addRepuesto: async (id, repuestoData) => {
    try {
      const response = await api.post(`/api/ordenes/${id}/repuestos`, repuestoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al agregar repuesto' };
    }
  },

  // Quitar repuesto de orden
  removeRepuesto: async (idOrden, idUso) => {
    try {
      const response = await api.delete(`/api/ordenes/${idOrden}/repuestos/${idUso}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al quitar repuesto' };
    }
  }
};

export default ordenService;