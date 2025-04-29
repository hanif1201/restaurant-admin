import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

const Alert = ({ message, type = "info", onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Alert variants
  const variants = {
    success: {
      bg: "bg-green-100",
      border: "border-green-500",
      text: "text-green-800",
      icon: <FaCheckCircle className='w-5 h-5 text-green-500' />,
    },
    error: {
      bg: "bg-red-100",
      border: "border-red-500",
      text: "text-red-800",
      icon: <FaExclamationCircle className='w-5 h-5 text-red-500' />,
    },
    warning: {
      bg: "bg-yellow-100",
      border: "border-yellow-500",
      text: "text-yellow-800",
      icon: <FaExclamationTriangle className='w-5 h-5 text-yellow-500' />,
    },
    info: {
      bg: "bg-blue-100",
      border: "border-blue-500",
      text: "text-blue-800",
      icon: <FaInfoCircle className='w-5 h-5 text-blue-500' />,
    },
  };

  const variant = variants[type] || variants.info;

  // Handle fade out animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300); // Wait for animation to complete
  };

  // Auto close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        ${variant.bg} ${variant.border} ${
        variant.text
      } border-l-4 p-4 mb-3 rounded shadow-md
        transition-opacity duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      role='alert'
    >
      <div className='flex items-start'>
        <div className='flex-shrink-0 mt-0.5'>{variant.icon}</div>

        <div className='ml-3 flex-1'>
          <p className='text-sm font-medium'>{message}</p>
        </div>

        <button
          onClick={handleClose}
          className='ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8'
        >
          <span className='sr-only'>Close</span>
          <FaTimes className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
};

export default Alert;
