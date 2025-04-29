import React, { useState, useEffect } from "react";
import {
  FaUtensils,
  FaShoppingBag,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";
import PageTitle from "../components/common/PageTitle";
import StatCard from "../components/dashboard/StatCard";
import RecentOrders from "../components/dashboard/RecentOrders";
import SalesChart from "../components/dashboard/SalesChart";
import Card from "../components/common/Card";
import useAuth from "../hooks/useAuth";
import useAlert from "../hooks/useAlert";
import orderService from "../api/orders";
import restaurantService from "../api/restaurant";

const Dashboard = () => {
  const { restaurant } = useAuth();
  const { error } = useAlert();

  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!restaurant) return;

      try {
        setLoading(true);

        // Get orders for stats
        const ordersResponse = await orderService.getOrders();

        // Get recent orders
        setRecentOrders(ordersResponse.data.data.slice(0, 5));

        // Get analytics
        const analyticsResponse = await restaurantService.getAnalytics(
          restaurant._id
        );

        if (analyticsResponse.success) {
          // Calculate stats
          const pendingOrders = ordersResponse.data.data.filter(
            (order) => order.status === "pending"
          ).length;

          // Get today's orders
          const today = new Date().toISOString().split("T")[0];
          const todayOrders = ordersResponse.data.data.filter(
            (order) =>
              new Date(order.createdAt).toISOString().split("T")[0] === today
          ).length;

          setStats({
            todayOrders,
            pendingOrders,
            totalRevenue: analyticsResponse.data.totalRevenue || 0,
            averageRating: restaurant.averageRating || 0,
          });

          // Format sales data for chart
          if (analyticsResponse.data.salesByDay) {
            setSalesData(
              analyticsResponse.data.salesByDay.map((item) => ({
                date: item.date,
                revenue: item.revenue,
                orderCount: item.orderCount,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [restaurant, error]);

  return (
    <div>
      <PageTitle
        title='Dashboard'
        subtitle='Overview of your restaurant performance'
      />

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          icon={<FaShoppingBag size={24} />}
          loading={loading}
        />

        <StatCard
          title='Pending Orders'
          value={stats.pendingOrders}
          icon={<FaUtensils size={24} />}
          loading={loading}
        />

        <StatCard
          title='Total Revenue'
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<FaMoneyBillWave size={24} />}
          loading={loading}
        />

        <StatCard
          title='Average Rating'
          value={stats.averageRating.toFixed(1)}
          icon={<FaStar size={24} />}
          loading={loading}
        />
      </div>

      {/* Charts and Tables */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Sales Chart */}
        <SalesChart salesData={salesData} loading={loading} />

        {/* Popular Items */}
        <Card title='Popular Items'>
          {loading ? (
            <div className='animate-pulse'>
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className='flex items-center py-3 border-b border-gray-200 last:border-0'
                >
                  <div className='h-10 w-10 bg-gray-200 rounded-md'></div>
                  <div className='ml-4 flex-1'>
                    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                    <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                  </div>
                  <div className='h-6 bg-gray-200 rounded w-16'></div>
                </div>
              ))}
            </div>
          ) : (
            <div className='divide-y divide-gray-200'>
              {restaurant?.menuItems?.length > 0 ? (
                restaurant.menuItems
                  .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={item._id} className='flex items-center py-3'>
                      <div className='flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500'>
                        {index + 1}
                      </div>
                      <div className='ml-4 flex-1'>
                        <h4 className='text-sm font-medium text-gray-900'>
                          {item.name}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className='text-sm font-medium text-gray-900'>
                        {item.orderCount || 0} orders
                      </div>
                    </div>
                  ))
              ) : (
                <div className='py-4 text-center text-gray-500'>
                  No items data available
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Orders */}
      <div className='mt-6'>
        <RecentOrders orders={recentOrders} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
