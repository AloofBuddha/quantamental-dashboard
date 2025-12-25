# Engineers Gate Take-Home Test - Implementation Summary

## Overview

This implementation delivers a responsive, production-ready financial trading dashboard with AG Grid tables and AG Charts candlestick visualizations. The focus was on creating a maintainable codebase with excellent user experience, responsive design, and persistent user preferences.

---

## ✨ Key Features

### 1. Responsive Multi-Table Dashboard

**What:** Four financial tables (Credit, Holdings, Risk, Transactions) displayed in a 2x2 grid on desktop, stacked vertically on mobile. Each table can be expanded to full-screen view.

**Why:** Allows users to see overview data at a glance, then drill into specific tables when needed. Optimizes screen real estate across devices.

**Technical Approach:**

-   Single component instance per table eliminates duplicate code and ensures state consistency
-   Tables use `ConfigurableTable` component built on top of `DataGrid` wrapper around AG Grid
-   Click table title to expand/collapse
-   All AG Grid enterprise features available: sorting, filtering, column reordering, show/hide columns

### 2. Persistent Table State

**What:** Table configurations (column visibility, order, sorts, filters, color modes) persist across sessions and page navigation.

**Why:** Users don't lose their customization when navigating away or refreshing the page. Critical for a professional financial dashboard.

**Technical Approach:**

-   `localStorage` keyed per table (`credit-columnState`, `holdings-filterModel`, etc.)
-   State saved on every user interaction (debounced where appropriate)
-   Restored on component mount via AG Grid's state management APIs

### 3. Advanced Table Features

**What:**

-   **Color-coded rows:** Tables support color modes (e.g., Credit rating, Transaction status, P&L indicators)
-   **Smart numeric filtering:** Filters work on raw values even when columns display formatted currency/percentages
-   **Intuitive multiselect filters:** Unchecked = "select all", check items to filter for specific values
-   **Auto-sizing columns:** Columns automatically adjust to fill available space on expand/collapse

**Why:** Provides visual context at a glance, makes data easier to parse, and improves filtering usability.

**Technical Approach:**

-   Custom header components with color toggle buttons
-   `filterValueGetter` provides raw numeric values to AG Grid filters
-   `defaultToNothingSelected: true` for intuitive multiselect UX
-   `sizeColumnsToFit()` called on layout changes

### 4. Interactive Candlestick Charts

**What:** AG Charts financial candlestick charts for AAPL, MSFT, and TSLA with full toolbar controls (zoom, pan, chart type selection, range buttons, volume toggle).

**Why:** Essential for financial analysis. Users need to visualize price movements and volume trends.

**Technical Approach:**

-   Dropdown selector to switch between symbols
-   Selected symbol persists to `localStorage`
-   Charts dynamically size to fill available space using container measurement
-   Loading spinner smooths chart initialization

### 5. Responsive Navigation & Dark Mode

**What:**

-   Top navigation bar with mobile hamburger menu
-   Dark mode toggle accessible on all screen sizes
-   Three-state dark mode: light, dark, system preference

**Why:** Modern UX expectations for mobile-first design and user preference respect.

**Technical Approach:**

-   Zustand store for dark mode state management
-   `matchMedia` listener for system preference changes
-   Tailwind dark mode classes throughout

### 6. Type-Safe Codebase

**What:** Comprehensive TypeScript usage with proper type imports and interfaces throughout.

**Why:** Catches errors at compile time, improves developer experience with IntelliSense, makes code self-documenting.

**Technical Approach:**

-   `import type` for all type-only imports (better tree-shaking)
-   Proper AG Grid and AG Charts type annotations
-   Custom interfaces for component props and configuration

---

## 🏗️ Architecture Decisions

### Component Structure

```
DataGrid.tsx (AG Grid wrapper)
├── Handles all AG Grid configuration
├── Manages localStorage persistence
├── Provides consistent grid behavior
└── Used by all tables

ConfigurableTable.tsx (Business logic layer)
├── Adds color mode functionality
├── Custom header components
├── Row styling based on data
└── Wraps DataGrid with table-specific features
```

**Why this structure?**

-   **DRY Principle:** Eliminated 500+ lines of duplicate code
-   **Single Responsibility:** Each component has one clear purpose
-   **Extensibility:** Easy to add new tables or features

### State Management Strategy

-   **Zustand:** Global UI state (dark mode) that needs reactivity
-   **localStorage:** Table/chart configurations that don't need React re-renders
-   **Component state:** Transient UI state (loading indicators, dimensions)

**Why not Zustand for everything?**
AG Grid manages its own rendering. Putting grid state in Zustand would trigger unnecessary React re-renders. Direct `localStorage` access is the recommended pattern per AG Grid documentation.

