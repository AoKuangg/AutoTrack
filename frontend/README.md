# 🎨 AutoTrackPro - Frontend

Interfaz web moderna y responsive para el sistema de gestión de taller automotriz.

## 🛠️ Stack Tecnológico

- **React** v18 - Biblioteca UI
- **Vite** - Build tool y dev server
- **React Router** v6 - Navegación SPA
- **Axios** - Cliente HTTP
- **TailwindCSS** - Framework CSS
- **Lucide React** - Iconos modernos

## 📁 Estructura

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/              # Imágenes y recursos estáticos
│   ├── components/          # Componentes reutilizables
│   │   ├── auth/           # Componentes de autenticación
│   │   └── common/         # Componentes comunes (Layout, Navbar, etc.)
│   ├── context/            # Context API
│   │   └── AuthContext.jsx
│   ├── pages/              # Páginas principales
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Clientes.jsx
│   │   ├── Vehiculos.jsx
│   │   ├── Ordenes.jsx
│   │   ├── Repuestos.jsx
│   │   ├── Facturas.jsx
│   │   ├── Usuarios.jsx
│   │   ├── Perfil.jsx
│   │   ├── Configuracion.jsx
│   │   ├── MisVehiculos.jsx     # 🆕 Página para clientes
│   │   ├── MisOrdenes.jsx       # 🆕 Página para clientes
│   │   ├── MisFacturas.jsx      # 🆕 Página para clientes
│   │   └── NotFound.jsx
│   ├── services/           # Servicios API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── clienteService.js
│   │   ├── vehiculoService.js
│   │   ├── ordenService.js
│   │   ├── repuestoService.js
│   │   ├── facturaService.js
│   │   └── usuarioService.js
│   ├── utils/              # Utilidades
│   │   ├── constants.js
│   │   └── formatters.js
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── .env                    # Variables de entorno
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Instalación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Para producción:

```env
VITE_API_URL=https://tu-backend.onrender.com
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará en: `http://localhost:5173`

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Preview de build de producción
npm run lint     # Linter (si está configurado)
```

## 🎨 Páginas

### Públicas

- **Login** (`/login`) - Autenticación de usuarios

### Protegidas (Autenticación requerida)

#### Todas las Roles

- **Dashboard** (`/dashboard`) - Panel personalizado según rol
- **Perfil** (`/perfil`) - Perfil de usuario
- **Configuración** (`/configuracion`) - Configuración del sistema

#### Admin y Mecánico

- **Clientes** (`/clientes`) - Gestión de clientes
- **Vehículos** (`/vehiculos`) - Gestión de vehículos
- **Órdenes** (`/ordenes`) - Gestión de órdenes de servicio
- **Repuestos** (`/repuestos`) - Inventario de repuestos

#### Solo Admin

- **Facturas** (`/facturas`) - Gestión de facturas
- **Usuarios** (`/usuarios`) - Gestión de usuarios

#### Solo Cliente

- **Mis Vehículos** (`/mis-vehiculos`) - Ver flota del cliente con estado de reparaciones
- **Mis Órdenes** (`/mis-ordenes`) - Consultar estado de órdenes de servicio
- **Mis Facturas** (`/mis-facturas`) - Ver comprobantes de pago y facturas asociadas

## 🔐 Sistema de Autenticación

### Context API

El estado de autenticación se maneja con Context:

```jsx
import { useAuth } from "../context/AuthContext";

function MiComponente() {
  const { usuario, login, logout, isAdmin, isMecanico, isCliente } = useAuth();

  // usuario contiene: { id, nombre, email, rol, id_cliente (si es cliente) }
  // isAdmin() retorna true si es administrador
  // isMecanico() retorna true si es mecánico
  // isCliente() retorna true si es cliente
}
```

### Rutas Protegidas

```jsx
<ProtectedRoute allowedRoles={["administrador"]}>
  <Usuarios />
</ProtectedRoute>
```

### Token Storage

El token JWT se guarda en `localStorage`:

- Key: `token`
- Key usuario: `usuario` (JSON)

## 🎨 Componentes Principales

### Layout

```jsx
<Layout>
  <Navbar />
  <Sidebar />
  <Outlet /> {/* Contenido de la página */}
</Layout>
```

### Componentes Comunes

- `LoadingSpinner` - Indicador de carga
- `Modal` - Ventanas modales
- `Card` - Tarjetas de contenido
- `Table` - Tablas estilizadas

## 🎨 TailwindCSS

### Clases Personalizadas

```css
/* Botones */
.btn              /* Botón base */
/* Botón base */
/* Botón base */
/* Botón base */
.btn-primary      /* Botón primario (azul) */
.btn-secondary    /* Botón secundario (gris) */
.btn-success      /* Botón éxito (verde) */
.btn-danger       /* Botón peligro (rojo) */
.btn-sm           /* Botón pequeño */

/* Formularios */
.input            /* Campo de entrada */
.label            /* Etiqueta de campo */

/* Contenedores */
.card             /* Tarjeta blanca con sombra */

