import React from "react";

const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  striped = true,
  hoverable = true,
  onRowClick,
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
}) => {
  // Check if data is available
  const hasData = data && data.length > 0;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className='min-w-full divide-y divide-gray-200'>
        {/* Table Header */}
        <thead className={`bg-gray-50 ${headerClassName}`}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope='col'
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.className || ""
                }`}
                style={column.width ? { width: column.width } : {}}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className='bg-white divide-y divide-gray-200'>
          {loading ? (
            // Loading state
            <tr>
              <td
                colSpan={columns.length}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                <div className='flex justify-center items-center space-x-2'>
                  <svg
                    className='animate-spin h-5 w-5 text-gray-400'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : hasData ? (
            // Data rows
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`
                  ${striped && rowIndex % 2 === 1 ? "bg-gray-50" : ""}
                  ${hoverable ? "hover:bg-gray-100" : ""}
                  ${onRowClick ? "cursor-pointer" : ""}
                  ${rowClassName}
                `}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${cellClassName} ${
                      column.cellClassName || ""
                    }`}
                  >
                    {column.render
                      ? column.render(row, rowIndex)
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // Empty state
            <tr>
              <td
                colSpan={columns.length}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
