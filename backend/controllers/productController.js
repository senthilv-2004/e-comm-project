// controllers/productController.js - Handles all product-related business logic
const db = require('../config/db');

/**
 * getProducts - GET /api/products
 * Returns all products with optional filtering, searching, and sorting
 */
const getProducts = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { 
      category, 
      search, 
      sort = 'created_at', 
      order = 'DESC',
      page = 1,
      limit = 12,
      featured
    } = req.query;

    // Build dynamic SQL query with sales count
    let query = `
      SELECT p.*, CAST(COALESCE(SUM(oi.quantity), 0) AS UNSIGNED) as sales_count 
      FROM products p 
      LEFT JOIN order_items oi ON p.id = oi.product_id 
      WHERE 1=1
    `;
    const params = [];

    // Filter by category if provided
    if (category && category !== 'all') {
      query += ' AND p.category = ?';
      params.push(category);
    }

    // Search by name or description
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Filter featured products
    if (featured === 'true') {
      query += ' AND p.is_featured = TRUE';
    }

    query += ' GROUP BY p.id';

    // Whitelist allowed sort columns
    const allowedSortColumns = ['name', 'price', 'rating', 'created_at', 'reviews_count', 'sales_count'];
    const sortColumn = allowedSortColumns.includes(sort) ? `p.${sort}` : 'p.created_at';
    if (sort === 'sales_count') {
      // Use the alias directly
      query += ` ORDER BY sales_count ${order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}`;
    } else {
      query += ` ORDER BY ${sortColumn} ${order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}`;
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const offset = (pageNum - 1) * limitNum;
    
    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    // Execute main query
    const [products] = await db.execute(query, params);

    // Get total count for pagination (same filters, no LIMIT)
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    
    if (category && category !== 'all') {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (featured === 'true') {
      countQuery += ' AND is_featured = TRUE';
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

/**
 * getProduct - GET /api/products/:id
 * Returns a single product by ID
 */
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product: products[0]
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
};

/**
 * createProduct - POST /api/products
 * Creates a new product (Admin only)
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image_url, stock, is_featured } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name, price, and category are required'
      });
    }

    // Validate price is a positive number
    if (isNaN(price) || parseFloat(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }

    const [result] = await db.execute(
      `INSERT INTO products (name, description, price, category, image_url, stock, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        description || '',
        parseFloat(price),
        category,
        image_url || null,
        parseInt(stock) || 0,
        is_featured ? 1 : 0
      ]
    );

    // Fetch the newly created product
    const [newProduct] = await db.execute(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct[0]
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
};

/**
 * updateProduct - PUT /api/products/:id
 * Updates an existing product (Admin only)
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, stock, is_featured } = req.body;

    // Check if product exists
    const [existing] = await db.execute('SELECT id FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update the product
    await db.execute(
      `UPDATE products SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        category = COALESCE(?, category),
        image_url = COALESCE(?, image_url),
        stock = COALESCE(?, stock),
        is_featured = COALESCE(?, is_featured)
       WHERE id = ?`,
      [
        name || null,
        description || null,
        price ? parseFloat(price) : null,
        category || null,
        image_url || null,
        stock !== undefined ? parseInt(stock) : null,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        id
      ]
    );

    // Fetch updated product
    const [updatedProduct] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct[0]
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};

/**
 * deleteProduct - DELETE /api/products/:id
 * Deletes a product (Admin only)
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [existing] = await db.execute('SELECT id, name FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete the product (cart items with this product will be deleted due to CASCADE)
    await db.execute('DELETE FROM products WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: `Product "${existing[0].name}" deleted successfully`
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
};

/**
 * getCategories - GET /api/products/categories
 * Returns all unique product categories
 */
const getCategories = async (req, res) => {
  try {
    const [categories] = await db.execute(
      'SELECT DISTINCT category, COUNT(*) as count FROM products GROUP BY category ORDER BY category'
    );

    res.status(200).json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories };
