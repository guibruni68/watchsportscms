import React, { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Clock, Users, Radio, X, Link2, BarChart3, Info, ImageIcon, AlertTriangle, Copy, Check, Globe } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { ReportIssueDialog } from "@/components/dialogs/ReportIssueDialog"

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
  scheduleDate: string
  isPublished: boolean
  badge?: "NEW" | "NEW EPISODES" | "SOON"
  cardImageUrl?: string
  bannerImageUrl?: string
  streamUrl?: string
  rtmpServerUrl?: string
  streamKey?: string
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
    scheduleDate: "2025-12-20T16:00:00",
    isPublished: true,
    badge: "SOON",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchThunders.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchThunders.png",
    streamUrl: "https://example.com/stream/championship-final",
    rtmpServerUrl: "rtmp://live.example.com/app",
    streamKey: "sk-championship-final-abc123",
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
    scheduleDate: "2024-01-18T10:00:00",
    isPublished: true,
    badge: "NEW",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchersIron.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchersIron.png",
    streamUrl: "https://example.com/stream/squad-presentation",
    rtmpServerUrl: "rtmp://live.example.com/app",
    streamKey: "sk-squad-presentation-def456",
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
    scheduleDate: "2026-01-22T09:00:00",
    isPublished: false,
    badge: "SOON",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-NovaThunder.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-NovaThunder.png",
    streamUrl: "https://example.com/stream/open-training",
    rtmpServerUrl: "rtmp://live.example.com/app",
    streamKey: "sk-open-training-ghi789",
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

type TabType = "information" | "media" | "stream" | "agents" | "publishing" | "stats"

export default function LiveDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [live, setLive] = useState<Live | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("information")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

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
    { id: "information", label: "Information", icon: Info },
    { id: "media",       label: "Media",       icon: ImageIcon },
    { id: "stream",      label: "Stream",      icon: Radio },
    { id: "agents",      label: "Agents",      icon: Users },
    { id: "publishing",  label: "Publishing",  icon: Globe },
    { id: "stats",       label: "Stats",       icon: BarChart3 },
  ]

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
        <div className="h-28 bg-cover bg-center" style={{ backgroundImage: "url(/assets/BackgroundAFA.png)" }} />

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
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">
                  {live.title}
                </h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-20">
              <Button
                variant="outline"
                onClick={() => setReportOpen(true)}
                className="gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Reportar Problema
              </Button>
              <Button
                onClick={handleEdit}
                className="bg-primary hover:bg-primary/80 text-white rounded-lg px-6 h-10"
              >
                Edit
              </Button>
            </div>
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

      {/* INFORMATION TAB */}
      {activeTab === "information" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Description</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {live.description || "No description available."}
                  </p>
                </div>
                {live.genre && live.genre.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {live.genre.map((genre, index) => (
                        <Badge key={index} variant="neutral">{genre}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-64 space-y-8">
                {live.ageRating && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Age Rating</h3>
                    <p className="text-sm text-white/80">{live.ageRating}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Created At</h3>
                  <p className="text-sm text-white/80">{formatDateTime(live.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Updated At</h3>
                  <p className="text-sm text-white/80">{formatDateTime(live.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "media" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Image */}
              {live.cardImageUrl && (
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Card Image</h3>
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
                  <h3 className="text-base font-semibold text-white mb-4">Banner Image</h3>
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

      {activeTab === "stats" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <h3 className="text-lg font-semibold text-white">Statistics</h3>

            {(live.viewers !== undefined && live.viewers !== null && live.viewers > 0) ? (
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
                  <p className="text-3xl font-bold text-white">{(live.viewers || 0).toLocaleString()}</p>
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
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Statistics will be available after the stream starts.</p>
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

      {/* Report Issue Dialog */}
      <ReportIssueDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        liveTitle={live.title}
        liveId={live.id}
      />
    </div>
  )
}
