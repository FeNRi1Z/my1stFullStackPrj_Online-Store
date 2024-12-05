import React from 'react';
import { Button } from 'antd';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const CartHeader = ({ cartCount, onClose, isAnimating }) => (
  <div 
    className={`p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700
      transition-opacity duration-300 delay-75
      ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
  >
    <Button
      type="text"
      icon={<X className="w-5 h-5" />}
      onClick={onClose}
      className="absolute right-2 sm:right-4 top-2 sm:top-4 
        hover:text-primary-100 focus:text-primary-100"
      aria-label="Close cart"
    />
    <h1 
      className="text-xl sm:text-2xl font-bold text-text-dark dark:text-text-light"
      id="cart-modal-title"
    >
      My Cart ({cartCount} items)
    </h1>
  </div>
);

CartHeader.propTypes = {
  cartCount: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  isAnimating: PropTypes.bool.isRequired
};

export default CartHeader;