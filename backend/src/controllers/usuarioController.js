import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

// Obtener todos los usuarios (solo Admin)
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_usuario, nombre, email, rol, fecha_registro, activo FROM usuario ORDER BY id_usuario DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id_usuario, nombre, email, rol, fecha_registro, activo FROM usuario WHERE id_usuario = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear usuario (solo Admin)
export const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validaciones
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ 
        error: 'Nombre, email, contraseña y rol son obligatorios' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    const rolesValidos = ['administrador', 'mecanico', 'cliente'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ 
        error: 'Rol inválido. Debe ser: administrador, mecanico o cliente' 
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const result = await pool.query(
      'INSERT INTO usuario (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario, nombre, email, rol, fecha_registro',
      [nombre, email, hashedPassword, rol]
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario (solo Admin)
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    const rolesValidos = ['administrador', 'mecanico', 'cliente'];
    if (rol && !rolesValidos.includes(rol)) {
      return res.status(400).json({ 
        error: 'Rol inválido. Debe ser: administrador, mecanico o cliente' 
      });
    }

    const result = await pool.query(
      'UPDATE usuario SET nombre = $1, email = $2, rol = $3 WHERE id_usuario = $4 RETURNING id_usuario, nombre, email, rol',
      [nombre, email, rol, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario actualizado exitosamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Resetear contraseña de un usuario (solo Admin)
export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevaPassword } = req.body;

    if (!nuevaPassword || nuevaPassword.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    const result = await pool.query(
      'UPDATE usuario SET password = $1 WHERE id_usuario = $2 RETURNING id_usuario',
      [hashedPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Contraseña reseteada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Desactivar usuario (soft delete - solo Admin)
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir que un admin se elimine a sí mismo
    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({ 
        error: 'No puedes desactivar tu propia cuenta' 
      });
    }

    const result = await pool.query(
      'UPDATE usuario SET activo = false WHERE id_usuario = $1 RETURNING id_usuario',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario desactivado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reactivar usuario (solo Admin)
export const activateUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE usuario SET activo = true WHERE id_usuario = $1 RETURNING id_usuario',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario reactivado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};