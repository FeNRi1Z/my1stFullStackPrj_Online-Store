import React from 'react';
import { Button } from 'antd';
import { ShoppingBag } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Displays an empty cart state with a shopping bag icon and a call-to-action button
 * @param {Object} props
 * @param {Function} props.onClose - Handler to close the cart modal/drawer
 * @param {Function} props.navigate - Navigation function to redirect user to store page
 * @returns {React.ReactElement} Empty cart UI component
 */

const EmptyCart = ({ onClose, navigate }) => (
  <div className="text-center py-8 sm:py-12 px-4">
    <ShoppingBag
      className="mx-auto mb-4 text-primary-100"
      size={48}
      strokeWidth={1.5}
    />
    <p className="text-lg sm:text-xl mb-4 text-text-dark dark:text-text-light">
      Your cart is empty
    </p>
    <Button
      type="primary"
      onClick={() => {
        onClose();
        navigate('/store');
      }}
      className="!text-white hover:!text-white"
      style={{
        height: '40px',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      Continue Shopping
    </Button>
  </div>
);

EmptyCart.propTypes = {
  onClose: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
};

export default EmptyCart;