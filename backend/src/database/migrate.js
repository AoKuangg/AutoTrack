import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

const createTables = async () => {
  try {
    console.log('🔄 Iniciando migración de base de datos...\n');

    // Tabla USUARIO
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        id_usuario SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(20) NOT NULL DEFAULT 'cliente',
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        activo BOOLEAN DEFAULT TRUE
      );
    `);
    console.log('✅ Tabla usuario creada');

    // Tabla CLIENTE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cliente (
        id_cliente SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        correo VARCHAR(100) UNIQUE NOT NULL,
        direccion VARCHAR(200),
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        activo BOOLEAN DEFAULT TRUE
      );
    `);
    console.log('✅ Tabla cliente creada');

    // Tabla VEHICULO
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehiculo (
        id_vehiculo SERIAL PRIMARY KEY,
        placa VARCHAR(20) UNIQUE NOT NULL,
        marca VARCHAR(50) NOT NULL,
        modelo VARCHAR(50) NOT NULL,
        anio INTEGER NOT NULL,
        color VARCHAR(30),
        tipo_vehiculo VARCHAR(30),
        kilometraje INTEGER DEFAULT 0,
        id_cliente INTEGER NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
      );
    `);
    console.log('✅ Tabla vehiculo creada');

    // Tabla REPUESTO
    await pool.query(`
      CREATE TABLE IF NOT EXISTS repuesto (
        id_repuesto SERIAL PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        marca VARCHAR(50),
        precio_unitario DECIMAL(10,2) NOT NULL,
        stock_actual INTEGER DEFAULT 0,
        stock_minimo INTEGER DEFAULT 5,
        unidad_medida VARCHAR(20) DEFAULT 'unidad',
        activo BOOLEAN DEFAULT TRUE,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla repuesto creada');

    // Tabla ORDEN_SERVICIO
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orden_servicio (
        id_orden SERIAL PRIMARY KEY,
        fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_estimada TIMESTAMP,
        fecha_finalizacion TIMESTAMP,
        estado VARCHAR(20) NOT NULL DEFAULT 'diagnostico',
        diagnostico TEXT,
        observaciones TEXT,
        costo_mano_obra DECIMAL(10,2) DEFAULT 0.00,
        costo_total DECIMAL(10,2) DEFAULT 0.00,
        id_vehiculo INTEGER NOT NULL,
        id_mecanico INTEGER,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo) ON DELETE CASCADE,
        FOREIGN KEY (id_mecanico) REFERENCES usuario(id_usuario) ON DELETE SET NULL
      );
    `);
    console.log('✅ Tabla orden_servicio creada');

    // Tabla USO_REPUESTO
    await pool.query(`
      CREATE TABLE IF NOT EXISTS uso_repuesto (
        id_uso SERIAL PRIMARY KEY,
        id_orden INTEGER NOT NULL,
        id_repuesto INTEGER NOT NULL,
        cantidad INTEGER NOT NULL DEFAULT 1,
        precio_unitario DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_orden) REFERENCES orden_servicio(id_orden) ON DELETE CASCADE,
        FOREIGN KEY (id_repuesto) REFERENCES repuesto(id_repuesto) ON DELETE CASCADE
      );
    `);
    console.log('✅ Tabla uso_repuesto creada');

    // Tabla FACTURA
    await pool.query(`
      CREATE TABLE IF NOT EXISTS factura (
        id_factura SERIAL PRIMARY KEY,
        id_orden INTEGER NOT NULL,
        fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        subtotal DECIMAL(10,2) NOT NULL,
        iva DECIMAL(10,2) DEFAULT 0.00,
        descuento DECIMAL(10,2) DEFAULT 0.00,
        total DECIMAL(10,2) NOT NULL,
        metodo_pago VARCHAR(50),
        estado VARCHAR(20) DEFAULT 'pendiente',
        observaciones TEXT,
        FOREIGN KEY (id_orden) REFERENCES orden_servicio(id_orden) ON DELETE CASCADE
      );
    `);
    console.log('✅ Tabla factura creada');

    // Tabla NOTIFICACION
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notificacion (
        id_notificacion SERIAL PRIMARY KEY,
        id_cliente INTEGER NOT NULL,
        id_orden INTEGER,
        tipo VARCHAR(50) NOT NULL,
        mensaje TEXT NOT NULL,
        fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        leida BOOLEAN DEFAULT FALSE,
        fecha_lectura TIMESTAMP,
        FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
        FOREIGN KEY (id_orden) REFERENCES orden_servicio(id_orden) ON DELETE CASCADE
      );
    `);
    console.log('✅ Tabla notificacion creada');

    // Crear índices
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_vehiculo_cliente ON vehiculo(id_cliente);
      CREATE INDEX IF NOT EXISTS idx_orden_vehiculo ON orden_servicio(id_vehiculo);
      CREATE INDEX IF NOT EXISTS idx_orden_estado ON orden_servicio(estado);
    `);
    console.log('✅ Índices creados');

    // Insertar datos de prueba
    console.log('\n📊 Insertando datos de prueba...');
    
    // Hash de contraseñas
    const adminPassword = await bcrypt.hash('admin123', 10);
    const mecanicoPassword = await bcrypt.hash('mecanico123', 10);
    const clientePassword = await bcrypt.hash('cliente123', 10);

    await pool.query(`
      INSERT INTO usuario (nombre, email, password, rol) 
      VALUES 
        ('Admin Sistema', 'admin@autotrackpro.com', $1, 'administrador'),
        ('Carlos Méndez', 'cmendez@taller.com', $2, 'mecanico'),
        ('Juan Pérez', 'jperez@email.com', $3, 'cliente')
      ON CONFLICT (email) DO NOTHING;
    `, [adminPassword, mecanicoPassword, clientePassword]);
    console.log('✅ Usuarios creados');
    console.log('   - Admin: admin@autotrackpro.com / admin123');
    console.log('   - Mecánico: cmendez@taller.com / mecanico123');
    console.log('   - Cliente: jperez@email.com / cliente123');

    await pool.query(`
      INSERT INTO cliente (nombre, telefono, correo, direccion) 
      VALUES 
        ('Juan Pérez', '3001234567', 'jperez@email.com', 'Calle 10 #20-30'),
        ('María Gómez', '3109876543', 'mgomez@email.com', 'Carrera 5 #15-25'),
        ('Pedro López', '3201112233', 'plopez@email.com', 'Avenida 8 #30-40')
      ON CONFLICT (correo) DO NOTHING;
    `);
    console.log('✅ Clientes creados');

    await pool.query(`
      INSERT INTO repuesto (codigo, nombre, descripcion, marca, precio_unitario, stock_actual) 
      VALUES 
        ('REP001', 'Filtro de Aceite', 'Filtro de aceite para motor', 'Bosch', 25000, 50),
        ('REP002', 'Pastillas de Freno', 'Juego de pastillas delanteras', 'Brembo', 120000, 30),
        ('REP003', 'Aceite 10W-40', 'Aceite sintético para motor', 'Castrol', 45000, 40),
        ('REP004', 'Batería 12V', 'Batería sellada 12V 45Ah', 'MAC', 280000, 15),
        ('REP005', 'Llantas 195/65R15', 'Llanta radial', 'Michelin', 350000, 20)
      ON CONFLICT (codigo) DO NOTHING;
    `);
    console.log('✅ Repuestos creados');

    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('\n🔐 Credenciales de acceso:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:     admin@autotrackpro.com / admin123');
    console.log('Mecánico:  cmendez@taller.com / mecanico123');
    console.log('Cliente:   jperez@email.com / cliente123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error en migración:', error);
    await pool.end();
    process.exit(1);
  }
};

createTables();