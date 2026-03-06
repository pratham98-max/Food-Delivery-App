import React, { useState } from 'react';
import { CartContext } from './CartContext';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const isItemInCart = prev.find((i) => i._id === item._id);
      if (isItemInCart) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decrementQuantity = (itemId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i._id === itemId);
      if (item.quantity === 1) {
        return prev.filter((i) => i._id !== itemId); // Remove item if quantity becomes 0
      }
      return prev.map((i) =>
        i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, decrementQuantity, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};