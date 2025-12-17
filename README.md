# Engineers Gate Take-Home Test

Welcome to the Engineers Gate Frontend Development Challenge!

## About Engineers Gate

Engineers Gate is a cutting-edge quantitative hedge fund where technology drives alpha generation. We operate in a fast-paced, high-performance environment. Our engineering teams work with large datasets, real-time market feeds, and complex trading algorithms to deliver exceptional results in the financial markets. Our goal is to test your skills, give you an opportunity to show off your talents, and ultimately make a hiring decision based on your work!

## Getting Started

This project requires Node.js version 18.

### Check if Node.js is installed

```bash
node --version
```

If Node.js is not installed or you don't have version 18, follow the installation instructions below.

### Installing Node.js

#### Option 1: Official Node.js Installer
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version (should be v18.x.x or higher)
3. Run the installer and follow the setup wizard
4. Verify installation: `node --version`

#### Option 2: Using Node Version Manager (nvm)
**macOS/Linux:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Restart terminal or run: source ~/.bashrc

# Install and use Node.js 18
nvm install 18
nvm use 18
```

**Windows:**
```bash
# Install nvm-windows from: https://github.com/coreybutler/nvm-windows
# Then run:
nvm install 18
nvm use 18
```

#### Option 3: Package Managers
**macOS (Homebrew):**
```bash
brew install node@18
```

**Windows (Chocolatey):**
```bash
choco install nodejs --version=18.19.0
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Start the Development Server

Once Node.js 18 is installed:

```bash
# Set Node version (if using nvm)
nvm use 18

# Install dependencies and start development server
pnpm install
pnpm run dev
```


## Overview

You will build **3 specific pages** for a trading dashboard:

1. **Home Page** - Display a trades table with the title "Trade Table"
2. **Table Overview Page** - Display 4 separate tables: Credit, Holdings, Risk, and Transactions
3. **Candlestick Charts Page** - Display 3 stock charts: AAPL, MSFT, and TSLA

You'll also enhance the navigation with a logo, tabs, breadcrumb, and light/dark mode toggle.

All data is provided as JSON files - just load and display them. No backend or API needed.
Sample table and candle stick components are provided as well. You will need to update these to support different datasets and make them reusable.

## Evaluation Criteria

You will be graded primarily on **design and organization**. We're looking to assess how you structure components, organize layouts, and create intuitive user experiences.
We are NOT focused on how the data is organized, stored, cached or loaded apart from basic functionality.
We are NOT focused on page routing. Basic page routing is provided.
We ARE evaluating your implementation of light and dark mode.
We ARE evaluating your ability to layout a page in an organized way.
We ARE evaluating your ability to create reusable components and expand upon a pre-existing code base.

## Requirements

### Pages to Build

#### 1. Home Page (`/`)

- Display the trades table using data from `@/data/homePage/trades.json`
- Include the title "Trade Table"
- Ensure the page is well formatted
- Support light/dark mode

#### 2. Table Overview Page (`/tableOverview`)

- Display **4 separate tables**: Credit, Holdings, Risk, and Transactions
- Data is located at `@/data/tableOverview/`
- Each table should include a title "Credit Table", "Holdings Table", etc...
- Organize tables in a visually appealing layout
- Support light/dark mode

#### 3. Candlestick Charts Page (`/candleSticks`)

- Display **3 candlestick charts**: AAPL, MSFT, and TSLA
- Data is located at `@/data/candleStick/`
- Label each chart with the stock symbol
- Organize charts in a visually appealing layout
- Support light/dark mode

### Navigation Requirements

Create a navigation component (header or sidebar) that includes:

- Company logo (component provided)
- Navigation tabs for page switching (component provided)
- Light/Dark mode toggle switch (component provided)
- Breadcrumb navigation (component provided)
- Make sure these elements are consistent on every page
- Use the provided components. Update as needed.
- Support light/dark mode

### Theme Requirements

- **Dark mode is the default theme**
- Both light and dark modes should be supported
- Ensure consistent styling across both themes

### Technical Requirements

- Clean, organized component structure
- Update the provided table and candlestick components to be reusable
- Proper use of React patterns and best practices
- Consistent code formatting
- **Browser Support:** Latest Chrome browser only
- Responsive design

## Tech Stack

- React: https://react.dev/
- Tailwind: https://tailwindcss.com/
- TanStack Router: https://tanstack.com/router/latest
- AgGrid: https://www.ag-grid.com/

Feel free to update and change ANY component. AI, UI libraries and any other external tools are fair game. Use any tool necessary to complete this assignment. All work must be your own.
This assessment has some ambiguity. That is by design. If there is something that is NOT clear to you, do your best to come up with a solution.
It's ok to make some assumptions and to make this project your own.

## Submission Instructions

1. **Fork this repository** to your GitHub account
2. Complete the take-home test requirements in your forked repository
3. Ensure your code is committed and pushed to your fork
4. **Submit the link to your public forked repository** to the Engineers Gate team
5. Make sure your repository is **public** so we can access and review your work

**Before submitting:**

- Test that your application runs successfully with `pnpm install` and `pnpm run build`
- Verify all three pages are functional and properly styled
- Ensure both light and dark modes work correctly
- Double-check that your navigation components are working as expected

Good luck! We're excited to see your approach to building this application.
