import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, X, Info, ImageIcon } from "lucide-react"
import { PlayerForm } from "@/components/forms/PlayerForm"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Player {
  id: string
  name: string
  position?: string
  nationality: string
  birthDate?: string
  imagePrimaryUrl?: string
  imageSecondaryUrl?: string
  description?: string
  skills?: string[]
  createdAt: string
  updatedAt: string
  enabled: boolean
}

// Mock data
const mockPlayer: Player = {
  id: "1",
  name: "Lionel Messi",
  position: "Forward",
  nationality: "Argentina",
  birthDate: "1987-06-24",
  imagePrimaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400",
  imageSecondaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=1200",
  description: "Lionel Messi is an Argentine professional football player widely regarded as one of the greatest players of all time. Known for his incredible dribbling, vision, and goal-scoring ability.",
  skills: ["Dribbling", "Finishing", "Passing", "Free Kicks", "Vision", "Ball Control"],
  createdAt: "2024-01-01T00:00:00",
  updatedAt: "2024-01-15T00:00:00",
  enabled: true
}

type TabType = "overview" | "media"

export default function PlayerDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [player] = useState<Player>(mockPlayer)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (showEditForm) {
    return (
      <PlayerForm
        initialData={{
          name: player.name,
          position: player.position,
          nationality: player.nationality,
          birthDate: player.birthDate ? new Date(player.birthDate) : undefined,
          imagePrimaryUrl: player.imagePrimaryUrl,
          imageSecondaryUrl: player.imageSecondaryUrl,
          enabled: player.enabled
        }}
        isEdit={true}
        onClose={() => setShowEditForm(false)}
      />
    )
  }

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "media", label: "Media", icon: ImageIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/players")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Players
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl overflow-hidden">
        {/* Top banner bar - 128px height */}
        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: "url(/assets/BackgroundAFA.png)" }} />

        {/* Header Content */}
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            {/* Left Section: Photo + Info */}
            <div className="flex flex-col">
              {/* Player Photo - circular */}
              <div className="w-[116px] h-[116px] rounded-full bg-white overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {player.imagePrimaryUrl ? (
                  <img
                    src={player.imagePrimaryUrl}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">
                    {player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                )}
              </div>

              {/* Player Info */}
              <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">
                {player.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {player.position || "Player"}
              </p>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setShowEditForm(true)}
              className="bg-primary hover:bg-primary/80 text-white rounded-[10px] px-6 h-10 mt-16"
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
              {/* Left Column */}
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Description</h3>
                  <p className="text-sm text-white/80 leading-relaxed max-w-xl">
                    {player.description || "No description available."}
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Full Name</h3>
                  <p className="text-sm text-white/80">{player.name}</p>
                </div>
                {player.position && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Position</h3>
                    <p className="text-sm text-white/80">{player.position}</p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Nationality</h3>
                  <p className="text-sm text-white/80">{player.nationality}</p>
                </div>
                {player.birthDate && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Birth Date</h3>
                    <p className="text-sm text-white/80">{formatDate(player.birthDate)}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "media" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <h3 className="text-lg font-semibold text-white">Media Assets</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Image */}
              {player.imagePrimaryUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Primary Image</p>
                  <div
                    className="aspect-square rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxImage(player.imagePrimaryUrl!)}
                  >
                    <img
                      src={player.imagePrimaryUrl}
                      alt="Primary"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Secondary Image */}
              {player.imageSecondaryUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Secondary Image</p>
                  <div
                    className="aspect-square rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxImage(player.imageSecondaryUrl!)}
                  >
                    <img
                      src={player.imageSecondaryUrl}
                      alt="Secondary"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
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
