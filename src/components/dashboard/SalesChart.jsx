import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Card from "../common/Card";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = ({ salesData, loading = false }) => {
  // State for time period filter
  const [timePeriod, setTimePeriod] = useState("week");

  // Process the data based on selected time period
  const processData = () => {
    if (!salesData || !salesData.length) {
      return {
        labels: [],
        datasets: [],
      };
    }

    let filteredData = [...salesData];
    let labels = [];
    let revenue = [];
    let orders = [];

    // Filter and format data based on selected time period
    if (timePeriod === "week") {
      // Limit to last 7 days and format as "Mon, Tue, etc."
      filteredData = filteredData.slice(-7);
      labels = filteredData.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleDateString("en-US", { weekday: "short" });
      });
    } else if (timePeriod === "month") {
      // Limit to last 30 days and format as "Jan 1, Jan 2, etc."
      filteredData = filteredData.slice(-30);
      labels = filteredData.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      });
    } else if (timePeriod === "year") {
      // Group by month for year view
      const monthlyData = {};

      filteredData.forEach((d) => {
        const date = new Date(d.date);
        const monthYear = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { revenue: 0, orderCount: 0 };
        }

        monthlyData[monthYear].revenue += d.revenue;
        monthlyData[monthYear].orderCount += d.orderCount;
      });

      // Convert grouped data to arrays
      labels = Object.keys(monthlyData);
      revenue = labels.map((month) => monthlyData[month].revenue);
      orders = labels.map((month) => monthlyData[month].orderCount);

      return {
        labels,
        datasets: [
          {
            label: "Revenue",
            data: revenue,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.2,
            yAxisID: "y",
          },
          {
            label: "Orders",
            data: orders,
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.2,
            yAxisID: "y1",
          },
        ],
      };
    }

    // Extract revenue and order count
    revenue = filteredData.map((d) => d.revenue);
    orders = filteredData.map((d) => d.orderCount);

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: revenue,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.2,
          yAxisID: "y",
        },
        {
          label: "Orders",
          data: orders,
          borderColor: "rgb(16, 185, 129)",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.2,
          yAxisID: "y1",
        },
      ],
    };
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Revenue ($)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Orders",
        },
      },
    },
  };

  // Filter buttons
  const filterButtons = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  // Render loading state
  if (loading) {
    return (
      <Card title='Sales Performance'>
        <div className='h-72 flex items-center justify-center'>
          <div className='animate-pulse text-center'>
            <div className='h-40 w-full bg-gray-200 rounded'></div>
            <div className='mt-4 text-sm text-gray-500'>Loading data...</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className='flex justify-between items-center w-full'>
          <h3 className='text-lg font-medium text-gray-700'>
            Sales Performance
          </h3>
          <div className='flex space-x-1'>
            {filterButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setTimePeriod(button.value)}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  timePeriod === button.value
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className='h-72'>
        <Line data={processData()} options={options} />
      </div>
    </Card>
  );
};

export default SalesChart;
