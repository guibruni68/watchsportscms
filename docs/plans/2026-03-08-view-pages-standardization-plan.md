# View Pages Standardization — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Padronizar todas as páginas de detalhe (view pages) para seguir o mesmo padrão visual do TeamDetailsPage — header card escuro com gradient, avatar/imagem sobreposto, tipografia `text-2xl font-bold text-white tracking-[-0.6px]`, custom button tabs com underline, cards de conteúdo `border-[#1f1f1f] bg-[#0d0d0d]`.

**Architecture:** Cada task é uma página independente. A referência exata de markup e className está no TeamDetailsPage (`src/pages/teams/TeamDetailsPage.tsx` linhas 244–325). Não criar componentes novos — aplicar os mesmos classNames inline como nas páginas que já estão padronizadas.

**Tech Stack:** React, TypeScript, Tailwind CSS, lucide-react, shadcn/ui (Badge, Button, Card)

---

## Reference Pattern (TeamDetailsPage linhas 244–325)

```tsx
// Back button
<Button variant="ghost" size="sm" onClick={() => navigate("/teams")}
  className="text-muted-foreground hover:text-foreground gap-2 px-0">
  <ArrowLeft className="h-4 w-4" />
  Back to Teams
</Button>

// Header Card
<Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
  <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />
  <div className="px-7 pb-7 -mt-14">
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        {/* Avatar: circular 116x116 para pessoas/times */}
        <div className="w-[116px] h-[116px] rounded-full bg-white overflow-hidden flex items-center justify-center shadow-lg mb-4">
          <img src={entity.imageUrl} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{entity.name}</h1>
          <Badge variant="neutral">{entity.enabled ? "Enabled" : "Disabled"}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{entity.subtitle}</p>
      </div>
      <Button className="bg-primary hover:bg-primary/80 text-white rounded-[10px] px-6 h-10 mt-16">
        Edit
      </Button>
    </div>
  </div>
</Card>

// Tabs (custom buttons, NOT shadcn Tabs)
<div className="border-b border-[#1f1f1f]">
  <div className="flex gap-0">
    {tabs.map(tab => (
      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
        className={cn(
          "px-6 py-3 text-xs font-normal uppercase tracking-wider transition-colors relative flex items-center gap-1.5",
          activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-white/80"
        )}>
        <tab.icon className="h-3.5 w-3.5" />
        {tab.label}
        {tab.count !== undefined && ` (${tab.count})`}
        {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
      </button>
    ))}
  </div>
</div>

// Content cards
<Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
  <CardContent className="p-7">
    <div className="flex gap-12">
      <div className="flex-1 space-y-8">
        <div>
          <h3 className="text-base font-semibold text-white mb-4">Label</h3>
          <p className="text-sm text-white/80">{value}</p>
        </div>
      </div>
      <div className="w-64 space-y-8">...</div>
    </div>
  </CardContent>
</Card>
```

---

### Task 1: AgentDetailsPage — Substituir shadcn Tabs por custom button tabs

**File:** `src/pages/agents/AgentDetailsPage.tsx`

**Contexto:** A página usa `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>` do shadcn (linha 147–244). O header usa `text-4xl` sem o card escuro. Precisa receber o header card padrão + substituir os tabs + usar os content cards padrão.

**Step 1: Remover imports não mais necessários e adicionar imports necessários**

Substituir as linhas 1–12:
```tsx
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Info, ImageIcon, X } from "lucide-react"
import { AgentForm } from "@/components/forms/AgentForm"
import { mockGenres } from "@/data/mockData"
import { cn } from "@/lib/utils"
```

**Step 2: Substituir o bloco de return (linhas 80–269) completamente**

