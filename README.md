# Finora Expense Tracker — Landing Page UI Design

Production-quality landing page for **Finora**, a modern fintech personal finance and expense-tracking web application.

---

## 🎨 Design Specification & Palette

| Token | Hex / Value | Description |
|---|---|---|
| **Main Hero Background** | `#11183F` | Deep navy canvas |
| **Secondary Background** | `#20275D` | Deep indigo gradient layer |
| **Primary Accent** | `#7957FF` | Vibrant violet for primary CTA & branding |
| **Secondary Accent** | `#48B9F5` | Electric blue for charts & trends |
| **Highlight** | `#C7B8FF` | Soft lavender text accent & borders |
| **Feature Strip** | `#FFFFFF` | Clean white strip at bottom of hero |
| **Main Text** | `#FFFFFF` | Crisp white typography |
| **Secondary Text** | `#C3C9E8` | Muted lavender for readability |
| **Positive Indicator** | `#43D9A3` | Mint green for financial growth |
| **Borders** | `rgba(255, 255, 255, 0.12)` | Translucent frosted glass |

---

## 📐 Layout & Composition (1440 × 1024 px Desktop First)

- **Slim Navigation Bar (~72px)**:
  - Left: Violet brand icon with white stylized finance symbol + bold wordmark **Finora**.
  - Center: Clean navigation items (*Home*, *Features*, *About*, *Contact*) with active indicator.
  - Right: Minimalist *Login* link + compact rounded violet *Get Started* button.
- **Hero Section (Two-Column Layout, 75–80% Viewport)**:
  - **Left Column (~520px)**:
    - Next-Gen Personal Finance status chip with mint pulse.
    - Large 56px bold headline: *"Take Control of Your Finances"* with violet-lavender gradient accent on *Finances*.
    - Supporting paragraph: *"Track your income, manage expenses, set goals and build a better financial future — all in one place."*
    - Two side-by-side CTA buttons: Solid violet **Get Started Free** with arrow, and dark navy translucent **Watch Demo** with play bubble.
    - Social proof rating badge (*40,000+ smart savers*).
  - **Right Column (3D Financial Visual Stage)**:
    - 3D character illustration of a young adult managing personal finances on a modern laptop with glowing fintech elements.
    - Floating glassmorphic cards:
      - **Monthly Income Card**: `+$3,850.00` with mint green positive `+14.2%` badge.
      - **Net Savings Chart**: Glowing electric blue sparkline with upward trend (`+28.4%`).
      - **Budget Status Donut Card**: Live budget indicator (`76% On Track`).
      - Glossy 3D gold coin and active vault badge.
    - Interactive 3D mouse parallax tilt effect.
- **Bottom Feature Strip (Clean White Row)**:
  - **Feature 1**: *Track Income & Expenses* — Organize every transaction (Mint green icon).
  - **Feature 2**: *Smart Analytics & Insights* — Understand your spending (Violet icon).
  - **Feature 3**: *Set Budgets & Goals* — Stay on track financially (Electric blue icon).
  - **Feature 4**: *Secure & Private Data* — Keep your data protected (Cyan shield icon).

- **Section 2: About Finora (`#about`)**:
  - Eyebrow: `ABOUT FINORA`
  - Headline: *"Your Money. Your Goals. Your Future."*
  - Supporting lead: Comprehensive overview of Finora's core value proposition.
  - Two-column layout:
    - **Left Column**: Subheading, mission intro, 3 benefit points (*Complete Financial Overview*, *Smarter Spending Decisions*, *Goal-Oriented Saving*) with violet icons, and primary *"Start Your Journey"* CTA.
    - **Right Column**: Fintech illustration card featuring a Financial Health Summary, sample Monthly Income vs Expenses bar with a 64% fill ratio, and an Emergency Fund 82% savings goal ring.
  - Centered lavender Mission Statement panel: *"Our mission is to help people build healthier financial habits by making their money easier to understand, organize, and manage."*

- **Section 3: Why Choose Finora (`#why-choose`)**:
  - Eyebrow: `WHY CHOOSE FINORA`
  - Headline: *"Everything You Need to Manage Your Money"*
  - 4-card responsive grid:
    1. *Income & Expense Tracking* (Record your income and expenses and review your financial activity in one place).
    2. *Budget Planning* (Set category budgets, monitor spending, and see how much of your budget remains).
    3. *Savings Goals* (Create financial goals, record contributions, and track progress toward your targets).
    4. *Financial Insights* (Explore your spending trends and understand your financial patterns through reports).

- **Section 4: Frequently Asked Questions (`#faq`)**:
  - Interactive accordion interface with smooth animated height transitions.
  - Accurate answers covering app capabilities: tracking, budgets, savings goals, and customer support.

- **Section 5: Contact Us (`#contact`)**:
  - Eyebrow: `CONTACT US`
  - Headline: *"We’re Here to Help"*
  - Two-column layout:
    - **Left Column**: *"Let’s Talk"* with 3 direct contact info cards (*General Inquiries*, *Technical Support*, *Feedback & Suggestions*).
    - **Right Column**: Comprehensive Contact Form card with Full Name, Email Address validation, Subject dropdown, Message multiline textarea with live 1000-character counter, Privacy confirmation checkbox, and a violet *"Send Message"* button with inline loading spinner.
  - Backend integration: Connects asynchronously to `POST /api/contact` on Node.js/Express, featuring input sanitization, rate limiting, inline error feedback, and persistence of entered input on failure.

- **Section 6: Polished Dark Navy Footer (`#11183F`)**:
  - 3-column top grid with Finora brand logo, tagline *"Track. Plan. Save. Grow."*, description, Quick Links (*Home*, *Features*, *About*, *Contact*), and Account links (*Login*, *Get Started*, *Dashboard*).
  - Bottom bar with copyright line *"© 2026 Finora. All rights reserved."* and an interactive Privacy Policy modal trigger.

---

## 📂 Application Screens

