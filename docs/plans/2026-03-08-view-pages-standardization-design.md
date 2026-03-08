# View Pages Standardization — Design

**Goal:** Padronizar todas as páginas de visualização (detail pages) para seguir o mesmo padrão visual do TeamDetailsPage — mesma tipografia, arquitetura de elementos e estrutura de layout, personalizando apenas os dados de cada entidade.

**Approved by user:** 2026-03-08

---

## Reference Standard: TeamDetailsPage

### 1. Back Button
```tsx
<Button
  variant="ghost" size="sm"
  onClick={() => navigate("/teams")}
  className="text-muted-foreground hover:text-foreground gap-2 px-0"
>
  <ArrowLeft className="h-4 w-4" />
  Back to [Section]
</Button>
```

### 2. Header Card
```tsx
<Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
  {/* Banner gradient */}
  <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />

  {/* Content */}
  <div className="px-7 pb-7 -mt-14">
    <div className="flex items-start justify-between">
      {/* Left: avatar + name + badge */}
      <div className="flex flex-col">
        {/* Avatar: 116x116, circular for people/teams, rectangular 16:9 for media */}
        <div className="w-[116px] h-[116px] rounded-full bg-white overflow-hidden ...shadow-lg mb-4">
          <img src={entity.imageUrl} ... />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{entity.name}</h1>
          <Badge variant="neutral">{entity.enabled ? "Enabled" : "Disabled"}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{entity.subtitle}</p>
      </div>
      {/* Edit button */}
      <Button className="bg-primary hover:bg-primary/80 text-white rounded-[10px] px-6 h-10 mt-16">
        Edit
      </Button>
    </div>
  </div>
</Card>
```

**Avatar variants by entity type:**
- Teams, Competitions, Seasons → circular (`rounded-full`), uses logo
- Players, Coaches, Agents → circular (`rounded-full`), uses profile photo
- Lives, Videos → rectangular `w-[180px] h-[101px] rounded-xl` (16:9), uses thumbnail
- News → rectangular `w-[180px] h-[101px] rounded-xl`, uses main image
- Banners → rectangular `w-[180px] h-[64px] rounded-lg` (banner proportion), uses preview image
- Collections → circular with Tag icon fallback
- Events/Schedule → circular with Calendar icon fallback

### 3. Tabs (custom buttons, NOT shadcn Tabs component)
```tsx
<div className="border-b border-[#1f1f1f]">
  <div className="flex gap-0">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={cn(
          "px-6 py-3 text-xs font-normal uppercase tracking-wider transition-colors relative flex items-center gap-1.5",
          activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-white/80"
        )}
      >
        <tab.icon className="h-3.5 w-3.5" />
        {tab.label}
        {tab.count !== undefined && ` (${tab.count})`}
        {activeTab === tab.id && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        )}
      </button>
    ))}
  </div>
</div>
```

### 4. Content Cards
```tsx
<Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
  <CardContent className="p-7">
    <div className="flex gap-12">
      <div className="flex-1 space-y-8">  {/* Left column */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4">Field Label</h3>
          <p className="text-sm text-white/80">{value}</p>
        </div>
      </div>
      <div className="w-64 space-y-8">   {/* Right column */}
        ...
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Pages to Standardize

### Status Assessment

| Page | File | Status | Changes Needed |
|------|------|--------|----------------|
| Teams | TeamDetailsPage.tsx | ✅ Reference | none |
| Players | PlayerDetailsPage.tsx | ✅ Ok | none |
| Coaches | CoachDetailsPage.tsx | ✅ Ok | none |
| Competitions | CompetitionDetailsPage.tsx | ✅ Ok | none |
| Seasons | SeasonDetailsPage.tsx | ✅ Ok | none |
| **Agents** | AgentDetailsPage.tsx | ⚠️ Partial | Replace shadcn Tabs with custom button tabs |
| **Lives** | LiveDetailsPage.tsx | ⚠️ Partial | Fix `text-xl` → `text-2xl`, bg `#0d0d0d` → `#171717` on header |
| **Videos** | VideoDetailsPage.tsx | ⚠️ Partial | Same as Lives |
| **Banners** | BannerDetailsPage.tsx | ❌ Divergent | Full header card + tabs |
| **Collections** | CollectionDetailsPage.tsx | ❌ Divergent | Fix tab bar styling |
| **News** | NewsDetailPage.tsx | ❌ Divergent | Full header card + tabs |
| **Schedule/Events** | EventDetailPage.tsx | ❌ Divergent | Full header card + tabs |

---

## Per-Page Specification

### AgentDetailsPage
- Replace `<Tabs>` (shadcn) with custom button tabs matching Teams pattern
- Keep content as-is, just change tab implementation
- Tabs: Overview, Media (already exist)

### LiveDetailsPage
- Header: change `text-xl` → `text-2xl font-bold text-white tracking-[-0.6px]`
- Header card bg: verify uses `bg-[#171717]` (not darker variant)
- Keep rectangular thumbnail (16:9 makes sense for streams)
- Tabs: keep existing tabs (Information, Media, Stream, Agents, Publishing, Stats) — already custom buttons, verify styling matches exactly

### VideoDetailsPage
- Same fixes as LiveDetailsPage
- Tabs: keep existing (Information, Media, Agents, Publishing)

### BannerDetailsPage
- Add back button (`variant="ghost"`, `px-0`, `gap-2`)
- Add header card (`border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden`)
  - Banner gradient `h-32`
  - Avatar: banner preview image rectangular OR Megaphone icon in circle
  - Title: banner name/title, `text-2xl font-bold text-white tracking-[-0.6px]`
  - Badge: status (enabled/disabled)
  - Edit button: `mt-16`
- Add custom tabs: Information, Preview, Publishing
- Distribute existing content (preview sections, metadata, status) into tabs

### CollectionDetailsPage
- Tab bar: change from `w-fit p-1 bg-[#0d0d0d] border rounded-xl` to the standard `border-b border-[#1f1f1f]` full-width bar
- Tab buttons: match exact className from reference (px-6 py-3 text-xs uppercase tracking-wider)
- Content cards: verify use `border-[#1f1f1f] bg-[#0d0d0d]`
- Keep Accordion for nested content inside tabs (it's a content detail, not a tab itself)

### NewsDetailPage
- Add back button (standard pattern)
- Add header card:
  - Banner gradient `h-32`
  - Avatar: main article image (rectangular `w-[180px] h-[101px] rounded-xl`) OR Newspaper icon in circle
  - Title: news headline, `text-2xl font-bold text-white tracking-[-0.6px]`
  - Badge: status / category
  - Edit button
- Add custom tabs: Content, Media, Publishing
- Move: article text + images → Content tab, media assets → Media tab, publication status/schedule → Publishing tab

### EventDetailPage (Schedule)
- Add back button (standard pattern)
- Add header card:
  - Banner gradient `h-32`
  - Avatar: event image OR Calendar icon in circle fallback
  - Title: event name, `text-2xl font-bold text-white tracking-[-0.6px]`
  - Badge: event status
  - Edit button
- Add custom tabs: Overview, Media (if applicable), Publishing
- Keep existing field content, distribute into tabs