```tsx
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(basePath)}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {pageTitlePlural}
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="w-[116px] h-[116px] rounded-full bg-white overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {agent.imagePrimaryUrl ? (
                  <img src={agent.imagePrimaryUrl} alt={agent.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">
                    {agent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{agent.name}</h1>
                <Badge variant="neutral">{agent.enabled ? "Enabled" : "Disabled"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 capitalize">{agent.label}</p>
            </div>
            <Button
              onClick={() => setShowEditForm(true)}
              className="bg-primary hover:bg-primary/80 text-white rounded-[10px] px-6 h-10 mt-16"
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-[#1f1f1f]">
        <div className="flex gap-0">
          {([
            { id: "overview" as const, label: "Overview", icon: Info },
            { id: "media"    as const, label: "Media",    icon: ImageIcon },
          ]).map(tab => (
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
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Full Name</h3>
                  <p className="text-sm text-white/80">{agent.name}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Nationality</h3>
                  <p className="text-sm text-white/80">{agent.nationality}</p>
                </div>
                {agent.genres && agent.genres.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Positions / Roles</h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.genres.map(genreId => {
                        const genre = mockGenres.find(g => g.id === genreId)
                        return genre ? <Badge key={genreId} variant="neutral">{genre.name}</Badge> : null
                      })}
                    </div>
                  </div>
                )}
                {agent.originDate && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Birth Date</h3>
                    <p className="text-sm text-white/80">{new Date(agent.originDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Created At</h3>
                  <p className="text-sm text-white/80">{new Date(agent.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Updated At</h3>
                  <p className="text-sm text-white/80">{new Date(agent.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Media Tab */}
      {activeTab === "media" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agent.imagePrimaryUrl && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Primary Image</p>
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer"
                    onClick={() => setLightboxImage(agent.imagePrimaryUrl!)}>
                    <img src={agent.imagePrimaryUrl} alt="Primary" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                </div>
              )}
              {agent.imageSecondaryUrl && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-3">Secondary Image (Banner)</p>
                  <div className="aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer"
                    onClick={() => setLightboxImage(agent.imageSecondaryUrl!)}>
                    <img src={agent.imageSecondaryUrl} alt="Banner" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                </div>
              )}
              {!agent.imagePrimaryUrl && !agent.imageSecondaryUrl && (
                <div className="col-span-3 py-12 text-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No media assets</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95">
          <div className="relative">
            <Button variant="ghost" size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setLightboxImage(null)}>
              <X className="h-6 w-6" />
            </Button>
            {lightboxImage && (
              <img src={lightboxImage} alt="Full size" className="w-full h-auto max-h-[90vh] object-contain" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
```

Também atualizar o tipo de `activeTab` na linha 52:
```tsx
const [activeTab, setActiveTab] = useState<"overview" | "media">("overview")
```

**Step 3: Verificar visualmente**
Navegar para `/agents/1` — deve mostrar header card escuro com gradient, avatar circular, tabs Overview e Media com underline, content cards escuros.

**Step 4: Commit**
```bash
git add src/pages/agents/AgentDetailsPage.tsx
git commit -m "feat: standardize AgentDetailsPage to Teams pattern"
```

---

### Task 2: CollectionDetailsPage — Corrigir tab bar styling

**File:** `src/pages/collections/CollectionDetailsPage.tsx`

**Contexto:** A página já tem header card e custom tabs, mas o tab bar usa um estilo diferente (`w-fit p-1 bg-[#0d0d0d] border rounded-xl`) em vez do padrão (`border-b border-[#1f1f1f]` full-width). O back button também difere.

**Step 1: Corrigir o back button (linhas 151–162)**

Substituir:
```tsx
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Collection
        </Button>
      </div>
```

Por:
```tsx
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/collections")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Collections
      </Button>
```

**Step 2: Corrigir o tab bar (linhas 164–185)**

Substituir:
```tsx
      {/* Tab Bar */}
      <div className="flex gap-1 p-1 bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl w-fit">
        {([
          { id: "information" as TabType, label: "Information", icon: Info },
          { id: "seasons"     as TabType, label: "Seasons",     icon: CalendarDays },
          { id: "publishing"  as TabType, label: "Publishing",  icon: Globe },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-[#1a1a1a] text-white"
                : "text-muted-foreground hover:text-white"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
```

Por:
```tsx
      {/* Tabs */}
      <div className="border-b border-[#1f1f1f]">
        <div className="flex gap-0">
          {([
            { id: "information" as TabType, label: "Information", icon: Info },
            { id: "seasons"     as TabType, label: "Seasons",     icon: CalendarDays },
            { id: "publishing"  as TabType, label: "Publishing",  icon: Globe },
          ]).map(tab => (
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
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
```

**Step 3: Verificar visualmente**
Navegar para `/collections` → clicar View em uma collection. O tab bar deve ter o mesmo estilo das outras páginas.

**Step 4: Commit**
```bash
git add src/pages/collections/CollectionDetailsPage.tsx
git commit -m "feat: standardize CollectionDetailsPage tab bar and back button"
```

---

### Task 3: BannerDetailsPage — Adicionar header card + tabs

**File:** `src/pages/banners/BannerDetailsPage.tsx`

**Contexto:** A página não tem header card nem tabs. Todo o conteúdo está em um único `<Card>`. Precisa: back button padrão, header card com gradient + título do banner + badge de status + edit button + duas tabs (Preview, Information).

**Step 1: Atualizar imports**

