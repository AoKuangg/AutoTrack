# 🔐 Sistema de Permisos - AutoTrackPro

## 👥 Roles del Sistema

### 🔴 ADMINISTRADOR

**Permisos:** Acceso total al sistema

✅ **Puede hacer TODO:**

- Gestionar usuarios (crear, editar, eliminar)
- Gestionar clientes
- Gestionar vehículos
- Gestionar órdenes de servicio
- Gestionar repuestos (crear, editar, eliminar, ajustar stock)
- Generar facturas
- Ver estadísticas y reportes
- Eliminar registros

---

### 🟡 MECÁNICO

**Permisos:** Gestión operativa del taller

✅ **Puede:**

- Ver clientes (desde módulo de clientes)
- Crear y editar clientes
- Ver y registrar vehículos
- Crear y gestionar órdenes de servicio
- Actualizar estado de órdenes
- Agregar/quitar repuestos a órdenes
- Ver repuestos disponibles
- Ver facturas de órdenes
- Dashboard con accesos rápidos a Órdenes y Repuestos

❌ **NO puede:**

- Acceder al módulo de Clientes (no aparece en el menú)
- Ver lista general de clientes
- Crear/editar/eliminar repuestos del inventario
- Ajustar stock de repuestos
- Generar facturas
- Ver estadísticas completas del taller
- Crear nuevos vehículos
- Eliminar clientes o vehículos
- Crear/eliminar usuarios
- Acceder a usuarios

---

### 🟢 CLIENTE

**Permisos:** Solo consulta de sus datos

✅ **Puede:**

- Ver sus propios vehículos en "Mis Vehículos"
- Ver el estado actual de reparación de cada vehículo
- Ver el historial completo de órdenes por vehículo
- Ver sus propias órdenes en "Mis Órdenes"
- Filtrar sus órdenes (todas, en proceso, completadas)
- Ver detalles completos de cada orden (diagnóstico, costos, fechas)
- Ver barra de progreso y timeline de estados
- Ver sus facturas en "Mis Facturas" (pendiente, pagada, anulada)
- Filtrar y buscar sus facturas
- Ver detalles de la orden asociada a cada factura
- Ver resumen de costos (mano de obra, repuestos, total)
- Cambiar su contraseña
- Dashboard personalizado con accesos a "Mis Vehículos", "Mis Órdenes" y "Mis Facturas"

❌ **NO puede:**

- Crear órdenes (lo hace el mecánico/admin)
- Ver datos de otros clientes
- Ver módulo de Clientes, Vehículos, Órdenes o Repuestos general
- Acceder a módulos administrativos
- Modificar información del taller
- Generar facturas
- Ver estadísticas

---

## 📊 Tabla de Permisos Detallada

