import React from "react";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import Card from "../common/Card";
import Table from "../common/Table";

const RecentOrders = ({ orders, loading }) => {
  // Helper to format date
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

  // Helper to get status badge style
  const getStatusBadge = (status) => {
    const statusStyles = {
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
      statusStyles[status] || "bg-gray-100 text-gray-800"
    }`;
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Column definitions
  const columns = [
    {
      header: "Order ID",
      accessor: "_id",
      render: (row) => `#${row._id.slice(-6)}`,
      width: "100px",
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
      header: "",
      accessor: "actions",
      render: (row) => (
        <Link
          to={`/orders/${row._id}`}
          className='text-blue-600 hover:text-blue-900'
        >
          <FaExternalLinkAlt />
        </Link>
      ),
      width: "50px",
    },
  ];

  return (
    <Card
      title='Recent Orders'
      footer={
        <Link
          to='/orders'
          className='text-sm text-blue-600 hover:text-blue-900'
        >
          View all orders
        </Link>
      }
    >
      <Table
        columns={columns}
        data={orders}
        loading={loading}
        emptyMessage='No recent orders'
        onRowClick={(row) => (window.location.href = `/orders/${row._id}`)}
      />
    </Card>
  );
};

export default RecentOrders;
