# Match Control Team Logos Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Exibir logos reais dos times (do mock da TeamsPage) no MatchControlPage, tanto no Match Info Card quanto nos cards de escalação (pre-game).

**Architecture:** Adicionar `logo` na interface `MatchTeam` e inicializar `homeTeam`/`awayTeam` com dados de dois times reais do mock da TeamsPage (Basement Basketball e Big City Thunder). Substituir as caixinhas de sigla por `<img>` com fallback para sigla.

**Tech Stack:** React, TypeScript, Tailwind CSS

---

### Task 1: Atualizar interface e mock data no MatchControlPage

**Files:**
- Modify: `src/pages/lives/MatchControlPage.tsx:24-29` (interface MatchTeam)
- Modify: `src/pages/lives/MatchControlPage.tsx:136-141` (estado inicial homeTeam/awayTeam)

**Step 1: Adicionar campo `logo` na interface `MatchTeam`**

Em `src/pages/lives/MatchControlPage.tsx`, na interface `MatchTeam` (linha ~24):

```ts
interface MatchTeam {
  id: string
  abbreviation: string
  name: string
  logo?: string
  players: MatchPlayer[]
}
```

**Step 2: Atualizar estado inicial dos times com dados reais**

Substituir o `useState` de `homeTeam` e `awayTeam` (linhas ~136-141):

```ts
const [homeTeam, setHomeTeam] = useState<MatchTeam>({
  id: "home",
  abbreviation: "BSM",
  name: "Basement Basketball",
  logo: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
  players: defaultHomePlayers,
})
const [awayTeam, setAwayTeam] = useState<MatchTeam>({
  id: "away",
  abbreviation: "BCT",
  name: "Big City Thunder",
  logo: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
  players: defaultAwayPlayers,
})
```

**Step 3: Commit**

```bash
git add src/pages/lives/MatchControlPage.tsx
git commit -m "feat: add logo field to MatchTeam and use real mock team data"
```

---

### Task 2: Exibir logo no Match Info Card

**Files:**
- Modify: `src/pages/lives/MatchControlPage.tsx:296-321` (seção de times no Match Info Card)

**Step 1: Criar helper de exibição de logo**

Logo acima do return da página, adicionar o helper inline (ou usar diretamente no JSX):

```tsx
function TeamLogo({ logo, abbreviation }: { logo?: string; abbreviation: string }) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={abbreviation}
        className="h-10 w-10 rounded-[4px] object-cover shrink-0"
      />
    )
  }
  return (
    <div className="h-10 w-10 rounded-[4px] bg-muted border flex items-center justify-center font-bold text-sm shrink-0">
      {abbreviation}
    </div>
  )
}
```

**Step 2: Substituir caixinhas de sigla no Match Info Card**

Substituir o `<div>` de sigla do time da casa (linha ~297-299):
```tsx
// ANTES:
<div className="h-10 w-10 rounded-[4px] bg-muted border flex items-center justify-center font-bold text-sm shrink-0">
  {homeTeam.abbreviation}
</div>

// DEPOIS:
<TeamLogo logo={homeTeam.logo} abbreviation={homeTeam.abbreviation} />
```

Fazer o mesmo para o time visitante (linha ~317-319):
```tsx
// ANTES:
<div className="h-10 w-10 rounded-[4px] bg-muted border flex items-center justify-center font-bold text-sm shrink-0">
  {awayTeam.abbreviation}
</div>

// DEPOIS:
<TeamLogo logo={awayTeam.logo} abbreviation={awayTeam.abbreviation} />
```

**Step 3: Commit**

```bash
git add src/pages/lives/MatchControlPage.tsx
git commit -m "feat: show team logo in Match Info Card with abbreviation fallback"
```

---

### Task 3: Exibir logo no cabeçalho dos cards de escalação (pre-game)

**Files:**
- Modify: `src/pages/lives/MatchControlPage.tsx:373-380` (CardHeader dos lineup cards)

**Step 1: Adicionar logo ao lado do nome do time no CardHeader**

Dentro do `CardHeader` de cada lineup card (linha ~373-380), adicionar a logo antes do nome:

```tsx
<CardHeader className="pb-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <TeamLogo logo={team.logo} abbreviation={team.abbreviation} />
      <CardTitle className="text-base">{team.name} Lineup</CardTitle>
    </div>
    <Badge variant={starters.length === 11 ? "default" : "outline"} className="text-xs font-normal">
      {starters.length}/11
    </Badge>
  </div>
</CardHeader>
```

**Step 2: Verificar visualmente**

Abrir o app, navegar para uma live > Controle de Partida. Verificar:
- Match Info Card mostra as logos dos dois times
- Cards de escalação mostram logo + nome do time no cabeçalho
- Se a imagem falhar, a sigla aparece como fallback

**Step 3: Commit**

```bash
git add src/pages/lives/MatchControlPage.tsx
git commit -m "feat: show team logo in pre-game lineup card headers"
```
