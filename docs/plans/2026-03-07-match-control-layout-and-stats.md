# Match Control Layout + Remove Stats Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fazer Register Event e Timeline terem sempre a mesma altura com scroll no Timeline, e remover Stats do menu action das lives.

**Architecture:** Duas mudanças independentes — (1) ajuste de layout CSS com `items-stretch` e `flex flex-col` nos cards da seção live/ended do MatchControlPage; (2) remoção da prop `showStats` e do handler `onStats` no ActionDropdown das lives.

**Tech Stack:** React, TypeScript, Tailwind CSS

---

### Task 1: Mesma altura para Register Event e Timeline + scroll no Timeline

**Files:**
- Modify: `src/pages/lives/MatchControlPage.tsx` (linhas 478–550)

**Contexto atual (linhas 478–550):**

```tsx
// Grid container — items-start faz os cards terem alturas diferentes
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

  {/* Register Events — col-span-2 */}
  <div className="lg:col-span-2">
    <Card>
      <CardHeader className="pb-3">...</CardHeader>
      <CardContent>
        {phase === "live" ? (
          <div className="grid grid-cols-5 gap-2">...</div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Match ended...</p>
        )}
      </CardContent>
    </Card>
  </div>

  {/* Timeline */}
  <div>
    <Card>
      <CardHeader className="pb-3">...</CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="py-8 text-center space-y-2">...</div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {[...events].reverse().map(...)}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
</div>
```

**Step 1: Atualizar grid container e wrappers dos cards**

Substituir o bloco da seção LIVE/ENDED (linhas 478–550) com as seguintes mudanças:

1. Grid: `items-start` → `items-stretch` e adicionar `min-h-[320px]`
2. Wrapper do Register Events: `<div className="lg:col-span-2">` → `<div className="lg:col-span-2 flex flex-col">`
3. Card do Register Events: `<Card>` → `<Card className="h-full flex flex-col">`
4. `<CardContent>` do Register Events: adicionar `flex-1 flex flex-col justify-center`
5. Wrapper do Timeline: `<div>` → `<div className="flex flex-col">`
6. Card do Timeline: `<Card>` → `<Card className="h-full flex flex-col">`
7. `<CardContent>` do Timeline: `<CardContent>` → `<CardContent className="flex-1 overflow-hidden flex flex-col">`
8. Div de eventos existentes: remover `max-h-[400px]`, manter `overflow-y-auto`, adicionar `flex-1`

**Resultado esperado:**

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-h-[320px]">

  {/* Register Events */}
  <div className="lg:col-span-2 flex flex-col">
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-1.5">
          <Plus className="h-4 w-4" />
          Register Event
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {phase === "live" ? (
          <div className="grid grid-cols-5 gap-2">
            {([
              { type: "goal" as EventType,         label: "Goal",         icon: "⚽" },
              { type: "substitution" as EventType, label: "Substitution", icon: "🔄" },
              { type: "yellow_card" as EventType,  label: "Yellow Card",  icon: "🟨" },
              { type: "red_card" as EventType,     label: "Red Card",     icon: "🟥" },
              { type: "penalty" as EventType,      label: "Penalty",      icon: "🎯" },
            ] as const).map(({ type, label, icon }) => (
              <button key={type} onClick={() => openEventDialog(type)}
                className="flex flex-col items-center justify-center gap-2 h-[81px] rounded-xl border border-border hover:bg-muted/60 hover:border-foreground/20 transition-colors text-center">
                <span className="text-2xl leading-8">{icon}</span>
                <span className="text-xs leading-none">{label}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Match ended. No more events can be registered.</p>
        )}
      </CardContent>
    </Card>
  </div>

  {/* Timeline */}
  <div className="flex flex-col">
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          Timeline ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col">
        {events.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No events yet</p>
          </div>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto">
            {[...events].reverse().map(e => (
              <div key={e.id} className="flex items-start gap-3 py-1.5">
                <span className="text-xs font-bold tabular-nums text-muted-foreground w-8 shrink-0 mt-0.5">{e.minute}'</span>
                <div className="shrink-0 mt-0.5">{eventIcon(e.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-tight truncate">
                    {e.type === "substitution"
                      ? <><span className="line-through text-muted-foreground">{e.playerName}</span> · {e.playerInName}</>
                      : e.playerName
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {eventLabel(e.type)} · {e.team === "home" ? homeTeam.abbreviation : awayTeam.abbreviation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
</div>
```

**Step 2: Verificar visualmente**

Navegar para a página de controle de partida, iniciar a partida e adicionar alguns eventos. Confirmar:
- Cards Register Event e Timeline têm a mesma altura
- Timeline com muitos eventos faz scroll interno
- No estado "ended", ambos os cards continuam com a mesma altura

**Step 3: Commit**

```bash
git add src/pages/lives/MatchControlPage.tsx
git commit -m "feat: equal height cards with scroll in match control live/ended section"
```

---

### Task 2: Remover Stats do menu action das lives

**Files:**
- Modify: `src/pages/lives/LivesPage.tsx` (linhas 259–270)

**Contexto atual (linhas 259–270):**

```tsx
<ActionDropdown
  onView={() => handleView(live.id)}
  onEdit={() => handleEdit(live)}
  onDelete={() => handleDelete(live.id)}
  onStats={() => navigate(`/lives/${live.id}?tab=stats`)}
  onMatchControl={() => navigate(`/lives/${live.id}/match-control`)}
  onReport={() => setReportLive(live)}
  showView={true}
  showStats={true}
  showMatchControl={true}
  showReport={true}
/>
```

**Step 1: Remover onStats e showStats**

```tsx
<ActionDropdown
  onView={() => handleView(live.id)}
  onEdit={() => handleEdit(live)}
  onDelete={() => handleDelete(live.id)}
  onMatchControl={() => navigate(`/lives/${live.id}/match-control`)}
  onReport={() => setReportLive(live)}
  showView={true}
  showMatchControl={true}
  showReport={true}
/>
```

**Step 2: Commit**

```bash
git add src/pages/lives/LivesPage.tsx
git commit -m "feat: remove stats from lives action dropdown"
```
