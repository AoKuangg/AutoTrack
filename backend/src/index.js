import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware (desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    next();
  });
}

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({ 
    message: '🚗 AutoTrackPro API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      clientes: '/api/clientes',
      vehiculos: '/api/vehiculos',
      ordenes: '/api/ordenes',
      repuestos: '/api/repuestos',
      facturas: '/api/facturas',
      estadisticas: '/api/estadisticas'
    }
  });
});

// Rutas de la API
app.use('/api', routes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log(`   AutoTrackPro API v1.0.0`);
  console.log('🚀 ================================');
  console.log(`📡 Servidor: http://localhost:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ================================');
});