import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Edit, Calendar, Globe, X } from "lucide-react"
import { PlayerForm } from "@/components/forms/PlayerForm"

interface Player {
  id: string
  name: string
  position?: string
  nationality: string
  birthDate?: string
  imagePrimaryUrl?: string
  imageSecondaryUrl?: string
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
  imagePrimaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
  imageSecondaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=1200",
  createdAt: "2024-01-01T00:00:00",
  updatedAt: "2024-01-15T00:00:00",
  enabled: true
}

export default function PlayerDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [player] = useState<Player>(mockPlayer)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/players")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Players
        </Button>
      </div>

      {/* Banner */}
      {player.imageSecondaryUrl && (
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
          <img
            src={player.imageSecondaryUrl}
            alt={player.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Player Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {player.imagePrimaryUrl ? (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={player.imagePrimaryUrl} alt={player.name} />
              <AvatarFallback className="text-2xl">
                {player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarFallback className="text-2xl">
                {player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{player.name}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                {player.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {player.position && (
                <span>{player.position}</span>
              )}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{player.nationality}</span>
              </div>
              {player.birthDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(player.birthDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditForm(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Player
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="pb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{player.name}</p>
                </div>
                {player.position && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Position</p>
                    <p className="text-base">{player.position}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                  <p className="text-base">{player.nationality}</p>
                </div>
                {player.birthDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
                    <p className="text-base">{new Date(player.birthDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border mt-1">
                    {player.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-base">{new Date(player.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                  <p className="text-base">{new Date(player.updatedAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {player.imagePrimaryUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Primary Image</p>
                    <img
                      src={player.imagePrimaryUrl}
                      alt="Primary"
                      className="h-32 w-32 object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setLightboxImage(player.imagePrimaryUrl!)}
                    />
                  </div>
                )}
                {player.imageSecondaryUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Secondary Image (Banner)</p>
                    <img
                      src={player.imageSecondaryUrl}
                      alt="Banner"
                      className="h-32 w-full object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setLightboxImage(player.imageSecondaryUrl!)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95">
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
