import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, AlertCircle, X, ChevronDown, Check } from 'lucide-react';
import Dialog from './Dialog';
import config from "../config";
import { useAuth } from './AuthProvider';

const SearchBox = ({ onSearch }) => {
  const { getAuthToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [filters, setFilters] = useState({
    author: '',
    minPrice: '',
    maxPrice: '',
    categories: []
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.apiPath}/product/public/list`);

        if (!response.ok) {
          throw new Error('Failed to fetch books data');
        }

        const data = await response.json();

        if (data && Array.isArray(data.results)) {
          // Extract unique categories from all books
          const uniqueCategories = new Set();
          data.results.forEach(book => {
            book.categoriesName?.forEach(category => {
              uniqueCategories.add(category);
            });
          });
          setCategories(Array.from(uniqueCategories).sort());
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = useCallback(async () => {
    const hasNoFilters = !searchTerm &&
      !filters.author &&
      !filters.minPrice &&
      !filters.maxPrice &&
      filters.categories.length === 0;

    if (hasNoFilters) {
      try {
        setIsLoading(true);
        const response = await fetch(`${config.apiPath}/product/public/list`);
        const data = await response.json();
        if (data && Array.isArray(data.results)) {
          onSearch(data.results);
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to fetch books. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      // Add basic search params
      if (searchTerm) params.append('name', searchTerm);
      if (filters.author) params.append('author', filters.author);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      // Add categories to the params
      if (filters.categories.length > 0) {
        // Add each category as a separate parameter
        filters.categories.forEach(category => {
          params.append('categories', category);
        });
      }

      const searchUrl = `${config.apiPath}/product/public/search?${params.toString()}`;
      console.log('Sending search request to:', searchUrl);
      console.log('With filters:', filters);

      const response = await fetch(searchUrl);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search error response:', errorText);
        throw new Error(`Search failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Search response data:', data);

      if (!data || data.status === 'error') {
        throw new Error(data.message || 'Search failed');
      }

      onSearch(data.results);
      setIsDialogOpen(false);

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search books. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filters, onSearch]);

  const clearFilters = useCallback(() => {
    setFilters({
      author: '',
      minPrice: '',
      maxPrice: '',
      categories: []
    });
  }, []);

  const clearSearch = useCallback(async () => {
    setIsLoading(true);
    setSearchTerm('');
    clearFilters();
    setError(null);

    try {
      const response = await fetch(`${config.apiPath}/product/public/list`);
      const data = await response.json();
      if (data && Array.isArray(data.results)) {
        onSearch(data.results);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [clearFilters, onSearch]);

  const toggleCategory = useCallback((category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('category-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = filters.author ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.categories.length > 0;

  return (
    <div className="w-full max-w-3xl">
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-50 dark:text-text-disabled">
              {isLoading ? (
                <div className="animate-spin">
                  <Search className="w-5 h-5" />
                </div>
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSearch();
                }
              }}
              placeholder="Search books..."
              disabled={isLoading}
              className="w-full h-14 pl-12 pr-12
                bg-white dark:bg-background-secondary-dark
                text-text-dark dark:text-text-light
                placeholder-secondary-50 dark:placeholder-text-disabled
                rounded-md
                focus:outline-none focus:ring-2 focus:ring-primary-100
                transition-all duration-300
                disabled:opacity-50"
            />

            {(searchTerm || hasActiveFilters) && !isLoading && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-secondary-50 hover:text-text-dark
                  dark:text-text-disabled dark:hover:text-text-light
                  transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsDialogOpen(true)}
            disabled={isLoading}
            className={`p-4 rounded-full transition-colors ${hasActiveFilters
              ? 'bg-primary-100 text-white hover:bg-primary-hover'
              : 'bg-white dark:bg-background-secondary-dark text-secondary-50 dark:text-text-disabled'
              }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="text-text-dark dark:text-text-light">
          <h2 className="text-xl font-semibold mb-4">Search Filters</h2>

          <div className="space-y-4">
            {/* Category Filter */}
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

            {/* Author Filter */}
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

            {/* Price Range */}
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

            {/* Dialog Buttons */}
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
      </Dialog>
    </div>
  );
};

export default SearchBox;