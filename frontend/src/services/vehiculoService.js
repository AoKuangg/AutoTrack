import api from './api';

const vehiculoService = {
  // Obtener todos los vehículos
  getAll: async () => {
    try {
      const response = await api.get('/api/vehiculos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener vehículos' };
    }
  },

  // Obtener un vehículo por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/vehiculos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener vehículo' };
    }
  },

  // Obtener vehículos de un cliente
  getByCliente: async (idCliente) => {
    try {
      const response = await api.get(`/api/clientes/${idCliente}/vehiculos`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener vehículos del cliente' };
    }
  },

  // Crear vehículo
  create: async (vehiculoData) => {
    try {
      const response = await api.post('/api/vehiculos', vehiculoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear vehículo' };
    }
  },

  // Actualizar vehículo
  update: async (id, vehiculoData) => {
    try {
      const response = await api.put(`/api/vehiculos/${id}`, vehiculoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar vehículo' };
    }
  },

  // Eliminar vehículo
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/vehiculos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al eliminar vehículo' };
    }
  }
};

export default vehiculoService;