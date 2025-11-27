import api from './api';

const facturaService = {
  // Obtener todas las facturas
  getAll: async () => {
    try {
      const response = await api.get('/api/facturas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener facturas' };
    }
  },

  // Obtener factura por orden
  getByOrden: async (idOrden) => {
    try {
      const response = await api.get(`/api/ordenes/${idOrden}/factura`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener factura' };
    }
  },

  // Crear factura
  create: async (facturaData) => {
    try {
      const response = await api.post('/api/facturas', facturaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear factura' };
    }
  },

  // Actualizar estado de factura
  updateEstado: async (id, estado) => {
    try {
      const response = await api.patch(`/api/facturas/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar estado' };
    }
  }
};

export default facturaService;