import pool from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario por email
    const result = await pool.query(
      "SELECT * FROM usuario WHERE email = $1 AND activo = true",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const usuario = result.rows[0];

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Si es cliente, buscar el id_cliente asociado
    let id_cliente = null;
    if (usuario.rol === "cliente") {
      const clienteResult = await pool.query(
        "SELECT id_cliente FROM cliente WHERE correo = $1",
        [email]
      );
      if (clienteResult.rows.length > 0) {
        id_cliente = clienteResult.rows[0].id_cliente;
      }
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        id_cliente: id_cliente,
      },
      process.env.JWT_SECRET || "tu_secreto_super_seguro",
      { expiresIn: "24h" }
    );

    // Responder con token y datos del usuario (sin password)
    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        id_cliente: id_cliente,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    // req.usuario viene del middleware de autenticación
    const { id } = req.usuario;

    const result = await pool.query(
      "SELECT id_usuario, nombre, email, rol, fecha_registro FROM usuario WHERE id_usuario = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
  try {
    const { id } = req.usuario;
    const { passwordActual, passwordNueva } = req.body;

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({
        error: "Contraseña actual y nueva son obligatorias",
      });
    }

    if (passwordNueva.length < 6) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Obtener usuario
    const result = await pool.query(
      "SELECT password FROM usuario WHERE id_usuario = $1",
      [id]
    );

    const usuario = result.rows[0];

    // Verificar contraseña actual
    const passwordValido = await bcrypt.compare(
      passwordActual,
      usuario.password
    );

    if (!passwordValido) {
      return res.status(401).json({ error: "Contraseña actual incorrecta" });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(passwordNueva, 10);

    // Actualizar contraseña
    await pool.query("UPDATE usuario SET password = $1 WHERE id_usuario = $2", [
      hashedPassword,
      id,
    ]);

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
