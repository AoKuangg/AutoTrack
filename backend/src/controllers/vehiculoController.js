import pool from '../config/database.js';

// Obtener todos los vehículos con información del cliente
export const getVehiculos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono
      FROM vehiculo v
      JOIN cliente c ON v.id_cliente = c.id_cliente
      ORDER BY v.id_vehiculo DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un vehículo por ID
export const getVehiculoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT v.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono, c.correo as cliente_correo
      FROM vehiculo v
      JOIN cliente c ON v.id_cliente = c.id_cliente
      WHERE v.id_vehiculo = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener vehículos de un cliente específico
export const getVehiculosByCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM vehiculo WHERE id_cliente = $1',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear vehículo
export const createVehiculo = async (req, res) => {
  try {
    const { placa, marca, modelo, anio, color, tipo_vehiculo, kilometraje, id_cliente } = req.body;
    
    // Validaciones básicas
    if (!placa || !marca || !modelo || !anio || !id_cliente) {
      return res.status(400).json({ 
        error: 'Placa, marca, modelo, año y cliente son obligatorios' 
      });
    }
    
    const result = await pool.query(
      'INSERT INTO vehiculo (placa, marca, modelo, anio, color, tipo_vehiculo, kilometraje, id_cliente) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [placa, marca, modelo, anio, color, tipo_vehiculo, kilometraje || 0, id_cliente]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'La placa ya está registrada' });
    }
    if (error.code === '23503') { // Foreign key violation
      return res.status(400).json({ error: 'Cliente no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Actualizar vehículo
export const updateVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, marca, modelo, anio, color, tipo_vehiculo, kilometraje } = req.body;
    
    const result = await pool.query(
      'UPDATE vehiculo SET placa = $1, marca = $2, modelo = $3, anio = $4, color = $5, tipo_vehiculo = $6, kilometraje = $7 WHERE id_vehiculo = $8 RETURNING *',
      [placa, marca, modelo, anio, color, tipo_vehiculo, kilometraje, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'La placa ya está registrada' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Eliminar vehículo
export const deleteVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM vehiculo WHERE id_vehiculo = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    
    res.json({ message: 'Vehículo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};