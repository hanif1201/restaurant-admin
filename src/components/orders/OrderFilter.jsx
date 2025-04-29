import React, { useState } from "react";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import Button from "../common/Button";

const OrderFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    status: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      status: "",
      searchTerm: "",
      startDate: "",
      endDate: "",
    });
    onFilter({
      status: "",
      searchTerm: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className='bg-white p-4 rounded-md shadow-sm mb-6'>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          {/* Status Filter */}
          <div>
            <label
              htmlFor='status'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Order Status
            </label>
            <select
              id='status'
              name='status'
              value={filters.status}
              onChange={handleChange}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            >
              <option value=''>All Statuses</option>
              <option value='pending'>Pending</option>
              <option value='accepted'>Accepted</option>
              <option value='preparing'>Preparing</option>
              <option value='ready_for_pickup'>Ready for Pickup</option>
              <option value='assigned_to_rider'>Assigned to Rider</option>
              <option value='picked_up'>Picked Up</option>
              <option value='on_the_way'>On the Way</option>
              <option value='delivered'>Delivered</option>
              <option value='cancelled'>Cancelled</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label
              htmlFor='searchTerm'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Search
            </label>
            <div className='relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaSearch className='text-gray-400' />
              </div>
              <input
                type='text'
                id='searchTerm'
                name='searchTerm'
                value={filters.searchTerm}
                onChange={handleChange}
                placeholder='Order ID or Customer'
                className='block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label
              htmlFor='startDate'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Start Date
            </label>
            <div className='relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaCalendarAlt className='text-gray-400' />
              </div>
              <input
                type='date'
                id='startDate'
                name='startDate'
                value={filters.startDate}
                onChange={handleChange}
                className='block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='endDate'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              End Date
            </label>
            <div className='relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaCalendarAlt className='text-gray-400' />
              </div>
              <input
                type='date'
                id='endDate'
                name='endDate'
                value={filters.endDate}
                onChange={handleChange}
                className='block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
              />
            </div>
          </div>
        </div>

        {/* Filter Actions */}
        <div className='mt-4 flex justify-end space-x-3'>
          <Button
            type='button'
            variant='secondary'
            size='sm'
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button type='submit' variant='primary' size='sm'>
            Apply Filters
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderFilter;
