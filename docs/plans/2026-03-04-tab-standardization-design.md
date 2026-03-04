# Tab Standardization Design

**Date:** 2026-03-04
**Status:** Approved

## Problem

The platform has two disconnected navigation systems for the same content:

- **Forms (create/edit)** use tabs: `information`, `media`, `agents`, `publishing`
- **Detail pages (view)** use different tabs: `overview`, `details`, `media`, `stats`

Same information, different organization. Operators have to mentally re-map content when switching between viewing and editing.

## Decision

> Create, edit, and view always use the same tabs, same order, same icons.
> The only difference is whether fields are editable (form inputs) or read-only (text).

## Tab Standard by Entity

| Entity | Tab 1 | Tab 2 | Tab 3 | Tab 4 | Tab 5 | Tab 6 |
|--------|-------|-------|-------|-------|-------|-------|
| Live | information (Info) | media (ImageIcon) | stream (Radio) | agents (Users) | publishing (Globe) | stats (BarChart3) |
| Video | information (Info) | media (ImageIcon) | agents (Users) | publishing (Globe) | — | — |
| Collection | information (Info) | seasons (CalendarDays) | publishing (Globe) | — | — | — |
| News | information (Info) | media (ImageIcon) | agents (Users) | publishing (Globe) | — | — |
| Player | information (Info) | media (ImageIcon) | — | — | — | — |
| Coach | information (Info) | media (ImageIcon) | — | — | — | — |
| Referee | information (Info) | media (ImageIcon) | — | — | — | — |
| Agent | information (Info) | media (ImageIcon) | — | — | — | — |
| Team | information (Info) | media (ImageIcon) | members (Users) | — | — | — |
| Competition | information (Info) | media (ImageIcon) | — | — | — | — |
| Stadium | information (Info) | media (ImageIcon) | publishing (Globe) | — | — | — |
| Event | information (Info) | media (ImageIcon) | publishing (Globe) | — | — | — |
| Banner | information (Info) | media (ImageIcon) | publishing (Globe) | — | — | — |
| Page | information (Info) | shelves (Layout) | publishing (Globe) | — | — | — |
| Shelf | information (Info) | configuration (Settings2) | publishing (Globe) | — | — | — |
| Season | information (Info) | teams (Users) | — | — | — | — |

## Scope of Changes

### Detail Pages (highest priority — currently out of sync)

| Page | Current tabs | Target tabs |
|------|-------------|-------------|
| LiveDetailsPage | overview · details · stats · media | information · media · stream · agents · publishing · stats |
| VideoDetailsPage | overview · details · media | information · media · agents · publishing |
| CollectionDetailsPage | *(no tabs — cards/accordion)* | information · seasons · publishing |

### Forms (already mostly correct — minor adjustments only)

- BannerForm: add icons to tab triggers (currently has no icons)
- All others: already use correct tab values/labels from previous standardization

## Rules

1. Tab values (internal): always lowercase English (`information`, `media`, `stream`, `agents`, `publishing`, `stats`, `seasons`, `members`, `teams`, `shelves`, `configuration`)
2. Tab icons: always use the icon mapped above — never a tab without an icon
3. Tab order: fixed per entity type — never reorder based on context
4. Stats tab: only shown when data is available (Live entity only)
5. Detail pages reorganize existing content into the matching tab sections — no content is removed
