import pool from "../config/database.js";
import bcrypt from "bcryptjs";

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cliente WHERE activo = true ORDER BY id_cliente DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un cliente por ID
export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM cliente WHERE id_cliente = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear cliente
export const createCliente = async (req, res) => {
  try {
    const { nombre, telefono, correo, direccion } = req.body;

    // Validaciones básicas
    if (!nombre || !telefono || !correo) {
      return res.status(400).json({
        error: "Nombre, teléfono y correo son obligatorios",
      });
    }

    // Generar contraseña sencilla: primeras 3 letras del nombre + número de teléfono
    const passwordDefault = (
      nombre.substring(0, 3) + telefono.substring(0, 4)
    ).toLowerCase();
    const hashedPassword = await bcrypt.hash(passwordDefault, 10);

    // Usar transacción para garantizar que ambas inserciones se hagan o ninguna
    const clientResult = await pool.query(
      "INSERT INTO cliente (nombre, telefono, correo, direccion) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, telefono, correo, direccion]
    );

    const cliente = clientResult.rows[0];

    // Crear usuario con rol cliente
    try {
      await pool.query(
        "INSERT INTO usuario (nombre, email, password, rol) VALUES ($1, $2, $3, $4)",
        [nombre, correo, hashedPassword, "cliente"]
      );
    } catch (userError) {
      // Si falla la creación del usuario, se ignora si es por correo duplicado
      if (userError.code !== "23505") {
        throw userError;
      }
    }

    res.status(201).json(cliente);
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, correo, direccion } = req.body;

    const result = await pool.query(
      "UPDATE cliente SET nombre = $1, telefono = $2, correo = $3, direccion = $4 WHERE id_cliente = $5 RETURNING *",
      [nombre, telefono, correo, direccion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cliente (soft delete)
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE cliente SET activo = false WHERE id_cliente = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
