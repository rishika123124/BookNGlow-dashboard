'use client';

import { useState, useCallback } from 'react';

// Simple toast implementation
let toastCount = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default" }) => {
    const id = toastCount++;
    const newToast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
    
    return id;
  }, []);

  const dismiss = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  return {
    toast,
    dismiss,
    toasts
  };
}

// Toast provider component
export function Toaster() {
  const { toasts } = useToast();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          className={`
            p-4 rounded-lg shadow-lg border max-w-sm animate-in slide-in-from-right
            ${variant === "destructive" 
              ? "bg-red-600 text-white border-red-700" 
              : "bg-slate-900 text-white border-slate-700"
            }
          `}
        >
          <div className="font-semibold">{title}</div>
          {description && (
            <div className="text-sm opacity-90 mt-1">{description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
