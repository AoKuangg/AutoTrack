# 🔧 AutoTrackPro - Backend API

API REST para el sistema de gestión de taller automotriz AutoTrackPro.

## 🛠️ Stack Tecnológico

- **Node.js** v18+
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **Bcrypt** - Hash de contraseñas
- **CORS** - Seguridad cross-origin

## 📁 Estructura

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración PostgreSQL
│   ├── controllers/             # Lógica de negocio
│   │   ├── authController.js
│   │   ├── clienteController.js
│   │   ├── vehiculoController.js
│   │   ├── ordenController.js
│   │   ├── repuestoController.js
│   │   ├── facturaController.js
│   │   └── usuarioController.js
│   ├── routes/
│   │   └── index.js             # Rutas centralizadas
│   ├── middlewares/
│   │   └── auth.js              # Middlewares de autenticación
│   ├── database/
│   │   └── migrate.js           # Script de migración
│   └── index.js                 # Servidor principal
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Instalación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://usuario:password@localhost:5432/autotrackpro
JWT_SECRET=tu_secreto_super_seguro_aqui
```

### 3. Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE autotrackpro;

# Salir
\q
```

### 4. Ejecutar Migraciones

```bash
npm run migrate
```

Esto creará todas las tablas y datos de prueba.

### 5. Iniciar Servidor

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará en: `http://localhost:3000`

## 📡 Endpoints

### Autenticación

| Método | Ruta                        | Descripción        | Auth |
| ------ | --------------------------- | ------------------ | ---- |
| POST   | `/api/auth/login`           | Iniciar sesión     | No   |
| GET    | `/api/auth/profile`         | Obtener perfil     | Sí   |
| POST   | `/api/auth/change-password` | Cambiar contraseña | Sí   |

### Usuarios (Solo Admin)

| Método | Ruta                               | Descripción         | Rol   |
| ------ | ---------------------------------- | ------------------- | ----- |
| GET    | `/api/usuarios`                    | Listar usuarios     | Admin |
| GET    | `/api/usuarios/:id`                | Obtener usuario     | Admin |
| POST   | `/api/usuarios`                    | Crear usuario       | Admin |
| PUT    | `/api/usuarios/:id`                | Actualizar usuario  | Admin |
| DELETE | `/api/usuarios/:id`                | Desactivar usuario  | Admin |
| POST   | `/api/usuarios/:id/reset-password` | Resetear contraseña | Admin |

### Clientes

| Método | Ruta                | Descripción        | Rol            |
| ------ | ------------------- | ------------------ | -------------- |
| GET    | `/api/clientes`     | Listar clientes    | Admin/Mecánico |
| GET    | `/api/clientes/:id` | Obtener cliente    | Admin/Mecánico |
| POST   | `/api/clientes`     | Crear cliente      | Admin/Mecánico |
| PUT    | `/api/clientes/:id` | Actualizar cliente | Admin/Mecánico |
| DELETE | `/api/clientes/:id` | Eliminar cliente   | Admin          |

### Vehículos

| Método | Ruta                          | Descripción          | Rol                    |
| ------ | ----------------------------- | -------------------- | ---------------------- |
| GET    | `/api/vehiculos`              | Listar vehículos     | Admin/Mecánico         |
| GET    | `/api/vehiculos/:id`          | Obtener vehículo     | Admin/Mecánico         |
| GET    | `/api/clientes/:id/vehiculos` | Vehículos de cliente | Admin/Mecánico/Cliente |
| POST   | `/api/vehiculos`              | Crear vehículo       | Admin/Mecánico         |
| PUT    | `/api/vehiculos/:id`          | Actualizar vehículo  | Admin/Mecánico         |
| DELETE | `/api/vehiculos/:id`          | Eliminar vehículo    | Admin                  |

### Órdenes de Servicio

| Método | Ruta                                | Descripción                        | Rol                    |
| ------ | ----------------------------------- | ---------------------------------- | ---------------------- |
| GET    | `/api/ordenes`                      | Listar órdenes (filtradas por rol) | Admin/Mecánico/Cliente |
| GET    | `/api/ordenes/:id`                  | Obtener orden completa             | Admin/Mecánico/Cliente |
| POST   | `/api/ordenes`                      | Crear orden                        | Admin/Mecánico         |
| PUT    | `/api/ordenes/:id`                  | Actualizar orden                   | Admin/Mecánico         |
| PATCH  | `/api/ordenes/:id/estado`           | Actualizar estado                  | Admin/Mecánico         |
| POST   | `/api/ordenes/:id/repuestos`        | Agregar repuesto                   | Admin/Mecánico         |
| DELETE | `/api/ordenes/:id/repuestos/:idUso` | Quitar repuesto                    | Admin/Mecánico         |

### Repuestos

| Método | Ruta                        | Descripción         | Rol            |
| ------ | --------------------------- | ------------------- | -------------- |
| GET    | `/api/repuestos`            | Listar repuestos    | Admin/Mecánico |
| GET    | `/api/repuestos/:id`        | Obtener repuesto    | Admin/Mecánico |
| GET    | `/api/repuestos/bajo-stock` | Stock bajo          | Admin/Mecánico |
| POST   | `/api/repuestos`            | Crear repuesto      | Admin          |
| PUT    | `/api/repuestos/:id`        | Actualizar repuesto | Admin          |
| PATCH  | `/api/repuestos/:id/stock`  | Actualizar stock    | Admin          |
| DELETE | `/api/repuestos/:id`        | Eliminar repuesto   | Admin          |

### Facturas

