// controllers/cartController.js - Handles shopping cart operations
const db = require('../config/db');

/**
 * getCart - GET /api/cart
 * Returns all cart items for the authenticated user
 */
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Join cart with products to get product details
    const [cartItems] = await db.execute(
      `SELECT 
        c.id as cart_id,
        c.quantity,
        c.created_at as added_at,
        p.id as product_id,
        p.name,
        p.description,
        p.price,
        p.category,
        p.image_url,
        p.stock,
        p.rating,
        (c.quantity * p.price) as subtotal
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );

    // Calculate cart totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.status(200).json({
      success: true,
      cartItems,
      summary: {
        totalItems,
        totalAmount: totalAmount.toFixed(2),
        itemCount: cartItems.length
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart'
    });
  }
};

/**
 * addToCart - POST /api/cart
 * Adds a product to the user's cart (or increases quantity if already exists)
 */
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    // Validate required fields
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists and has enough stock
    const [products] = await db.execute(
      'SELECT id, name, price, stock FROM products WHERE id = ?',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = products[0];

    // Check if product is already in cart
    const [existingItems] = await db.execute(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingItems.length > 0) {
      // Product already in cart - increase quantity
      const newQuantity = existingItems[0].quantity + parseInt(quantity);

      // Check stock availability
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available in stock`
        });
      }

      await db.execute(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [newQuantity, userId, product_id]
      );

      return res.status(200).json({
        success: true,
        message: `${product.name} quantity updated in cart`,
        quantity: newQuantity
      });
    }

    // Check stock availability for new item
    if (parseInt(quantity) > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units available in stock`
      });
    }

    // Add new item to cart
    await db.execute(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, product_id, parseInt(quantity)]
    );

    res.status(201).json({
      success: true,
      message: `${product.name} added to cart successfully!`
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
};

/**
 * updateCartItem - PUT /api/cart/:id
 * Updates the quantity of a cart item
 */
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || parseInt(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if cart item belongs to this user
    const [cartItems] = await db.execute(
      'SELECT c.*, p.stock, p.name FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id = ? AND c.user_id = ?',
      [cartItemId, userId]
    );

    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const cartItem = cartItems[0];

    // Check stock availability
    if (parseInt(quantity) > cartItem.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${cartItem.stock} units available in stock`
      });
    }

    // Update quantity
    await db.execute(
      'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [parseInt(quantity), cartItemId, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      quantity: parseInt(quantity)
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart'
    });
  }
};

/**
 * removeFromCart - DELETE /api/cart/:id
 * Removes an item from the cart
 */
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;

    // Check if cart item belongs to this user
    const [cartItems] = await db.execute(
      'SELECT id FROM cart WHERE id = ? AND user_id = ?',
      [cartItemId, userId]
    );

    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Delete the cart item
    await db.execute('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartItemId, userId]);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart'
    });
  }
};

/**
 * clearCart - DELETE /api/cart
 * Removes all items from the user's cart
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
