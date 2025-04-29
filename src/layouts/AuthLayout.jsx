import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Alert from "../components/common/Alert";
import useAlert from "../hooks/useAlert";

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const { alerts, removeAlert } = useAlert();

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && !loading) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      {/* Alert notifications */}
      <div className='fixed top-4 right-4 z-50 w-72'>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            message={alert.message}
            type={alert.type}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>

      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <img
          className='mx-auto h-16 w-auto'
          src='/assets/images/logo.png'
          alt='GoChop Restaurant Portal'
        />
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Restaurant Admin Portal
        </h2>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          {/* Render the current auth page (Login, ForgotPassword, etc.) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
