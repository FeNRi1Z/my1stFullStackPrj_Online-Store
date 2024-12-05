import { useState, useEffect, useCallback } from 'react';
import config from '../config';

export const useSearchBox = (onSearch) => {
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

  const hasActiveFilters = useCallback(() => {
    return filters.author ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.categories.length > 0;
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters({
      author: '',
      minPrice: '',
      maxPrice: '',
      categories: []
    });
  }, []);

  const fetchInitialData = useCallback(async () => {
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
  }, [onSearch]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm && !hasActiveFilters()) {
      await fetchInitialData();
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      if (searchTerm) params.append('name', searchTerm);
      if (filters.author) params.append('author', filters.author);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      filters.categories.forEach(category => {
        params.append('categories', category);
      });

      const searchUrl = `${config.apiPath}/product/public/search?${params.toString()}`;
      const response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }

      const data = await response.json();
      onSearch(data.results);
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search books. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filters, onSearch, hasActiveFilters, fetchInitialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.apiPath}/product/public/list`);
        if (!response.ok) {
          throw new Error('Failed to fetch books data');
        }
        const data = await response.json();
        if (data && Array.isArray(data.results)) {
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

  return {
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
  };
};