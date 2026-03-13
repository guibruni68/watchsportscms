# Tab Standardization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make create, edit, and view pages use identical tab names, icons, and order for every entity.

**Architecture:** Detail pages adopt the same tab structure already used in forms. Content from old tabs (overview/details) is redistributed into the correct new tabs (information/media/stream/agents/publishing/stats). No new components — same custom button-tab pattern already in detail pages.

**Tech Stack:** React + TypeScript, Tailwind CSS, Lucide icons, shadcn/ui Cards

---

## Tab Standards Reference

| Entity | Tabs (in order) |
|--------|----------------|
| Live | information (Info) · media (ImageIcon) · stream (Radio) · agents (Users) · publishing (Globe) · stats (BarChart3) |
| Video | information (Info) · media (ImageIcon) · agents (Users) · publishing (Globe) |
| Collection | information (Info) · seasons (CalendarDays) · publishing (Globe) |

---

## Task 1: LiveDetailsPage — rename and redistribute tabs

**File:** `src/pages/lives/LiveDetailsPage.tsx`

**Current tabs:** `overview` · `details` · `stats` · `media`
**Target tabs:** `information` · `media` · `stream` · `agents` · `publishing` · `stats`

**Content redistribution:**
- `overview` → split into `information` (description, genres, age rating, created/updated) and `agents` (related agents)
- `details` → split into `stream` (stream URL, RTMP server URL, stream key) and `publishing` (label, badge, schedule date, enabled)
- `stats` → stays as `stats`
- `media` → stays as `media`

**Step 1: Update TabType**

Replace:
```tsx
type TabType = "overview" | "details" | "stats" | "media"
```
With:
```tsx
type TabType = "information" | "media" | "stream" | "agents" | "publishing" | "stats"
```

**Step 2: Update useState default**

Replace:
```tsx
const [activeTab, setActiveTab] = useState<TabType>("overview")
```
With:
```tsx
const [activeTab, setActiveTab] = useState<TabType>("information")
```

**Step 3: Update stats searchParam redirect**

Replace:
```tsx
if (tabParam === 'stats') {
  setActiveTab('stats')
}
```
With:
```tsx
if (tabParam === 'stats') setActiveTab('stats')
```
(no change in value, just confirming it still works)

**Step 4: Update tabs array**

Add `Globe`, `Radio`, `CalendarDays` to lucide imports if not already present. `Users` and `ImageIcon` are already imported.

Replace the tabs array:
```tsx
const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "information", label: "Information", icon: Info },
  { id: "media",       label: "Media",       icon: ImageIcon },
  { id: "stream",      label: "Stream",      icon: Radio },
  { id: "agents",      label: "Agents",      icon: Users },
  { id: "publishing",  label: "Publishing",  icon: Globe },
  { id: "stats",       label: "Stats",       icon: BarChart3 },
]
```

**Step 5: Replace tab content blocks**

Remove all existing `{activeTab === "overview" && ...}` and `{activeTab === "details" && ...}` blocks.

Add the following five new blocks (keep `stats` and `media` blocks as-is, just rename `media` check to `activeTab === "media"` — already correct):

