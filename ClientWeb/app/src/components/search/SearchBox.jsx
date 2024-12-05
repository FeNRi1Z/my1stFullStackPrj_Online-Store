import React from 'react';
import { Search, SlidersHorizontal, AlertCircle, X } from 'lucide-react';
import Dialog from '../layout/Dialog';
import { useSearchBox } from '../../hooks/useSearchBox';
import FilterContent from './FilterContent';

const SearchBox = ({ onSearch }) => {
  const {
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    isLoading,
    error,
    categories,
    isCategoryDropdownOpen,
    setIsCategoryDropdownOpen,
    filters,
    setFilters,
    hasActiveFilters,
    clearFilters,
    handleSearch,
    fetchInitialData
  } = useSearchBox(onSearch);

  const clearSearch = async () => {
    setSearchTerm('');
    clearFilters();
    await fetchInitialData();
  };

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

            {(searchTerm || hasActiveFilters()) && !isLoading && (
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
            className={`p-4 rounded-full transition-colors ${hasActiveFilters()
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
        <FilterContent
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          isCategoryDropdownOpen={isCategoryDropdownOpen}
          setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
          handleSearch={handleSearch}
          hasActiveFilters={hasActiveFilters()}
          clearFilters={clearFilters}
          isLoading={isLoading}
        />
      </Dialog>
    </div>
  );
};

export default SearchBox;