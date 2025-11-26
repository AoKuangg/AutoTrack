import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Package,
  FileText,
  UserCog
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { usuario, isAdmin, isMecanicoOrAdmin } = useAuth();

  // Configuración de menú según rol
  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['administrador', 'mecanico', 'cliente']
    },
    {
      name: 'Clientes',
      icon: Users,
      path: '/clientes',
      roles: ['administrador', 'mecanico']
    },
    {
      name: 'Vehículos',
      icon: Car,
      path: '/vehiculos',
      roles: ['administrador', 'mecanico']
    },
    {
      name: 'Órdenes',
      icon: Wrench,
      path: '/ordenes',
      roles: ['administrador', 'mecanico']
    },
    {
      name: 'Repuestos',
      icon: Package,
      path: '/repuestos',
      roles: ['administrador', 'mecanico']
    },
    {
      name: 'Facturas',
      icon: FileText,
      path: '/facturas',
      roles: ['administrador']
    },
    {
      name: 'Usuarios',
      icon: UserCog,
      path: '/usuarios',
      roles: ['administrador']
    }
  ];

  // Filtrar menú según rol del usuario
  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(usuario?.rol)
  );

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 pt-16`}
      >
        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Cerrar sidebar en móvil al hacer clic
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer con información del usuario */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p className="font-medium text-gray-900 mb-1">{usuario?.nombre}</p>
            <p className="capitalize">{usuario?.rol}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;