```tsx
{/* INFORMATION TAB */}
{activeTab === "information" && (
  <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
    <CardContent className="p-7 space-y-8">
      {/* Description */}
      <div>
        <h3 className="text-base font-semibold text-white mb-4">Description</h3>
        <p className="text-sm text-white/80 leading-relaxed max-w-xl">
          {live.description || "No description available."}
        </p>
      </div>

      {/* Genres */}
      {live.genre && live.genre.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-white mb-4">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {live.genre.map((genre, index) => (
              <div key={index} className="inline-flex items-center px-4 py-2 rounded-[10px] bg-[#090909] border border-[#262626]">
                <span className="text-xs font-medium text-white/50">{genre}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {live.ageRating && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Age Rating</p>
            <p className="text-sm text-white">{live.ageRating}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Created At</p>
          <p className="text-sm text-white">{formatDateTime(live.createdAt)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Updated At</p>
          <p className="text-sm text-white">{formatDateTime(live.updatedAt)}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)}

{/* STREAM TAB */}
{activeTab === "stream" && (
  <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
    <CardContent className="p-7 space-y-6">
      <h3 className="text-lg font-semibold text-white">Stream Configuration</h3>
      <div className="space-y-4">
        {live.streamUrl && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Stream URL</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090909] border border-[#262626]">
              <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <code className="text-xs text-white/60 break-all flex-1">{live.streamUrl}</code>
              <button onClick={() => handleCopy(live.streamUrl!, "streamUrl")} className="ml-auto flex-shrink-0 text-muted-foreground hover:text-white transition-colors">
                {copiedField === "streamUrl" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
        {live.rtmpServerUrl && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">RTMP Server URL</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090909] border border-[#262626]">
              <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <code className="text-xs text-white/60 break-all flex-1">{live.rtmpServerUrl}</code>
              <button onClick={() => handleCopy(live.rtmpServerUrl!, "rtmpServerUrl")} className="ml-auto flex-shrink-0 text-muted-foreground hover:text-white transition-colors">
                {copiedField === "rtmpServerUrl" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
        {live.streamKey && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Stream Key</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090909] border border-[#262626]">
              <code className="text-xs text-white/60 break-all flex-1">{"•".repeat(live.streamKey.length)}</code>
              <button onClick={() => handleCopy(live.streamKey!, "streamKey")} className="ml-auto flex-shrink-0 text-muted-foreground hover:text-white transition-colors">
                {copiedField === "streamKey" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
        {!live.streamUrl && !live.rtmpServerUrl && !live.streamKey && (
          <div className="text-center py-8">
            <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No stream configuration available.</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)}

{/* AGENTS TAB */}
{activeTab === "agents" && (
  <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
    <CardContent className="p-7 space-y-6">
      <h3 className="text-lg font-semibold text-white">Related Agents</h3>
      {live.agentesRelacionados && live.agentesRelacionados.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {live.agentesRelacionados.map((agent) => (
            <div key={agent.id} className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#090909] border border-[#262626]">
              <span className={cn("w-2 h-2 rounded-full", agent.type === "agent" ? "bg-blue-500" : "bg-green-500")} />
              <span className="text-xs font-medium text-white/50">{agent.name}</span>
              <span className="text-[10px] text-white/30 uppercase">{agent.type === "agent" ? "Player" : "Team"}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No agents associated with this live.</p>
        </div>
      )}
    </CardContent>
  </Card>
)}

{/* PUBLISHING TAB */}
{activeTab === "publishing" && (
  <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
    <CardContent className="p-7 space-y-6">
      <h3 className="text-lg font-semibold text-white">Publishing</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Label</p>
          <p className="text-sm text-white">{live.label}</p>
        </div>
        {live.badge && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Badge</p>
            <p className="text-sm text-white">{live.badge}</p>
          </div>
        )}
        {live.scheduleDate && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Schedule Date</p>
            <p className="text-sm text-white">{formatDateTime(live.scheduleDate)}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
          <p className="text-sm text-white">{live.isPublished ? "Published" : "Draft"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Enabled</p>
          <p className="text-sm text-white">{live.enabled ? "Yes" : "No"}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)}
```

**Step 6: Verify lucide imports**

Ensure these are imported at the top of the file:
`ArrowLeft, Clock, Users, Radio, X, Link2, BarChart3, Info, Settings2, ImageIcon, AlertTriangle, Copy, Check, Globe`

Add `Globe` if missing.

**Step 7: Commit**
```bash
git add src/pages/lives/LiveDetailsPage.tsx
git commit -m "feat: standardize LiveDetailsPage tabs to match LiveForm"
```

---

## Task 2: VideoDetailsPage — rename and redistribute tabs

**File:** `src/pages/videos/VideoDetailsPage.tsx`

**Current tabs:** `overview` · `details` · `media`
**Target tabs:** `information` · `media` · `agents` · `publishing`

