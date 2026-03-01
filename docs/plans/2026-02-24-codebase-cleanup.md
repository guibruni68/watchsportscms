# Codebase Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all Lovable platform references, Storybook infrastructure, and orphaned pages/routes to produce a clean codebase ready for developer handoff.

**Architecture:** Three scoped cleanup passes — (1) Lovable references across config/source files, (2) Storybook files and dependencies, (3) orphaned pages and sidebar links. No new functionality added, only deletions and targeted edits. Supabase migration files are left untouched.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router DOM, Supabase

---

### Task 1: Remove lovable-tagger from vite.config.ts

**Files:**
- Modify: `vite.config.ts`

**Step 1: Edit vite.config.ts**

Remove the import and usage of `componentTagger`. The final file should look like:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

**Step 2: Verify build still works**

Run: `npm run build`
Expected: Build completes with no errors.

**Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "chore: remove lovable-tagger plugin from vite config"
```

---

### Task 2: Remove lovable-tagger from package.json

**Files:**
- Modify: `package.json`

**Step 1: Remove the dependency**

Delete the line `"lovable-tagger": "^1.1.7"` from `devDependencies`.

**Step 2: Remove the package from node_modules**

Run: `npm install`
Expected: package-lock.json updated, lovable-tagger no longer present.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove lovable-tagger dependency"
```

---

### Task 3: Clean index.html meta tags

**Files:**
- Modify: `index.html`

**Step 1: Remove Lovable OG/Twitter meta tags**

Remove these lines from `<head>`:
```html
<meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
<meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
```
(Exact line numbers may vary — search for `lovable.dev` in the file.)

Keep all other meta tags intact.

**Step 2: Verify**

Open `index.html` and confirm no `lovable.dev` references remain.

**Step 3: Commit**

```bash
git add index.html
git commit -m "chore: remove lovable OG/Twitter meta tags from index.html"
```

---

### Task 4: Replace Lovable logo in app-sidebar.tsx

**Files:**
- Modify: `src/components/app-sidebar.tsx`

**Step 1: Find the lovable-uploads image reference**

Search for `/lovable-uploads/` in `src/components/app-sidebar.tsx` (line ~2).

**Step 2: Replace with a text placeholder**

Replace the `<img>` tag that uses the lovable-uploads URL with a simple text/SVG placeholder. Example:

```tsx
{/* Logo placeholder — replace with actual brand asset */}
<div className="flex items-center gap-2 px-2">
  <div className="w-8 h-8 rounded-md bg-[#153A8A] flex items-center justify-center">
    <span className="text-white text-xs font-bold">W</span>
  </div>
  <span className="font-semibold text-sm text-white">WatchSports</span>
</div>
```

Adapt to fit the existing sidebar layout without breaking surrounding structure.

**Step 3: Verify**

Run the dev server (`npm run dev`) and confirm the sidebar renders without errors and no broken image appears.

**Step 4: Commit**

```bash
git add src/components/app-sidebar.tsx
git commit -m "chore: replace lovable-uploads logo with placeholder in sidebar"
```

---

### Task 5: Rewrite README.md

**Files:**
- Modify: `README.md`

**Step 1: Replace README content**

Rewrite the file removing all Lovable platform links, project IDs, and deployment instructions. Replace with a clean developer-oriented README:

```markdown
# WatchSports CMS

Content management system for WatchSports platform.

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
```

**Step 2: Verify**

Confirm no `lovable` string remains in the file.

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README removing Lovable references"
```

---

### Task 6: Remove Storybook files

**Files:**
- Delete: all `src/components/ui/*.stories.tsx` (28 files)
- Delete: `src/components/forms/LiveForm.stories.tsx`

**Step 1: Delete all story files**

Run:
```bash
find /Users/watchbrasil/watchsportscms/src -name "*.stories.tsx" -delete
```

**Step 2: Verify no stories remain**

Run:
```bash
find /Users/watchbrasil/watchsportscms/src -name "*.stories.tsx"
```
Expected: no output.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove all Storybook story files"
```

---

### Task 7: Remove Storybook dependencies and scripts from package.json

**Files:**
- Modify: `package.json`

**Step 1: Remove devDependencies**

Delete these entries from `devDependencies`:
- `@chromatic-com/storybook`
- `@storybook/addon-a11y`
- `@storybook/addon-docs`
- `@storybook/addon-onboarding`
- `@storybook/addon-vitest`
- `@storybook/react-vite`
- `eslint-plugin-storybook`
- `storybook`

**Step 2: Remove scripts**

Delete from `scripts`:
- `"storybook": "storybook dev -p 6006"`
- `"build-storybook": "storybook build"`

**Step 3: Remove Storybook config directory**

Run:
```bash
rm -rf /Users/watchbrasil/watchsportscms/.storybook
```
(Only if the directory exists — check first with `ls .storybook`.)

**Step 4: Update node_modules**

Run: `npm install`
Expected: package-lock.json updated, Storybook packages removed.

**Step 5: Verify build**

Run: `npm run build`
Expected: Build completes with no errors.

**Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove Storybook dependencies and scripts"
```

---

### Task 8: Remove CampaignsPage

**Files:**
- Delete: `src/pages/campaigns/CampaignsPage.tsx`
- Delete: `src/pages/campaigns/` (directory, if now empty)

**Step 1: Confirm it is not imported anywhere**

Run:
```bash
grep -r "CampaignsPage\|campaigns" /Users/watchbrasil/watchsportscms/src/App.tsx
grep -r "CampaignsPage" /Users/watchbrasil/watchsportscms/src
```
Expected: no results in App.tsx; only the file itself.

**Step 2: Delete the file and directory**

Run:
```bash
rm -rf /Users/watchbrasil/watchsportscms/src/pages/campaigns
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused CampaignsPage"
```

---

### Task 9: Remove orphaned sidebar navigation items

**Files:**
- Modify: `src/components/app-sidebar.tsx`

**Step 1: Identify and remove orphaned items**

Remove the following nav items from the sidebar (they point to routes with no implemented page):
- `/advertising` (Ads Management)
- `/billing` (Subscriptions & Billing)
- `/users-management` (Users Management)
- `/settings` (Configurações)

Read the file first, locate each item, and delete only those nav entries. Do not remove surrounding section structure unless the entire section becomes empty.

**Step 2: Verify no broken links remain**

Run the dev server (`npm run dev`) and click through all sidebar items. Each link should navigate to an existing page.

**Step 3: Commit**

```bash
git add src/components/app-sidebar.tsx
git commit -m "chore: remove sidebar links for unimplemented routes"
```

---

### Task 10: Final verification

**Step 1: Search for any remaining lovable references in source**

Run:
```bash
grep -ri "lovable" /Users/watchbrasil/watchsportscms/src /Users/watchbrasil/watchsportscms/index.html /Users/watchbrasil/watchsportscms/vite.config.ts /Users/watchbrasil/watchsportscms/package.json /Users/watchbrasil/watchsportscms/README.md
```
Expected: no output (Supabase migration files are excluded intentionally).

**Step 2: Search for any remaining story files**

Run:
```bash
find /Users/watchbrasil/watchsportscms/src -name "*.stories.*"
```
Expected: no output.

**Step 3: Full build check**

Run: `npm run build`
Expected: Build completes with 0 errors.

**Step 4: Final commit (if any stragglers)**

```bash
git add -A
git commit -m "chore: final cleanup verification pass"
```
