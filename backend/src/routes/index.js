import express from "express";

// Importar controllers
import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controllers/clienteController.js";

import {
  getVehiculos,
  getVehiculoById,
  getVehiculosByCliente,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
} from "../controllers/vehiculoController.js";

import {
  getOrdenes,
  getOrdenById,
  createOrden,
  updateOrden,
  updateEstadoOrden,
  addRepuestoOrden,
  removeRepuestoOrden,
} from "../controllers/ordenController.js";

import {
  getRepuestos,
  getRepuestoById,
  getRepuestosBajoStock,
  createRepuesto,
  updateRepuesto,
  updateStockRepuesto,
  deleteRepuesto,
} from "../controllers/repuestoController.js";

import {
  createFactura,
  getFacturaByOrden,
  getFacturas,
  updateEstadoFactura,
} from "../controllers/facturaController.js";

import {
  login,
  getProfile,
  changePassword,
} from "../controllers/authController.js";

import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  resetPassword,
  deleteUsuario,
  activateUsuario,
} from "../controllers/usuarioController.js";

// Importar middlewares
import {
  authenticateToken,
  isAdmin,
  isMecanicoOrAdmin,
} from "../middlewares/auth.js";

import pool from "../config/database.js";

const router = express.Router();

// ==================== AUTENTICACIÓN (Públicas) ====================
router.post("/auth/login", login);

// ==================== PERFIL (Requiere autenticación) ====================
router.get("/auth/profile", authenticateToken, getProfile);
router.post("/auth/change-password", authenticateToken, changePassword);

// ==================== USUARIOS (Solo Admin) ====================
router.get("/usuarios", authenticateToken, isAdmin, getUsuarios);
router.get("/usuarios/:id", authenticateToken, isAdmin, getUsuarioById);
router.post("/usuarios", authenticateToken, isAdmin, createUsuario);
router.put("/usuarios/:id", authenticateToken, isAdmin, updateUsuario);
router.post(
  "/usuarios/:id/reset-password",
  authenticateToken,
  isAdmin,
  resetPassword
);
router.delete("/usuarios/:id", authenticateToken, isAdmin, deleteUsuario);
router.patch(
  "/usuarios/:id/activate",
  authenticateToken,
  isAdmin,
  activateUsuario
);

// ==================== CLIENTES (Admin y Mecánico) ====================
router.get("/clientes", authenticateToken, isMecanicoOrAdmin, getClientes);
router.get(
  "/clientes/:id",
  authenticateToken,
  isMecanicoOrAdmin,
  getClienteById
);
router.post("/clientes", authenticateToken, isMecanicoOrAdmin, createCliente);
router.put(
  "/clientes/:id",
  authenticateToken,
  isMecanicoOrAdmin,
  updateCliente
);
router.delete("/clientes/:id", authenticateToken, isAdmin, deleteCliente);

// ==================== VEHÍCULOS (Admin, Mecánico y Cliente) ====================
router.get("/vehiculos", authenticateToken, isMecanicoOrAdmin, getVehiculos);
router.get(
  "/vehiculos/:id",
  authenticateToken,
  isMecanicoOrAdmin,
  getVehiculoById
);
router.get("/clientes/:id/vehiculos", authenticateToken, getVehiculosByCliente);
router.post("/vehiculos", authenticateToken, isMecanicoOrAdmin, createVehiculo);
router.put(
  "/vehiculos/:id",
  authenticateToken,
  isMecanicoOrAdmin,
  updateVehiculo
);
router.delete("/vehiculos/:id", authenticateToken, isAdmin, deleteVehiculo);

// ==================== ÓRDENES DE SERVICIO (Admin, Mecánico y Cliente) ====================
router.get("/ordenes", authenticateToken, getOrdenes);
router.get("/ordenes/:id", authenticateToken, getOrdenById);
router.post("/ordenes", authenticateToken, isMecanicoOrAdmin, createOrden);
router.put("/ordenes/:id", authenticateToken, isMecanicoOrAdmin, updateOrden);
router.patch(
  "/ordenes/:id/estado",
  authenticateToken,
  isMecanicoOrAdmin,
  updateEstadoOrden
);
router.post(
  "/ordenes/:id/repuestos",
  authenticateToken,
  isMecanicoOrAdmin,
  addRepuestoOrden
);
router.delete(
  "/ordenes/:id/repuestos/:idUso",
  authenticateToken,
  isMecanicoOrAdmin,
  removeRepuestoOrden
);

// ==================== REPUESTOS (Admin y Mecánico) ====================
router.get("/repuestos", authenticateToken, isMecanicoOrAdmin, getRepuestos);
router.get(
  "/repuestos/bajo-stock",
  authenticateToken,
  isMecanicoOrAdmin,
  getRepuestosBajoStock
);
router.get(
  "/repuestos/:id",
  authenticateToken,
  isMecanicoOrAdmin,
  getRepuestoById
);
router.post("/repuestos", authenticateToken, isAdmin, createRepuesto);
router.put("/repuestos/:id", authenticateToken, isAdmin, updateRepuesto);
router.patch(
  "/repuestos/:id/stock",
  authenticateToken,
  isAdmin,
  updateStockRepuesto
);
router.delete("/repuestos/:id", authenticateToken, isAdmin, deleteRepuesto);

// ==================== FACTURAS (Admin y Cliente) ====================
router.get("/facturas", authenticateToken, getFacturas);
router.post("/facturas", authenticateToken, isAdmin, createFactura);
router.get(
  "/ordenes/:id/factura",
  authenticateToken,
  isMecanicoOrAdmin,
  getFacturaByOrden
);
router.patch(
  "/facturas/:id/estado",
  authenticateToken,
  isAdmin,
  updateEstadoFactura
);

// ==================== ESTADÍSTICAS (Admin) ====================
router.get("/estadisticas", authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalClientes = await pool.query(
      "SELECT COUNT(*) as total FROM cliente WHERE activo = true"
    );
    const totalOrdenes = await pool.query(
      "SELECT COUNT(*) as total FROM orden_servicio"
    );
    const ordenesActivas = await pool.query(
      "SELECT COUNT(*) as total FROM orden_servicio WHERE estado IN ('diagnostico', 'reparando')"
    );
    const ingresosMes = await pool.query(`
      SELECT COALESCE(SUM(total), 0) as total 
      FROM factura 
      WHERE estado = 'pagada' 
      AND fecha_emision >= DATE_TRUNC('month', CURRENT_DATE)
    `);

    res.json({
      total_clientes: totalClientes.rows[0].total,
      total_ordenes: totalOrdenes.rows[0].total,
      ordenes_activas: ordenesActivas.rows[0].total,
      ingresos_mes: ingresosMes.rows[0].total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
