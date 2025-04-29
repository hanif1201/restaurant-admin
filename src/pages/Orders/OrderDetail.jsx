import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import PageTitle from "../../components/common/PageTitle";
import OrderDetails from "../../components/orders/OrderDetails";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import useAuth from "../../hooks/useAuth";
import useAlert from "../../hooks/useAlert";
import orderService from "../../api/orders";

const OrderDetail = () => {
  const { id } = useParams();
  const { restaurant } = useAuth();
  const { success, error } = useAlert();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!restaurant || !id) return;

      try {
        setLoading(true);
        const response = await orderService.getOrder(id);

        if (response.success) {
          setOrder(response.data);
        } else {
          error("Order not found");
          navigate("/orders");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        error("Failed to load order details");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, restaurant, error, navigate]);

  // Handle order status update
  const handleUpdateStatus = async (statusData) => {
    try {
      setUpdating(true);

      const response = await orderService.updateOrderStatus(id, statusData);

      if (response.success) {
        setOrder(response.data);
        success(
          `Order status updated to ${statusData.status
            .replace(/_/g, " ")
            .toUpperCase()}`
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      error(err.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className='mb-6 flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center mb-4 md:mb-0'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate("/orders")}
            className='mr-4'
          >
            <FaArrowLeft className='mr-2' /> Back to Orders
          </Button>

          <h1 className='text-2xl font-semibold text-gray-900'>
            {order ? `Order #${order._id.slice(-6)}` : "Order Details"}
          </h1>
        </div>
      </div>

      {loading ? (
        <Card>
          <div className='animate-pulse space-y-6'>
            <div className='h-6 bg-gray-200 rounded w-1/4'></div>
            <div className='h-6 bg-gray-200 rounded w-1/2'></div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                <div className='h-6 bg-gray-200 rounded w-3/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                <div className='h-6 bg-gray-200 rounded w-full'></div>
              </div>
              <div className='space-y-4'>
                <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                <div className='h-6 bg-gray-200 rounded w-3/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                <div className='h-6 bg-gray-200 rounded w-full'></div>
              </div>
            </div>
          </div>
        </Card>
      ) : order ? (
        <OrderDetails
          order={order}
          onUpdateStatus={handleUpdateStatus}
          loading={updating}
        />
      ) : (
        <Card>
          <div className='text-center py-8'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Order Not Found
            </h3>
            <p className='text-gray-500'>
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrderDetail;
