// controllers/orderController.js - Handles order placement and management
const db = require('../config/db');

/**
 * placeOrder - POST /api/orders
 * Places a new order from the user's cart
 */
const placeOrder = async (req, res) => {
  const connection = await db.getConnection();
  let transactionStarted = false;

  try {
    const userId = req.user.id;
    const { shipping_address, payment_method = 'cod', notes } = req.body;

    // Validate shipping address
    if (!shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Get all cart items for this user
    const [cartItems] = await connection.execute(
      `SELECT c.quantity, p.id as product_id, p.name, p.price, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    // Check if cart is empty
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Add items before placing an order.'
      });
    }

    // Verify stock availability for all items
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.name}". Only ${item.stock} available.`
        });
      }
    }

    // Calculate total order amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);

    // Start database transaction for data consistency
    await connection.beginTransaction();
    transactionStarted = true;

    // Create the order record
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method, notes)
       VALUES (?, ?, 'pending', ?, ?, ?)`,
      [userId, totalAmount.toFixed(2), shipping_address, payment_method, notes || null]
    );

    const orderId = orderResult.insertId;

    // Insert individual order items
    for (const item of cartItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Decrease product stock
      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear the user's cart after successful order
    await connection.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

    // Commit all changes to database
    await connection.commit();

    // Fetch the complete order details
    const [orders] = await connection.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Thank you for shopping with us.',
      order: {
        ...orders[0],
        items: cartItems.map(item => ({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: (parseFloat(item.price) * item.quantity).toFixed(2)
        })),
        totalAmount: totalAmount.toFixed(2)
      }
    });

  } catch (error) {
    // Only rollback if a transaction was actually started
    if (transactionStarted) {
      await connection.rollback();
    }
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order. Please try again.'
    });
  } finally {
    connection.release();
  }
};

/**
 * getMyOrders - GET /api/orders/my-orders
 * Returns all orders for the authenticated user
 */
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all orders for this user
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    // For each order, fetch its items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.execute(
          `SELECT oi.*, p.name, p.image_url, p.category
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = ?`,
          [order.id]
        );
        return { ...order, items };
      })
    );

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: ordersWithItems
    });

  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

/**
 * getOrder - GET /api/orders/:id
 * Returns a single order with all items
 */
const getOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    // Get the order (users can only see their own orders)
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get order items with product details
    const [items] = await db.execute(
      `SELECT oi.*, p.name, p.image_url, p.category, p.description
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    res.status(200).json({
      success: true,
      order: {
        ...orders[0],
        items
      }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

/**
 * getAllOrders - GET /api/orders (Admin only)
 * Returns all orders in the system
 */
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const [orders] = await db.execute(query, params);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

/**
 * updateOrderStatus - PUT /api/orders/:id/status (Admin only)
 * Updates the status of an order
 */
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const [existing] = await db.execute('SELECT id FROM orders WHERE id = ?', [orderId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

module.exports = { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
