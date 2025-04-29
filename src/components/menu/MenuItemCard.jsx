import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Card from "../common/Card";
import Button from "../common/Button";
import Modal from "../common/Modal";

const MenuItemCard = ({
  menuItem,
  onToggleAvailability,
  onDelete,
  loading = false,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Format price with discount if available
  const renderPrice = () => {
    if (menuItem.discountedPrice && menuItem.discountedPrice < menuItem.price) {
      return (
        <div className='flex items-center'>
          <span className='text-lg font-semibold text-gray-900'>
            ${menuItem.discountedPrice.toFixed(2)}
          </span>
          <span className='ml-2 text-sm text-gray-500 line-through'>
            ${menuItem.price.toFixed(2)}
          </span>
        </div>
      );
    }

    return (
      <span className='text-lg font-semibold text-gray-900'>
        ${menuItem.price.toFixed(2)}
      </span>
    );
  };

  // Handle delete confirmation
  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(menuItem._id);
  };

  return (
    <>
      <Card className='h-full'>
        <div className='flex flex-col h-full'>
          {/* Image */}
          <div className='relative pb-2/3 w-full mb-4'>
            <img
              src={menuItem.image || "/assets/images/default-food.jpg"}
              alt={menuItem.name}
              className='absolute h-48 w-full object-cover rounded-md'
            />
          </div>

          {/* Content */}
          <div className='flex-1'>
            {/* Title and availability toggle */}
            <div className='flex justify-between items-start mb-2'>
              <h3 className='text-lg font-semibold text-gray-900 truncate'>
                {menuItem.name}
              </h3>
              <button
                onClick={() => onToggleAvailability(menuItem._id)}
                disabled={loading}
                className='text-blue-600 hover:text-blue-800 disabled:opacity-50'
                title={
                  menuItem.available
                    ? "Mark as unavailable"
                    : "Mark as available"
                }
              >
                {menuItem.available ? (
                  <FaToggleOn size={24} className='text-green-500' />
                ) : (
                  <FaToggleOff size={24} className='text-gray-400' />
                )}
              </button>
            </div>

            {/* Category and dietary info */}
            <div className='flex flex-wrap gap-2 mb-2'>
              <span className='px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
                {menuItem.category}
              </span>

              {menuItem.isVeg && (
                <span className='px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full'>
                  Vegetarian
                </span>
              )}

              {menuItem.isVegan && (
                <span className='px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full'>
                  Vegan
                </span>
              )}

              {menuItem.isGlutenFree && (
                <span className='px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full'>
                  Gluten Free
                </span>
              )}

              {menuItem.featured && (
                <span className='px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full'>
                  Featured
                </span>
              )}
            </div>

            {/* Description */}
            <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
              {menuItem.description}
            </p>

            {/* Price */}
            <div className='mt-auto'>{renderPrice()}</div>
          </div>

          {/* Actions */}
          <div className='flex justify-between items-center pt-4 mt-4 border-t border-gray-200'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowDeleteConfirm(true)}
              loading={loading}
              disabled={loading}
              className='text-red-600 border-red-600 hover:bg-red-50'
            >
              <FaTrash className='mr-1' /> Delete
            </Button>

            <Link to={`/menu/edit/${menuItem._id}`}>
              <Button variant='outline' size='sm' disabled={loading}>
                <FaEdit className='mr-1' /> Edit
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title='Confirm Delete'
        showConfirmButtons
        confirmText='Delete'
        cancelText='Cancel'
        onConfirm={handleDelete}
        confirmButtonProps={{
          variant: "danger",
          loading: loading,
        }}
      >
        <p className='text-gray-700'>
          Are you sure you want to delete <strong>{menuItem.name}</strong>? This
          action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

export default MenuItemCard;
