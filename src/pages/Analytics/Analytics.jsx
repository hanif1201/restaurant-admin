import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import SalesChart from "../../components/dashboard/SalesChart";
import useRestaurant from "../../hooks/useRestaurant";
import useAlert from "../../hooks/useAlert";
import restaurantService from "../../api/restaurant";

const Analytics = () => {
  const { restaurant } = useRestaurant();
  const { error } = useAlert();

  const [timeframe, setTimeframe] = useState("week");
  const [salesData, setSalesData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!restaurant) return;

      try {
        setLoading(true);

        // Get analytics with selected timeframe
        const response = await restaurantService.getAnalytics(
          restaurant._id,
          timeframe
        );

        if (response.success) {
          // Set sales data for chart
          if (response.data.salesByDay) {
            setSalesData(
              response.data.salesByDay.map((item) => ({
                date: item.date,
                revenue: item.revenue,
                orderCount: item.orderCount,
              }))
            );
          }

          // Set top selling items
          if (response.data.topItems) {
            setTopItems(response.data.topItems);
          }
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [restaurant, timeframe, error]);

  // Timeframe options
  const timeframeOptions = [
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
    { value: "year", label: "Last 12 months" },
  ];

  return (
    <div>
      <PageTitle
        title='Analytics'
        subtitle="Track your restaurant's performance and trends"
      />

      {/* Timeframe selector */}
      <Card className='mb-6'>
        <div className='flex items-center'>
          <FaCalendarAlt className='text-gray-400 mr-2' />
          <span className='text-sm font-medium text-gray-700 mr-4'>
            Timeframe:
          </span>
          <div className='flex space-x-2'>
            {timeframeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeframe(option.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  timeframe === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Sales Chart */}
      <div className='mb-6'>
        <SalesChart salesData={salesData} loading={loading} />
      </div>

      {/* Top Menu Items */}
      <Card title='Top Selling Items'>
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
            {topItems.length > 0 ? (
              topItems.map((item, index) => (
                <div key={item._id || index} className='flex items-center py-3'>
                  <div className='flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500'>
                    {index + 1}
                  </div>
                  <div className='ml-4 flex-1'>
                    <h4 className='text-sm font-medium text-gray-900'>
                      {item.name}
                    </h4>
                    <p className='text-sm text-gray-500'>
                      ${item.price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className='text-sm font-medium text-gray-900'>
                    {item.orderCount || 0} orders
                  </div>
                </div>
              ))
            ) : (
              <div className='py-4 text-center text-gray-500'>
                No sales data available for this period
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Revenue Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
        <Card title='Revenue Breakdown'>
          {loading ? (
            <div className='animate-pulse space-y-4 py-2'>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              <div className='h-4 bg-gray-200 rounded w-2/3'></div>
              <div className='h-4 bg-gray-200 rounded w-3/5'></div>
            </div>
          ) : (
            <div className='space-y-4 py-2'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Total Revenue</span>
                <span className='text-sm font-medium text-gray-900'>
                  $
                  {salesData
                    .reduce((sum, day) => sum + (day.revenue || 0), 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>
                  Average Order Value
                </span>
                <span className='text-sm font-medium text-gray-900'>
                  $
                  {salesData.length > 0
                    ? (
                        salesData.reduce(
                          (sum, day) => sum + (day.revenue || 0),
                          0
                        ) /
                        salesData.reduce(
                          (sum, day) => sum + (day.orderCount || 0),
                          0
                        )
                      ).toFixed(2)
                    : "0.00"}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Total Orders</span>
                <span className='text-sm font-medium text-gray-900'>
                  {salesData.reduce(
                    (sum, day) => sum + (day.orderCount || 0),
                    0
                  )}
                </span>
              </div>
            </div>
          )}
        </Card>

        <Card title='Customer Insights'>
          {loading ? (
            <div className='animate-pulse space-y-4 py-2'>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              <div className='h-4 bg-gray-200 rounded w-2/3'></div>
            </div>
          ) : (
            <div className='space-y-4 py-2'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Total Customers</span>
                <span className='text-sm font-medium text-gray-900'>
                  {/* This would come from actual API data */}
                  {Math.floor(
                    salesData.reduce(
                      (sum, day) => sum + (day.orderCount || 0),
                      0
                    ) * 0.7
                  )}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Repeat Customers</span>
                <span className='text-sm font-medium text-gray-900'>
                  {/* This would come from actual API data */}
                  {Math.floor(
                    salesData.reduce(
                      (sum, day) => sum + (day.orderCount || 0),
                      0
                    ) * 0.3
                  )}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Average Rating</span>
                <span className='text-sm font-medium text-gray-900'>
                  {restaurant?.averageRating?.toFixed(1) || "N/A"} / 5.0
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Generate Report Button */}
      <div className='mt-6 flex justify-end'>
        <Button variant='outline' className='mr-2'>
          Export Data
        </Button>
        <Button variant='primary'>Generate Full Report</Button>
      </div>
    </div>
  );
};

export default Analytics;
