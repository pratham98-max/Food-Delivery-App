import { createContext, useContext } from 'react';

// Export only the context object
export const CartContext = createContext();

// Export the custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};