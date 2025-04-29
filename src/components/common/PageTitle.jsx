import React from "react";
import Button from "./Button";

const PageTitle = ({
  title,
  subtitle,
  actionButton,
  actionButtonText,
  actionButtonIcon,
  onActionButtonClick,
  actionButtonProps = {},
  className = "",
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>{title}</h1>
          {subtitle && <p className='mt-1 text-sm text-gray-500'>{subtitle}</p>}
        </div>

        {(actionButton || actionButtonText) && (
          <div className='mt-4 md:mt-0'>
            {actionButton || (
              <Button
                variant='primary'
                onClick={onActionButtonClick}
                {...actionButtonProps}
              >
                {actionButtonIcon && (
                  <span className='mr-2'>{actionButtonIcon}</span>
                )}
                {actionButtonText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
