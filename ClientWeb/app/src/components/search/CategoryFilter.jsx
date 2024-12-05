import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CategoryFilter = ({ 
  categories, 
  filters, 
  setFilters, 
  isCategoryDropdownOpen, 
  setIsCategoryDropdownOpen 
}) => {
  const toggleCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <div className="relative" id="category-dropdown">
      <label className="block text-sm font-medium mb-1">Categories</label>
      <button
        type="button"
        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
        className="w-full p-2 flex justify-between items-center
                  bg-white dark:bg-background-secondary-dark rounded-md
                  text-text-dark dark:text-text-light
                  border border-gray-300 dark:border-none
                  focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <span className="text-sm">
          {filters.categories.length
            ? `${filters.categories.length} selected`
            : 'Select categories'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isCategoryDropdownOpen && (
        <div className="absolute z-50 w-full mt-1 py-1
                      bg-white dark:bg-background-secondary-dark
                      border border-gray-200 dark:border-gray-700
                      rounded-md shadow-lg
                      max-h-60 overflow-auto">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className="w-full px-4 py-2 text-sm text-left flex items-center justify-between
                        hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span>{category}</span>
              {filters.categories.includes(category) && (
                <Check className="w-4 h-4 text-primary-100" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;