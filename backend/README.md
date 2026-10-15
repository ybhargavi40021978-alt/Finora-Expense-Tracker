# Finora Backend Architecture

This directory contains the REST API server, business logic services, controllers, and security middleware for the **Finora Personal Expense Tracker**.

## 📁 Directory Structure
```
backend/
├── src/
│   ├── app.js               # Express app configuration & static middleware
│   ├── server.js            # HTTP server bootstrap & DB initialization
│   ├── config/              # Configuration (delegates to database/connection.js)
│   ├── controllers/         # Request handling & business orchestration
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   ├── incomeController.js
│   │   ├── summaryController.js
│   │   └── transactionController.js
│   ├── middleware/          # JWT auth, error handlers, and validation
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validateRequest.js
│   ├── models/              # Data model delegates (points to database/models/)
│   ├── routes/              # Express API route declarations
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── summaryRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   └── services/            # Financial summary calculations & aggregations
│       └── summaryService.js
└── README.md                # Backend architecture guide
```

## 🔐 Security & Middleware
- **`requireAuth`**: Validates incoming `Authorization: Bearer <token>` and attaches authenticated `req.userId`.
- **`validateRequest`**: Rejects negative amounts (`amount > 0`), ensures required fields (`title`, `category`), and prevents invalid payloads.
- **`errorHandler`**: Catches unhandled exceptions, validation errors, and returns consistent JSON errors without leaking stack traces.
