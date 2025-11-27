import pool from "../config/database.js";

// Generar factura para una orden
export const createFactura = async (req, res) => {
  try {
    const { id_orden, metodo_pago } = req.body;

    // Verificar si ya existe una factura para esta orden
    const existente = await pool.query(
      "SELECT * FROM factura WHERE id_orden = $1",
      [id_orden]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({ error: "Esta orden ya tiene una factura" });
    }

    // Obtener datos de la orden
    const orden = await pool.query(
      "SELECT costo_total FROM orden_servicio WHERE id_orden = $1",
      [id_orden]
    );

    if (orden.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    const subtotal = parseFloat(orden.rows[0].costo_total);
    const iva = subtotal * 0.19; // 19% IVA
    const total = subtotal + iva;

    const result = await pool.query(
      "INSERT INTO factura (id_orden, subtotal, iva, total, metodo_pago, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id_orden, subtotal, iva, total, metodo_pago, "pendiente"]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener factura por orden
export const getFacturaByOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM factura WHERE id_orden = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las facturas (filtrado por cliente si el usuario es cliente)
export const getFacturas = async (req, res) => {
  try {
    let query = `
      SELECT f.id_factura, f.id_orden, f.numero_factura, f.fecha_emision, 
             f.estado, f.metodo_pago, f.subtotal, f.iva, f.total,
             o.id_vehiculo, v.placa, v.marca, v.modelo, c.nombre as cliente_nombre, c.id_cliente,
             o.diagnostico, o.costo_mano_obra as monto_mano_obra,
             COALESCE(o.costo_total, 0) as subtotal_orden
      FROM factura f
      JOIN orden_servicio o ON f.id_orden = o.id_orden
      JOIN vehiculo v ON o.id_vehiculo = v.id_vehiculo
      JOIN cliente c ON v.id_cliente = c.id_cliente
    `;

    let params = [];

    // Si el usuario es cliente, filtrar por id_cliente
    if (req.usuario.rol === "cliente") {
      query += " WHERE c.id_cliente = $1 ";
      params.push(req.usuario.id_cliente);
    }

    query += " ORDER BY f.id_factura DESC ";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar estado de factura
export const updateEstadoFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const result = await pool.query(
      "UPDATE factura SET estado = $1 WHERE id_factura = $2 RETURNING *",
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