**Content redistribution:**
- `overview` → `information` (description, genres, tags, duration, age rating, created/updated)
- `details` → `publishing` (stream URL moves here, label, schedule date, enabled status)
- `media` → stays as `media`
- New `agents` tab → empty state (no agents in current Video interface; show placeholder)

**Step 1: Update TabType**

Replace:
```tsx
type TabType = "overview" | "details" | "media"
```
With:
```tsx
type TabType = "information" | "media" | "agents" | "publishing"
```

**Step 2: Update useState default**
```tsx
const [activeTab, setActiveTab] = useState<TabType>("information")
```

**Step 3: Update tabs array**

Add `Globe, Users` to lucide imports if not present.

```tsx
const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "information", label: "Information", icon: Info },
  { id: "media",       label: "Media",       icon: ImageIcon },
  { id: "agents",      label: "Agents",      icon: Users },
  { id: "publishing",  label: "Publishing",  icon: Globe },
]
```

**Step 4: Replace tab content blocks**

Remove `activeTab === "overview"` and `activeTab === "details"` blocks. Keep `activeTab === "media"` as-is.

Add:

```tsx
{/* INFORMATION TAB */}
{activeTab === "information" && (
  <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
    <CardContent className="p-7 space-y-8">
      <div>
        <h3 className="text-base font-semibold text-white mb-4">Description</h3>
        <p className="text-sm text-white/80 leading-relaxed max-w-xl">
          {video.description || "No description available."}
        </p>
      </div>

      {video.genre && video.genre.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-white mb-4">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {video.genre.map((genre, index) => (
              <div key={index} className="inline-flex items-center px-4 py-2 rounded-[10px] bg-[#090909] border border-[#262626]">
                <span className="text-xs font-medium text-white/50">{genre}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {video.tags && video.tags.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag, index) => (
              <div key={index} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#262626]">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-white/60">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {video.duration && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Duration</p>
            <p className="text-sm text-white">{video.duration}</p>
          </div>
        )}
        {video.ageRating && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Age Rating</p>
            <p className="text-sm text-white">{video.ageRating}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Created At</p>
          <p className="text-sm text-white">{formatDateTime(video.createdAt)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Updated At</p>
          <p className="text-sm text-white">{formatDateTime(video.updatedAt)}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)}

{/* AGENTS TAB */}
{activeTab === "agents" && (
  <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
    <CardContent className="p-7">
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No agents associated with this video.</p>
      </div>
    </CardContent>
  </Card>
)}

{/* PUBLISHING TAB */}
{activeTab === "publishing" && (
  <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
    <CardContent className="p-7 space-y-6">
      <h3 className="text-lg font-semibold text-white">Publishing</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Label</p>
          <p className="text-sm text-white">{video.label}</p>
        </div>
        {video.badge && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Badge</p>
            <p className="text-sm text-white">{video.badge}</p>
          </div>
        )}
        {video.scheduleDate && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Schedule Date</p>
            <p className="text-sm text-white">{formatDateTime(video.scheduleDate)}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
          <p className="text-sm text-white">{video.isPublished ? "Published" : "Draft"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Enabled</p>
          <p className="text-sm text-white">{video.enabled ? "Yes" : "No"}</p>
        </div>
        {video.streamUrl && (
          <div className="col-span-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">Stream URL</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090909] border border-[#262626]">
              <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <code className="text-xs text-white/60 break-all">{video.streamUrl}</code>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)}
```

**Step 5: Verify lucide imports include:** `ArrowLeft, Play, Tag, X, Link2, Info, Settings2, ImageIcon, Users, Globe`

**Step 6: Commit**
```bash
git add src/pages/videos/VideoDetailsPage.tsx
git commit -m "feat: standardize VideoDetailsPage tabs to match VideoForm"
```

---

## Task 3: CollectionDetailsPage — add tabs

**File:** `src/pages/collections/CollectionDetailsPage.tsx`

**Current:** No tabs — all content in stacked cards
**Target tabs:** `information` · `seasons` · `publishing`

