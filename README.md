# 🚗 AutoTrackPro - Sistema de Gestión de Taller Automotriz

Sistema integral para la gestión de talleres automotrices que permite administrar clientes, vehículos, órdenes de servicio, inventario de repuestos y facturación.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Documentation](#api-documentation)
- [Roles y Permisos](#roles-y-permisos)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Autor](#autor)
- [Licencia](#licencia)

---

## ✨ Características

### Gestión Completa

- ✅ **Clientes**: Registro y gestión completa de clientes
- ✅ **Vehículos**: Catálogo de vehículos con historial
- ✅ **Órdenes de Servicio**: Control de diagnóstico, reparación y estados
- ✅ **Repuestos**: Inventario con alertas de stock bajo
- ✅ **Facturación**: Generación automática de facturas con IVA
- ✅ **Usuarios**: Sistema de roles y permisos (Admin, Mecánico, Cliente)

### Funcionalidades Adicionales

- 🔐 Autenticación segura con JWT
- 👥 **RBAC Completo**: Control de acceso basado en roles (Admin, Mecánico, Cliente)
- 📊 Dashboard personalizado según rol del usuario
- 🔔 Notificaciones de estado de órdenes
- 💰 Cálculo automático de costos (mano de obra + repuestos + IVA)
- 📱 Diseño responsive (móvil, tablet, escritorio)
- 🎨 Interfaz moderna con TailwindCSS
- 🔍 Búsqueda y filtros avanzados
- 🚗 Página "Mis Vehículos" para clientes (ver flota con estado de reparación)
- 🔧 Página "Mis Órdenes" para clientes (seguimiento de reparaciones)
- 💰 Página "Mis Facturas" para clientes (ver comprobantes de pago)
- 📦 Modal mejorado para agregar repuestos con vista previa de stock

---

## 🛠️ Tecnologías

### Backend

- **Node.js** v18+
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas

### Frontend

- **React** v18 - Biblioteca UI
- **Vite** - Build tool
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **TailwindCSS** - Estilos
- **Lucide React** - Iconos

### Herramientas

- **Git** - Control de versiones
- **Nodemon** - Hot reload (desarrollo)

---

## 📦 Instalación

### Requisitos Previos

Asegúrate de tener instalado:

- Node.js v18 o superior
- PostgreSQL v14 o superior
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/autotrackpro.git
cd autotrackpro
```

### 2. Configurar Backend

```bash
# Ir a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DATABASE_URL=postgresql://usuario:password@localhost:5432/autotrackpro

# Crear base de datos en PostgreSQL
psql -U postgres
CREATE DATABASE autotrackpro;
\q

# Ejecutar migraciones (crear tablas)
npm run migrate

# Iniciar servidor backend
npm run dev
```

El backend estará disponible en: `http://localhost:3000`

### 3. Configurar Frontend

```bash
# Abrir nueva terminal y ir a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# El archivo .env debe contener:
# VITE_API_URL=http://localhost:3000

# Iniciar servidor frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 🚀 Uso

### Credenciales de Prueba

El sistema incluye usuarios de prueba:

| Rol               | Email                  | Contraseña  |
| ----------------- | ---------------------- | ----------- |
| **Administrador** | admin@autotrackpro.com | admin123    |
| **Mecánico**      | cmendez@taller.com     | mecanico123 |
| **Cliente**       | jperez@email.com       | cliente123  |

### Flujo de Trabajo Típico

1. **Registro de Cliente**: Admin/Mecánico registra un nuevo cliente
2. **Registro de Vehículo**: Se asocia el vehículo al cliente
3. **Crear Orden**: Se crea una orden de servicio con diagnóstico
4. **Agregar Repuestos**: Se agregan los repuestos utilizados
5. **Actualizar Estado**: Se cambia el estado (diagnóstico → reparando → finalizado)
6. **Generar Factura**: Admin genera la factura automáticamente
7. **Marcar como Pagada**: Admin marca la factura como pagada

---

## 📁 Estructura del Proyecto

```
autotrackpro/
├── backend/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/            # Configuración de BD
│   │   ├── controllers/       # Controladores (lógica de negocio)
│   │   ├── routes/            # Rutas de la API
│   │   ├── middlewares/       # Middlewares (auth, errores)
│   │   ├── database/          # Migraciones y seeds
│   │   └── index.js           # Servidor principal
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── frontend/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas principales
│   │   ├── services/          # Servicios API
│   │   ├── context/           # Context API (auth)
│   │   ├── utils/             # Utilidades y constantes
│   │   ├── App.jsx            # Componente principal
│   │   └── main.jsx           # Punto de entrada
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── docs/                      # Documentación
│   ├── diagramas/            # Diagramas UML
│   └── capturas/             # Screenshots
│
└── README.md                  # Este archivo
```

---

## 🔌 API Documentation

### Endpoints Principales

#### Autenticación

```http
POST   /api/auth/login              # Iniciar sesión
GET    /api/auth/profile            # Obtener perfil
POST   /api/auth/change-password    # Cambiar contraseña
```

#### Clientes

```http
GET    /api/clientes                # Listar clientes
GET    /api/clientes/:id            # Obtener cliente
POST   /api/clientes                # Crear cliente
PUT    /api/clientes/:id            # Actualizar cliente
DELETE /api/clientes/:id            # Eliminar cliente
```

#### Vehículos

```http
GET    /api/vehiculos               # Listar vehículos
GET    /api/vehiculos/:id           # Obtener vehículo
POST   /api/vehiculos               # Crear vehículo
PUT    /api/vehiculos/:id           # Actualizar vehículo
DELETE /api/vehiculos/:id           # Eliminar vehículo
```

#### Órdenes de Servicio

```http
GET    /api/ordenes                 # Listar órdenes
GET    /api/ordenes/:id             # Obtener orden con detalles
POST   /api/ordenes                 # Crear orden
PATCH  /api/ordenes/:id/estado      # Actualizar estado
POST   /api/ordenes/:id/repuestos   # Agregar repuesto
DELETE /api/ordenes/:id/repuestos/:idUso  # Quitar repuesto
```

#### Repuestos

```http
GET    /api/repuestos               # Listar repuestos
GET    /api/repuestos/:id           # Obtener repuesto
GET    /api/repuestos/bajo-stock    # Repuestos con stock bajo
POST   /api/repuestos               # Crear repuesto
PUT    /api/repuestos/:id           # Actualizar repuesto
DELETE /api/repuestos/:id           # Eliminar repuesto
```

#### Facturas

```http
GET    /api/facturas                # Listar facturas
POST   /api/facturas                # Generar factura
GET    /api/ordenes/:id/factura     # Obtener factura de orden
PATCH  /api/facturas/:id/estado     # Actualizar estado
```

#### Usuarios (Solo Admin)

```http
GET    /api/usuarios                # Listar usuarios
GET    /api/usuarios/:id            # Obtener usuario
POST   /api/usuarios                # Crear usuario
PUT    /api/usuarios/:id            # Actualizar usuario
DELETE /api/usuarios/:id            # Desactivar usuario
```

#### Estadísticas

```http
GET    /api/estadisticas            # Dashboard con métricas
```

### Autenticación

Todas las rutas (excepto `/api/auth/login`) requieren autenticación mediante JWT:

```http
Authorization: Bearer <token>
```

---

## 👥 Roles y Permisos

### 🔴 Administrador

- ✅ Acceso total al sistema
- ✅ Gestionar usuarios, clientes, vehículos, órdenes
- ✅ Gestionar repuestos (crear, editar, eliminar, stock)
- ✅ Generar y gestionar facturas
- ✅ Ver estadísticas y reportes
- ✅ Dashboard con 6 accesos rápidos
- ✅ Crear nuevos vehículos

### 🟡 Mecánico

- ✅ Gestionar clientes y vehículos
- ✅ Crear y actualizar órdenes de servicio
- ✅ Agregar repuestos a órdenes
- ✅ Ver inventario de repuestos
- ✅ Dashboard con 2 accesos rápidos (Órdenes, Repuestos)
- ❌ NO acceso a módulo de Clientes
- ❌ NO puede crear/editar repuestos
- ❌ NO puede crear nuevos vehículos
- ❌ NO puede gestionar usuarios

### 🟢 Cliente

- ✅ Ver sus propios vehículos y estado de reparación
- ✅ Consultar sus órdenes de servicio
- ✅ Filtrar órdenes (todas, en proceso, completadas)
- ✅ Ver detalles completos de estado y costos
- ✅ Ver sus facturas
- ✅ Filtrar y buscar facturas
- ✅ Ver detalles de facturas con información de órdenes asociadas
- ✅ Dashboard personalizado con 3 accesos rápidos
- ✅ Página "Mis Vehículos" con historial de reparaciones
- ✅ Página "Mis Órdenes" con seguimiento detallado
- ✅ Página "Mis Facturas" para consultar comprobantes de pago
- ❌ NO puede crear órdenes
- ❌ NO acceso a módulos administrativos

---

## 📸 Capturas de Pantalla

### Login

![Login](docs/capturas/login.png)

### Dashboard

![Dashboard](docs/capturas/dashboard.png)

### Gestión de Órdenes

![Órdenes](docs/capturas/ordenes.png)

### Detalle de Factura

![Factura](docs/capturas/factura.png)

---

## 🗄️ Modelo de Base de Datos

### Tablas Principales

- **usuario**: Usuarios del sistema con roles
- **cliente**: Clientes del taller
- **vehiculo**: Vehículos registrados
- **orden_servicio**: Órdenes de reparación
- **repuesto**: Catálogo de repuestos
- **uso_repuesto**: Relación orden-repuesto
- **factura**: Facturas generadas
- **notificacion**: Notificaciones a clientes

### Diagrama ER

Ver diagrama completo en: [docs/diagramas/modelo-er.png](docs/diagramas/modelo-er.png)

---

## 🚀 Deploy

### Backend (Render)

1. Crear cuenta en [render.com](https://render.com)
2. New + → PostgreSQL → Crear base de datos
3. New + → Web Service → Conectar repositorio
4. Variables de entorno:
   ```
   DATABASE_URL=<internal_database_url>
   NODE_ENV=production
   JWT_SECRET=<tu_secreto>
   ```
5. Deploy automático

### Frontend (Vercel)

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Import Git Repository
3. Framework: Vite
4. Environment Variables:
   ```
   VITE_API_URL=https://tu-backend.onrender.com
   ```
5. Deploy

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que la base de datos existe

### Error: "Port already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: "Token inválido"

- Limpia localStorage del navegador
- Vuelve a hacer login

---

## 📚 Documentación Adicional

- [Guía de Instalación Detallada](docs/INSTALACION.md)
- [API Reference Completa](docs/API.md)
- [Guía de Contribución](docs/CONTRIBUTING.md)

---

## 👨‍💻 Autor

**Tu Nombre**

- Tecnología en Desarrollo de Sistemas Informáticos
- Unidades Tecnológicas de Santander (UTS)
- Email: tu.email@example.com
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

---

## 📄 Licencia

Este proyecto fue desarrollado como trabajo final para la asignatura de **Planeación de Sistemas Informáticos (E193)** en las Unidades Tecnológicas de Santander.

**Proyecto Académico** - 2025

---

## 🙏 Agradecimientos

- Docente: William Ernesto Ardila Gómez
- Unidades Tecnológicas de Santander
- Compañeros de clase

---

## 📞 Soporte

Si tienes preguntas o encuentras algún problema:

1. Revisa la sección de [Solución de Problemas](#solución-de-problemas)
2. Consulta la [documentación](docs/)
3. Crea un issue en GitHub

---

## 🔄 Actualizaciones

### v1.0.0 (Noviembre 2025)

- ✅ Versión inicial del proyecto
- ✅ CRUD completo de todas las entidades
- ✅ Sistema de autenticación con roles
- ✅ Dashboard con estadísticas
- ✅ Gestión de órdenes con repuestos
- ✅ Facturación automática

---

## 📊 Estado del Proyecto

![Estado](https://img.shields.io/badge/Estado-Completo-success)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![Node](https://img.shields.io/badge/Node-v18+-green)
![React](https://img.shields.io/badge/React-v18-61dafb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14-336791)

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**
