# Help & Support Page — Design

**Date:** 2026-03-01
**Status:** Approved

## Overview

A Help & Support page accessible from the main sidebar via a dedicated button. Content is hardcoded in a data file and organized in three levels: categories → sub-topics → Q&A. Navigation uses URL query params for deep-linking.

## Architecture

- **Route:** `/help` (protected, inside existing layout with `AppSidebar`)
- **Navigation:** `?category=<id>` query param drives which category is active
- **Data:** Hardcoded in `src/data/helpData.ts` — edit this file to manage all help content
- **Search:** Client-side filter across category labels and sub-topic titles

## Components

| File | Purpose |
|---|---|
| `src/data/helpData.ts` | All hardcoded help content (categories, topics, FAQs) |
| `src/pages/help/HelpPage.tsx` | Main page: search bar + two-column layout |

## Data Structure

```ts
interface HelpCategory {
  id: string
  label: string
  icon: LucideIcon
  topics: HelpTopic[]
}

interface HelpTopic {
  id: string
  title: string
  description: string
  icon: LucideIcon
  faqs: HelpFaq[]
  featured?: boolean   // shown in Popular Topics on home screen
}

interface HelpFaq {
  question: string
  answer: string
}
```

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [barra de busca - "Como podemos ajudar?"]                  │
├──────────────┬──────────────────────────────────────────────┤
│  Sidebar     │  Área principal                              │
│  esquerda    │                                              │
│  ─────────── │  [sem categoria selecionada]                 │
│  Primeiros   │  → Popular Topics: 6 cards 3x2              │
│  Passos      │                                              │
│  Vídeos VOD  │  [com categoria selecionada]                 │
│  Lives       │  → Sub-tópicos: cards em grid               │
│  Conteúdo    │    ↓ clique abre accordion de Q&A           │
│  Publicação  │                                              │
│  ...         │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

## Sidebar Button (app-sidebar.tsx)

- Position: above the user profile footer, separated by a subtle divider
- Icon: `LifeBuoy` (lucide-react)
- Label: "Ajuda & Suporte"
- Style: matches existing nav items — `bg-primary text-white` when active, hover on idle

## Initial Content Categories

1. Primeiros Passos (3 topics)
2. Vídeos VOD (3 topics)
3. Lives (2 topics)
4. Conteúdo & Publicação (2 topics)
5. Competições & Times (2 topics)
6. Conta & Acesso (2 topics)

Popular Topics (featured: true): one sub-topic per category = 6 cards in a 3×2 grid on the home view.

## Search Behavior

- Filters the left sidebar category list and visible topic cards in real time
- Matches against: category label, topic title, topic description
- When a search is active and a category is selected, only matching topics within that category are shown