**Content redistribution:**
- `information`: title, description, genres, age rating, created/updated
- `seasons`: the existing seasons accordion/table (currently in a separate Card below)
- `publishing`: status, badge, schedule date, enabled, label

**Step 1: Add tab state and type**

After the existing `useState` declarations, add:
```tsx
type TabType = "information" | "seasons" | "publishing"
const [activeTab, setActiveTab] = useState<TabType>("information")
```

**Step 2: Add lucide imports**

Add to imports: `Info, ImageIcon, CalendarDays, Globe` (check which are already present)

**Step 3: Add tabs array and tab bar**

After the Edit button header section, before the first Card, insert the tab bar using the same custom button pattern as LiveDetailsPage:

```tsx
{/* Tab Bar */}
<div className="flex gap-1 p-1 bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl w-fit">
  {([
    { id: "information", label: "Information", icon: Info },
    { id: "seasons",     label: "Seasons",     icon: CalendarDays },
    { id: "publishing",  label: "Publishing",  icon: Globe },
  ] as { id: TabType; label: string; icon: React.ElementType }[]).map((tab) => (
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

**Step 4: Wrap existing content in tab conditionals**

Wrap the existing "Collection Information" Card in `{activeTab === "information" && (...)}`.
Inside it, keep: title, description, genres, age rating, created/updated dates.
Remove from it: status, badge, schedule date (those move to publishing tab).

Wrap the "Seasons and Contents" Card in `{activeTab === "seasons" && (...)}`.

Add a new publishing tab block:
```tsx
{activeTab === "publishing" && (
  <Card>
    <CardContent className="p-7 space-y-6">
      <h3 className="text-lg font-semibold">Publishing</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <p className="text-xs font-bold text-foreground uppercase tracking-wide">Status</p>
          <Badge variant="neutral">
            {getContentStatus(collection.enabled ?? collection.available, collection.scheduleDate || collection.published_at)}
          </Badge>
        </div>
        {collection.badge && (
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Badge</p>
            <p className="text-sm">{collection.badge}</p>
          </div>
        )}
        <div className="space-y-1">
          <p className="text-xs font-bold text-foreground uppercase tracking-wide">Label</p>
          <p className="text-sm">{collection.label || "COLLECTION"}</p>
        </div>
        {collection.scheduleDate && (
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Schedule Date</p>
            <div className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(collection.scheduleDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)}
```

**Step 5: Commit**
```bash
git add src/pages/collections/CollectionDetailsPage.tsx
git commit -m "feat: add tabs to CollectionDetailsPage matching CollectionForm"
```

---

## Task 4: BannerForm — add icons to tabs

**File:** `src/components/forms/BannerForm.tsx`

BannerForm is the only form that has tabs without icons. Add `Info`, `ImageIcon`, `Globe` icons to its tab triggers to match all other forms.

**Step 1: Read the file** and find the TabsList/TabsTrigger section.

**Step 2: Add imports** — add `Info, ImageIcon, Globe` from lucide-react if not present.

**Step 3: Update each TabsTrigger** to include the icon before the label text:

```tsx
<TabsTrigger value="information" className="gap-2">
  <Info className="h-4 w-4" />
  Information
</TabsTrigger>
<TabsTrigger value="media" className="gap-2">
  <ImageIcon className="h-4 w-4" />
  Media
</TabsTrigger>
<TabsTrigger value="publishing" className="gap-2">
  <Globe className="h-4 w-4" />
  Publishing
</TabsTrigger>
```

**Step 4: Commit**
```bash
git add src/components/forms/BannerForm.tsx
git commit -m "feat: add icons to BannerForm tabs for consistency"
```

---

## Task 5: Final commit and push

```bash
git push origin claude-code
```

---

## Verification Checklist

After each task, manually verify in the browser:
- [ ] Tabs render in the correct order with correct icons
- [ ] Clicking each tab shows the right content
- [ ] No content is missing (compare with what was visible before)
- [ ] Default tab on page load is `information`
- [ ] Styling matches existing tabs (same active/inactive states)
