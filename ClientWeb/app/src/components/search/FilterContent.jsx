import React from 'react';
import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';

const FilterContent = ({ 
  filters, 
  setFilters, 
  categories, 
  isCategoryDropdownOpen, 
  setIsCategoryDropdownOpen,
  handleSearch,
  hasActiveFilters,
  clearFilters,
  isLoading 
}) => {
  return (
    <div className="text-text-dark dark:text-text-light">
      <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
      
      <div className="space-y-4">
        <CategoryFilter 
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          isCategoryDropdownOpen={isCategoryDropdownOpen}
          setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            value={filters.author}
            onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
            placeholder="Author name"
            className="w-full p-2 bg-white dark:bg-background-secondary-dark rounded-md
                      text-text-dark dark:text-text-light placeholder-text-disabled
                      border border-gray-300 dark:border-none
                      focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <PriceRangeFilter filters={filters} setFilters={setFilters} />

        <div className="flex justify-end gap-2 mt-6">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 text-sm rounded-md 
                bg-gray-100 dark:bg-gray-800 
                text-text-dark dark:text-text-light
                hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Clear Filters
            </button>
          )}
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 text-sm rounded-md 
              bg-primary-100 text-white
              hover:bg-primary-hover active:bg-primary-active"
            disabled={isLoading}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterContent;