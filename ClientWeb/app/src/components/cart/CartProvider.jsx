import React, { createContext, useContext, useState, useEffect } from 'react';
import { App, ConfigProvider, theme as antdTheme } from 'antd';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../theme/ThemeProvider';
import config from '../../config';


/**
 * CartProvider component
 * Are all about fetching and updating cart item and status
 */
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, getAuthToken } = useAuth();
  const { theme } = useTheme();

  return (
    <App>
      <ConfigProvider
        theme={{
          algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        }}
      >
        <CartContextContent
          cartItems={cartItems}
          setCartItems={setCartItems}
          cartCount={cartCount}
          setCartCount={setCartCount}
          loading={loading}
          setLoading={setLoading}
          isAuthenticated={isAuthenticated}
          getAuthToken={getAuthToken}
        >
          {children}
        </CartContextContent>
      </ConfigProvider>
    </App>
  );
};

const CartContextContent = ({
  children,
  cartItems,
  setCartItems,
  cartCount,
  setCartCount,
  loading,
  setLoading,
  isAuthenticated,
  getAuthToken
}) => {
  const { message } = App.useApp();

  const updateCartCount = (items) => {
    const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(count);
  };

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartCount(0);
      setLoading(false);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token available');
      }

      const cleanToken = token.replace('Bearer ', '');

      const response = await fetch(config.apiPath + '/product/cart/items', {
        headers: {
          Authorization: cleanToken,
          'Content-Type': 'application/json'
        }
      });

      console.log(response);

      if (response.status === 401) {
        message.error('Please sign in to view your cart');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch cart');

      const data = await response.json();
      setCartItems(data.results || []);
      console.log(data.results)
      updateCartCount(data.results || []);
      const updatedCartItems = data.results.map((item) => ({
        ...item,
        maxQuantity: item.maxQuantity || 0,
      }));
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      message.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = async (item) => {
    if (!isAuthenticated) {
      message.warning('Please sign in to add items to cart');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token available');
      }

      const cleanToken = token.replace('Bearer ', '');

      const response = await fetch(config.apiPath + '/product/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cleanToken
        },
        body: JSON.stringify({
          productId: item.id,
          quantity: item.quantity || 1
        })
      });

      if (response.status === 401) {
        message.error('Please sign in to add items');
        return;
      }

      if (!response.ok) throw new Error('Failed to add item to cart');

      await fetchCart();
      message.success('Item added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error('Failed to add item to cart');
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token available');
      }

      const cleanToken = token.replace('Bearer ', '');

      const response = await fetch(config.apiPath + '/product/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cleanToken
        },
        body: JSON.stringify({
          productId: itemId,
          quantity: newQuantity
        })
      });

      if (response.status === 401) {
        message.error('Please sign in to update cart');
        return;
      }

      if (!response.ok) throw new Error('Failed to update cart');

      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      message.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token available');
      }

      const cleanToken = token.replace('Bearer ', '');

      const response = await fetch(config.apiPath + `/product/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: cleanToken,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        message.error('Please sign in to remove items');
        return;
      }

      if (!response.ok) throw new Error('Failed to remove item');

      await fetchCart();
      message.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      message.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <App>
      <CartContext.Provider
        value={{
          cartItems,
          cartCount,
          addToCart,
          updateQuantity,
          removeItem,
          clearCart,
          loading
        }}
      >
        {children}
      </CartContext.Provider>
    </App>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};