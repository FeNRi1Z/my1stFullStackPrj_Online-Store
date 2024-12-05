import React from 'react';

const PriceRangeFilter = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Min Price</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
          placeholder="0"
          min="0"
          className="w-full p-2 bg-white dark:bg-background-secondary-dark rounded-md
                    text-text-dark dark:text-text-light placeholder-text-disabled
                    border border-gray-300 dark:border-none
                    focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Max Price</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          placeholder="Max"
          min="0"
          className="w-full p-2 bg-white dark:bg-background-secondary-dark rounded-md
                  text-text-dark dark:text-text-light placeholder-text-disabled
                  border border-gray-300 dark:border-none
                  focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>
    </div>
  );
};

export default PriceRangeFilter;