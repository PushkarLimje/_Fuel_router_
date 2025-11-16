import React, { createContext, useContext } from 'react';
import { useToast } from './Notifications';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const { showToast, ToastContainer } = useToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}