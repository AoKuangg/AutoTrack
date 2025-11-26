// Estados de las órdenes de servicio
export const ESTADOS_ORDEN = {
  DIAGNOSTICO: 'diagnostico',
  REPARANDO: 'reparando',
  FINALIZADO: 'finalizado',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado'
};

// Labels de estados
export const ESTADOS_LABELS = {
  [ESTADOS_ORDEN.DIAGNOSTICO]: 'Diagnóstico',
  [ESTADOS_ORDEN.REPARANDO]: 'Reparando',
  [ESTADOS_ORDEN.FINALIZADO]: 'Finalizado',
  [ESTADOS_ORDEN.ENTREGADO]: 'Entregado',
  [ESTADOS_ORDEN.CANCELADO]: 'Cancelado'
};

// Colores de badges según estado
export const ESTADOS_COLORS = {
  [ESTADOS_ORDEN.DIAGNOSTICO]: 'bg-yellow-100 text-yellow-800',
  [ESTADOS_ORDEN.REPARANDO]: 'bg-blue-100 text-blue-800',
  [ESTADOS_ORDEN.FINALIZADO]: 'bg-green-100 text-green-800',
  [ESTADOS_ORDEN.ENTREGADO]: 'bg-gray-100 text-gray-800',
  [ESTADOS_ORDEN.CANCELADO]: 'bg-red-100 text-red-800'
};

// Roles de usuario
export const ROLES = {
  ADMIN: 'administrador',
  MECANICO: 'mecanico',
  CLIENTE: 'cliente'
};

// Labels de roles
export const ROLES_LABELS = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.MECANICO]: 'Mecánico',
  [ROLES.CLIENTE]: 'Cliente'
};

// Colores de roles
export const ROLES_COLORS = {
  [ROLES.ADMIN]: 'bg-purple-100 text-purple-800',
  [ROLES.MECANICO]: 'bg-blue-100 text-blue-800',
  [ROLES.CLIENTE]: 'bg-green-100 text-green-800'
};

// Estados de factura
export const ESTADOS_FACTURA = {
  PENDIENTE: 'pendiente',
  PAGADA: 'pagada',
  ANULADA: 'anulada'
};

// Métodos de pago
export const METODOS_PAGO = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'nequi', label: 'Nequi' },
  { value: 'daviplata', label: 'Daviplata' }
];

// Tipos de vehículo
export const TIPOS_VEHICULO = [
  { value: 'sedan', label: 'Sedán' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'van', label: 'Van' },
  { value: 'moto', label: 'Moto' }
];