Substituir linhas 1–10:
```tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Tag as TagIcon, Calendar, X, Image as ImageIcon, Megaphone, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { mockBanners, Banner } from "@/data/mockData";
import { getContentStatus, getStatusBadgeVariant, cn } from "@/lib/utils";
import { format } from "date-fns";
```

**Step 2: Adicionar estado de tab após linha `const [lightboxImage...]`**

```tsx
  const [activeTab, setActiveTab] = useState<"preview" | "information">("preview")
```

**Step 3: Substituir o return (a partir da linha 66) com o novo layout**

```tsx
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/banners')}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Banners
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="w-[116px] h-[116px] rounded-full bg-[#262626] border border-[#1f1f1f] overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {banner.bgImageUrl ? (
                  <img src={banner.bgImageUrl} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <Megaphone className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{banner.title}</h1>
                <Badge variant="neutral">{banner.enabled ? "Enabled" : "Disabled"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 capitalize">{banner.layout} layout</p>
            </div>
            <Button
              onClick={handleEdit}
              className="bg-primary hover:bg-primary/80 text-white rounded-[10px] px-6 h-10 mt-16"
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-[#1f1f1f]">
        <div className="flex gap-0">
          {([
            { id: "preview"     as const, label: "Preview",     icon: ImageIcon },
            { id: "information" as const, label: "Information", icon: Info },
          ]).map(tab => (
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
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Banner Preview ({banner.layout === "hero" ? "Hero Layout" : "Standard Layout"})
              </p>

              {banner.layout === "hero" && (
                <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden bg-muted">
                  {banner.bgImageUrl ? (
                    <div className="relative w-full h-full">
                      <img src={banner.bgImageUrl} alt={banner.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setLightboxImage(banner.bgImageUrl!)} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        {banner.tag && <Badge className="mb-2" variant="neutral">{banner.tag}</Badge>}
                        <h2 className="text-4xl font-bold mb-2">{banner.title}</h2>
                        <p className="text-lg mb-4 max-w-2xl">{banner.text}</p>
                        {banner.buttonText && (
                          <Button size="lg" className="bg-white text-black hover:bg-gray-100">{banner.buttonText}</Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}

              {banner.layout === "standard" && (
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                  {banner.bgImageUrl ? (
                    <div className="relative w-full h-full">
                      <img src={banner.bgImageUrl} alt={banner.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setLightboxImage(banner.bgImageUrl!)} />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 p-6 text-white max-w-md">
                        {banner.tag && <Badge className="mb-2" variant="neutral">{banner.tag}</Badge>}
                        <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                        <p className="text-sm mb-3">{banner.text}</p>
                        {banner.buttonText && (
                          <Button className="bg-white text-black hover:bg-gray-100">{banner.buttonText}</Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}

              {banner.bgMobileUrl && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">Mobile Banner</p>
                  <div className="relative w-48 aspect-[9/16] rounded-lg overflow-hidden bg-muted">
                    <img src={banner.bgMobileUrl} alt={`${banner.title} - Mobile`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setLightboxImage(banner.bgMobileUrl!)} />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Tab */}
      {activeTab === "information" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              <div className="flex-1 space-y-8">
                {banner.text && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Body Text</h3>
                    <p className="text-sm text-white/80">{banner.text}</p>
                  </div>
                )}
                {banner.buttonText && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Button Text</h3>
                    <p className="text-sm text-white/80">{banner.buttonText}</p>
                  </div>
                )}
                {banner.buttonRedirectionUrl && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Button URL</h3>
                    <p className="text-sm text-white/80 font-mono break-all">{banner.buttonRedirectionUrl}</p>
                  </div>
                )}
              </div>
              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={banner.enabled ? "default" : "outline"}>
                      {banner.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    {banner.isPublished && <Badge variant="neutral">Published</Badge>}
                    <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
                  </div>
                </div>
                {banner.tag && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Tag</h3>
                    <Badge variant="neutral"><TagIcon className="h-3 w-3 mr-1" />{banner.tag}</Badge>
                  </div>
                )}
                {banner.scheduleDate && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Schedule Date</h3>
                    <p className="text-sm text-white/80 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(banner.scheduleDate), "PPP 'at' p")}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Created At</h3>
                  <p className="text-sm text-white/80">{format(new Date(banner.createdAt), "PPP")}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Updated At</h3>
                  <p className="text-sm text-white/80">{format(new Date(banner.updatedAt), "PPP")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}>
          <Button variant="ghost" size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setLightboxImage(null)}>
            <X className="h-6 w-6" />
          </Button>
          <img src={lightboxImage} alt="Enlarged view"
            className="max-w-full max-h-full object-contain"
            onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
```

