import React, { createContext, useContext, useState, useEffect } from 'react';
import { message, ConfigProvider, theme as antdTheme } from 'antd';
import { useAuth } from './AuthProvider';
import { useTheme } from './ThemeProvider';
import config from '../config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, getAuthToken } = useAuth();
  const { theme } = useTheme();

  // Theme styles
  const themeStyles = {
    background: theme === 'dark' ? '#2B2B2B' : '#F5F5F5',
    text: theme === 'dark' ? '#F5F5F5' : '#2D3142',
    cardBg: theme === 'dark' ? '#3D3D3D' : '#FFFFFF',
  };

  const primaryColor = '#EA9029';
  const primaryHover = '#D68324';

  // Custom theme token for antd components
  const customToken = {
    colorPrimary: primaryColor,
    colorPrimaryHover: primaryHover,
    colorPrimaryActive: primaryHover,
    colorBgContainer: themeStyles.cardBg,
    colorText: themeStyles.text,
    colorBgElevated: themeStyles.cardBg,
    controlItemBgHover: theme === 'dark' ? '#4A4A4A' : '#F0F0F0',
  };

  // Message instance
  const [messageApi, contextHolder] = message.useMessage();

  // Wrapper for message calls
  const showMessage = {
    success: (content) => messageApi.success(content),
    error: (content) => messageApi.error(content),
    warning: (content) => messageApi.warning(content),
  };

  // Load cart data from API
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
      
      if (response.status === 401) {
        showMessage.error('Please sign in to view your cart');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const data = await response.json();
      setCartItems(data.results || []);
      updateCartCount(data.results || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      showMessage.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  // Update cart count from items
  const updateCartCount = (items) => {
    const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(count);
  };

  // Load cart when auth state changes
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
      showMessage.warning('Please sign in to add items to cart');
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
        showMessage.error('Please sign in to add items');
        return;
      }

      if (!response.ok) throw new Error('Failed to add item to cart');

      await fetchCart();
      showMessage.success('Item added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showMessage.error('Failed to add item to cart');
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
        showMessage.error('Please sign in to update cart');
        return;
      }

      if (!response.ok) throw new Error('Failed to update cart');

      await fetchCart(); 
    } catch (error) {
      console.error('Error updating cart:', error);
      showMessage.error('Failed to update quantity');
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
        showMessage.error('Please sign in to remove items');
        return;
      }

      if (!response.ok) throw new Error('Failed to remove item');

      await fetchCart();
      showMessage.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      showMessage.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: customToken,
      }}
    >
      {contextHolder}
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
    </ConfigProvider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};