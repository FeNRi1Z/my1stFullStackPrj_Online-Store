import React, { useState } from 'react';
import { Search, SlidersHorizontal, AlertCircle, X } from 'lucide-react';
import Dialog from './Dialog';

const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    author: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleSearch = async () => {
    if (!searchTerm && !filters.author && !filters.minPrice && !filters.maxPrice) {
      // If no search criteria, fetch all books
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3002/product/public/list');
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
      // Build search parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('name', searchTerm);
      if (filters.author) params.append('author', filters.author);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      // Make search request
      const response = await fetch(
        `http://localhost:3002/product/public/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }

      const data = await response.json();

      // Validate response format
      if (!data || data.status === 'error') {
        throw new Error(data.message || 'Search failed');
      }

      if (!Array.isArray(data.results)) {
        throw new Error('Invalid response format');
      }

      // Update search results
      onSearch(data.results);
      setIsDialogOpen(false);

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search books. Please try again.');

      // Fallback to showing all books
      try {
        const fallbackResponse = await fetch('http://localhost:3002/product/public/list');
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && Array.isArray(fallbackData.results)) {
          onSearch(fallbackData.results);
        }
      } catch (fallbackErr) {
        console.error('Error fetching all books:', fallbackErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      author: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const clearSearch = async () => {
    // Set loading state first
    setIsLoading(true);
    
    // Clear all search states
    setSearchTerm('');
    clearFilters();
    setError(null);
    
    try {
      // Fetch all books
      const response = await fetch('http://localhost:3002/product/public/list');
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
  };

  const hasActiveFilters = filters.author || filters.minPrice || filters.maxPrice;

  return (
    <div className="w-full max-w-3xl">
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            {/* Search Icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-50 dark:text-text-disabled">
              {isLoading ? (
                <div className="animate-spin">
                  <Search className="w-5 h-5" />
                </div>
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>

            {/* Search Input */}
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

            {/* Clear Search Button */}
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

          {/* Filter Button */}
          <button
            onClick={() => setIsDialogOpen(true)}
            disabled={isLoading}
            className={`p-4 rounded-full transition-colors ${
              hasActiveFilters 
                ? 'bg-primary-100 text-white hover:bg-primary-hover' 
                : 'bg-white dark:bg-background-secondary-dark text-secondary-50 dark:text-text-disabled'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Filter Dialog */}
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="text-text-dark dark:text-text-light">
          <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
          
          <div className="space-y-4">
            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                value={filters.author}
                onChange={(e) => setFilters({...filters, author: e.target.value})}
                placeholder="Author name"
                className="w-full p-2 rounded-md border
                  bg-white dark:bg-background-secondary-dark
                  text-text-dark dark:text-text-light
                  border-secondary-50 dark:border-background-secondary-dark"
              />
            </div>
            
            {/* Price Range */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  placeholder="0"
                  min="0"
                  className="w-full p-2 rounded-md border
                    bg-white dark:bg-background-secondary-dark
                    text-text-dark dark:text-text-light
                    border-secondary-50 dark:border-background-secondary-dark"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  placeholder="Max"
                  min="0"
                  className="w-full p-2 rounded-md border
                    bg-white dark:bg-background-secondary-dark
                    text-text-dark dark:text-text-light
                    border-secondary-50 dark:border-background-secondary-dark"
                />
              </div>
            </div>

            {/* Dialog Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              {hasActiveFilters && (
                <button
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