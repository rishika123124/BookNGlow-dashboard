import { useMemo, useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
  };

  const removeToast = (toastId) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
}


