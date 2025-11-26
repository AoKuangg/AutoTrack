import jwt from 'jsonwebtoken';

// Middleware para verificar token JWT
export const authenticateToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_super_seguro', (err, usuario) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
      }

      // Agregar datos del usuario al request
      req.usuario = usuario;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware para verificar rol de administrador
export const isAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({ 
      error: 'Acceso denegado. Se requieren permisos de administrador.' 
    });
  }
  next();
};

// Middleware para verificar rol de mecánico o admin
export const isMecanicoOrAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'mecanico' && req.usuario.rol !== 'administrador') {
    return res.status(403).json({ 
      error: 'Acceso denegado. Se requieren permisos de mecánico o administrador.' 
    });
  }
  next();
};

// Middleware para verificar que el usuario accede solo a sus propios recursos
export const isOwnerOrAdmin = (req, res, next) => {
  const userId = parseInt(req.params.id);
  
  if (req.usuario.rol === 'administrador' || req.usuario.id === userId) {
    next();
  } else {
    return res.status(403).json({ 
      error: 'Acceso denegado. Solo puedes acceder a tus propios recursos.' 
    });
  }
};