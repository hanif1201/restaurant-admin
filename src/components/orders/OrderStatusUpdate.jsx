import React, { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";

const OrderStatusUpdate = ({
  order,
  onUpdateStatus,
  loading = false,
  allowedStatuses = [],
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [note, setNote] = useState("");

  // Open modal with a pre-selected status
  const openStatusModal = (status) => {
    setSelectedStatus(status);
    setNote("");
    setShowModal(true);
  };

  // Handle status update
  const handleUpdateStatus = () => {
    onUpdateStatus({
      status: selectedStatus,
      note,
    });
    setShowModal(false);
  };

  // Get the next allowed statuses based on current status
  const getNextStatuses = () => {
    if (!order) return [];

    // If specific allowed statuses are provided, use those
    if (allowedStatuses.length > 0) {
      return allowedStatuses;
    }

    // Default status flows
    const statusFlows = {
      pending: ["accepted", "cancelled"],
      accepted: ["preparing", "cancelled"],
      preparing: ["ready_for_pickup", "cancelled"],
      ready_for_pickup: ["picked_up", "cancelled"],
      picked_up: ["on_the_way", "cancelled"],
      on_the_way: ["delivered", "cancelled"],
      // Terminal states
      delivered: [],
      cancelled: [],
    };

    return statusFlows[order.status] || [];
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get color class for status button
  const getStatusButtonClass = (status) => {
    const statusClasses = {
      accepted: "bg-blue-600 hover:bg-blue-700",
      preparing: "bg-indigo-600 hover:bg-indigo-700",
      ready_for_pickup: "bg-purple-600 hover:bg-purple-700",
      picked_up: "bg-cyan-600 hover:bg-cyan-700",
      on_the_way: "bg-teal-600 hover:bg-teal-700",
      delivered: "bg-green-600 hover:bg-green-700",
      cancelled: "bg-red-600 hover:bg-red-700",
    };

    return statusClasses[status] || "bg-gray-600 hover:bg-gray-700";
  };

  const nextStatuses = getNextStatuses();

  // If no next statuses, don't render anything
  if (nextStatuses.length === 0) {
    return null;
  }

  return (
    <>
      <div className='mt-4'>
        <h3 className='text-sm font-medium text-gray-700 mb-2'>
          Update Order Status
        </h3>
        <div className='flex flex-wrap gap-2'>
          {nextStatuses.map((status) => (
            <Button
              key={status}
              onClick={() => openStatusModal(status)}
              className={`${getStatusButtonClass(status)} text-white`}
              disabled={loading}
            >
              {formatStatus(status)}
            </Button>
          ))}
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Update Order to ${formatStatus(selectedStatus)}`}
        showConfirmButtons
        confirmText='Update Status'
        cancelText='Cancel'
        onConfirm={handleUpdateStatus}
        confirmButtonProps={{
          loading,
          className: getStatusButtonClass(selectedStatus),
        }}
      >
        <div>
          <p className='mb-4 text-gray-700'>
            Are you sure you want to update this order to{" "}
            <strong>{formatStatus(selectedStatus)}</strong>?
          </p>

          <div>
            <label
              htmlFor='note'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Add a Note (Optional)
            </label>
            <textarea
              id='note'
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='Add any additional information or notes...'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            />
          </div>

          {selectedStatus === "cancelled" && (
            <div className='mt-4 p-3 bg-red-50 text-red-800 rounded-md'>
              <p className='text-sm font-medium'>
                Warning: Cancelling an order cannot be undone!
              </p>
              <p className='text-sm mt-1'>
                If the order has online payment, the system will attempt to
                process a refund automatically.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default OrderStatusUpdate;
