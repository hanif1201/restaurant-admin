import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaShoppingBag,
  FaChartBar,
  FaCog,
  FaTimes,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { restaurant } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-600 transition-colors duration-300 transform rounded-lg 
    ${
      isActive
        ? "bg-gray-100 text-gray-700 font-medium"
        : "hover:bg-gray-100 hover:text-gray-700"
    }`;

  return (
    <div
      className={`
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto
    `}
    >
      <div className='flex items-center justify-between px-4 py-3 bg-gray-800'>
        <div className='flex items-center'>
          <img
            src='/assets/images/logo.png'
            alt='GoChop Logo'
            className='w-10 h-10'
          />
          <span className='mx-2 text-xl font-semibold text-white'>GoChop</span>
        </div>
        <button
          onClick={toggleSidebar}
          className='md:hidden text-gray-300 hover:text-white focus:outline-none'
        >
          <FaTimes size={24} />
        </button>
      </div>

      {/* Restaurant details */}
      {restaurant && (
        <div className='p-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold truncate'>{restaurant.name}</h2>
          <div className='flex items-center mt-2'>
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                restaurant.status === "open" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className='text-sm capitalize'>{restaurant.status}</span>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <nav className='p-4 space-y-2'>
        <NavLink to='/' className={navLinkClass}>
          <FaHome className='w-5 h-5' />
          <span className='mx-4'>Dashboard</span>
        </NavLink>

        <NavLink to='/menu' className={navLinkClass}>
          <FaUtensils className='w-5 h-5' />
          <span className='mx-4'>Menu Management</span>
        </NavLink>

        <NavLink to='/orders' className={navLinkClass}>
          <FaShoppingBag className='w-5 h-5' />
          <span className='mx-4'>Orders</span>
        </NavLink>

        <NavLink to='/analytics' className={navLinkClass}>
          <FaChartBar className='w-5 h-5' />
          <span className='mx-4'>Analytics</span>
        </NavLink>

        {/* Settings with nested links */}
        <div className='space-y-2'>
          <NavLink to='/settings/profile' className={navLinkClass}>
            <FaCog className='w-5 h-5' />
            <span className='mx-4'>Settings</span>
          </NavLink>

          <div className='ml-6 space-y-2 mt-2'>
            <NavLink
              to='/settings/profile'
              className={({ isActive }) =>
                `block px-4 py-2 text-sm text-gray-600 rounded-md ${
                  isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-100"
                }`
              }
            >
              Restaurant Profile
            </NavLink>

            <NavLink
              to='/settings/hours'
              className={({ isActive }) =>
                `block px-4 py-2 text-sm text-gray-600 rounded-md ${
                  isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-100"
                }`
              }
            >
              Business Hours
            </NavLink>

            <NavLink
              to='/settings/account'
              className={({ isActive }) =>
                `block px-4 py-2 text-sm text-gray-600 rounded-md ${
                  isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-100"
                }`
              }
            >
              Account Settings
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
