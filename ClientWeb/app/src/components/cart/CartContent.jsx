import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import EmptyCart from './EmptyCart';
import CartTable from './CartTable';

/**
 * Displays cart contents with loading, empty, and populated states.
 * Handles responsive behavior and animations for cart modal content.
 * 
 * @param {Object} props
 * @param {Array} props.items - Cart items to display
 * @param {boolean} props.loading - Loading state of cart data
 * @param {string} props.searchQuery - Current search filter for cart items
 * @param {number} props.windowWidth - Current window width for responsive layout
 * @param {boolean} props.isAnimating - Controls entry/exit animations
 * @param {Function} props.onClose - Handler for closing the cart
 * @param {Function} props.navigate - Navigation function for routing
 */

const CartContent = ({ 
  items, 
  loading, 
  searchQuery, 
  windowWidth, 
  isAnimating, 
  onClose, 
  navigate 
}) => (
  <div 
    className={`transition-all duration-300 delay-150
      ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    style={{ maxHeight: 'calc(90vh - 240px)', overflowY: 'auto' }}
  >
    {loading ? (
      <LoadingSpinner />
    ) : items.length === 0 ? (
      <EmptyCart onClose={onClose} navigate={navigate} />
    ) : (
      <CartTable 
        items={items}
        searchQuery={searchQuery}
        windowWidth={windowWidth}
      />
    )}
  </div>
);

CartContent.propTypes = {
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string.isRequired,
  windowWidth: PropTypes.number.isRequired,
  isAnimating: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
};

export default CartContent;