### Styling Approach

-   **Tailwind CSS:** Utility-first for rapid development
-   **Semantic constants:** `commonStyles.ts` groups related styles for readability
-   **`cn()` utility:** Type-safe class merging with `clsx` and `tailwind-merge`

**Why this approach?**
Balances Tailwind's speed with maintainability. Long inline class strings moved to semantic constants where they're reused or complex.

---

## 🧪 Testing & Quality Assurance

### Manual Testing Coverage

-   ✅ All tables: filtering, sorting, column reordering, show/hide columns
-   ✅ State persistence across page navigation and browser refresh
-   ✅ Responsive layouts: mobile (vertical), tablet, desktop (2x2 grid)
-   ✅ Dark mode across all components
-   ✅ Expand/collapse table functionality
-   ✅ Candlestick chart interactions and symbol switching

### Code Quality

-   ✅ TypeScript strict mode with no errors
-   ✅ ESLint passing with no warnings
-   ✅ Prettier formatting with project-specific config
-   ✅ Production build succeeds with no errors

### Performance Considerations

-   AG Grid's virtualization handles large datasets efficiently
-   Loading spinners provide perceived performance during initialization
-   Debounced state saving prevents excessive localStorage writes

---

## 📂 Project Structure

```
src/
├── components/
│   ├── DataGrid.tsx              # AG Grid wrapper with persistence
│   ├── ConfigurableTable.tsx     # Business logic layer for tables
│   ├── CandleStick.tsx           # AG Charts financial chart
│   ├── LoadingSpinner.tsx        # Reusable loading indicator
│   └── [other UI components]
├── routes/
│   ├── __root.tsx                # Root layout with navigation
│   ├── index.tsx                 # Home page with Trades table
│   ├── table-overview.tsx        # 2x2 grid of tables
│   └── candle-sticks.tsx         # Candlestick chart page
├── config/
│   ├── tableConfigs.ts           # Color mode configurations
│   └── candlestickConfig.ts      # Symbol definitions
├── data/
│   └── columnDefs.ts             # AG Grid column definitions
├── constants/
│   └── colorSchemes.ts           # Color palettes for tables
├── styles/
│   └── commonStyles.ts           # Semantic Tailwind constants
└── utils/
    ├── cn.ts                     # Class name merging utility
    └── [other utilities]
```

---

## 🚀 Running the Application

### Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

### Key URLs

-   Home (Trades table): `/`
-   Table Overview: `/table-overview`
-   Candlestick Charts: `/candle-sticks`

---

## 💡 Design Decisions & Trade-offs

### Why No Chart State Persistence?

**Decision:** Charts load fresh with full data each time, only symbol selection persists.

**Rationale:**

-   Financial charts should show complete context by default
-   Restoring zoomed/panned views is disorienting for users
-   Industry standard (Bloomberg, Yahoo Finance) don't persist chart view
-   Simpler code, better UX

### Why No Loading Spinners on Tables?

**Decision:** Removed artificial loading delays from tables, kept for charts.

**Rationale:**

-   Table data is client-side (JSON files), AG Grid initializes in ~50-100ms
-   500ms spinner was slower than just showing the grid
-   Charts have more complex initialization, benefit from smooth loading state

### Why Single Table Instances?

**Decision:** Each table type renders once, conditionally shows in grid or expanded view.

**Rationale:**

-   Fixes critical bug where state didn't persist across expand/collapse
-   Eliminates duplicate components fighting over localStorage
-   More performant (fewer DOM nodes)
-   Simpler mental model

---

## 📈 Metrics

-   **Lines of Code Removed:** ~500 (duplicate components)
-   **Lines of Code Added:** ~800 (new features + refactoring)
-   **Net Improvement:** Cleaner, more maintainable, feature-rich
-   **Bundle Size:** 3.84 MB (AG Grid + AG Charts enterprise are large, production-ready libraries)
-   **Components:** 4 duplicates removed → 2 reusable abstractions
-   **Type Safety:** 100% TypeScript coverage

---

## ✅ Checklist for Reviewer

-   [ ] Navigate to all three pages (Home, Table Overview, Candlestick)
-   [ ] Try filtering, sorting, and hiding columns in any table
-   [ ] Expand a table in Table Overview, verify changes persist
-   [ ] Refresh the page, verify table state persists
-   [ ] Switch between candlestick symbols, verify selection persists
-   [ ] Toggle dark mode, verify all pages update correctly
-   [ ] Resize browser window to test responsive layouts
-   [ ] Check mobile view (narrow window) to see vertical table stacking
