import React from "react";
import Card from "../common/Card";

const StatCard = ({
  title,
  value,
  icon,
  change,
  changeType = "neutral", // 'positive', 'negative', or 'neutral'
  changePeriod = "from last period",
  loading = false,
  className = "",
}) => {
  const getChangeColorClass = () => {
    if (changeType === "positive") return "text-green-600";
    if (changeType === "negative") return "text-red-600";
    return "text-gray-500";
  };

  const getChangeIcon = () => {
    if (changeType === "positive") return "↑";
    if (changeType === "negative") return "↓";
    return "";
  };

  return (
    <Card className={`h-full ${className}`}>
      <div className='flex items-center'>
        {icon && (
          <div className='p-3 rounded-full bg-blue-100 text-blue-600 mr-4'>
            {icon}
          </div>
        )}
        <div>
          <h3 className='text-lg font-medium text-gray-700'>{title}</h3>
          {loading ? (
            <div className='animate-pulse h-8 w-24 bg-gray-200 rounded mt-1'></div>
          ) : (
            <div className='flex items-baseline'>
              <p className='text-3xl font-semibold text-gray-900'>{value}</p>
              {change !== undefined && (
                <p className={`ml-2 text-sm ${getChangeColorClass()}`}>
                  {getChangeIcon()} {change} {changePeriod}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
