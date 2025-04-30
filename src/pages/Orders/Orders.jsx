import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import PageTitle from "../../components/common/PageTitle";
import OrderFilter from "../../components/orders/OrderFilter";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import useRestaurant from "../../hooks/useRestaurant";
import useAlert from "../../hooks/useAlert";
import orderService from "../../api/orders";

const Orders = () => {
  const { restaurant } = useRestaurant();
  const { error } = useAlert();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
  });

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!restaurant) {
        console.log("No restaurant data in Orders component");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching orders for restaurant:", restaurant._id);

        // Prepare query parameters
        const queryParams = {};

        if (filters.status) {
          queryParams.status = filters.status;
        }

        if (filters.startDate) {
          queryParams.startDate = new Date(filters.startDate).toISOString();
        }

        if (filters.endDate) {
          queryParams.endDate = new Date(filters.endDate).toISOString();
        }

        const response = await orderService.getOrders(queryParams);
        console.log("Orders response:", response);

        if (response.success) {
          // Ensure we have the data array before processing
          const ordersData = response.data || [];
          console.log("Processing orders data:", ordersData);

          // If search term is provided, filter orders client-side
          let filteredOrders = ordersData;

          if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filteredOrders = filteredOrders.filter(
              (order) =>
                (order._id && order._id.toLowerCase().includes(searchLower)) ||
                (order.user &&
                  order.user.name &&
                  order.user.name.toLowerCase().includes(searchLower))
            );
          }

          console.log("Setting filtered orders:", filteredOrders.length);
          setOrders(filteredOrders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [restaurant, filters, error]);

  // Handle filter changes
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle row click
  const handleRowClick = (order) => {
    navigate(`/orders/${order._id}`);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Get status badge class
  const getStatusBadge = (status) => {
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

    return `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
      statusClasses[status] || "bg-gray-100 text-gray-800"
    }`;
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Table columns
  const columns = [
    {
      header: "Order ID",
      accessor: "_id",
      render: (row) => `#${row._id.slice(-6)}`,
    },
    {
      header: "Customer",
      accessor: "user",
      render: (row) => row.user?.name || "N/A",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span className={getStatusBadge(row.status)}>
          {formatStatus(row.status)}
        </span>
      ),
    },
    {
      header: "Total",
      accessor: "total",
      render: (row) => `$${row.total.toFixed(2)}`,
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (row) => formatDate(row.createdAt),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <Button
          variant='outline'
          size='xs'
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/orders/${row._id}`);
          }}
        >
          <FaEye className='mr-1' /> View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageTitle
        title='Orders'
        subtitle='Manage and track all customer orders'
      />

      {/* Order Filters */}
      <OrderFilter onFilter={handleFilter} />

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          data={orders}
          loading={loading}
          emptyMessage='No orders found matching your filters'
          onRowClick={handleRowClick}
        />
      </Card>
    </div>
  );
};

export default Orders;
