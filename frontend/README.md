# Finora Frontend Architecture

This directory houses the client-side presentation layer for the **Finora Personal Expense Tracker**.

## 📁 Directory Structure
```
frontend/
├── index.html                # Public landing page with 3D finance visuals
├── login.html                # Secure authentication screen
├── register.html             # User registration with password strength meter
├── dashboard.html            # Main financial dashboard overview
├── transactions.html         # Transaction ledger with search & category filters
├── add-income.html           # Add income entry screen
├── add-expense.html          # Add expense entry screen
├── analytics.html            # Financial analytics & spending breakdown
├── budgets.html              # Category budgets & threshold alerts
├── goals.html                # Milestone savings goals & progress rings
├── categories.html           # Custom category management
├── recurring.html            # Recurring bills & subscription manager
├── transaction-details.html  # Single transaction detail audit view
├── settings.html             # Profile, security, preferences & appearance
├── 404.html                  # Error 404 page
├── empty-state.html          # Clean zero-data empty state preview
├── empty-states.html         # Multi-scenario empty states gallery
├── loading.html              # Fullscreen spinner & loading indicator
├── loading-states.html       # Shimmer skeleton loader showcase
├── favicon.svg               # Application brand favicon
├── assets/                   # High-res fintech illustrations & branding graphics
├── css/                      # Modular style sheets & design tokens
├── js/                       # Client-side JavaScript controllers & auth state
└── src/                      # React.js JSX component library
```

## 🎨 Design Tokens & Aesthetic
- **Canvas / Background**: `#11183F` & `#20275D` (Deep navy & indigo)
- **Primary Accent**: `#7957FF` (Vibrant violet)
- **Chart / Secondary**: `#48B9F5` (Electric blue)
- **Positive / Mint**: `#43D9A3` (Income & positive balances)
- **Negative / Coral**: `#F06575` (Expenses & threshold alerts)

## ⚛️ React Integration
Reusable React JSX components corresponding to all major views reside in [`src/`](./src) for seamless framework integration.
