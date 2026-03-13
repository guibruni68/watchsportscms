# WatchSports CMS

Content management system for the WatchSports platform.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Routing:** React Router DOM v6
- **Forms:** React Hook Form + Zod
- **Data fetching:** TanStack Query
- **Backend:** Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:8080`.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
  components/   # Shared UI components and forms
  pages/        # Route-level page components
  lib/          # Utilities
  hooks/        # Custom React hooks
  data/         # Mock data (to be replaced with API calls)
```
