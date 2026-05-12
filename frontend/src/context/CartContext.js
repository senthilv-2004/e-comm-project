// src/context/CartContext.js - Global Shopping Cart State Management
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api/axios';
import { useAuth } from './AuthContext';

// Create the Cart Context
const CartContext = createContext(null);

/**
 * CartProvider - Provides cart state and actions to all children
 * Syncs with backend when user is logged in
 * Falls back to localStorage when logged out
 */
export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Cart items array: [{ cart_id, product_id, name, price, quantity, image_url, ... }]
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  /**
   * fetchCart - Loads cart from backend API (when logged in)
   */
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setCartLoading(true);
      const response = await cartAPI.getCart();
      const items = response.data.cartItems || [];
      setCartItems(items);
      updateCartTotals(items);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    }
  }, [isAuthenticated, fetchCart]);

  /**
   * updateCartTotals - Recalculates cart count and total price
   * @param {array} items - Cart items array
   */
  const updateCartTotals = (items) => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    setCartCount(count);
    setCartTotal(total.toFixed(2));
  };

  /**
   * addToCart - Adds a product to the cart
   * @param {number} productId - ID of product to add
   * @param {number} quantity - Quantity to add (default: 1)
   */
  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.addToCart({ product_id: productId, quantity });
      await fetchCart(); // Refresh cart from server
      return { success: true, message: 'Added to cart!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      return { success: false, message };
    }
  };

  /**
   * updateQuantity - Changes the quantity of a cart item
   * @param {number} cartItemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await cartAPI.updateItem(cartItemId, { quantity });
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity';
      return { success: false, message };
    }
  };

  /**
   * removeFromCart - Removes a specific item from the cart
   * @param {number} cartItemId - Cart item ID to remove
   */
  const removeFromCart = async (cartItemId) => {
    try {
      await cartAPI.removeItem(cartItemId);
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to remove item' };
    }
  };

  /**
   * clearCart - Removes all items from the cart
   */
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to clear cart' };
    }
  };

  // Context value exposed to consumers
  const value = {
    cartItems,
    cartLoading,
    cartCount,
    cartTotal,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * useCart - Custom hook to access cart context
 * Usage: const { cartItems, addToCart, cartCount } = useCart();
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
