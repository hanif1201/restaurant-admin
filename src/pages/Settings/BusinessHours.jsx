import React, { useState, useEffect } from "react";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useAlert from "../../hooks/useAlert";
import restaurantService from "../../api/restaurant";

const BusinessHours = () => {
  const { restaurant, updateRestaurantProfile } = useAuth();
  const { success, error } = useAlert();

  const [loading, setLoading] = useState(false);
  const [businessHours, setBusinessHours] = useState([]);

  // Initialize with default business hours if none exist
  useEffect(() => {
    if (restaurant) {
      if (restaurant.openingHours && restaurant.openingHours.length > 0) {
        setBusinessHours(restaurant.openingHours);
      } else {
        // Default hours for all days of the week
        const defaultHours = [
          { day: 0, open: "08:00", close: "20:00", isClosed: false }, // Sunday
          { day: 1, open: "08:00", close: "20:00", isClosed: false }, // Monday
          { day: 2, open: "08:00", close: "20:00", isClosed: false }, // Tuesday
          { day: 3, open: "08:00", close: "20:00", isClosed: false }, // Wednesday
          { day: 4, open: "08:00", close: "20:00", isClosed: false }, // Thursday
          { day: 5, open: "08:00", close: "20:00", isClosed: false }, // Friday
          { day: 6, open: "08:00", close: "20:00", isClosed: false }, // Saturday
        ];
        setBusinessHours(defaultHours);
      }
    }
  }, [restaurant]);

  // Update business hours state
  const handleHoursChange = (day, field, value) => {
    setBusinessHours((prevHours) =>
      prevHours.map((hours) =>
        hours.day === day ? { ...hours, [field]: value } : hours
      )
    );
  };

  // Toggle closed status
  const toggleClosed = (day) => {
    setBusinessHours((prevHours) =>
      prevHours.map((hours) =>
        hours.day === day ? { ...hours, isClosed: !hours.isClosed } : hours
      )
    );
  };

  // Get day name from number
  const getDayName = (dayNumber) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayNumber];
  };

  // Apply the same hours to all days
  const applyToAllDays = (sourceDay) => {
    const sourceHours = businessHours.find((hours) => hours.day === sourceDay);

    if (sourceHours) {
      setBusinessHours((prevHours) =>
        prevHours.map((hours) => ({
          ...hours,
          open: sourceHours.open,
          close: sourceHours.close,
          isClosed: sourceHours.isClosed,
        }))
      );
    }
  };

  // Apply the same hours to weekdays only
  const applyToWeekdays = (sourceDay) => {
    const sourceHours = businessHours.find((hours) => hours.day === sourceDay);

    if (sourceHours) {
      setBusinessHours((prevHours) =>
        prevHours.map((hours) =>
          hours.day >= 1 && hours.day <= 5
            ? {
                ...hours,
                open: sourceHours.open,
                close: sourceHours.close,
                isClosed: sourceHours.isClosed,
              }
            : hours
        )
      );
    }
  };

  // Apply the same hours to weekend days only
  const applyToWeekends = (sourceDay) => {
    const sourceHours = businessHours.find((hours) => hours.day === sourceDay);

    if (sourceHours) {
      setBusinessHours((prevHours) =>
        prevHours.map((hours) =>
          hours.day === 0 || hours.day === 6
            ? {
                ...hours,
                open: sourceHours.open,
                close: sourceHours.close,
                isClosed: sourceHours.isClosed,
              }
            : hours
        )
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!restaurant) {
      error("Restaurant information not found");
      return;
    }

    try {
      setLoading(true);

      // Validate time format and business logic
      for (const hours of businessHours) {
        if (!hours.isClosed) {
          const openTime = hours.open.split(":").map(Number);
          const closeTime = hours.close.split(":").map(Number);

          // Check if close time is after open time
          if (
            openTime[0] > closeTime[0] ||
            (openTime[0] === closeTime[0] && openTime[1] >= closeTime[1])
          ) {
            error(
              `Invalid hours for ${getDayName(
                hours.day
              )}: Closing time must be after opening time`
            );
            setLoading(false);
            return;
          }
        }
      }

      // Update restaurant with new business hours
      const updatedRestaurant = {
        ...restaurant,
        openingHours: businessHours,
      };

      const response = await restaurantService.updateRestaurant(
        restaurant._id,
        updatedRestaurant
      );

      if (response.success) {
        updateRestaurantProfile(response.data);
        success("Business hours updated successfully");
      }
    } catch (err) {
      console.error("Error updating business hours:", err);
      error(err.message || "Failed to update business hours");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageTitle
        title='Business Hours'
        subtitle="Set your restaurant's opening and closing hours"
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <div className='space-y-6'>
            {/* Business hours schedule */}
            <div>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Day
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Open
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Close
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Closed
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {businessHours
                    .sort((a, b) => a.day - b.day)
                    .map((hours) => (
                      <tr key={hours.day}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {getDayName(hours.day)}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <input
                            type='time'
                            value={hours.open}
                            onChange={(e) =>
                              handleHoursChange(
                                hours.day,
                                "open",
                                e.target.value
                              )
                            }
                            disabled={hours.isClosed}
                            className={`rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                              hours.isClosed ? "bg-gray-100 text-gray-500" : ""
                            }`}
                          />
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <input
                            type='time'
                            value={hours.close}
                            onChange={(e) =>
                              handleHoursChange(
                                hours.day,
                                "close",
                                e.target.value
                              )
                            }
                            disabled={hours.isClosed}
                            className={`rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                              hours.isClosed ? "bg-gray-100 text-gray-500" : ""
                            }`}
                          />
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <input
                              type='checkbox'
                              checked={hours.isClosed}
                              onChange={() => toggleClosed(hours.day)}
                              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                            />
                            <span className='ml-2 text-sm text-gray-500'>
                              Closed
                            </span>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <div className='flex space-x-2'>
                            <button
                              type='button'
                              onClick={() => applyToAllDays(hours.day)}
                              className='text-xs text-blue-600 hover:text-blue-900'
                            >
                              Apply to all
                            </button>
                            <button
                              type='button'
                              onClick={() => applyToWeekdays(hours.day)}
                              className='text-xs text-blue-600 hover:text-blue-900'
                            >
                              Apply to weekdays
                            </button>
                            <button
                              type='button'
                              onClick={() => applyToWeekends(hours.day)}
                              className='text-xs text-blue-600 hover:text-blue-900'
                            >
                              Apply to weekends
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Form Actions */}
            <div className='flex justify-end'>
              <Button
                type='submit'
                variant='primary'
                loading={loading}
                disabled={loading}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default BusinessHours;
