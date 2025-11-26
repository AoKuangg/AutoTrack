import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioGuardado = authService.getCurrentUser();
    setUsuario(usuarioGuardado);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUsuario(data.usuario);
      return data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const isAdmin = () => {
    return usuario?.rol === 'administrador';
  };

  const isMecanico = () => {
    return usuario?.rol === 'mecanico';
  };

  const isCliente = () => {
    return usuario?.rol === 'cliente';
  };

  const isMecanicoOrAdmin = () => {
    return isAdmin() || isMecanico();
  };

  const value = {
    usuario,
    loading,
    login,
    logout,
    isAdmin,
    isMecanico,
    isCliente,
    isMecanicoOrAdmin,
    isAuthenticated: !!usuario
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;