import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const Header = ({ toggleSidebar }) => {
  const { user, restaurant, logout, toggleRestaurantStatus } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle restaurant status toggle
  const handleStatusToggle = async () => {
    if (restaurant) {
      await toggleRestaurantStatus();
    }
  };

  // Dummy notifications (in a real app, these would come from your API)
  const notifications = [
    { id: 1, text: "New order received", time: "5 minutes ago", read: false },
    {
      id: 2,
      text: "Customer left a new review",
      time: "1 hour ago",
      read: false,
    },
    { id: 3, text: "Weekly report available", time: "2 days ago", read: true },
  ];

  return (
    <header className='bg-white shadow-sm z-10'>
      <div className='flex items-center justify-between px-4 py-3'>
        <div className='flex items-center'>
          <button
            onClick={toggleSidebar}
            className='text-gray-600 focus:outline-none md:hidden'
          >
            <FaBars size={24} />
          </button>

          <h1 className='text-xl font-semibold text-gray-800 ml-2 md:ml-0'>
            {/* Dynamic page title based on current route */}
            Restaurant Dashboard
          </h1>
        </div>

        <div className='flex items-center space-x-4'>
          {/* Restaurant status toggle */}
          {restaurant && (
            <div className='hidden md:flex items-center mr-4'>
              <span className='mr-2 text-sm font-medium'>
                {restaurant.status === "open" ? "Open" : "Closed"}
              </span>
              <label className='inline-flex relative items-center cursor-pointer'>
                <input
                  type='checkbox'
                  value=''
                  className='sr-only peer'
                  checked={restaurant.status === "open"}
                  onChange={handleStatusToggle}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          )}

          {/* Notifications */}
          <div className='relative' ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className='flex text-gray-600 focus:outline-none'
            >
              <FaBell size={20} />
              {notifications.some((n) => !n.read) && (
                <span className='absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500'></span>
              )}
            </button>

            {/* Notifications dropdown */}
            {notificationsOpen && (
              <div className='absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20'>
                <div className='py-2 px-3 bg-gray-100 border-b border-gray-200'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-sm font-semibold text-gray-800'>
                      Notifications
                    </h3>
                    <button className='text-sm text-blue-600 hover:text-blue-800'>
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className='max-h-64 overflow-y-auto'>
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-200 hover:bg-gray-50 ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <p className='text-sm text-gray-800'>
                            {notification.text}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='px-4 py-6 text-center text-gray-500'>
                      No notifications
                    </div>
                  )}
                </div>
                <div className='py-2 px-3 bg-gray-100 text-center'>
                  <button className='text-sm text-blue-600 hover:text-blue-800'>
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown */}
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className='flex items-center space-x-2 focus:outline-none'
            >
              <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700'>
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user?.name}
                    className='w-8 h-8 rounded-full object-cover'
                  />
                ) : (
                  <FaUser size={16} />
                )}
              </div>
              <span className='hidden md:inline text-sm font-medium text-gray-700'>
                {user?.name || "User"}
              </span>
            </button>

            {/* Profile dropdown */}
            {dropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20'>
                <div className='py-2'>
                  <Link
                    to='/settings/profile'
                    onClick={() => setDropdownOpen(false)}
                    className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    <FaCog className='mr-2 text-gray-600' size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className='flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    <FaSignOutAlt className='mr-2 text-gray-600' size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
