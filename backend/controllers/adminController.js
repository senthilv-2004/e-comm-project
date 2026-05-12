// controllers/adminController.js - Handles admin-specific analytics and stats
const db = require('../config/db');

/**
 * getDashboardStats - GET /api/admin/stats
 * Returns aggregated statistics for the admin dashboard
 */
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Revenue and Order Count
    const [orderStats] = await db.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders
      FROM orders
    `);

    // 2. User count
    const [userStats] = await db.execute('SELECT COUNT(*) as total_users FROM users');

    // 3. Product count
    const [productStats] = await db.execute('SELECT COUNT(*) as total_products FROM products');

    // 4. Sales by category
    const [categoryStats] = await db.execute(`
      SELECT category, COUNT(*) as count, SUM(price) as value
      FROM products
      GROUP BY category
    `);

    // 5. Recent Sales (Last 7 days)
    const [recentSales] = await db.execute(`
      SELECT DATE(created_at) as date, SUM(total_amount) as amount, COUNT(*) as orders
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // 6. Top Selling Products
    const [topProducts] = await db.execute(`
      SELECT p.name, SUM(oi.quantity) as sales
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id
      ORDER BY sales DESC
      LIMIT 5
    `);

    res.status(200).json({
      success: true,
      stats: {
        orders: orderStats[0],
        users: userStats[0].total_users,
        products: productStats[0].total_products,
        categories: categoryStats,
        recentSales,
        topProducts
      }
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

module.exports = { getDashboardStats };
