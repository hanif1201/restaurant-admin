import React, { useEffect, Fragment } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  footer,
  closeOnBackdrop = true,
  closeButton = true,
  showConfirmButtons = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  confirmButtonProps = {},
  cancelButtonProps = {},
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size styles
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 overflow-y-auto'
      role='dialog'
      aria-modal='true'
    >
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={handleBackdropClick}
      />

      {/* Modal container */}
      <div className='flex items-center justify-center min-h-screen p-4 text-center sm:p-0'>
        {/* Modal content */}
        <div
          className={`
          inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all
          sm:my-8 sm:align-middle ${sizeClasses[size] || sizeClasses.md} w-full
        `}
        >
          {/* Header */}
          {title && (
            <div className='px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between'>
              <h3 className='text-lg font-medium text-gray-900'>{title}</h3>

              {closeButton && (
                <button
                  onClick={onClose}
                  className='text-gray-400 hover:text-gray-500'
                >
                  <span className='sr-only'>Close</span>
                  <FaTimes className='h-5 w-5' />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className='px-4 py-5 sm:p-6'>{children}</div>

          {/* Footer */}
          {(footer || showConfirmButtons) && (
            <div className='px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse'>
              {showConfirmButtons ? (
                <Fragment>
                  <Button
                    variant='primary'
                    onClick={onConfirm}
                    className='w-full sm:w-auto sm:ml-3'
                    {...confirmButtonProps}
                  >
                    {confirmText}
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={onClose}
                    className='mt-3 sm:mt-0 w-full sm:w-auto'
                    {...cancelButtonProps}
                  >
                    {cancelText}
                  </Button>
                </Fragment>
              ) : (
                footer
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