| Método | Ruta                       | Descripción       | Rol                       |
| ------ | -------------------------- | ----------------- | ------------------------- |
| GET    | `/api/facturas`            | Listar facturas   | Admin/Cliente (filtradas) |
| POST   | `/api/facturas`            | Generar factura   | Admin                     |
| GET    | `/api/ordenes/:id/factura` | Factura de orden  | Admin/Mecánico            |
| PATCH  | `/api/facturas/:id/estado` | Actualizar estado | Admin                     |

### Estadísticas

| Método | Ruta                | Descripción        | Rol   |
| ------ | ------------------- | ------------------ | ----- |
| GET    | `/api/estadisticas` | Dashboard métricas | Admin |

## 🔐 Autenticación

Todas las rutas (excepto login) requieren token JWT:

```http
Authorization: Bearer <token>
```

### Obtener Token

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@autotrackpro.com",
  "password": "admin123"
}
```

Respuesta:

```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "id_cliente": null,
    "nombre": "Admin Sistema",
    "email": "admin@autotrackpro.com",
    "rol": "administrador"
  }
}
```

### Token JWT

El token contiene:

- `id`: ID del usuario
- `email`: Email del usuario
- `rol`: Rol del usuario (administrador, mecanico, cliente)
- `nombre`: Nombre completo
- `id_cliente`: ID del cliente (solo si el rol es "cliente")

## ✨ Características Principales

### Control de Acceso Basado en Roles (RBAC)

El backend implementa un RBAC completo con middlewares de autenticación:

```javascript
// Todos los usuarios autenticados
router.get("/ordenes", authenticateToken, getOrdenes);

// Solo administradores
router.post("/usuarios", authenticateToken, isAdmin, createUsuario);

// Administradores y mecánicos
router.post("/ordenes", authenticateToken, isMecanicoOrAdmin, createOrden);
```

### Filtrado Automático por Rol

- **Cliente**:
  - Cuando obtiene `/api/ordenes`, solo ve sus propias órdenes (filtradas por `id_cliente`)
  - Cuando obtiene `/api/facturas`, solo ve sus propias facturas (filtradas por `id_cliente`)
  - Puede acceder a `/api/ordenes/:id` solo si la orden es de sus vehículos
- **Admin/Mecánico**: Ven todos los datos

### Actualización Automática de Stock

Cuando se agrega un repuesto a una orden:

1. Se valida que haya stock disponible
2. Se decrementa el stock automáticamente
3. Se recalcula el costo total de la orden
4. Si se quita un repuesto, se devuelve el stock

### Relación Cliente-Usuario

Para clientes, el login ahora devuelve:

```javascript
{
  id: usuario.id_usuario,
  id_cliente: cliente.id_cliente,  // 🆕 Devuelto en login
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol
}
```

Esto permite que la aplicación frontend acceda fácilmente al `id_cliente` del usuario autenticado.

## 🗄️ Base de Datos

### Tablas Principales

1. **usuario** - Usuarios del sistema
2. **cliente** - Clientes del taller
3. **vehiculo** - Vehículos registrados
4. **orden_servicio** - Órdenes de reparación
5. **repuesto** - Catálogo de repuestos
6. **uso_repuesto** - Relación orden-repuesto
7. **factura** - Facturas generadas
8. **notificacion** - Notificaciones

### Diagrama de Relaciones

```
cliente (1) ─── (N) vehiculo
vehiculo (1) ─── (N) orden_servicio
orden_servicio (1) ─── (N) uso_repuesto
repuesto (1) ─── (N) uso_repuesto
orden_servicio (1) ─── (1) factura
```

## 📊 Datos de Prueba

La migración incluye:

- 2 usuarios (admin y mecánico)
- 3 clientes
- 5 repuestos

### Credenciales

| Rol      | Email                  | Contraseña  |
| -------- | ---------------------- | ----------- |
| Admin    | admin@autotrackpro.com | admin123    |
| Mecánico | cmendez@taller.com     | mecanico123 |
| Cliente  | jperez@email.com       | cliente123  |

## 🧪 Testing con cURL

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@autotrackpro.com","password":"admin123"}'
```

### Obtener Clientes

```bash
curl http://localhost:3000/api/clientes \
  -H "Authorization: Bearer <tu_token>"
```

### Crear Orden

```bash
curl -X POST http://localhost:3000/api/ordenes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "id_vehiculo": 1,
    "diagnostico": "Cambio de aceite",
    "costo_mano_obra": 50000
  }'
```

## 🚀 Deploy en Render

### 1. Crear PostgreSQL

1. Dashboard → New + → PostgreSQL
2. Name: `autotrackpro-db`
3. Copiar **Internal Database URL**

### 2. Crear Web Service

1. New + → Web Service
2. Connect repository
3. Build Command: `npm install`
4. Start Command: `npm start`

### 3. Variables de Entorno

```
DATABASE_URL=<internal_database_url>
NODE_ENV=production
JWT_SECRET=<tu_secreto_seguro>
PORT=3000
```

### 4. Ejecutar Migración

En Render Shell:

```bash
npm run migrate
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar PostgreSQL
psql --version
pg_ctl status

# Verificar conexión
psql -U postgres -d autotrackpro
```

### Error: "Port in use"

```bash
# Ver procesos en puerto 3000
lsof -ti:3000

# Matar proceso
kill -9 <PID>
```

### Reiniciar BD

```bash
# Eliminar y recrear
psql -U postgres
DROP DATABASE autotrackpro;
CREATE DATABASE autotrackpro;
\q

# Ejecutar migración
npm run migrate
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm run migrate  # Ejecutar migraciones
```

## 🔒 Seguridad

- ✅ Passwords hasheados con bcrypt
- ✅ JWT con expiración de 24h
- ✅ CORS configurado
- ✅ Validación de roles
- ✅ SQL injection protection (pg library)

## 📚 Más Información

- [Documentación Principal](../README.md)
- [Frontend README](../frontend/README.md)

---

**Desarrollado para UTS - 2025**
