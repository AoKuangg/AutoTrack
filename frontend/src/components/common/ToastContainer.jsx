import { useCallback } from 'react';
import { toast } from 'react-toastify';

// Hook para manejar toasts con react-toastify
export const useToast = () => {
  const success = useCallback((message, duration = 4000) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const error = useCallback((message, duration = 5000) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const warning = useCallback((message, duration = 4000) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const info = useCallback((message, duration = 4000) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  return { success, error, warning, info };
};

export default useToast;
