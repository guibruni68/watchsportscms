import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Clock, Play, Tag, X, Link2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Video {
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
  genre?: string[]
  tags?: string[]
  views?: number
  duration?: string
  available?: boolean
  publishDate?: string
}

// Mock data
const mockVideos: Video[] = [
  {
    id: "1",
    title: "Buzzer Beater: Vitória épica no último segundo",
    description: "Os melhores momentos da vitória dramática com cesta no estouro do cronômetro. Uma partida emocionante que ficará marcada na história do time.",
    label: "VOD",
    releaseYear: 2024,
    scheduleDate: "2024-01-15T20:30:00",
    isPublished: true,
    badge: "NEW",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/04542e4202afd169555c7c2693804706a2fa64e5.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/04542e4202afd169555c7c2693804706a2fa64e5.png",
    streamUrl: "https://example.com/stream/buzzer-beater",
    ageRating: "L",
    createdAt: "2024-01-10T10:00:00",
    updatedAt: "2024-01-15T20:30:00",
    enabled: true,
    genre: ["Goals and Highlights", "Best Moments"],
    tags: ["buzzer beater", "vitória", "playoffs"],
    views: 15420,
    duration: "05:32",
    available: true
  },
  {
    id: "2",
    title: "Triple-Double histórico do armador",
    description: "Reveja a performance incrível com pontos, assistências e rebotes. O armador entregou uma atuação memorável.",
    label: "VOD",
    releaseYear: 2024,
    scheduleDate: "2025-12-15T14:00:00",
    isPublished: false,
    badge: "SOON",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/1d986d6d01b285b9919ce7999ac9e722c4840aaf.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/1d986d6d01b285b9919ce7999ac9e722c4840aaf.png",
    streamUrl: "https://example.com/stream/triple-double",
    ageRating: "L",
    createdAt: "2024-01-05T09:00:00",
    updatedAt: "2024-01-12T10:00:00",
    enabled: false,
    genre: ["Interviews", "Backstage"],
    tags: ["triple-double", "armador", "recorde"],
    views: 8931,
    duration: "12:18",
    available: false
  },
]

type TabType = "overview" | "details" | "media"

export default function VideoDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

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
        const videoData = mockVideos.find(v => v.id === id)

        if (!videoData) {
          throw new Error("Video not found")
        }

        setVideo(videoData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Error loading video data.",
          variant: "destructive",
        })
        navigate('/videos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, navigate])

  const handleEdit = () => {
    navigate(`/videos/edit/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!video) {
    return null
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Details" },
    { id: "media", label: "Media" }
  ]

  const getStatusLabel = () => {
    if (!video.enabled) return "Disabled"
    if (!video.isPublished) return "Draft"
    const now = new Date()
    const scheduleDate = new Date(video.scheduleDate)
    if (scheduleDate > now) return "Scheduled"
    return "Published"
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/videos")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Videos
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
              {/* Video Thumbnail */}
              <div className="w-[200px] h-[120px] rounded-2xl bg-[#1a1a1a] overflow-hidden flex items-center justify-center shadow-lg mb-4 relative">
                {video.cardImageUrl ? (
                  <>
                    <img
                      src={video.cardImageUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <Play className="h-5 w-5 text-white fill-white" />
                      </div>
                    </div>
                  </>
                ) : (
                  <Play className="h-8 w-8 text-muted-foreground/50" />
                )}
              </div>

              {/* Video Info */}
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white">
                  {video.title}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                  {getStatusLabel()}
                </span>
                {video.badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-[#153A8A]/20 text-[#4a90d9] border border-[#153A8A]/30">
                    {video.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {video.releaseYear || "Video"}
              </p>
            </div>

            {/* Edit Button */}
            <Button
              onClick={handleEdit}
              className="bg-[#153A8A] hover:bg-[#1a4aa8] text-white rounded-lg px-6 h-10 mt-20"
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
                "px-6 py-3 text-xs font-normal uppercase tracking-wider transition-colors relative",
                activeTab === tab.id
                  ? "text-white"
                  : "text-muted-foreground hover:text-white/80"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#153A8A]" />
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
              {/* Left Column - Description & Tags */}
              <div className="flex-1 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Description</h3>
                  <p className="text-sm text-white/80 leading-relaxed max-w-xl">
                    {video.description || "No description available."}
                  </p>
                </div>

                {/* Genres */}
                {video.genre && video.genre.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {video.genre.map((genre, index) => (
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

                {/* Tags */}
                {video.tags && video.tags.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#262626]"
                        >
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-white/60">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Info Cards */}
              <div className="w-64 space-y-6">
                {/* Duration */}
                {video.duration && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Duration</p>
                      <p className="text-xs text-muted-foreground">{video.duration}</p>
                    </div>
                  </div>
                )}

                {/* Age Rating */}
                {video.ageRating && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-muted-foreground">{video.ageRating}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Age Rating</p>
                      <p className="text-xs text-muted-foreground">{video.ageRating}</p>
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
              {video.streamUrl && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Stream URL</p>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090909] border border-[#262626]">
                    <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <code className="text-xs text-white/60 break-all">{video.streamUrl}</code>
                  </div>
                </div>
              )}

              {/* Release Year */}
              {video.releaseYear && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Release Year</p>
                  <p className="text-sm text-white">{video.releaseYear}</p>
                </div>
              )}

              {/* Label */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Label</p>
                <p className="text-sm text-white">{video.label}</p>
              </div>

              {/* Created At */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Created At</p>
                <p className="text-sm text-white">{formatDateTime(video.createdAt)}</p>
              </div>

              {/* Updated At */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Updated At</p>
                <p className="text-sm text-white">{formatDateTime(video.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "media" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <h3 className="text-lg font-semibold text-white">Media Assets</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Image */}
              {video.cardImageUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Card Image</p>
                  <div
                    className="aspect-video rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxImage(video.cardImageUrl!)}
                  >
                    <img
                      src={video.cardImageUrl}
                      alt="Card"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Banner Image */}
              {video.bannerImageUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Banner Image</p>
                  <div
                    className="aspect-video rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxImage(video.bannerImageUrl!)}
                  >
                    <img
                      src={video.bannerImageUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {!video.cardImageUrl && !video.bannerImageUrl && (
              <div className="text-center py-12">
                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
