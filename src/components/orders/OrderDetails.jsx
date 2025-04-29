import React from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaExclamationCircle,
} from "react-icons/fa";
import Card from "../common/Card";
import OrderStatusUpdate from "./OrderStatusUpdate";

const OrderDetails = ({ order, onUpdateStatus, loading = false }) => {
  if (!order) return null;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      preparing: "bg-indigo-100 text-indigo-800",
      ready_for_pickup: "bg-purple-100 text-purple-800",
      assigned_to_rider: "bg-pink-100 text-pink-800",
      picked_up: "bg-cyan-100 text-cyan-800",
      on_the_way: "bg-teal-100 text-teal-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return `px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
      statusClasses[status] || "bg-gray-100 text-gray-800"
    }`;
  };

  // Format status
  const formatStatus = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className='space-y-6'>
      {/* Order Header */}
      <Card>
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>
              Order #{order._id.slice(-6)}
            </h2>
            <p className='text-sm text-gray-500'>
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className='mt-4 lg:mt-0'>
            <span className={getStatusBadgeClass(order.status)}>
              {formatStatus(order.status)}
            </span>
          </div>
        </div>

        {/* Status Update Controls */}
        <OrderStatusUpdate
          order={order}
          onUpdateStatus={onUpdateStatus}
          loading={loading}
        />
      </Card>

      {/* Order Info and Customer Details */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Customer Details */}
        <Card title='Customer Information'>
          <div className='space-y-4'>
            {order.user && (
              <>
                <div className='flex items-start'>
                  <FaUser className='mt-1 text-gray-400 mr-3' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      {order.user.name}
                    </p>
                    <p className='text-sm text-gray-500'>{order.user.email}</p>
                  </div>
                </div>

                {order.user.phone && (
                  <div className='flex items-start'>
                    <FaPhone className='mt-1 text-gray-400 mr-3' />
                    <div>
                      <p className='text-sm text-gray-900'>
                        {order.user.phone}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className='flex items-start'>
              <FaMapMarkerAlt className='mt-1 text-gray-400 mr-3' />
              <div>
                <p className='text-sm font-medium text-gray-900'>
                  Delivery Address
                </p>
                <p className='text-sm text-gray-500'>
                  {order.deliveryAddress.address}
                </p>
                {order.deliveryAddress.instructions && (
                  <p className='text-sm text-gray-500 mt-1'>
                    <span className='font-medium'>Instructions:</span>{" "}
                    {order.deliveryAddress.instructions}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Order Info */}
        <Card title='Order Information'>
          <div className='space-y-4'>
            <div className='flex items-start'>
              <FaClock className='mt-1 text-gray-400 mr-3' />
              <div>
                <p className='text-sm font-medium text-gray-900'>
                  Estimated Delivery
                </p>
                {order.estimatedDeliveryTime ? (
                  <p className='text-sm text-gray-500'>
                    {formatDate(order.estimatedDeliveryTime)}
                  </p>
                ) : (
                  <p className='text-sm text-gray-500'>Not available yet</p>
                )}

                {order.actualDeliveryTime && (
                  <>
                    <p className='text-sm font-medium text-gray-900 mt-2'>
                      Actual Delivery
                    </p>
                    <p className='text-sm text-gray-500'>
                      {formatDate(order.actualDeliveryTime)}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className='flex items-start'>
              <FaMoneyBillWave className='mt-1 text-gray-400 mr-3' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Payment</p>
                <p className='text-sm text-gray-500 capitalize'>
                  Method: {order.paymentMethod.replace("_", " ")}
                </p>
                <p className='text-sm text-gray-500 capitalize'>
                  Status: {order.paymentStatus.replace("_", " ")}
                </p>
              </div>
            </div>

            {order.status === "cancelled" && order.cancellationReason && (
              <div className='flex items-start'>
                <FaExclamationCircle className='mt-1 text-red-500 mr-3' />
                <div>
                  <p className='text-sm font-medium text-red-700'>
                    Cancellation Reason
                  </p>
                  <p className='text-sm text-red-500'>
                    {order.cancellationReason}
                  </p>
                  {order.cancelledBy && (
                    <p className='text-sm text-gray-500 mt-1'>
                      Cancelled by:{" "}
                      <span className='capitalize'>{order.cancelledBy}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card title='Order Items'>
        <div className='flow-root'>
          <ul className='divide-y divide-gray-200'>
            {order.items.map((item, index) => (
              <li key={index} className='py-4'>
                <div className='flex items-center space-x-4'>
                  <div className='flex-shrink-0'>
                    <div className='h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500'>
                      {index + 1}
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {item.name}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>

                    {/* Customizations */}
                    {item.customizations && item.customizations.length > 0 && (
                      <div className='mt-1'>
                        {item.customizations.map((customization, custIndex) => (
                          <div
                            key={custIndex}
                            className='text-xs text-gray-500 mt-1'
                          >
                            <span className='font-medium'>
                              {customization.name}:
                            </span>{" "}
                            {customization.options
                              .map((opt) => opt.name)
                              .join(", ")}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className='flex-shrink-0 text-sm font-medium text-gray-900'>
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className='mt-6 border-t border-gray-200 pt-4'>
          <div className='flex justify-between text-sm'>
            <p className='text-gray-500'>Subtotal</p>
            <p className='font-medium text-gray-900'>
              {formatCurrency(order.subtotal)}
            </p>
          </div>

          <div className='flex justify-between text-sm mt-2'>
            <p className='text-gray-500'>Delivery Fee</p>
            <p className='font-medium text-gray-900'>
              {formatCurrency(order.deliveryFee)}
            </p>
          </div>

          <div className='flex justify-between text-sm mt-2'>
            <p className='text-gray-500'>Tax</p>
            <p className='font-medium text-gray-900'>
              {formatCurrency(order.taxAmount)}
            </p>
          </div>

          {order.discount > 0 && (
            <div className='flex justify-between text-sm mt-2'>
              <p className='text-gray-500'>Discount</p>
              <p className='font-medium text-green-600'>
                -{formatCurrency(order.discount)}
              </p>
            </div>
          )}

          <div className='flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-200'>
            <p className='text-gray-900'>Total</p>
            <p className='text-gray-900'>{formatCurrency(order.total)}</p>
          </div>
        </div>
      </Card>

      {/* Order History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <Card title='Order Timeline'>
          <div className='flow-root'>
            <ul className='divide-y divide-gray-200'>
              {order.statusHistory.map((statusItem, index) => (
                <li key={index} className='py-3'>
                  <div className='flex items-start space-x-4'>
                    <div className='flex-shrink-0'>
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusBadgeClass(
                          statusItem.status
                        )
                          .replace("text-", "bg-")
                          .replace("bg-", "text-")}`}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900'>
                        {formatStatus(statusItem.status)}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {formatDate(statusItem.time)}
                      </p>
                      {statusItem.note && (
                        <p className='text-sm text-gray-500 mt-1'>
                          Note: {statusItem.note}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrderDetails;