| Funcionalidad           | Admin | Mecánico | Cliente         |
| ----------------------- | ----- | -------- | --------------- |
| **Usuarios**            |
| Crear usuarios          | ✅    | ❌       | ❌              |
| Ver usuarios            | ✅    | ❌       | ❌              |
| Editar usuarios         | ✅    | ❌       | ❌              |
| Eliminar usuarios       | ✅    | ❌       | ❌              |
| Resetear contraseñas    | ✅    | ❌       | ❌              |
| **Clientes**            |
| Ver clientes            | ✅    | ❌       | ❌              |
| Crear clientes          | ✅    | ✅       | ❌              |
| Editar clientes         | ✅    | ✅       | ❌              |
| Eliminar clientes       | ✅    | ❌       | ❌              |
| **Vehículos**           |
| Ver vehículos (general) | ✅    | ✅       | ❌              |
| Ver mis vehículos       | ✅    | ❌       | ✅              |
| Registrar vehículos     | ✅    | ❌       | ❌              |
| Editar vehículos        | ✅    | ❌       | ❌              |
| Eliminar vehículos      | ✅    | ❌       | ❌              |
| **Órdenes**             |
| Ver órdenes (general)   | ✅    | ✅       | ❌              |
| Ver mis órdenes         | ✅    | ❌       | ✅              |
| Crear órdenes           | ✅    | ✅       | ❌              |
| Editar órdenes          | ✅    | ✅       | ❌              |
| Cambiar estado          | ✅    | ✅       | ❌              |
| Agregar repuestos       | ✅    | ✅       | ❌              |
| **Repuestos**           |
| Ver repuestos           | ✅    | ✅       | ❌              |
| Crear repuestos         | ✅    | ❌       | ❌              |
| Editar repuestos        | ✅    | ❌       | ❌              |
| Ajustar stock           | ✅    | ❌       | ❌              |
| Eliminar repuestos      | ✅    | ❌       | ❌              |
| **Facturas**            |
| Ver facturas            | ✅    | ✅       | ✅ (solo suyas) |
| Generar facturas        | ✅    | ❌       | ❌              |
| Cambiar estado factura  | ✅    | ❌       | ❌              |
| Ver detalles de factura | ✅    | ✅       | ✅ (solo suyas) |
| **Estadísticas**        |
| Ver dashboard           | ✅    | ❌       | ❌              |
| Ver reportes            | ✅    | ❌       | ❌              |

---

## 🔒 Implementación Técnica

### Middlewares de Autenticación

```javascript
// 1. authenticateToken - Verifica que el usuario esté autenticado
router.get("/api/ordenes", authenticateToken, getOrdenes);

// 2. isAdmin - Solo administradores
router.post("/api/usuarios", authenticateToken, isAdmin, createUsuario);

// 3. isMecanicoOrAdmin - Mecánicos y administradores
router.post("/api/ordenes", authenticateToken, isMecanicoOrAdmin, createOrden);

// 4. isOwnerOrAdmin - Solo el dueño o administrador
router.get("/api/clientes/:id", authenticateToken, isOwnerOrAdmin, getCliente);
```

### Flujo de Autenticación

```
1. Usuario hace login → Recibe JWT token
2. Usuario envía request con token en header:
   Authorization: Bearer <token>
3. Middleware verifica token
4. Si válido → Continúa
5. Si inválido → 403 Forbidden
```

---

## 🎯 Casos de Uso

### Caso 1: Admin crea un mecánico

```
1. Admin hace login
2. Va a "Gestión de Usuarios"
3. Click "Nuevo Usuario"
4. Completa formulario:
   - Nombre: Carlos Méndez
   - Email: cmendez@taller.com
   - Contraseña: mecanico123
   - Rol: Mecánico
5. Sistema crea el usuario
6. Carlos ya puede hacer login
```

### Caso 2: Mecánico registra una orden

```
1. Mecánico hace login
2. Cliente llega con su vehículo
3. Mecánico busca/crea el cliente
4. Registra el vehículo
5. Crea orden de servicio
6. Actualiza estado a "reparando"
7. Agrega repuestos usados
8. Cambia estado a "finalizado"
9. Admin genera la factura
```

### Caso 3: Cliente consulta su orden

```
1. Cliente hace login
2. Ve "Mis Órdenes"
3. Solo ve sus propias órdenes
4. Click en una orden → Ve detalles completos
5. Ve estado, repuestos, costo
```

---

## 🛡️ Seguridad

### Contraseñas

- ✅ Hasheadas con bcrypt (10 rounds)
- ✅ Mínimo 6 caracteres
- ✅ No se almacenan en texto plano

### Tokens JWT

- ✅ Expiración: 24 horas
- ✅ Incluye: id, email, rol, nombre
- ✅ Firmado con JWT_SECRET

### Validaciones

- ✅ Emails únicos
- ✅ Roles válidos
- ✅ Permisos por endpoint
- ✅ Protección contra SQL injection (pg library)

---

## 📱 Interfaz según Rol

### Admin ve:

