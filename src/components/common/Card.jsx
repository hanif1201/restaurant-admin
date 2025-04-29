import React from "react";

const Card = ({
  title,
  children,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footer,
  footerClassName = "",
}) => {
  return (
    <div
      className={`bg-white overflow-hidden shadow-sm rounded-lg ${className}`}
    >
      {title && (
        <div
          className={`px-4 py-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 ${headerClassName}`}
        >
          {title}
        </div>
      )}

      <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>{children}</div>

      {footer && (
        <div
          className={`px-4 py-3 bg-gray-50 border-t border-gray-200 ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
