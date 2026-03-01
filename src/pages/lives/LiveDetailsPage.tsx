import React, { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Clock, Users, Radio, X, Link2, BarChart3, Info, Settings2, ImageIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Agent {
  id: string
  name: string
  type: "agent" | "group"
}

interface Live {
  id: string
  title: string
  description: string
  label: "VOD" | "LIVE"
  releaseYear?: number
  scheduleDate: string
  isPublished: boolean
  badge?: "NEW" | "NEW EPISODES" | "SOON"
  cardImageUrl?: string
  bannerImageUrl?: string
  streamUrl?: string
  ageRating?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
  eventName?: string
  dateTime?: string
  genre?: string[]
  available?: boolean
  viewers?: number
  playerEmbed?: string
  agentesRelacionados?: Agent[]
}

// Mock data
const mockLives: Live[] = [
  {
    id: "1",
    title: "State Championship Final",
    description: "Live broadcast of the grand final against traditional rival. A decisive match for the state title with both teams at their best.",
    label: "LIVE",
    releaseYear: 2025,
    scheduleDate: "2025-12-20T16:00:00",
    isPublished: true,
    badge: "SOON",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchThunders.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchThunders.png",
    streamUrl: "https://example.com/stream/championship-final",
    ageRating: "L",
    createdAt: "2025-11-15T10:00:00",
    updatedAt: "2025-11-20T14:30:00",
    enabled: true,
    eventName: "State Championship Final",
    dateTime: "2025-12-20T16:00:00",
    genre: ["Championship", "Final"],
    available: false,
    viewers: 0,
    agentesRelacionados: [
      { id: "player1", name: "Carlos Eduardo", type: "agent" },
      { id: "player2", name: "André Silva", type: "agent" },
      { id: "team1", name: "Watch Thunders", type: "group" }
    ]
  },
  {
    id: "2",
    title: "2024 Squad Presentation",
    description: "Press conference with presentation of new players. Meet the new reinforcements for the upcoming season.",
    label: "LIVE",
    releaseYear: 2024,
    scheduleDate: "2024-01-18T10:00:00",
    isPublished: true,
    badge: "NEW",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchersIron.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchersIron.png",
    streamUrl: "https://example.com/stream/squad-presentation",
    ageRating: "L",
    createdAt: "2024-01-10T09:00:00",
    updatedAt: "2024-01-17T16:45:00",
    enabled: true,
    eventName: "2024 Squad Presentation",
    dateTime: "2024-01-18T10:00:00",
    genre: ["Press Conference", "Institutional"],
    available: true,
    viewers: 1247
  },
  {
    id: "3",
    title: "Open Training for Fans",
    description: "Follow the team's training before the decisive game. An exclusive opportunity to see the players preparing.",
    label: "LIVE",
    releaseYear: 2026,
    scheduleDate: "2026-01-22T09:00:00",
    isPublished: false,
    badge: "SOON",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-NovaThunder.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-NovaThunder.png",
    streamUrl: "https://example.com/stream/open-training",
    ageRating: "L",
    createdAt: "2026-01-10T08:00:00",
    updatedAt: "2026-01-20T10:00:00",
    enabled: true,
    eventName: "Open Training for Fans",
    dateTime: "2026-01-22T09:00:00",
    genre: ["Training", "Behind the Scenes"],
    available: false,
    viewers: 0
  },
]

type TabType = "overview" | "details" | "stats" | "media"

export default function LiveDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [live, setLive] = useState<Live | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Check for tab param on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'stats') {
      setActiveTab('stats')
    }
  }, [searchParams])

  // Format datetime
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        const liveData = mockLives.find(l => l.id === id)

        if (!liveData) {
          throw new Error("Live stream not found")
        }

        setLive(liveData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Error loading live stream data.",
          variant: "destructive",
        })
        navigate('/lives')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, navigate])

  const handleEdit = () => {
    navigate(`/lives/edit/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!live) {
    return null
  }

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "details", label: "Details", icon: Settings2 },
    { id: "stats", label: "Stats", icon: BarChart3 },
    { id: "media", label: "Media", icon: ImageIcon }
  ]

  const getStatusLabel = () => {
    if (!live.enabled) return "Disabled"
    if (!live.isPublished) return "Draft"
    const now = new Date()
    const scheduleDate = new Date(live.scheduleDate)
    if (live.available) return "Live Now"
    if (scheduleDate > now) return "Scheduled"
    return "Ended"
  }

  const getStatusVariant = (): "destructive" | "info" | "outline" => {
    const status = getStatusLabel()
    if (status === "Live Now") return "destructive"
    if (status === "Scheduled") return "info"
    return "outline"
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/lives")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Live Streams
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl overflow-hidden">
        {/* Top banner bar */}
        <div className="h-28 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d]" />

        {/* Header Content */}
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            {/* Left Section: Thumbnail + Info */}
            <div className="flex flex-col">
              {/* Live Thumbnail */}
              <div className="w-[200px] h-[120px] rounded-2xl bg-[#1a1a1a] overflow-hidden flex items-center justify-center shadow-lg mb-4 relative">
                {live.cardImageUrl ? (
                  <>
                    <img
                      src={live.cardImageUrl}
                      alt={live.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Radio icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <Radio className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </>
                ) : (
                  <Radio className="h-8 w-8 text-muted-foreground/50" />
                )}
                {/* Live indicator */}
                {live.available && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                )}
              </div>

              {/* Live Info */}
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white">
                  {live.title}
                </h1>
                <Badge variant={getStatusVariant()}>
                  {getStatusLabel()}
                </Badge>
                {live.badge && (
                  <Badge variant="info">
                    {live.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {live.releaseYear || "Live Stream"}
              </p>
            </div>

            {/* Edit Button */}
            <Button
              onClick={handleEdit}
              className="bg-primary hover:bg-primary/80 text-white rounded-lg px-6 h-10 mt-20"
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs - outside the card */}
      <div className="border-b border-[#1f1f1f]">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-xs font-normal uppercase tracking-wider transition-colors relative flex items-center gap-1.5",
                activeTab === tab.id
                  ? "text-white"
                  : "text-muted-foreground hover:text-white/80"
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

      {/* Tab Content */}
      {activeTab === "overview" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              {/* Left Column - Description & Genres */}
              <div className="flex-1 space-y-8">
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
                        <div
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-[10px] bg-[#090909] border border-[#262626]"
                        >
                          <span className="text-xs font-medium text-white/50">{genre}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agents */}
                {live.agentesRelacionados && live.agentesRelacionados.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Related Agents</h3>
                    <div className="flex flex-wrap gap-2">
                      {live.agentesRelacionados.map((agent) => (
                        <div
                          key={agent.id}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#090909] border border-[#262626]"
                        >
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            agent.type === "agent" ? "bg-blue-500" : "bg-green-500"
                          )} />
                          <span className="text-xs font-medium text-white/50">{agent.name}</span>
                          <span className="text-[10px] text-white/30 uppercase">{agent.type === "agent" ? "Player" : "Team"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Info Cards */}
              <div className="w-64 space-y-6">
                {/* Age Rating */}
                {live.ageRating && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-muted-foreground">{live.ageRating}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Age Rating</p>
                      <p className="text-xs text-muted-foreground">{live.ageRating}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "details" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <h3 className="text-lg font-semibold text-white">Technical Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stream URL */}
              {live.streamUrl && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Stream URL</p>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090909] border border-[#262626]">
                    <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <code className="text-xs text-white/60 break-all">{live.streamUrl}</code>
                  </div>
                </div>
              )}

              {/* Release Year */}
              {live.releaseYear && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Release Year</p>
                  <p className="text-sm text-white">{live.releaseYear}</p>
                </div>
              )}

              {/* Label */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Label</p>
                <p className="text-sm text-white">{live.label}</p>
              </div>

              {/* Created At */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Created At</p>
                <p className="text-sm text-white">{formatDateTime(live.createdAt)}</p>
              </div>

              {/* Updated At */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Updated At</p>
                <p className="text-sm text-white">{formatDateTime(live.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "stats" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <h3 className="text-lg font-semibold text-white">Statistics</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Peak Viewers */}
              <div className="p-6 rounded-xl bg-[#090909] border border-[#262626]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Peak Viewers</p>
                </div>
                <p className="text-3xl font-bold text-white">{(live.viewers || 0).toLocaleString()}</p>
              </div>

              {/* Total Views */}
              <div className="p-6 rounded-xl bg-[#090909] border border-[#262626]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                </div>
                <p className="text-3xl font-bold text-white">{((live.viewers || 0) * 2.5).toLocaleString()}</p>
              </div>

              {/* Watch Time */}
              <div className="p-6 rounded-xl bg-[#090909] border border-[#262626]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Watch Time</p>
                </div>
                <p className="text-3xl font-bold text-white">24:35</p>
              </div>
            </div>

            {!live.viewers && (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Statistics will be available after the stream starts.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "media" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <h3 className="text-lg font-semibold text-white">Media Assets</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Image */}
              {live.cardImageUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Card Image</p>
                  <div
                    className="aspect-video rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxImage(live.cardImageUrl!)}
                  >
                    <img
                      src={live.cardImageUrl}
                      alt="Card"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Banner Image */}
              {live.bannerImageUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Banner Image</p>
                  <div
                    className="aspect-video rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxImage(live.bannerImageUrl!)}
                  >
                    <img
                      src={live.bannerImageUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {!live.cardImageUrl && !live.bannerImageUrl && (
              <div className="text-center py-12">
                <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No media assets uploaded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Image Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setLightboxImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            {lightboxImage && (
              <img
                src={lightboxImage}
                alt="Full size preview"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
