import React, { createContext, useState, useCallback } from "react";

// Create alert context
export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Add a new alert
  const addAlert = useCallback((message, type = "info", timeout = 5000) => {
    const id = Date.now();

    setAlerts((current) => [...current, { id, message, type }]);

    // Auto remove after timeout
    if (timeout > 0) {
      setTimeout(() => {
        // removeAlert(id);
      }, timeout);
    }

    return id;
  }, []);

  // Remove an alert by ID
  const removeAlert = useCallback((id) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  }, []);

  // Convenience methods for different alert types
  const success = useCallback(
    (message, timeout) => {
      return addAlert(message, "success", timeout);
    },
    [addAlert]
  );

  const error = useCallback(
    (message, timeout) => {
      return addAlert(message, "error", timeout);
    },
    [addAlert]
  );

  const warning = useCallback(
    (message, timeout) => {
      return addAlert(message, "warning", timeout);
    },
    [addAlert]
  );

  const info = useCallback(
    (message, timeout) => {
      return addAlert(message, "info", timeout);
    },
    [addAlert]
  );

  // Context value
  const value = {
    alerts,
    addAlert,
    removeAlert,
    success,
    error,
    warning,
    info,
  };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

export default AlertContext;