/* Badges */
.badge            /* Badge base */
.badge-primary    /* Badge primario */
.badge-success    /* Badge éxito */
.badge-warning    /* Badge advertencia */
.badge-danger; /* Badge peligro */
```

## ✨ Características Principales

### Control de Acceso Basado en Roles (RBAC)

El sistema implementa un RBAC completo con tres roles:

- **Admin**: Acceso total a todos los módulos
- **Mecánico**: Gestión de órdenes, clientes y repuestos (consulta)
- **Cliente**: Solo ve sus vehículos y órdenes

### Páginas Personalizadas por Rol

- **Dashboard**: Muestra diferentes accesos rápidos según el rol

  - Admin: Acceso a todo (Clientes, Vehículos, Órdenes, Repuestos, Facturas, Usuarios)
  - Mecánico: Órdenes, Repuestos
  - Cliente: Mis Vehículos, Mis Órdenes

- **Sidebar**: Menú dinámico que se adapta al rol del usuario
  - Admin: Todos los módulos
  - Mecánico: Sin acceso a "Clientes"
  - Cliente: Solo Dashboard, Mis Vehículos, Mis Órdenes

### Páginas Exclusivas para Clientes

- **Mis Vehículos** (`/mis-vehiculos`)

  - Visualiza su flota de vehículos
  - Ve el estado actual de reparación de cada vehículo
  - Expande para ver historial completo de órdenes por vehículo
  - Estados: En Diagnóstico, Reparando, Finalizado (Listo para recoger), Entregado

- **Mis Órdenes** (`/mis-ordenes`)

  - Visualiza todas sus órdenes de servicio
  - Filtra: Todas, En Proceso, Completadas
  - Ve detalles completos: diagnóstico, fechas, costos
  - Barra de progreso visual del estado
  - Timeline interactivo con estados

- **Mis Facturas** (`/mis-facturas`) - 🆕
  - Consulta sus comprobantes de pago
  - Filtrar por estado: Pendiente, Pagada, Anulada
  - Buscar por número de factura
  - Ver detalles de la orden asociada
  - Ver resumen de costos (mano de obra, repuestos, total)
  - Descargar factura en PDF (próximamente)

### Modal Mejorado para Repuestos

- Modal elegante para agregar repuestos a órdenes
- Dropdown con lista de repuestos disponibles
- Muestra precio unitario y stock disponible
- Cálculo automático de subtotal
- Validación de stock
- Actualización automática del inventario

### Restricciones por Rol

- **Creación de Vehículos**: Solo Admin puede crear (Mecánico solo ve)
- **Clientes**: No pueden acceder a módulos de admin
- **Mecánico**: No puede ver ni gestionar usuarios

## 📡 Servicios API

### Configuración Base

```javascript
// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Uso de Servicios

```javascript
import clienteService from "../services/clienteService";

// Obtener todos
const clientes = await clienteService.getAll();

// Crear
const nuevoCliente = await clienteService.create(data);

// Actualizar
await clienteService.update(id, data);

// Eliminar
await clienteService.delete(id);
```

## 🎨 Estilos y Temas

### Paleta de Colores

```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#eff6ff',
    // ... hasta 900
    600: '#2563eb',  // Color principal
  }
}
```

### Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Contenido */}
</div>
```

## 🔄 Estado y Context

### AuthContext

```javascript
{
  usuario: {
    id: 1,
    nombre: "Admin",
    email: "admin@example.com",
    rol: "administrador"
  },
  loading: false,
  isAuthenticated: true,
  login: async (email, password) => {},
  logout: () => {},
  isAdmin: () => boolean,
  isMecanico: () => boolean,
  isCliente: () => boolean
}
```

## 🚀 Build y Deploy

### Build Local

```bash
npm run build
```

Genera carpeta `dist/` con archivos estáticos.

### Deploy en Vercel

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Import Git Repository
3. Framework Preset: **Vite**
4. Environment Variables:
   ```
   VITE_API_URL=https://tu-backend.onrender.com
   ```
5. Deploy

### Deploy en Netlify

1. Crear cuenta en [netlify.com](https://netlify.com)
2. New site from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variables:
   ```
   VITE_API_URL=https://tu-backend.onrender.com
   ```

## 🐛 Troubleshooting

### Problema: "Failed to fetch"

**Causa:** Backend no está corriendo o URL incorrecta

**Solución:**

1. Verifica que el backend esté en `http://localhost:3000`
2. Verifica `VITE_API_URL` en `.env`
3. Reinicia el servidor de Vite

### Problema: TailwindCSS no funciona

**Solución:**

1. Verifica `tailwind.config.js`
2. Verifica que `index.css` tenga:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Reinicia Vite

### Problema: Rutas no funcionan después de refresh

**Causa:** Problema de historial en producción

**Solución Vercel:** Agregar `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Solución Netlify:** Agregar `_redirects` en `public/`:

```
/*    /index.html   200
```

## 📱 Responsive Features

- ✅ Sidebar colapsable en móvil
- ✅ Tablas con scroll horizontal
- ✅ Modales adaptables
- ✅ Formularios optimizados para móvil
- ✅ Menú hamburguesa

## ⚡ Optimizaciones

- Code splitting con React Router
- Lazy loading de componentes
- Imágenes optimizadas
- CSS purging con Tailwind
- Minificación en producción

## 🔒 Seguridad

- ✅ Token en localStorage (auto-limpieza en logout)
- ✅ Rutas protegidas por rol
- ✅ Validación de formularios
- ✅ Escape de HTML
- ✅ HTTPS en producción

## 📚 Recursos

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)

---

**Desarrollado para UTS - 2025**
