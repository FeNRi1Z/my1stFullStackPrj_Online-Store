import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

const CartFooter = ({ items, isAnimating, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div 
      className={`p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700
        transition-all duration-300 delay-200 rounded-bl-lg rounded-br-lg
        ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">
        <div className="text-base sm:text-lg font-medium text-text-dark dark:text-text-light">
          Total: ${total.toFixed(2)}
        </div>
        <Button
          type="primary"
          onClick={onCheckout}
          className="w-full sm:w-auto !text-white hover:!text-white 
            bg-primary-100 hover:bg-primary-hover font-medium"
          style={{
            height: "40px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

CartFooter.propTypes = {
  items: PropTypes.array.isRequired,
  isAnimating: PropTypes.bool.isRequired,
  onCheckout: PropTypes.func.isRequired
};

export default CartFooter;