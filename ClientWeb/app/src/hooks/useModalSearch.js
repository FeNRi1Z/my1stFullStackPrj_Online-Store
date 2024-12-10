import { useState, useCallback } from 'react';

/**
 * Custom hook for filtering items based on search criteria within a modal
 * @param {string} initialQuery - Initial search query value
 * @returns {Object} Search utilities including query state and filter function
 */
function useModalSearch(initialQuery = '') {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearchChange = useCallback((newQuery) => {
    setSearchQuery(newQuery);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const filterItems = useCallback((items) => {
    if (!searchQuery.trim()) {
      return items;
    }

    // Filter items by matching query against name or author fields
    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item.name?.toLowerCase().includes(query) ||
      item.author?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    resetSearch,
    filterItems
  };
}

export default useModalSearch;