- **Screen 1: Landing Page** — [`index.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/index.html)
- **Screen 2: Login Page** — [`login.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/login.html)
- **Screen 3: Register Page** — [`register.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/register.html)
- **Screen 4: Dashboard Page** — [`dashboard.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/dashboard.html)
- **Screen 5: Transactions Page** — [`transactions.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/transactions.html)
- **Screen 6: Add Income Page** — [`add-income.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/add-income.html)
- **Screen 7: Add Expense Page** — [`add-expense.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/add-expense.html)
- **Screen 8: Analytics & Reports Page** — [`analytics.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/analytics.html)
- **Screen 9: Budget Management Page** — [`budgets.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/budgets.html)
- **Screen 10: Goals & Savings Page** — [`goals.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/goals.html)
- **Screen 11: Categories Management Page** — [`categories.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/categories.html)
- **Screen 12: Recurring Transactions Page** — [`recurring.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/recurring.html)
- **Screen 13: Transaction Details Page** — [`transaction-details.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/transaction-details.html)
- **Screen 14: Profile & Settings Page** — [`settings.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/settings.html)
- **Screen 15: Empty State Page** — [`empty-state.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/empty-state.html) *(Multi-scenario showcase: [`empty-states.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/empty-states.html))*
- **Screen 16: Loading State Page** — [`loading.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/loading.html) *(Skeleton design system: [`loading-states.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/loading-states.html))*
- **Screen 17: 404 Error Page** — [`404.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/404.html)

---

## 🚀 Quick Start

### 1. Run with Node.js
```bash
npm start
# Server running at http://localhost:3000
```

### 2. Standalone HTML
You can also open [index.html](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/index.html) directly in any modern web browser.

---

## 🔐 Screen 2: Login Page (1440 × 1024 px Split Layout)

Accessible directly at [login.html](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/login.html) or `http://localhost:3000/login.html`.

- **Layout Composition:**
  - **Left Illustration Panel (46% width):** Deep navy (`#11183F`) to indigo (`#20275D`) gradient, top Finora logo and wordmark (aligned ~48px left, 36px top), centered 3D financial illustration of a person managing money with a smartphone, floating savings growth badge (`+$940.00`), 256-bit encrypted vault badge, and supporting copy:
    - *“Better Money Habits, Brighter Future”* (28–32px bold white).
    - *“Track. Plan. Save. Grow.”* (15–16px muted lavender).
  - **Right Login Panel (54% width):** Clean white (`#FFFFFF`) background, horizontally & vertically centered form container (max 400px):
    - Welcome heading: *“Welcome Back!”* (32px dark navy `#18213D`) + subtext *“Sign in to your account to continue.”*
    - **Email Address** field with leading mail icon, hover & violet focus ring, and inline validation.
    - **Password** field with leading lock icon, trailing eye toggle (show/hide password), and inline validation.
    - **Remember-me** row with custom checkbox and violet *“Forgot password?”* link.
    - Primary **Login** button in Finora violet (`#7957FF`) with loading spinner and authentication feedback.
    - Divider with *“or”*.
    - Secondary **Continue with Google** button with official multicolor Google “G” icon.
    - Registration navigation link: *“Don't have an account? Register”*.

---

## 📝 Screen 3: Registration Page (1440 × 1024 px Split Layout)

Accessible directly at [register.html](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/register.html) or `http://localhost:3000/register.html`.

- **Layout Composition:**
  - **Left Branding Panel (46% width):** Deep navy (`#11183F`) to indigo (`#20275D`) gradient, top Finora logo and wordmark (aligned ~48px left, 36px top), centered 3D financial illustration of a young adult managing wealth goals with a tablet, floating emergency savings goal progress badge (`84% Funded`), AI automated budgeting pill, and supporting copy:
    - *“Start Your Financial Journey”* (28–32px bold white).
    - *“Create your account and take control of your money.”* (15–16px muted lavender `#C3C9E8`).
  - **Right Registration Panel (54% width):** Clean white (`#FFFFFF`) surface, horizontally and vertically centered form container (max 400px):
    - Form heading: *“Create Your Account”* (30–32px dark navy `#18213D`) + subtext *“Join Finora and start managing your finances.”*
    - **Full Name** field with leading user icon.
    - **Email Address** field with leading mail icon.
    - **Password** field with leading lock icon, trailing eye visibility toggle, and a **4-Segment Dynamic Password Strength Indicator** (Weak, Fair, Good, Strong) with live helper captions.
    - **Confirm Password** field with lock icon, trailing eye toggle, and real-time mismatch validation.
    - **Terms & Privacy Agreement** checkbox row with custom violet check and modal links.
    - Primary **Create Account** button in Finora violet (`#7957FF`) with loading spinner and success alert.
    - Divider with *“or”*.
    - Secondary **Continue with Google** button with official multicolor Google “G” icon.
    - Existing account navigation link: *“Already have an account? Login”*.

---

## ⚛️ React.js Components

The repository provides modular, production-ready React components:

1. **Landing Page:** [src/FinoraLandingPage.jsx](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/src/FinoraLandingPage.jsx)
2. **Login Page:** [src/FinoraLoginPage.jsx](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/src/FinoraLoginPage.jsx)
3. **Registration Page:** [src/FinoraRegisterPage.jsx](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/src/FinoraRegisterPage.jsx)

```jsx
import FinoraRegisterPage from './src/FinoraRegisterPage';

export default function App() {
  return (
    <FinoraRegisterPage
      onRegisterSuccess={(userData) => console.log('Registered:', userData)}
      onNavigateToLogin={() => console.log('Navigate to login screen')}
    />
  );
}
```

---

## 💳 Screen 7: Add Expense Page (1440 × 1024 px Two-Column Layout)

Accessible directly at [`add-expense.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/add-expense.html) or `http://localhost:3000/add-expense.html`.

- **Sidebar & Header:**
  - 220px dark indigo sidebar (`#171D4C`) with Finora branding and tagline *“Track. Plan. Save. Grow.”*
  - **Expenses** active navigation item in bold violet (`#7957FF`) with subtle glow.
  - Header with breadcrumb `Dashboard / Expenses / Add Expense`, global search, notification center, and authenticated user profile badge.
- **Left Column (65% width) — Expense Details & Options:**
  - **Expense Title** (required) with receipt icon indicator.
  - **Amount** (required) with Indian Rupee (`₹`) prefix and prominent coral-red (`#F06575`) styling.
  - **Expense Category** with 13 categories (Food & Dining, Groceries, Transportation, Shopping, Bills & Utilities, Housing & Rent, Healthcare, Education, Entertainment, Travel, Personal Care, Subscriptions, Other).
  - **Expense Date** picker defaulting to current local date.
  - **Payment Method** (UPI, Debit Card, Credit Card, Cash, Bank Transfer, Net Banking, Other).
  - **Paid From** account dropdown (Primary Bank Account, Savings Account, Cash Wallet, Credit Card, Other).
  - **Merchant / Recipient** optional text input.
  - **Description** multi-line text area.
  - **Tags Chip Manager** with custom tag creation and removable lavender chips.
  - **Receipt & Attachments** upload dropzone supporting drag-and-drop, client-side validation (5MB max), and remove option.
  - **Additional Options:**
    - Recurring expense toggle revealing frequency (Weekly, Monthly, Quarterly, Yearly), start/end dates, and next bill date calculation.
    - “Include this expense in financial reports and analytics” checkbox (enabled by default).
    - “Mark this as an essential expense” classification flag.
  - Top & bottom action buttons (**Cancel** and **Save Expense** with check-circle icon).
- **Right Column (35% width) — Context & Impact:**
  - **Expense Preview Card:** Live-updating card reflecting all form inputs, status indicator (*“Ready to save”* vs *“Complete required fields”*), and large coral-red bold amount.
  - **Monthly Spending Snapshot:** Displays total expenses (`₹33,180`), record count (`24`), top category (*Food & Dining*), and multi-colored spending distribution bar.
  - **Budget Impact Card:** Real-time calculation of category budget (`₹10,000`), current spent (`₹6,200`), remaining budget, and dynamic progress bar with amber warning (≥80%) and coral exceeded alerts.
  - **Smart Spending Tip:** Lavender card with lightbulb icon highlighting categorization best practices.
- **Interactive State Switcher Bar:** Floating toolbar to test **Standard**, **Pre-filled**, **Recurring**, **Budget Warning**, **No Budget**, **Empty Snapshot**, and **API Error** states with one click.
- **Backend & MongoDB Ready:** Clean integration with `POST /api/expenses` supporting INR currency formatting, authenticated user reference, and client/server validation.

---

## 📊 Screen 8: Analytics & Reports Page (1440 × 1024 px Multi-Chart Analytics)

Accessible directly at [`analytics.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/analytics.html) or `http://localhost:3000/analytics.html`.

- **Sidebar & Header:**
  - 220px dark indigo sidebar (`#171D4C`) with Finora branding and tagline *“Track. Plan. Save. Grow.”*
  - **Analytics** active navigation item in bold violet (`#7957FF`) with subtle glow.
  - Header with breadcrumb `Dashboard / Analytics & Reports`, search bar, notifications indicator, and authenticated user profile.
- **Report Controls & Filters:**
  - **Period Selector:** Dropdown with This Month, Last Month, Last 3 Months, Last 6 Months, This Year, Last Year, Custom Range.
  - **Date Range Indicator & Custom Range Inputs:** Expands start/end date pickers when Custom Range is active.
  - **Transaction Type Segmented Control:** All, Income, Expenses filters dynamically adjusting displayed analytics.
  - **Export CSV Button:** Real client-side CSV file download with formatted transaction headers and records.
  - **Download Report Button:** Generates a formatted PDF/Print report layout.
- **Financial Overview Cards (4 Metric Cards):**
  - **Total Income:** `₹78,500` with mint green trending-up icon and `+12.4%` vs previous period comparison.
  - **Total Expenses:** `₹33,180` with coral trending-down icon and `-4.8%` vs previous period.
  - **Net Savings:** `₹45,320` (`Income - Expenses`) with violet piggy-bank/safe icon and `+24.1%` retention rate.
  - **Savings Rate:** `57.7%` with electric blue progress ring icon and healthy savings habit badge.
- **Main Charts (65% vs 35% Layout):**
  - **Income vs Expenses Grouped Bar Chart:** SVG grouped bar visualization with Weekly, Monthly, and Yearly interval pills, mint green income bars (`#23B981`), coral expense bars (`#F06575`), subtle grid lines, and interactive hover tooltips.
  - **Spending by Category Donut Chart:** Central callout with Total Expenses (`₹33,180`), interactive segments, and category legend with amounts and percentages (Food & Dining 34%, Transportation 22%, Shopping 15%, Bills & Utilities 12%, Other 17%).
- **Full Width Monthly Spending Trend:**
  - Smooth multi-line chart tracking 6-month trajectory for Income, Expenses, and Net Savings with interactive point hover tooltips.
- **Secondary Analytics Grid (3 Columns):**
  - **Income Sources:** Horizontal bar chart displaying Salary, Freelance, Investments, Rental Income, and Other with amount and share.
  - **Financial Insights:** 4 actionable insight cards highlighting spending pattern, savings progress, income trend, and budget awareness.
  - **Savings Analysis:** Metric boxes with compound allocation bar dividing expenses (42.3%) and savings (57.7%).
- **Recent Financial Activity Table:**
  - Transaction rows contributing to reports with category icons, green income amounts (`+₹...`), and coral expense amounts (`−₹...`), linking to `transactions.html`.
- **Interactive State Switcher Bar:** Floating toolbar to test **Standard (Oct 2026)**, **Income Only**, **Expenses Only**, **Empty Period**, and **API Error State**.

---

## 🎯 Screen 9: Budget Management Page (1440 × 1024 px Budget Controls)

Accessible directly at [`budgets.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/budgets.html) or `http://localhost:3000/budgets.html`.

- **Sidebar & Header:**
  - 220px dark indigo sidebar (`#171D4C`) with Finora branding and tagline *“Track. Plan. Save. Grow.”*
  - **Budgets** active navigation item in bold violet (`#7957FF`) with subtle glow.
  - Header with breadcrumb `Dashboard / Budgets`, search control, notification bell, and authenticated user profile badge.
- **Period & Action Controls:**
  - **Budget Period Selector:** This Month, Last Month, Next Month, Custom Period with previous/next month navigation buttons.
  - **Copy Previous Budget:** Copies previous month's budget allocations with instant user feedback.
  - **+ Create Budget Button:** Opens the centered creation modal.
- **Overall Budget Summary Cards (Row of 4 Cards):**
  - **Total Budget:** `₹50,000` (planned spending, violet wallet icon).
  - **Total Spent:** `₹28,450` (recorded expenses, coral receipt icon).
  - **Remaining Budget:** `₹21,550` (unspent allocation, green wallet icon).
  - **Budget Usage:** `56.9%` (blue circular progress icon).
- **Overall Budget Progress Card (Full-Width):**
  - Full-width card with total budget, spent, remaining, percentage used (`56.9%`), large horizontal progress bar with threshold color indicators (<70% violet, 70-89% amber, ≥90% coral), and status legend chips.
- **Category Budgets Breakdown:**
  - Toolbar with search categories field, status filter dropdown (*All*, *Under Budget*, *Near Limit*, *Over Budget*), and sort dropdown (*Category Name*, *Highest Budget*, *Highest Spending*, *Remaining Budget*).
  - 2-Column responsive grid of category cards with category icon, name, limit, spent, remaining, percentage, progress bar, status pills, and interactive 3-dot action menu:
    - *View Transactions* (redirects to `transactions.html`).
    - *Edit Budget* (prefills modal).
    - *Adjust Budget* (quick prompt to change spending limit).
    - *View Details* (detailed breakdown modal).
    - *Delete Budget* (confirmation dialog).
  - 8 realistic illustrative categories: Food & Dining (62%), Transportation (76%), Shopping (93.8%), Bills & Utilities (70%), Entertainment (113.3% - over budget), Healthcare (37.5%), Housing & Rent (50%), Subscriptions (60%).
- **Budget Alerts & Spending Comparisons:**
  - **Budget vs Actual Spending Chart:** Grouped bar chart comparing planned envelope with actual spending across categories with legend.
  - **Budget Alerts Card:** Real-time warnings for near-limit spending (Shopping 93.8%, Transportation 76%) and over-budget alerts (Entertainment exceeded by ₹400).
- **Period Overview & Recommendations:**
  - **Budget Period Overview:** Status metric chips (8 active budgets, 6 within limits, 2 near limits, 1 over budget).
  - **Budget Recommendations:** Actionable tips to adjust limits or review purchases.
- **Create / Edit Budget Modal:**
  - Form fields: Budget Name, Category, Budget Limit with `₹` prefix, Period, Start/End dates, Alert Threshold (50%, 75%, 80%, 90%, 100%), and optional description.
- **Interactive State Switcher Bar:** Floating toolbar to test **Standard (Oct 2026)**, **Near Limit Only**, **Over Budget Only**, **Empty State**, and **API Error State**.

---

---

## 🏆 Screen 10: Goals & Savings Page (1440 × 1024 px Goals & Milestones)

Accessible directly at [`goals.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/goals.html) or `http://localhost:3000/goals.html`.

- **Sidebar & Header:**
  - 220px dark indigo sidebar (`#171D4C`) with Finora branding and tagline *“Track. Plan. Save. Grow.”*
  - **Goals** active navigation item in bold violet (`#7957FF`) with subtle glow.
  - Header with breadcrumb `Dashboard / Goals`, search control, notification bell with unread dot, and authenticated user profile badge.
- **Page Introduction & Action Row:**
  - Title: *Your Financial Goals* and subtitle *“Set a target, build your savings, and track every step toward your future.”*
  - **Savings Insights** secondary outlined button with chart icon.
  - **+ Create Goal** primary violet button with plus icon.
- **Savings Overview Cards (Row of 4 Cards):**
  - **Total Goal Target:** `₹2,00,000` (combined active goals target, violet target/bullseye icon).
  - **Total Saved:** `₹85,000` (allocated savings, mint-green wallet/piggy-bank icon).
  - **Remaining to Save:** `₹1,15,000` (needed savings, electric blue trending-up icon).
  - **Goals Completed:** `2 of 6` (achieved milestones, check-circle icon).
- **Featured Goal — Main Progress Card (Dream Vacation):**
  - Prominent wide card featuring **Dream Vacation** (`₹65,000` / `₹1,00,000`, 65% progress, target date 31 March 2027).
  - High-priority badge, circular progress ring with electric blue/violet gradient stroke and center percentage.
  - Quick actions: **Add Contribution** and **View Details**.
- **My Savings Goals Grid & Controls:**
  - Toolbar with search goals input, status filter dropdown (*All*, *Active*, *Completed*, *Paused*, *Overdue*), and sort dropdown (*Recently Updated*, *Nearest Deadline*, *Highest Progress*, *Lowest Progress*, *Target Amount*).
  - 3-Column responsive card grid displaying 6 realistic goals:
    - *New Laptop* (`₹48,000` / `₹80,000`, 60%, Active)
    - *Emergency Fund* (`₹75,000` / `₹1,50,000`, 50%, Active)
    - *Dream Vacation* (`₹65,000` / `₹1,00,000`, 65%, Active)
    - *New Phone* (`₹40,000` / `₹40,000`, 100%, Completed with green check badge)
    - *Course & Certification* (`₹10,000` / `₹25,000`, 40%, Active)
    - *New Bicycle* (`₹5,000` / `₹20,000`, 25%, Active)
  - Interactive 3-dot action menu: *View Details*, *Add Contribution*, *Edit Goal*, *Pause/Resume Goal*, *Mark as Completed*, *Delete Goal*.
- **Goal Progress Insights & Savings Timeline (2-Column Layout):**
  - **Goal Progress Insights:** Compact metric chips (Goals On Track, Near Deadline, Completed, Total Remaining), dynamic horizontal progress comparison bars, and contextual financial recommendations.
  - **Savings Timeline:** Chronological timeline sorted by upcoming target dates with status pills, progress bars, and amber deadline warnings.
- **Interactive Modals:**
  - **Create / Edit Goal Modal:** Form fields for Goal Name, Category dropdown, Target Amount (`₹`), Initial Saved Amount, Target Date, compact 10-icon selector grid, accent color palette selector, Priority, Description, and collapsible Savings Plan (frequency & monthly calculation).
  - **Add Contribution Modal:** Displays goal snapshot, Contribution Amount (`₹`), Date, Source Account, and Note with instant progress updates and completion celebration.
  - **Goal Details & Contribution History Modal:** Large modal with complete goal metadata, progress bar, and comprehensive contribution history table with date, note, amount, source, and delete action.
- **Interactive State Switcher Bar:** Floating toolbar to test **Standard (All 6 Goals)**, **Active Only**, **Completed Only**, **Overdue State**, **Empty State**, and **API Error State**.
- **Backend & MongoDB Ready:** Clean REST endpoint architecture (`GET/POST /api/goals`, `POST /api/goals/:id/contributions`, `GET /api/goals/summary`) with authenticated user isolation and server-side validation.

---

---

## 🏷️ Screen 11: Categories Management Page (1440 × 1024 px Categories & Classifications)

Accessible directly at [`categories.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/categories.html) or `http://localhost:3000/categories.html`.

- **Sidebar & Header:**
  - 220px dark indigo sidebar (`#171D4C`) with Finora branding and tagline *“Track. Plan. Save. Grow.”*
  - **Categories** active navigation item in bold violet (`#7957FF`) with subtle glow.
  - Header with breadcrumb `Dashboard / Categories`, search control, notification bell with unread dot, and authenticated user profile badge.
- **Page Introduction & Action Row:**
  - Title: *Your Financial Categories* and subtitle *“Organize your income and expenses your way.”*
  - **Manage Defaults** secondary outlined button.
  - **+ Create Category** primary violet button.
- **Category Overview Cards (Row of 3 Compact Cards):**
  - **Income Categories:** `8` (available income types, mint green wallet/arrow-up icon).
  - **Expense Categories:** `12` (available expense types, coral receipt/arrow-down icon).
  - **Custom Categories:** `5` (user-created classifications, violet folder-plus icon).
- **Category Type Switcher (Segmented Control):**
  - Segmented control with instant filtering: **All Categories** (25), **Income** (10), **Expenses** (15) with live count badges and active indicators.
- **Search & Filter Toolbar:**
  - Search input with live name and description lookup.
  - Category type dropdown (*All, Income, Expense*).
  - Category source dropdown (*All, Default, Custom*).
  - Sort dropdown (*Name A–Z, Name Z–A, Most Used, Highest Amount*).
  - Grid View vs List View layout toggles.
  - Clear Filters action button.
- **Categories Display Area (3-Column Grid):**
  - 25 rich categories (12 default expenses, 8 default income, 5 custom).
  - Each card shows category icon tile with assigned color, category title, Type badge (Income green or Expense coral), Source badge (Default or Custom), transaction count, and monthly total (`Spent this month: ₹6,450` or `Earned this month: ₹65,000`).
  - Interactive 3-dot action menu:
    - *View Transactions* (navigates to `transactions.html?category=...`).
    - *Edit Category* (opens prefilled form).
    - *Archive Category* / *Restore Category* (safe archive preserving historical transactions).
    - *Delete Category* (disabled with tooltip for default categories; enabled with confirmation for custom categories).
- **Category Details Side Drawer:**
  - Slides in upon card click: Category hero tile, Type/Source pills, monthly total, transaction count, average transaction size, and simulated recent category transactions.
- **Create / Edit Category Modal:**
  - Category Name with duplicate and whitespace validation.
  - Category Type radio selector (Expense vs Income).
  - Compact 24-icon selectable grid.
  - 10 accessible color swatches.
  - Description textarea and optional linked budget dropdown.
- **Manage Defaults Modal:**
  - Lists system default categories with protected lock status and "Restore All System Defaults" safeguard action.
- **Interactive State Switcher Bar:** Floating toolbar to test **Standard (All 25)**, **Income Only**, **Expenses Only**, **Custom Only**, **Archived**, **Empty State**, and **API Error State**.
- **Backend & MongoDB Ready:** Integration endpoints `GET /api/categories`, `POST /api/categories`, `PATCH /api/categories/:id`, `PATCH /api/categories/:id/archive`, `DELETE /api/categories/:id` with authenticated user scoping and historical transaction safety.

---

---

## 🔄 Screen 12: Recurring Transactions Page (1440 × 1024 px Automated Schedules)

Accessible directly at [`recurring.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/recurring.html) or `http://localhost:3000/recurring.html`.

- **Sidebar & Header:**
  - 220px dark indigo sidebar (`#171D4C`) with Finora branding and tagline *“Track. Plan. Save. Grow.”*
  - **Recurring** active navigation item in bold violet (`#7957FF`) with subtle glow.
  - Header with breadcrumb `Dashboard / Recurring`, search control, notification bell with unread dot, and authenticated user profile badge.
- **Page Introduction & Action Row:**
  - Title: *Your Repeating Cash Flow* and subtitle *“Automate your financial routine and stay ahead of every payment.”*
  - **Calendar View** secondary outlined button toggling between Table and Calendar presentations.
  - **+ Create Schedule** primary violet button.
- **Financial Overview Cards (Row of 4 Cards):**
  - **Active Schedules:** `8` (currently active automated items, violet repeat icon).
  - **Upcoming Expenses:** `₹19,098` (scheduled expenses over next 30 days, coral calendar-event icon).
  - **Expected Income:** `₹90,000` (scheduled income over next 30 days, green trending-up icon).
  - **Payments Due Soon:** `5` (scheduled items due within the next 7 days, amber alarm-warning icon).
- **Upcoming Payments Panel (Chronological Quick List):**
  - Prominent white card featuring nearest upcoming payments (Rent Payment due Oct 18, Internet Broadband due Oct 20, Salary due Oct 25) with dynamic timing chips (*“Due in 3 days”*, *“Due today”*, *“Awaiting confirmation”*).
- **Recurring Transaction Tabs & Filter Toolbar:**
  - Segmented control with instant filtering: **All Schedules** (10), **Expenses** (8), **Income** (2), **Paused** (1).
  - Search input with live lookup across schedule titles, categories, and descriptions.
  - Frequency dropdown (*All Frequencies, Daily, Weekly, Monthly, Quarterly, Yearly*).
  - Category dropdown (*Housing, Bills & Utilities, Salary, Subscriptions, Transportation, Healthcare, Freelance*).
  - Status dropdown (*Active, Paused, Ended*).
  - Sort dropdown (*Next Due Date, Amount: High to Low, Amount: Low to High, Name A–Z*).
  - Clear Filters action button.
- **Recurring Transactions Table:**
  - Columns: Transaction, Category, Amount (`-₹...` coral for expense, `+₹...` green for income), Frequency, Next Occurrence, Reminder, Status, Actions.
  - Interactive 3-dot action menu:
    - *View Details* (opens full schedule slide drawer).
    - *Record Payment / Record Income* (opens record transaction modal and advances next occurrence date).
    - *Edit Schedule* (prefills schedule settings).
    - *Skip Occurrence* (advances next occurrence without recording a transaction).
    - *Pause / Resume Schedule* (toggles active recurrence safely).
    - *End Schedule* (stops future occurrences while preserving historical records).
- **Calendar View Presentation:**
  - Full-month calendar view for October 2026 with navigation, today indicator, and schedule event pills color-coded by income (green) and expense (coral).
- **Monthly Commitments & Helpful Insights (2 Cards):**
  - **Monthly Commitments Estimate:** Expected recurring expenses (`₹19,098`), expected recurring income (`₹90,000`), estimated net recurring cash flow (`+₹70,902`), and proportional comparison progress bar.
  - **Smart Recurring Insights:** Contextual financial tips highlighting payments due in the next 7 days and active subscription counts.
- **Interactive Modals & Drawers:**
  - **Create / Edit Recurring Schedule Modal:** Transaction type cards, title, amount, category, account, frequency rules, start date, reminder timing, and safe occurrence handling safeguards.
  - **Record Payment Modal:** Actual amount, transaction date, account/method, and optional note.
  - **Schedule Details Side Drawer:** Hero tile, category badges, amount, frequency, next date, account, occurrence mode, and quick payment recording.
  - **Confirmation Modals:** Skip occurrence, pause/resume, and end schedule dialogs.
- **Interactive State Switcher Bar:** Floating toolbar to test **Standard (All)**, **Expenses Only**, **Income Only**, **Paused Only**, **Calendar View**, **Empty State**, and **API Error State**.
- **Backend & MongoDB Ready:** Clean integration with `GET /api/recurring`, `POST /api/recurring`, `PATCH /api/recurring/:id`, `PATCH /api/recurring/:id/pause`, `POST /api/recurring/:id/occurrences/:occurrenceId/record`.

---

## 🧾 Screen 13: Transaction Details Page (1440 × 1024 px Complete Transaction Inspector)

Accessible directly at [`transaction-details.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/transaction-details.html) or `http://localhost:3000/transaction-details.html`.

- **Sidebar & Header:**
  - 220px dark indigo sidebar (`#171D4C`) with Finora branding and tagline *“Track. Plan. Save. Grow.”*
  - **Transactions** active navigation item in bold violet (`#7957FF`) with subtle glow (Screen 13 inspects a specific transaction record).
  - Header with breadcrumb `Dashboard / Transactions / Transaction Details`, page navigation link `← Back to Transactions`, search control, notification bell with unread dot, and authenticated user profile badge.
- **Transaction Header & Action Row:**
  - Category icon tile in rounded coral (or mint green for income) with title: **Food & Dining**, reference badge `TXN-2026-10482`, Type pill (*Expense*), Status badge (*Completed*), and Date (*October 14, 2026*).
  - Primary **Edit Transaction** button in vibrant violet (`#7957FF`).
  - **More Actions** outlined button with dropdown menu: *Duplicate Transaction*, *View Related Transactions*, *Print Details*, and destructive *Delete Transaction*.
- **Transaction Amount Hero Card:**
  - Prominent white card with colored left accent border (coral `#F06575` for expense, mint `#23B981` for income).
  - Massive bold typography displaying formatted Indian Rupee amount: **−₹1,250.00** (or `+₹65,000.00`).
  - Metadata strip displaying Title (*Dinner at Urban Cafe*), Type, Category, Date, Payment Method (*UPI*), and Status.
- **Two-Column Details Layout (65% / 35%):**
  - **Left Main Column:**
    - **Transaction Information Card:** Clean two-column field grid displaying Title, Type, Amount, Category, Date, Payment Method, Account (*Personal Account*), Merchant/Payee (*Urban Cafe*), Status, Reference ID, Created On, and Last Updated.
    - **Description & Notes Card:** Description (*“Dinner with friends after work.”*), Personal Notes, clickable lavender tag chips (*Dining*, *Weekend*, *Personal*), and clean empty-state fallback.
    - **Activity History Timeline:** Vertical connector line with status dot icons, timestamps, and recorded events (*Transaction created*, *Category assigned*, *Transaction updated*).
    - **Related Transactions Card:** List of related activities (e.g. *Coffee at Urban Cafe ₹280*, *Lunch at Urban Cafe ₹450*, *Grocery Shopping ₹1,850*) with category icons and link to view all transactions.
  - **Right Context Column:**
    - **Category Information Panel:** Category hero banner, icon, type, source (*Default* vs *Custom*), transaction count (*32 transactions this month*), monthly spend (*₹6,450 spent this month*), and **View Category Transactions** link.
    - **Payment Information Card:** Payment method with UPI icon, linked account, merchant, reference ID, payment date, and **Receipt & Attachment** preview thumbnail with zoom/view modal.
    - **Budget Impact Card:** Linked budget (*Food Budget — October 2026*), budget limit (`₹10,000`), previous spending (`₹5,200`), this transaction (`₹1,250`), updated spending (`₹6,450`), remaining budget (`₹3,550`), and dynamic usage progress bar (64.5%) with threshold warning states.
- **Interactive Modals:**
  - **Edit Transaction Modal:** Complete form with real-time validation, type toggle, amount, category, date, method, account, merchant, description, notes, and tags.
  - **Duplicate Transaction Modal:** Pre-filled form with reusable details, date confirmation, and safety notice (*“Creates a new transaction without modifying the original”*).
  - **Delete Transaction Confirmation Dialog:** Destructive coral confirmation dialog displaying transaction title and amount.
  - **Receipt Viewer Modal:** Full-fidelity receipt viewer dialog with download and close options.
- **Print Friendly View:**
  - Dedicated `@media print` stylesheet hiding sidebar, interactive buttons, and floating toolbars to produce clean white A4/Letter printable financial vouchers.
- **Demo State Switcher Toolbar:**
  - Floating switcher to test: **Standard Expense** (`TXN-2026-10482`, Dinner at Urban Cafe, ₹1,250), **Income Demo** (`TXN-2026-10490`, TechCorp Salary, ₹65,000), **Over Budget Demo** (Entertainment ₹2,400 with 113% alert), **No Receipt Demo**, **404 Not Found**, and **API Error State**.
- **Backend & MongoDB Ready:**
  - Architecture adhering to `GET /api/transactions/:id`, `PATCH /api/transactions/:id`, `DELETE /api/transactions/:id`, `POST /api/transactions/:id/duplicate`, `GET /api/transactions/:id/related`, and `GET /api/transactions/:id/budget-impact`.

---

## ⚙️ Screen 14: Profile & Settings Page (1440 × 1024 px Account & Preferences Hub)

Accessible directly at [`settings.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/settings.html) or `http://localhost:3000/settings.html`.

- **Sidebar & Header:**
  - 220px dark indigo sidebar (`#171D4C`) with Finora branding and tagline *“Track. Plan. Save. Grow.”*
  - **Settings** active navigation item in bold violet (`#7957FF`) with subtle glow (Item 10 in exact order).
  - Header with breadcrumb `Dashboard / Settings`, page title **Profile & Settings**, subtitle, global search, notification bell with unread dot, and authenticated user profile dropdown menu.
- **Settings Navigation:**
  - 2-Column desktop layout with sticky vertical tab list (`240px` wide) on the left and smooth panel container on the right.
  - Mobile horizontal scrollable tab bar.
  - 6 clearly organized sections:
    1. **My Profile** — Personal Information, avatar uploader (max 5MB, live preview, fallback initials), verified badges, full name, display name, email change trigger, phone with country code, date of birth, country, language, and personal bio.
    2. **Preferences** — Regional and financial formatting: Preferred currency selector (INR ₹ default, USD, EUR, GBP, AED, JPY) with live symbol and number format preview, Date format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD), Time format (12h vs 24h), Time Zone (Asia/Kolkata default), First day of week, 5 financial display switches (show cents, compact numbers, privacy mask balances, confirm delete, show category icons), and default transaction options.
    3. **Notifications** — Budget alerts (approaching limit, reached, exceeded) with configurable threshold chips (50%, 75%, 80%, 90%, 100%), recurring reminders with timing select, large expense alerts with customizable ₹ threshold, weekly/monthly spending digests, goal milestones, and delivery channels (In-app, Email, Browser Push) with **Send Test Notification** action.
    4. **Security** — Password change form with eye toggles, real-time 4-bar strength meter, checklist of requirements, active sessions inspector with device labels, IP, and **Sign Out Other Sessions** action, Two-Factor Authentication (2FA) status card with interactive modal setup flow (QR code, manual key, 6-digit TOTP validation), and new login security alert toggles.
    5. **Appearance** — Interactive theme switcher cards (Light, Dark, System Auto) with real-time class toggle (`.theme-dark`), 4 accessible brand accent swatches (Finora Violet, Electric Blue, Mint Teal, Coral Rose) dynamically updating `--accent-color`, and accessibility switches (reduce motion, increase text size, enhanced contrast).
    6. **Account Management** — Portable financial data exporter generating genuine client-side CSV or JSON downloads with customizable scopes, connected cloud services (Google Drive automated backups with sync/disconnect), standard Sign Out action, and permanent Delete Account destructive card with confirmation modal requiring typing "DELETE".
- **Unsaved Changes Banner:**
  - Dynamic alert bar warning users when edits are dirty with Discard and Save Changes actions.
- **Interactive Demo State Switcher Toolbar:**
  - Floating switcher to test: **Standard (Saved)**, **Unsaved Changes State**, **2FA Enabled State**, **Appearance & Theme**, and **API Error Toast**.
- **Backend & MongoDB Ready:**
  - Complete RESTful conventions (`GET/PATCH /api/users/me`, `POST/DELETE /api/users/me/avatar`, `GET/PATCH /api/users/me/preferences`, `GET/PATCH /api/users/me/notification-settings`, `POST /api/auth/change-password`, `GET/DELETE /api/auth/sessions`, `POST /api/users/me/export`, `POST /api/users/me/delete-account`).

---

## 📭 Screen 15: Empty State Page (1440 × 1024 px Multi-Scenario Guidance)

Accessible directly at [`empty-states.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/empty-states.html) or `http://localhost:3000/empty-states.html`.

- **Sidebar & Header:**
  - 220px dark indigo sidebar (`#171D4C`) with Finora branding and tagline *“Track. Plan. Save. Grow.”*
  - Dynamically updates the active navigation item based on the selected empty-state scenario (defaults to **Transactions**).
  - Header with dynamic breadcrumb, page title, subtitle, search control, notification bell, and authenticated user profile menu.
- **Main Full-Page Empty State Card:**
  - Friendly, modern fintech SVG illustration featuring receipt lists, floating plus bubbles, coin stacks, and violet/blue accents.
  - Heading: *“Your financial journey starts here.”*
  - Supporting text: *“You haven't added any transactions yet. Start recording your income and expenses to see where your money goes and build better financial habits.”*
  - Primary button: **+ Add Your First Transaction** (links to transaction creation).
  - Secondary button: **Explore Dashboard** (links to `dashboard.html`).
  - Helpful hint banner: *“Tip: Start with your latest income and a few everyday expenses to get a clearer picture of your finances.”*
- **Scenario Variants (Interactive Switcher Toolbar):**
  - **No Transactions:** Initial onboarding guidance for zero financial records.
  - **No Income:** Inflow empty state guiding users to add salary and freelance earnings.
  - **No Expenses:** Outflow empty state encouraging expense categorization and budget tracking.
  - **No Budgets:** Planning empty state highlighting spending limits and automated threshold alerts.
  - **No Savings Goals:** Milestone empty state encouraging users to establish target amounts.
  - **No Categories:** Custom category empty state explaining personal grouping.
  - **No Recurring Schedules:** Automation empty state detailing upcoming bill reminders.
  - **No Analytics:** Insights empty state explaining data requirements for chart generation.
  - **API Error / Offline:** Technical failure state with reconnect and retry actions.
- **Compact & Section Empty States Showcase:**
  - **No Matching Search Results:** Magnifying glass bubble with *Clear Filters* and *Reset Search* actions.
  - **No Upcoming Recurring Payments:** Calendar checkmark bubble with *View Recurring Schedules*.
  - **No Related Transactions:** Linked card icon with *View All Transactions*.
  - **Empty Notifications Center:** Notification bell with checkmark indicator.
- **Backend & MongoDB Ready:**
  - Component architecture respecting empty array responses (`[]`) from `GET /api/transactions`, `GET /api/income`, `GET /api/expenses`, `GET /api/budgets`, and `GET /api/goals`, distinguishing clean zero-data states from server errors.

---

## ⏳ Screen 16: Loading States & Skeleton UI (1440 × 1024 px Reusable Performance States)

Accessible directly at [`loading-states.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/loading-states.html) or `http://localhost:3000/loading-states.html`.

- **Sidebar & Header:**
  - Fixed 220px dark indigo sidebar (`#171D4C`) with Finora branding and tagline *“Track. Plan. Save. Grow.”*
  - Top header with greeting, search, notification, and profile skeleton placeholders.
- **Full-Page Centered Loading Overlay:**
  - Centered modal/full-page screen for initial app hydration on `#F6F7FC` background.
  - Double-ring spinner (violet outer `#7957FF` and electric blue inner `#48B9F5`).
  - Heading: *“Getting everything ready…”*
  - Subtitle: *“Please wait while we prepare your financial overview securely.”*
  - Indeterminate dual-gradient progress bar.
- **Dashboard Skeleton State:**
  - 4 Summary card skeletons (Balance, Income, Expenses, Net Savings) with shimmer gradient.
  - Cash-flow grouped bar chart skeleton with varied-height animated bars.
  - Expense breakdown donut ring skeleton.
  - Recent transactions skeleton table rows.
- **Transactions Table Skeleton State:**
  - Filter and search bar skeletons with rounded pill shapes.
  - Table headers with staggered placeholder widths (40–180px) ensuring natural, organic loading appearance.
- **Analytics & Charts Skeleton State:**
  - Wave spending trend skeleton line chart and 3 financial insight cards.
- **Budgets & Goals Skeleton State:**
  - Category budget progress bar skeletons and savings goal cards.
- **Form Submissions & Inline Loading Indicators:**
  - Stable-width form submission buttons with mini-spinners (*“Saving Income…”*, *“Saving Expense…”*, *“Creating Budget…”*, *“Creating Goal…”*).
  - Inline card refreshers with pulsing dot indicators (*“Updating…”* and *“Checking schedules…”*).
- **Accessibility & Reduced Motion:**
  - Fully supports `prefers-reduced-motion: reduce` by replacing continuous shimmer with soft static placeholders.
  - Skeletons include `aria-busy="true"` and `role="status"` semantics without noisy screen-reader chatter.

---

## 🚫 Screen 17: 404 Error Page (Full-Viewport Not Found Interface)

Accessible directly at [`404.html`](file:///d:/Internship/Full%20Stack%20Projects/Finora%20Expense/404.html) or `http://localhost:3000/404.html`.

- **Branded Header Navigation:**
  - Finora logo (stylized finance bars symbol), brand name, and tagline *“Track. Plan. Save. Grow.”* on the left.
  - Navigation links: **Home** (`index.html`), **About** (`#about`), and **Contact** (`#contact`).
  - Action button: *“Back to Dashboard”* with home icon (`ri-home-4-line`) on the right.
- **Custom Fintech 404 Illustration:**
  - Oversized geometric sans-serif **404** numerals styled with deep navy (`#11183F`) to violet-blue gradient (`#7957FF` → `#48B9F5`).
  - Floating mini browser window with missing-page disconnected icon.
  - Curved dotted navigation route ending in a location pin marker.
  - Floating fintech card with chip and security details.
  - Floating soft lavender (`#C7B8FF`) diamond and electric blue (`#48B9F5`) sparkles with gentle looping float animation.
- **Error Typography & Messaging:**
  - Bold heading: **“Oops! Page not found.”** in `#18213D`.
  - Supporting paragraph: *“The page you’re looking for may have moved, been removed, or the link may be incorrect.”* (`#75809A`, centered, 480px width).
  - Helper tagline: *“Let’s get you back on track with your finances.”* with compass icon.
- **Dual Action Buttons:**
  - **Primary CTA:** *Back to Dashboard* (`#7957FF`, white text, home icon, hover elevation to `#6742f8`, links to `dashboard.html`).
  - **Secondary Action:** *View Transactions* (white background, `#18213D` text, border `#E8EBF3`, receipt icon, links to `transactions.html`).
  - **Browser History Link:** *“Go back to the previous page”* with left-arrow icon. Checks `window.history` and `document.referrer` for safe navigation with automatic fallback to Dashboard.
- **Quick Exploration Navigation:**
  - *“Or explore these pages”* pills linking to **Dashboard**, **Transactions**, and **Analytics**.
- **Interactive Route Search Widget:**
  - Search input with search icon, live suggestion dropdown, and clear button.
  - Searches real Finora application routes (Dashboard, Transactions, Add Income, Add Expense, Analytics, Budgets, Goals, Categories, Recurring, Settings).
  - Displays *“No matching pages found”* message for unsupported queries.
- **About Finora Section (`#about`):**
  - Section title: **“About Finora”** with descriptive introduction.
  - Three feature highlight cards:
    - *Track Your Money* — Manage income and expenses in one place.
    - *Plan Your Budget* — Monitor spending and stay within your limits.
    - *Grow Your Savings* — Set financial goals and follow your progress.
- **Contact Support Section (`#contact`):**
  - Heading: **“Need a little help?”**
  - Subtitle and direct email link to `support@finora.app`.
  - Fully validated asynchronous contact form (Name, Email, Subject, Message).
  - Loading spinner, duplicate submission prevention, inline error handling, and server-confirmed success banner.
  - Backend integration at `POST /api/contact` with input sanitization and IP rate-limiting.
- **Branded Minimal Footer:**
  - Copyright line: *“© 2026 Finora. Track. Plan. Save. Grow.”*
  - Working dialog links for **Help Center**, **Contact Support**, and **Privacy Policy**.
- **Backend API vs. Frontend 404 Separation:**
  - API endpoints (`/api/*`) return structured JSON errors (`{ status: 404, message: "Endpoint not found" }`).
  - Unknown frontend routes return HTTP 404 with the rendered `404.html` layout.
- **React Router Integration:**
  - Implemented in `src/FinoraNotFoundPage.jsx` and `src/FinoraNotFoundPage.css`.

---

## 📁 Project Structure

```
Finora Expense/
├── index.html                   # Screen 1: Landing Page
├── login.html                   # Screen 2: Login Page
├── register.html                # Screen 3: Registration Page
├── dashboard.html               # Screen 4: Dashboard Page
├── transactions.html            # Screen 5: Transactions Page
├── add-income.html              # Screen 6: Add Income Page
├── add-expense.html             # Screen 7: Add Expense Page
├── analytics.html               # Screen 8: Analytics & Reports Page
├── budgets.html                 # Screen 9: Budget Management Page
├── goals.html                   # Screen 10: Goals & Savings Page
├── categories.html              # Screen 11: Categories Management Page
├── recurring.html               # Screen 12: Recurring Transactions Page
├── transaction-details.html     # Screen 13: Transaction Details Page
├── settings.html                # Screen 14: Profile & Settings Page
├── empty-states.html            # Screen 15: Empty State Page
├── loading-states.html          # Screen 16: Loading States & Skeletons
├── 404.html                     # Screen 17: 404 Error Page
├── css/
│   ├── styles.css               # Landing page design system
│   ├── login.css                # Login page split-layout styles
│   ├── register.css             # Registration page split-layout styles
│   ├── dashboard.css            # Dashboard styles & metric cards
│   ├── transactions.css         # Transactions filters & data table
│   ├── add-income.css           # Add Income form & preview styles
│   ├── add-expense.css          # Add Expense form & budget impact styles
│   ├── analytics.css            # Analytics charts, donut breakdown & report styles
│   ├── budgets.css              # Budget cards, progress bars & modal styles
│   ├── goals.css                # Goals cards, progress rings, timeline & modal styles
│   ├── categories.css           # Categories grid, drawer, swatches & modal styles
│   ├── recurring.css            # Recurring schedules table, calendar, drawer & modal styles
│   ├── transaction-details.css  # Transaction details 2-col, amount hero, modals & print styles
│   ├── settings.css             # Profile & settings tabs, forms, theme switcher & modals
│   ├── empty-states.css         # Empty state cards, SVG illustrations, hint banners & compact cards
│   ├── loading-states.css       # Skeleton shimmers, spinners, indeterminate bars & loading buttons
│   └── 404.css                  # 404 error page layout, ambient glow, buttons & search styles
├── js/
│   ├── app.js                   # Landing page interactions & 3D tilt
│   ├── login.js                 # Login form validation, eye toggle, auth states
│   ├── register.js              # Register validation, 4-bar strength meter, terms modal
│   ├── dashboard.js             # Dashboard charts, metrics & quick actions
│   ├── transactions.js          # Search, multi-filtering, sorting, export & pagination
│   ├── add-income.js            # Add Income live preview, tags & validation
│   ├── add-expense.js           # Add Expense preview, budget calculator & demo states
│   ├── analytics.js             # Analytics SVG charts, CSV export & report generation
│   ├── budgets.js               # Budget CRUD, filter/sorting, alerts & SVG bar charts
│   ├── goals.js                 # Goals CRUD, contributions, search/sort & modals
│   ├── categories.js            # Categories CRUD, search/filter, drawer & demo switcher
│   ├── recurring.js             # Recurring CRUD, occurrence advancing, calendar & modals
│   ├── transaction-details.js   # Transaction inspector, CRUD modals, demo states & print
│   ├── settings.js              # Settings tabs, profile photo, 2FA, theme & export
│   ├── empty-states.js          # Multi-scenario switcher, SVG illustrations & state transitions
│   ├── loading-states.js        # Skeleton view switcher, form submit simulations & refreshers
│   └── 404.js                   # 404 history navigation, smart route search & modal handlers
├── src/
│   ├── FinoraLandingPage.jsx    # React Landing Page component
│   ├── FinoraLandingPage.css    # React Landing Page styles
│   ├── FinoraLoginPage.jsx      # React Login Page component
│   ├── FinoraLoginPage.css      # React Login Page styles
│   ├── FinoraRegisterPage.jsx   # React Register Page component
│   ├── FinoraRegisterPage.css   # React Register Page styles
│   ├── FinoraDashboardPage.jsx  # React Dashboard component
│   ├── FinoraDashboardPage.css  # React Dashboard styles
│   ├── FinoraTransactionsPage.jsx # React Transactions component
│   ├── FinoraTransactionsPage.css # React Transactions styles
│   ├── FinoraAddIncomePage.jsx  # React Add Income component
│   ├── FinoraAddIncomePage.css  # React Add Income styles
│   ├── FinoraAddExpensePage.jsx # React Add Expense component
│   ├── FinoraAddExpensePage.css # React Add Expense styles
│   ├── FinoraAnalyticsPage.jsx  # React Analytics component
│   ├── FinoraAnalyticsPage.css  # React Analytics styles
│   ├── FinoraBudgetPage.jsx     # React Budget component
│   ├── FinoraBudgetPage.css     # React Budget styles
│   ├── FinoraGoalsPage.jsx      # React Goals & Savings component
│   ├── FinoraGoalsPage.css      # React Goals & Savings styles
│   ├── FinoraCategoriesPage.jsx # React Categories Management component
│   ├── FinoraCategoriesPage.css # React Categories Management styles
│   ├── FinoraRecurringPage.jsx  # React Recurring Transactions component
│   ├── FinoraRecurringPage.css  # React Recurring Transactions styles
│   ├── FinoraTransactionDetailsPage.jsx # React Transaction Details component
│   ├── FinoraTransactionDetailsPage.css # React Transaction Details styles
│   ├── FinoraSettingsPage.jsx   # React Profile & Settings component
│   ├── FinoraSettingsPage.css   # React Profile & Settings styles
│   ├── FinoraEmptyStatePage.jsx # React Empty State component
│   ├── FinoraEmptyStatePage.css # React Empty State styles
│   ├── FinoraLoadingStates.jsx  # React Reusable Loading & Skeleton Components
│   ├── FinoraLoadingStates.css  # React Loading & Skeleton styles
│   ├── FinoraNotFoundPage.jsx   # React 404 Not Found Page component
│   └── FinoraNotFoundPage.css   # React 404 Not Found styles
├── server.js                    # Zero-dependency local Node.js server with API/Frontend 404 routing
├── package.json                 # Project configuration
└── README.md                    # Project documentation
```



