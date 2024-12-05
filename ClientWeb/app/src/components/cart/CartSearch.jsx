import React from 'react';
import { Input } from 'antd';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const CartSearch = ({ searchQuery, setSearchQuery, isAnimating }) => (
  <div 
    className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700
      transition-opacity duration-300 delay-100
      ${isAnimating ? "opacity-100" : "opacity-0"}`}
  >
    <Input
      placeholder="Search in cart..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      prefix={<Search className="w-5 h-5 text-gray-400" />}
      className="hover:border-primary-100 focus:border-primary-100"
      aria-label="Search cart items"
    />
  </div>
);

CartSearch.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  isAnimating: PropTypes.bool.isRequired
};

export default CartSearch;
