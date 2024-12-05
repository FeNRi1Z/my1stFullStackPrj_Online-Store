// src/hooks/useModalSearch.js
import { useState, useCallback } from 'react';

// Change from const to function declaration
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

// Export the hook as default
export default useModalSearch;