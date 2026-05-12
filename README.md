# 🛍️ ShopEase - Enterprise E-Commerce Platform

A production-ready, scalable, and secure e-commerce application built for high-throughput transaction processing. Engineered with **React.js**, **Node.js/Express**, and **MySQL** to provide an industry-standard shopping experience comparable to leading global e-commerce platforms.

---

## 🏗️ Architecture & Features

Designed with scalability, security, performance, and conversion optimization in mind:

- **Scalable Backend Infrastructure**: Built on a microservices-ready Node.js/Express architecture handling complex routing, rate-limiting, and error tracking.
- **Relational Database Integrity**: Powered by a highly-normalized MySQL schema with ACID-compliant transactions for fault-tolerant order processing and inventory deduction.
- **Enterprise-Grade Security**: Features comprehensive JWT-based authentication, salted password hashing via bcrypt, and strict CORS/CSRF protection mechanisms.
- **High-Performance Frontend UI**: A React 18 single-page application utilizing advanced Context API state management to ensure rapid page loads and high conversion rates.
- **Responsive & Modern UX**: Employs an interactive, glassmorphic design system that ensures a seamless, dynamic user experience across all devices.
- **Robust Order Management System (OMS)**: End-to-end handling of the user journey from cart synchronization to secure checkout, payment processing, and administrative order fulfillment.

---

## 📁 Project Structure

```text
e-com/
├── backend/              # Node.js/Express REST API
│   ├── config/
│   │   ├── db.js         # MySQL Connection Pool
│   │   └── schema.sql    # Database Schema & Seed Data
│   ├── controllers/      # Core Business Logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT Verification & RBAC
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── .env              # Environment Configuration
│   ├── server.js         # Application Entry Point
│   └── package.json
│
└── frontend/             # React SPA
    ├── public/
    │   └── index.html
    └── src/
        ├── api/
        │   └── axios.js          # Centralized Axios Client & Interceptors
        ├── context/
        │   ├── AuthContext.js    # Global Authentication State
        │   └── CartContext.js    # Persistent Cart State
        ├── components/
        │   ├── Navbar/
        │   ├── Footer/
        │   ├── ProductCard/
        │   └── ProtectedRoute/
        ├── pages/
        │   ├── HomePage/
        │   ├── ProductsPage/
        │   ├── ProductDetailPage/
        │   ├── CartPage/
        │   ├── CheckoutPage/
        │   ├── OrderSuccessPage/
        │   ├── MyOrdersPage/
        │   ├── LoginPage/
        │   ├── RegisterPage/
        │   └── AdminDashboard/
        ├── App.js
        └── index.css             # Enterprise Design System
```

---

## ⚡ Deployment & Setup

### Step 1 — Database Provisioning

1. Connect to your local or cloud MySQL instance.
2. Execute the schema initialization script:
```sql
source C:/Users/senth/Desktop/e-com/backend/config/schema.sql
```

### Step 2 — Configure Environment Variables

Create and configure `backend/.env` for your environment:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_SECURE_PASSWORD
DB_NAME=ecommerce_db
JWT_SECRET=your_production_grade_secret
JWT_EXPIRE=7d
NODE_ENV=production
```

### Step 3 — Initialize Services

**Start the Backend API Server:**
```powershell
cd C:\Users\senth\Desktop\e-com\backend
npm install
npm run dev
```
*API running at → **http://localhost:5000***

**Start the Frontend Client:**
```powershell
cd C:\Users\senth\Desktop\e-com\frontend
npm install
npm start
```
*Client running at → **http://localhost:3000***

---

## 🔑 Staging Credentials

Use these credentials to access staging environments and review different role-based access control (RBAC) privileges:

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@shop.com     | admin123  |
| User  | john@example.com   | admin123  |

---

## 🌐 Enterprise API Gateway

### Authentication Service
| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | /api/auth/register    | Public  | Create new account   |
| POST   | /api/auth/login       | Public  | Authenticate user    |
| GET    | /api/auth/profile     | Private | Fetch user details   |
| PUT    | /api/auth/profile     | Private | Update user details  |

### Product Catalog Service
| Method | Endpoint              | Access  | Description               |
|--------|-----------------------|---------|---------------------------|
| GET    | /api/products         | Public  | Paginated search & filter |
| GET    | /api/products/:id     | Public  | Retrieve item details     |
| GET    | /api/products/categories | Public | List dynamic categories   |
| POST   | /api/products         | Admin   | Add catalog item          |
| PUT    | /api/products/:id     | Admin   | Modify catalog item       |
| DELETE | /api/products/:id     | Admin   | Remove catalog item       |

### Cart & Checkout Service
| Method | Endpoint       | Access  | Description              |
|--------|----------------|---------|--------------------------|
| GET    | /api/cart      | Private | Retrieve active cart     |
| POST   | /api/cart      | Private | Add to cart              |
| PUT    | /api/cart/:id  | Private | Modify quantity          |
| DELETE | /api/cart/:id  | Private | Remove item              |
| DELETE | /api/cart      | Private | Clear cart payload       |

### Order Management Service
| Method | Endpoint                  | Access  | Description             |
|--------|---------------------------|---------|-------------------------|
| POST   | /api/orders               | Private | Finalize transaction    |
| GET    | /api/orders/my-orders     | Private | User order history      |
| GET    | /api/orders/:id           | Private | Order specifics         |
| GET    | /api/orders               | Admin   | Global order registry   |
| PUT    | /api/orders/:id/status    | Admin   | Update fulfillment      |

---

## 🛠️ Technology Stack Matrix

| Layer     | Technology                         |
|-----------|------------------------------------|
| Client    | React 18, React Router v6, Axios   |
| UI/UX     | Vanilla CSS, CSS Variables         |
| API       | Node.js, Express.js                |
| Persistence| MySQL 8 (mysql2 connection pool)  |
| Security  | JWT Authentication, bcryptjs       |
| State     | React Context API                  |

---

## 📝 Engineering Notes

- **API Proxying**: The client routes traffic via a development proxy configured in `frontend/package.json` to prevent CORS issues during local testing.
- **Data Integrity**: Database transactions are strictly enforced during the `/api/orders` POST operation to ensure synchronized stock reduction and order creation.
- **Security Protocols**: All passwords are one-way hashed using **bcrypt** with 10 salt rounds. JWTs have a rolling expiration, and Axios interceptors automatically enforce strict token lifecycle management by destroying compromised or expired sessions.
