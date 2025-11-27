import pool from "../config/database.js";

// Obtener todas las órdenes
export const getOrdenes = async (req, res) => {
  try {
    let query = `
      SELECT o.*, v.placa, v.marca, v.modelo, 
             c.nombre as cliente_nombre, c.telefono as cliente_telefono, c.id_cliente
      FROM orden_servicio o
      JOIN vehiculo v ON o.id_vehiculo = v.id_vehiculo
      JOIN cliente c ON v.id_cliente = c.id_cliente
    `;

    const values = [];

    // Si es cliente, solo mostrar sus órdenes
    if (req.usuario.rol === "cliente") {
      query += ` WHERE c.id_cliente = $1`;
      values.push(req.usuario.id_cliente);
    }

    query += ` ORDER BY o.id_orden DESC`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una orden por ID con detalles completos
export const getOrdenById = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener orden con datos del vehículo y cliente
    const result = await pool.query(
      `
      SELECT o.*, v.placa, v.marca, v.modelo, v.anio, v.color,
             c.nombre as cliente_nombre, c.telefono as cliente_telefono, 
             c.correo as cliente_correo, c.direccion as cliente_direccion
      FROM orden_servicio o
      JOIN vehiculo v ON o.id_vehiculo = v.id_vehiculo
      JOIN cliente c ON v.id_cliente = c.id_cliente
      WHERE o.id_orden = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Obtener repuestos usados en esta orden
    const repuestos = await pool.query(
      `
      SELECT ur.*, r.nombre, r.codigo, r.marca
      FROM uso_repuesto ur
      JOIN repuesto r ON ur.id_repuesto = r.id_repuesto
      WHERE ur.id_orden = $1
    `,
      [id]
    );

    res.json({
      ...result.rows[0],
      repuestos: repuestos.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear orden de servicio
export const createOrden = async (req, res) => {
  try {
    const {
      id_vehiculo,
      diagnostico,
      costo_mano_obra,
      estado,
      fecha_estimada,
      observaciones,
    } = req.body;

    // Validaciones
    if (!id_vehiculo) {
      return res.status(400).json({ error: "El vehículo es obligatorio" });
    }

    const result = await pool.query(
      `INSERT INTO orden_servicio 
       (id_vehiculo, diagnostico, costo_mano_obra, estado, fecha_estimada, observaciones, costo_total) 
       VALUES ($1, $2, $3, $4, $5, $6, $3) 
       RETURNING *`,
      [
        id_vehiculo,
        diagnostico || "",
        costo_mano_obra || 0,
        estado || "diagnostico",
        fecha_estimada || null,
        observaciones || "",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23503") {
      // Foreign key violation
      return res.status(400).json({ error: "Vehículo no encontrado" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Actualizar orden completa
export const updateOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnostico, costo_mano_obra, observaciones, fecha_estimada } =
      req.body;

    const result = await pool.query(
      `UPDATE orden_servicio 
       SET diagnostico = $1, costo_mano_obra = $2, observaciones = $3, fecha_estimada = $4
       WHERE id_orden = $5 
       RETURNING *`,
      [diagnostico, costo_mano_obra, observaciones, fecha_estimada, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar estado de la orden
export const updateEstadoOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body;

    // Validar estado
    const estadosValidos = [
      "diagnostico",
      "reparando",
      "finalizado",
      "entregado",
      "cancelado",
    ];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error:
          "Estado inválido. Debe ser: diagnostico, reparando, finalizado, entregado o cancelado",
      });
    }

    const updates = ["estado = $1"];
    const values = [estado, id];
    let paramCount = 2;

    if (observaciones) {
      updates.push(`observaciones = $${++paramCount}`);
      values.splice(1, 0, observaciones);
    }

    if (estado === "finalizado") {
      updates.push("fecha_finalizacion = CURRENT_TIMESTAMP");
    }

    const result = await pool.query(
      `UPDATE orden_servicio SET ${updates.join(", ")} WHERE id_orden = $${
        values.length
      } RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar repuesto a una orden
export const addRepuestoOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_repuesto, cantidad } = req.body;

    // Validaciones
    if (!id_repuesto || !cantidad || cantidad <= 0) {
      return res.status(400).json({
        error: "Repuesto y cantidad válida son obligatorios",
      });
    }

    // Obtener precio del repuesto y verificar stock
    const repuesto = await pool.query(
      "SELECT precio_unitario, stock_actual FROM repuesto WHERE id_repuesto = $1",
      [id_repuesto]
    );

    if (repuesto.rows.length === 0) {
      return res.status(404).json({ error: "Repuesto no encontrado" });
    }

    if (repuesto.rows[0].stock_actual < cantidad) {
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${repuesto.rows[0].stock_actual}`,
      });
    }

    const precio = repuesto.rows[0].precio_unitario;
    const subtotal = precio * cantidad;

    // Insertar uso de repuesto
    await pool.query(
      "INSERT INTO uso_repuesto (id_orden, id_repuesto, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)",
      [id, id_repuesto, cantidad, precio, subtotal]
    );

    // Actualizar stock del repuesto
    await pool.query(
      "UPDATE repuesto SET stock_actual = stock_actual - $1 WHERE id_repuesto = $2",
      [cantidad, id_repuesto]
    );

    // Recalcular costo total de la orden
    const total = await pool.query(
      `
      SELECT COALESCE(SUM(subtotal), 0) as total_repuestos, costo_mano_obra 
      FROM uso_repuesto 
      JOIN orden_servicio ON uso_repuesto.id_orden = orden_servicio.id_orden
      WHERE uso_repuesto.id_orden = $1
      GROUP BY costo_mano_obra
    `,
      [id]
    );

    const costoTotal =
      parseFloat(total.rows[0].total_repuestos) +
      parseFloat(total.rows[0].costo_mano_obra);

    await pool.query(
      "UPDATE orden_servicio SET costo_total = $1 WHERE id_orden = $2",
      [costoTotal, id]
    );

    res.json({
      message: "Repuesto agregado exitosamente",
      costo_total: costoTotal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar repuesto de una orden
export const removeRepuestoOrden = async (req, res) => {
  try {
    const { id, idUso } = req.params;

    // Obtener información del repuesto antes de eliminarlo
    const uso = await pool.query(
      "SELECT id_repuesto, cantidad FROM uso_repuesto WHERE id_uso = $1 AND id_orden = $2",
      [idUso, id]
    );

    if (uso.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Repuesto no encontrado en esta orden" });
    }

    // Devolver el stock
    await pool.query(
      "UPDATE repuesto SET stock_actual = stock_actual + $1 WHERE id_repuesto = $2",
      [uso.rows[0].cantidad, uso.rows[0].id_repuesto]
    );

    // Eliminar uso de repuesto
    await pool.query("DELETE FROM uso_repuesto WHERE id_uso = $1", [idUso]);

    // Recalcular costo total
    const total = await pool.query(
      `
      SELECT COALESCE(SUM(subtotal), 0) as total_repuestos, costo_mano_obra 
      FROM uso_repuesto 
      JOIN orden_servicio ON uso_repuesto.id_orden = orden_servicio.id_orden
      WHERE uso_repuesto.id_orden = $1
      GROUP BY costo_mano_obra
    `,
      [id]
    );

    let costoTotal = 0;
    if (total.rows.length > 0) {
      costoTotal =
        parseFloat(total.rows[0].total_repuestos) +
        parseFloat(total.rows[0].costo_mano_obra);
    } else {
      const orden = await pool.query(
        "SELECT costo_mano_obra FROM orden_servicio WHERE id_orden = $1",
        [id]
      );
      costoTotal = parseFloat(orden.rows[0].costo_mano_obra);
    }

    await pool.query(
      "UPDATE orden_servicio SET costo_total = $1 WHERE id_orden = $2",
      [costoTotal, id]
    );

    res.json({
      message: "Repuesto eliminado exitosamente",
      costo_total: costoTotal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