**Step 4: Verificar visualmente**
Navegar para `/banners` → View em um banner. Deve mostrar header card, tabs Preview e Information.

**Step 5: Commit**
```bash
git add src/pages/banners/BannerDetailsPage.tsx
git commit -m "feat: standardize BannerDetailsPage with header card and tabs"
```

---

### Task 4: NewsDetailPage — Adicionar header card + tabs

**File:** `src/pages/news/NewsDetailPage.tsx`

**Contexto:** A página não tem header card nem tabs. Conteúdo atual: artigo editorial (text-4xl headline, imagens, blocos de texto) + metadata card. Precisa: back button padrão, header card, tabs Content e Publishing.

**Step 1: Atualizar imports (linhas 1–10)**

```tsx
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Newspaper, FileText, Globe, X } from "lucide-react"
import { NewsForm } from "@/components/forms/NewsForm"
import { mockNews, mockGenres } from "@/data/mockData"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
```

**Step 2: Adicionar estado de tab após `const [lightboxImage...]`**

```tsx
  const [activeTab, setActiveTab] = useState<"content" | "publishing">("content")
```

**Step 3: Substituir o return (linhas 71–239)**

```tsx
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/news")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="w-[116px] h-[116px] rounded-full bg-[#262626] border border-[#1f1f1f] overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {newsItem.firstImageUrl ? (
                  <img src={newsItem.firstImageUrl} alt={newsItem.header} className="w-full h-full object-cover" />
                ) : (
                  <Newspaper className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{newsItem.header}</h1>
                <Badge variant="neutral">{newsItem.enabled ? "Enabled" : "Disabled"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{format(new Date(newsItem.date), "PPP")}</p>
            </div>
            <Button
              onClick={() => setShowEditForm(true)}
              className="bg-primary hover:bg-primary/80 text-white rounded-[10px] px-6 h-10 mt-16"
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-[#1f1f1f]">
        <div className="flex gap-0">
          {([
            { id: "content"    as const, label: "Content",    icon: FileText },
            { id: "publishing" as const, label: "Publishing", icon: Globe },
          ]).map(tab => (
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
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Tab */}
      {activeTab === "content" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-8">
            {newsItem.firstImageUrl && (
              <img
                src={newsItem.firstImageUrl}
                alt={newsItem.header}
                className="w-full h-80 object-cover rounded-xl cursor-pointer"
                onClick={() => setLightboxImage(newsItem.firstImageUrl!)}
              />
            )}
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Content</h3>
              <p className="text-sm text-white/80 leading-relaxed">{newsItem.firstText}</p>
            </div>
            {newsItem.secondImageUrl && (
              <img
                src={newsItem.secondImageUrl}
                alt="Mid content"
                className="w-full h-56 object-cover rounded-xl cursor-pointer"
                onClick={() => setLightboxImage(newsItem.secondImageUrl!)}
              />
            )}
            {newsItem.lastText && (
              <p className="text-sm text-white/80 leading-relaxed">{newsItem.lastText}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Publishing Tab */}
      {activeTab === "publishing" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Internal Title</h3>
                  <p className="text-sm text-white/80">{newsItem.title}</p>
                </div>
                {newsGenres.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">News Types</h3>
                    <div className="flex flex-wrap gap-2">
                      {newsGenres.map(genre => (
                        <Badge key={genre} variant="neutral">{genre}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="neutral">{newsItem.published ? "Published" : "Draft"}</Badge>
                    {newsItem.highlighted && <Badge variant="neutral">Highlighted</Badge>}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Publication Date</h3>
                  <p className="text-sm text-white/80">{format(new Date(newsItem.date), "PPP")}</p>
                </div>
                {newsItem.scheduleDate && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Scheduled Date</h3>
                    <p className="text-sm text-white/80">{format(new Date(newsItem.scheduleDate), "PPP")}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Created At</h3>
                  <p className="text-sm text-white/80">{format(new Date(newsItem.createdAt), "PPP")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-6xl p-0">
          <div className="relative">
            <img src={lightboxImage!} alt="Full size" className="w-full h-auto" />
            <Button variant="ghost" size="icon"
              className="absolute top-2 right-2 text-white hover:bg-white/20"
              onClick={() => setLightboxImage(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
```

**Step 4: Verificar visualmente**
Navegar para `/news` → View em uma notícia. Deve mostrar header card com thumbnail circular, tabs Content e Publishing.

**Step 5: Commit**
```bash
git add src/pages/news/NewsDetailPage.tsx
git commit -m "feat: standardize NewsDetailPage with header card and tabs"
```

---

### Task 5: EventDetailPage — Adicionar header card + tabs

**File:** `src/pages/schedule/EventDetailPage.tsx`

