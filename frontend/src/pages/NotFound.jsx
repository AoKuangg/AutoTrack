import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="text-center">
        {/* 404 Grande */}
        <h1 className="text-9xl font-bold text-primary-600 mb-4">
          404
        </h1>

        {/* Mensaje */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Botones */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ir al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;