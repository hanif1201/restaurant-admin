import React from "react";

const CategoryFilter = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className='mb-6'>
      <h2 className='text-sm font-medium text-gray-700 mb-2'>
        Filter by Category
      </h2>
      <div className='flex flex-wrap gap-2'>
        <button
          onClick={() => onSelectCategory("all")}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          All Items
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