**Contexto:** Página mais simples (164 linhas). Não tem header card nem tabs. Conteúdo: imagem do evento, título, descrição, sidebar de metadata. Precisa do header card + tabs Overview e Publishing.

**Step 1: Atualizar imports (linhas 1–10)**

```tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Info, Globe, ExternalLink } from "lucide-react";
import { EventForm } from "@/components/forms/EventForm";
import { mockEvents } from "@/data/mockData";
import { format } from "date-fns";
import { getContentStatus, getStatusBadgeVariant, cn } from "@/lib/utils";
```

**Step 2: Adicionar estado de tab após `const [showEditForm...]`**

```tsx
  const [activeTab, setActiveTab] = useState<"overview" | "publishing">("overview")
```

**Step 3: Substituir o return principal (linhas 49–163)**

```tsx
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/schedule")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Schedule
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="w-[116px] h-[116px] rounded-full bg-[#262626] border border-[#1f1f1f] overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {event.cardImageUrl ? (
                  <img src={event.cardImageUrl} alt={event.title} className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.src = "/placeholder.svg" }} />
                ) : (
                  <CalendarDays className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{event.title}</h1>
                <Badge variant={statusVariant}>{status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(event.date), "PPP 'at' p")}
              </p>
            </div>
            <Button
              onClick={() => setShowEditForm(true)}
              className="bg-primary hover:bg-primary/80 text-white rounded-[10px] px-6 h-10 mt-16"
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-[#1f1f1f]">
        <div className="flex gap-0">
          {([
            { id: "overview"   as const, label: "Overview",   icon: Info },
            { id: "publishing" as const, label: "Publishing", icon: Globe },
          ]).map(tab => (
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
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-8">
            {event.cardImageUrl && (
              <img
                src={event.cardImageUrl}
                alt={event.title}
                className="w-full h-72 object-cover rounded-xl"
                onError={e => { e.currentTarget.src = "/placeholder.svg" }}
              />
            )}
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Description</h3>
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
            {event.redirectionUrl && (
              <div>
                <h3 className="text-base font-semibold text-white mb-4">Link</h3>
                <a href={event.redirectionUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  {event.redirectionUrl}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Publishing Tab */}
      {activeTab === "publishing" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Status</h3>
                  <Badge variant={statusVariant}>{status}</Badge>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Enabled</h3>
                  <p className="text-sm text-white/80">{event.enabled ? "Yes" : "No"}</p>
                </div>
              </div>
              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Event Date</h3>
                  <p className="text-sm text-white/80">{format(new Date(event.date), "PPP 'at' p")}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Created</h3>
                  <p className="text-sm text-white/80">{format(new Date(event.createdAt), "PPP")}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Last Updated</h3>
                  <p className="text-sm text-white/80">{format(new Date(event.updatedAt), "PPP")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
```

**Step 4: Verificar visualmente**
Navegar para `/schedule` → View em um evento. Deve mostrar header card, tabs Overview e Publishing.

**Step 5: Commit**
```bash
git add src/pages/schedule/EventDetailPage.tsx
git commit -m "feat: standardize EventDetailPage with header card and tabs"
```

---

### Task 6: LiveDetailsPage e VideoDetailsPage — Corrigir minor typography

**Files:**
- `src/pages/lives/LiveDetailsPage.tsx`
- `src/pages/videos/VideoDetailsPage.tsx`

**Contexto:** Ambas já usam custom tabs e header card. As divergências menores são: `text-xl` em vez de `text-2xl`, back button sem `px-0 gap-2`, e possível diferença no bg do header card. Verificar e corrigir.

**Step 1: Em LiveDetailsPage — buscar e corrigir tipografia do título**

Buscar `text-xl font-bold text-white` no header e substituir por `text-2xl font-bold text-white tracking-[-0.6px]`.

Buscar o back button e garantir que usa:
```tsx
className="text-muted-foreground hover:text-foreground gap-2 px-0"
```
Com `<ArrowLeft className="h-4 w-4" />` como primeiro filho (não com `mr-2`).

**Step 2: Em VideoDetailsPage — mesmas correções**

Mesmo processo: `text-xl` → `text-2xl tracking-[-0.6px]` no título, e back button com `px-0 gap-2`.

**Step 3: Verificar visualmente ambas**
Navegar para `/lives` e `/videos`, abrir o view de um item. Confirmar tipografia do título.

**Step 4: Commit**
```bash
git add src/pages/lives/LiveDetailsPage.tsx src/pages/videos/VideoDetailsPage.tsx
git commit -m "feat: fix typography consistency in LiveDetailsPage and VideoDetailsPage"
```
