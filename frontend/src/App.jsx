import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';

// Layout
import Layout from './components/common/Layout';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Vehiculos from './pages/Vehiculos';
import Ordenes from './pages/Ordenes';
import Repuestos from './pages/Repuestos';
import Facturas from './pages/Facturas';
import Usuarios from './pages/Usuarios';
import Perfil from './pages/Perfil';
import Configuracion from './pages/Configuracion';
import MisVehiculos from './pages/MisVehiculos';
import MisOrdenes from './pages/MisOrdenes';
import MisFacturas from './pages/MisFacturas';
import NotFound from './pages/NotFound';

// Componentes
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* Ruta pública - Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />

        {/* Rutas protegidas con Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Redireccionar / a /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard - Todos los roles */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Clientes - Admin y Mecánico */}
          <Route
            path="clientes"
            element={
              <ProtectedRoute allowedRoles={['administrador', 'mecanico']}>
                <Clientes />
              </ProtectedRoute>
            }
          />

          {/* Vehículos - Admin y Mecánico */}
          <Route
            path="vehiculos"
            element={
              <ProtectedRoute allowedRoles={['administrador', 'mecanico']}>
                <Vehiculos />
              </ProtectedRoute>
            }
          />

          {/* Órdenes - Admin y Mecánico */}
          <Route
            path="ordenes"
            element={
              <ProtectedRoute allowedRoles={['administrador', 'mecanico']}>
                <Ordenes />
              </ProtectedRoute>
            }
          />

          {/* Repuestos - Admin y Mecánico */}
          <Route
            path="repuestos"
            element={
              <ProtectedRoute allowedRoles={['administrador', 'mecanico']}>
                <Repuestos />
              </ProtectedRoute>
            }
          />

          {/* Facturas - Solo Admin */}
          <Route
            path="facturas"
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Facturas />
              </ProtectedRoute>
            }
          />

          {/* Usuarios - Solo Admin */}
          <Route
            path="usuarios"
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Usuarios />
              </ProtectedRoute>
            }
          />

          {/* Perfil - Todos los roles */}
          <Route path="perfil" element={<Perfil />} />

          {/* Configuración - Todos los roles */}
          <Route path="configuracion" element={<Configuracion />} />

          {/* Mis Vehículos - Solo Cliente */}
          <Route
            path="mis-vehiculos"
            element={
              <ProtectedRoute allowedRoles={['cliente']}>
                <MisVehiculos />
              </ProtectedRoute>
            }
          />

          {/* Mis Órdenes - Solo Cliente */}
          <Route
            path="mis-ordenes"
            element={
              <ProtectedRoute allowedRoles={['cliente']}>
                <MisOrdenes />
              </ProtectedRoute>
            }
          />

          {/* Mis Facturas - Solo Cliente */}
          <Route
            path="mis-facturas"
            element={
              <ProtectedRoute allowedRoles={['cliente']}>
                <MisFacturas />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;