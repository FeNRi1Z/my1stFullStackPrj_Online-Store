import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import EmptyCart from './EmptyCart';
import CartTable from './CartTable';

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