# Navigation Guard — Design

## Goal

Block all navigation that would cause loss of unsaved form data. Show a confirmation modal before any exit.

## Router Migration

Replace `BrowserRouter` with `createBrowserRouter` + `RouterProvider` in `App.tsx`. This is required to enable `useBlocker`, the React Router v6 hook that intercepts all in-app navigation.

All other router usage (`NavLink`, `useNavigate`, `useParams`, `ProtectedRoute`) remains unchanged.

## Hook: `useNavigationGuard`

```ts
useBlocker(isDirty)          // intercepts sidebar, navigate(), browser back
window.addEventListener("beforeunload") // intercepts tab close / reload
guardNavigation(action)       // manual guard for onClose callbacks (dialog forms)
```

## Protected Forms

VideoForm, LiveForm, BannerForm, ShelfForm, CollectionForm, PageForm — all already use the hook and render `<UnsavedChangesDialog>`.

## Coverage

| Action | Protection |
|---|---|
| Sidebar NavLink click | useBlocker → modal |
| Cancel / Back button in form | guardNavigation → modal |
| Browser back button | useBlocker → modal |
| Close tab / reload | beforeunload → native browser dialog |
| navigate() in code | useBlocker → modal |
