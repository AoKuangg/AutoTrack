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
- Ver clientes
- Crear y editar clientes
- Ver y registrar vehículos
- Crear y gestionar órdenes de servicio
- Actualizar estado de órdenes
- Agregar/quitar repuestos a órdenes
- Ver repuestos disponibles
- Ver facturas de órdenes

❌ **NO puede:**
- Crear/eliminar usuarios
- Crear/editar/eliminar repuestos del inventario
- Ajustar stock de repuestos
- Generar facturas
- Ver estadísticas completas del taller
- Eliminar clientes o vehículos

---

### 🟢 CLIENTE
**Permisos:** Solo consulta de sus datos

✅ **Puede:**
- Ver sus propios vehículos
- Ver sus propias órdenes de servicio
- Ver el estado de sus reparaciones
- Ver sus facturas
- Cambiar su contraseña

❌ **NO puede:**
- Crear órdenes (lo hace el mecánico/admin)
- Ver datos de otros clientes
- Acceder a módulos administrativos
- Modificar información del taller

---

## 📊 Tabla de Permisos Detallada

| Funcionalidad | Admin | Mecánico | Cliente |
|--------------|-------|----------|---------|
| **Usuarios** |
| Crear usuarios | ✅ | ❌ | ❌ |
| Ver usuarios | ✅ | ❌ | ❌ |
| Editar usuarios | ✅ | ❌ | ❌ |
| Eliminar usuarios | ✅ | ❌ | ❌ |
| Resetear contraseñas | ✅ | ❌ | ❌ |
| **Clientes** |
| Ver clientes | ✅ | ✅ | ❌ |
| Crear clientes | ✅ | ✅ | ❌ |
| Editar clientes | ✅ | ✅ | ❌ |
| Eliminar clientes | ✅ | ❌ | ❌ |
| **Vehículos** |
| Ver vehículos | ✅ | ✅ | ✅ (solo suyos) |
| Registrar vehículos | ✅ | ✅ | ❌ |
| Editar vehículos | ✅ | ✅ | ❌ |
| Eliminar vehículos | ✅ | ❌ | ❌ |
| **Órdenes** |
| Ver órdenes | ✅ | ✅ | ✅ (solo suyas) |
| Crear órdenes | ✅ | ✅ | ❌ |
| Editar órdenes | ✅ | ✅ | ❌ |
| Cambiar estado | ✅ | ✅ | ❌ |
| Agregar repuestos | ✅ | ✅ | ❌ |
| **Repuestos** |
| Ver repuestos | ✅ | ✅ | ❌ |
| Crear repuestos | ✅ | ❌ | ❌ |
| Editar repuestos | ✅ | ❌ | ❌ |
| Ajustar stock | ✅ | ❌ | ❌ |
| Eliminar repuestos | ✅ | ❌ | ❌ |
| **Facturas** |
| Ver facturas | ✅ | ✅ | ✅ (solo suyas) |
| Generar facturas | ✅ | ❌ | ❌ |
| Cambiar estado factura | ✅ | ❌ | ❌ |
| **Estadísticas** |
| Ver dashboard | ✅ | ❌ | ❌ |
| Ver reportes | ✅ | ❌ | ❌ |

---

## 🔒 Implementación Técnica

### Middlewares de Autenticación

```javascript
// 1. authenticateToken - Verifica que el usuario esté autenticado
router.get('/api/ordenes', authenticateToken, getOrdenes);

// 2. isAdmin - Solo administradores
router.post('/api/usuarios', authenticateToken, isAdmin, createUsuario);

// 3. isMecanicoOrAdmin - Mecánicos y administradores
router.post('/api/ordenes', authenticateToken, isMecanicoOrAdmin, createOrden);

// 4. isOwnerOrAdmin - Solo el dueño o administrador
router.get('/api/clientes/:id', authenticateToken, isOwnerOrAdmin, getCliente);
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
📊 Dashboard
👥 Usuarios
👤 Clientes
🚗 Vehículos
🔧 Órdenes de Servicio
📦 Repuestos
💰 Facturas
📈 Reportes
```

### Mecánico ve:
```
👤 Clientes
🚗 Vehículos
🔧 Órdenes de Servicio
📦 Repuestos (solo consulta)
```

### Cliente ve:
```
🚗 Mis Vehículos
🔧 Mis Órdenes
💰 Mis Facturas
👤 Mi Perfil
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
7. Mecánico agrega repuestos usados
8. Admin genera factura
9. Cliente puede hacer login y ver su orden
```

---

## 🎓 Justificación para el Proyecto

Este sistema de roles y permisos permite:

✅ **Seguridad:** Solo usuarios autorizados acceden al sistema  
✅ **Control:** Admin tiene control total  
✅ **Eficiencia:** Mecánicos trabajan sin obstáculos  
✅ **Transparencia:** Clientes ven su información  
✅ **Auditabilidad:** Se sabe quién hizo qué  
✅ **Escalabilidad:** Fácil agregar más roles