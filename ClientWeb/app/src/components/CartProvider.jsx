import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Load initial cart data
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    updateCartCount(savedCart);
  }, []);

  const updateCartCount = (items) => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      let updatedItems;

      if (existingItemIndex !== -1) {
        // Update existing item and move it to the top
        const existingItem = prevItems[existingItemIndex];
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
          totalPrice: (existingItem.quantity + item.quantity) * existingItem.price
        };
        
        // Update items
        updatedItems = [
          updatedItem,
          ...prevItems.filter(i => i.id !== item.id)
        ];
      } else {
        // Add new item
        updatedItems = [{ ...item }, ...prevItems];
      }

      // Update localStorage and cart count
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      updateCartCount(updatedItems);
      return updatedItems;
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity || 99)),
            totalPrice: Math.max(1, Math.min(newQuantity, item.maxQuantity || 99)) * item.price
          };
        }
        return item;
      });

      localStorage.setItem('cart', JSON.stringify(updatedItems));
      updateCartCount(updatedItems);
      return updatedItems;
    });
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      updateCartCount(updatedItems);
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        addToCart, 
        updateQuantity, 
        removeItem, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};