# 🚗 AutoTrackPro - Backend API

API REST para el sistema de gestión de taller automotriz AutoTrackPro.

## 🛠️ Stack Tecnológico

- **Node.js** v18+
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **CORS** - Seguridad
- **dotenv** - Variables de entorno

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración PostgreSQL
│   │
│   ├── controllers/             # Lógica de negocio
│   │   ├── clienteController.js
│   │   ├── vehiculoController.js
│   │   ├── ordenController.js
│   │   ├── repuestoController.js
│   │   └── facturaController.js
│   │
│   ├── routes/
│   │   └── index.js             # Rutas de la API
│   │
│   ├── database/
│   │   └── migrate.js           # Script de migración
│   │
│   └── index.js                 # Servidor principal
│
├── .env                         # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del backend:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://usuario:password@localhost:5432/autotrackpro
```

### 3. Crear y configurar la base de datos

#### Opción A: PostgreSQL Local

1. Instala PostgreSQL
2. Crea la base de datos:
```sql
CREATE DATABASE autotrackpro;
```
3. Actualiza el `DATABASE_URL` en `.env`

#### Opción B: PostgreSQL en Render (Cloud - Gratis)

1. Ve a [render.com](https://render.com)
2. Crea una cuenta
3. New + → PostgreSQL
4. Copia la **Internal Database URL**
5. Pégala en `.env` como `DATABASE_URL`

### 4. Ejecutar migración

```bash
npm run migrate
```

Deberías ver:
```
✅ Tabla usuario creada
✅ Tabla cliente creada
✅ Tabla vehiculo creada
...
🎉 Migración completada exitosamente
```

### 5. Iniciar el servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📡 Endpoints de la API

### 🔹 Clientes
- `GET /api/clientes` - Listar todos los clientes
- `GET /api/clientes/:id` - Obtener un cliente
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente (soft delete)

### 🔹 Vehículos
- `GET /api/vehiculos` - Listar todos los vehículos
- `GET /api/vehiculos/:id` - Obtener un vehículo
- `GET /api/clientes/:id/vehiculos` - Vehículos de un cliente
- `POST /api/vehiculos` - Crear vehículo
- `PUT /api/vehiculos/:id` - Actualizar vehículo
- `DELETE /api/vehiculos/:id` - Eliminar vehículo

### 🔹 Órdenes de Servicio
- `GET /api/ordenes` - Listar todas las órdenes
- `GET /api/ordenes/:id` - Obtener una orden completa
- `POST /api/ordenes` - Crear orden
- `PUT /api/ordenes/:id` - Actualizar orden
- `PATCH /api/ordenes/:id/estado` - Actualizar estado
- `POST /api/ordenes/:id/repuestos` - Agregar repuesto
- `DELETE /api/ordenes/:id/repuestos/:idUso` - Quitar repuesto

### 🔹 Repuestos
- `GET /api/repuestos` - Listar repuestos
- `GET /api/repuestos/:id` - Obtener un repuesto
- `GET /api/repuestos/bajo-stock` - Repuestos con stock bajo
- `POST /api/repuestos` - Crear repuesto
- `PUT /api/repuestos/:id` - Actualizar repuesto
- `PATCH /api/repuestos/:id/stock` - Actualizar stock
- `DELETE /api/repuestos/:id` - Eliminar repuesto (soft delete)

### 🔹 Facturas
- `GET /api/facturas` - Listar facturas
- `POST /api/facturas` - Generar factura
- `GET /api/ordenes/:id/factura` - Factura de una orden
- `PATCH /api/facturas/:id/estado` - Actualizar estado de factura

### 🔹 Estadísticas
- `GET /api/estadisticas` - Dashboard con métricas

## 🧪 Ejemplos de Uso

### Crear Cliente
```bash
POST http://localhost:3000/api/clientes
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "telefono": "3001234567",
  "correo": "juan@email.com",
  "direccion": "Calle 10 #20-30"
}
```

### Crear Vehículo
```bash
POST http://localhost:3000/api/vehiculos
Content-Type: application/json

{
  "placa": "ABC123",
  "marca": "Toyota",
  "modelo": "Corolla",
  "anio": 2020,
  "color": "Blanco",
  "tipo_vehiculo": "Sedán",
  "kilometraje": 45000,
  "id_cliente": 1
}
```

### Crear Orden de Servicio
```bash
POST http://localhost:3000/api/ordenes
Content-Type: application/json

{
  "id_vehiculo": 1,
  "diagnostico": "Cambio de aceite y filtro",
  "costo_mano_obra": 50000,
  "estado": "diagnostico"
}
```

### Actualizar Estado de Orden
```bash
PATCH http://localhost:3000/api/ordenes/1/estado
Content-Type: application/json

{
  "estado": "reparando",
  "observaciones": "Iniciando reparación"
}
```

### Agregar Repuesto a Orden
```bash
POST http://localhost:3000/api/ordenes/1/repuestos
Content-Type: application/json

{
  "id_repuesto": 1,
  "cantidad": 2
}
```

## 🌐 Deploy en Render

### 1. Subir código a GitHub

```bash
git init
git add .
git commit -m "Backend AutoTrackPro"
git branch -M main
git remote add origin https://github.com/tu-usuario/autotrackpro-backend.git
git push -u origin main
```

### 2. Crear PostgreSQL en Render

1. Dashboard de Render → New +
2. PostgreSQL
3. Name: `autotrackpro-db`
4. Plan: Free
5. Crea y copia la **Internal Database URL**

### 3. Crear Web Service

1. New + → Web Service
2. Conecta tu repositorio de GitHub
3. Configuración:
   - Name: `autotrackpro-api`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Variables de entorno:
   ```
   DATABASE_URL=tu_internal_database_url_aqui
   NODE_ENV=production
   ```
5. Despliega

### 4. Ejecutar migración

En Render, ve a Shell y ejecuta:
```bash
npm run migrate
```

Tu API estará en: `https://autotrackpro-api.onrender.com`

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que la base de datos existe

## 📊 Datos de Prueba

La migración incluye datos de prueba:
- 2 usuarios (admin y mecánico)
- 3 clientes
- 5 repuestos

## 🔐 Seguridad

- CORS habilitado para desarrollo
- Validaciones en todos los endpoints
- Manejo de errores centralizado
- Soft deletes en clientes y repuestos

## 📝 Licencia

MIT

## 👨‍💻 Autor

Camilo Paez - Tecnología en Desarrollo de Sistemas Informáticos  
UTS - 2025