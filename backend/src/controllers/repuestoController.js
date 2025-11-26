import pool from '../config/database.js';

// Obtener todos los repuestos activos
export const getRepuestos = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM repuesto WHERE activo = true ORDER BY nombre'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un repuesto por ID
export const getRepuestoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM repuesto WHERE id_repuesto = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Repuesto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener repuestos con stock bajo
export const getRepuestosBajoStock = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM repuesto WHERE stock_actual <= stock_minimo AND activo = true ORDER BY stock_actual'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear repuesto
export const createRepuesto = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, marca, precio_unitario, stock_actual, stock_minimo, unidad_medida } = req.body;
    
    // Validaciones
    if (!codigo || !nombre || !precio_unitario) {
      return res.status(400).json({ 
        error: 'Código, nombre y precio unitario son obligatorios' 
      });
    }

    if (precio_unitario <= 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
    }
    
    const result = await pool.query(
      `INSERT INTO repuesto 
       (codigo, nombre, descripcion, marca, precio_unitario, stock_actual, stock_minimo, unidad_medida) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        codigo, 
        nombre, 
        descripcion || '', 
        marca || '', 
        precio_unitario, 
        stock_actual || 0, 
        stock_minimo || 5,
        unidad_medida || 'unidad'
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'El código ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Actualizar repuesto
export const updateRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, marca, precio_unitario, stock_actual, stock_minimo, unidad_medida } = req.body;
    
    // Validaciones
    if (precio_unitario && precio_unitario <= 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
    }
    
    const result = await pool.query(
      `UPDATE repuesto 
       SET codigo = $1, nombre = $2, descripcion = $3, marca = $4, 
           precio_unitario = $5, stock_actual = $6, stock_minimo = $7, unidad_medida = $8 
       WHERE id_repuesto = $9 
       RETURNING *`,
      [codigo, nombre, descripcion, marca, precio_unitario, stock_actual, stock_minimo, unidad_medida, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Repuesto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El código ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Actualizar stock de repuesto
export const updateStockRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_actual } = req.body;
    
    if (stock_actual < 0) {
      return res.status(400).json({ error: 'El stock no puede ser negativo' });
    }
    
    const result = await pool.query(
      'UPDATE repuesto SET stock_actual = $1 WHERE id_repuesto = $2 RETURNING *',
      [stock_actual, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Repuesto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar repuesto (soft delete)
export const deleteRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE repuesto SET activo = false WHERE id_repuesto = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Repuesto no encontrado' });
    }
    
    res.json({ message: 'Repuesto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};