```
📊 Dashboard (con estadísticas)
👥 Clientes
🚗 Vehículos
🔧 Órdenes de Servicio
📦 Repuestos
💰 Facturas
👤 Usuarios
```

### Mecánico ve:

```
📊 Dashboard (con accesos a Órdenes y Repuestos)
🚗 Vehículos (solo consulta)
🔧 Órdenes de Servicio
📦 Repuestos (solo consulta)
```

### Cliente ve:

```
📊 Dashboard (con accesos a Mis Vehículos, Mis Órdenes y Mis Facturas)
🚗 Mis Vehículos
🔧 Mis Órdenes
💰 Mis Facturas
```

---

## 🔄 Flujo de Trabajo Típico

```
1. Admin del taller inicia el sistema
2. Admin crea cuentas para mecánicos
3. Cliente llega al taller
4. Mecánico/Admin registra cliente en el sistema
5. Mecánico crea orden de servicio
6. Mecánico actualiza estados mientras repara
7. Mecánico agrega repuestos usados (stock se actualiza automáticamente)
8. Admin genera factura
9. Cliente hace login y ve:
   - Sus vehículos en "Mis Vehículos"
   - Sus órdenes en "Mis Órdenes"
   - El estado actual de cada reparación
   - Detalles completos de costos
```

## ✨ Características Recientes

### Nuevas Páginas para Clientes

#### 🚗 Mis Vehículos

- Muestra la flota del cliente
- Estado actual de reparación de cada vehículo
- Historial expandible de órdenes por vehículo
- Estados visibles: En Diagnóstico, Reparando, Finalizado (Listo para recoger), Entregado

#### 🔧 Mis Órdenes

- Lista todas las órdenes del cliente
- Filtros: Todas, En Proceso, Completadas
- Detalles completos: diagnóstico, repuestos, costos, fechas
- Barra de progreso visual
- Timeline interactivo de estados

#### 💰 Mis Facturas - 🆕

- Consulta sus comprobantes de pago
- Filtrar por estado: Pendiente, Pagada, Anulada
- Buscar por número de factura
- Ver detalles de la orden asociada
- Ver resumen de costos (mano de obra, repuestos, total)
- Descargar factura en PDF (próximamente)

### Dashboard Personalizado

El dashboard ahora muestra diferentes accesos según el rol:

- **Admin**: 6 accesos (Gestionar Clientes, Vehículos, Órdenes, Repuestos, Facturas, Usuarios) + estadísticas
- **Mecánico**: 2 accesos (Órdenes, Repuestos)
- **Cliente**: 2 accesos (Mis Vehículos, Mis Órdenes)

### Sidebar Dinámico

El menú lateral se adapta automáticamente al rol:

- **Mecánico**: Ya NO ve "Clientes" (antes sí lo veía)
- **Cliente**: Solo ve Dashboard, Mis Vehículos, Mis Órdenes
- **Admin**: Acceso a todo

### Control de Vehículos

- **Antes**: Mecánico podía crear vehículos
- **Ahora**: Solo Admin puede crear vehículos
- **Mecánico**: Solo puede ver y editar vehículos existentes

### Modal Mejorado para Repuestos

- Interfaz elegante en lugar de prompts
- Dropdown con lista de repuestos disponibles
- Muestra stock disponible en tiempo real
- Cálculo automático de subtotal
- Validación de stock
- Stock se actualiza automáticamente en la base de datos

---

## 🔄 Flujo de Trabajo Típico

---

## 🎓 Justificación para el Proyecto

Este sistema de roles y permisos permite:

✅ **Seguridad:** Solo usuarios autorizados acceden al sistema  
✅ **Control:** Admin tiene control total  
✅ **Eficiencia:** Mecánicos trabajan sin obstáculos  
✅ **Transparencia:** Clientes ven su información  
✅ **Auditabilidad:** Se sabe quién hizo qué  
✅ **Escalabilidad:** Fácil agregar más roles
