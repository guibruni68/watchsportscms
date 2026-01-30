import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Edit, Calendar, Globe, X } from "lucide-react"
import { CoachForm } from "@/components/forms/CoachForm"

interface Coach {
  id: string
  name: string
  role?: string
  nationality: string
  birthDate?: string
  imagePrimaryUrl?: string
  imageSecondaryUrl?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
}

// Mock data
const mockCoach: Coach = {
  id: "1",
  name: "Pep Guardiola",
  role: "Head Coach",
  nationality: "Spain",
  birthDate: "1971-01-18",
  imagePrimaryUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=100",
  imageSecondaryUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=1200",
  createdAt: "2024-01-01T00:00:00",
  updatedAt: "2024-01-15T00:00:00",
  enabled: true
}

export default function CoachDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [coach] = useState<Coach>(mockCoach)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  if (showEditForm) {
    return (
      <CoachForm
        initialData={{
          name: coach.name,
          role: coach.role,
          nationality: coach.nationality,
          birthDate: coach.birthDate ? new Date(coach.birthDate) : undefined,
          imagePrimaryUrl: coach.imagePrimaryUrl,
          imageSecondaryUrl: coach.imageSecondaryUrl,
          enabled: coach.enabled
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
          onClick={() => navigate("/coaches")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Coaches
        </Button>
      </div>

      {/* Banner */}
      {coach.imageSecondaryUrl && (
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
          <img
            src={coach.imageSecondaryUrl}
            alt={coach.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Coach Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {coach.imagePrimaryUrl ? (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={coach.imagePrimaryUrl} alt={coach.name} />
              <AvatarFallback className="text-2xl">
                {coach.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarFallback className="text-2xl">
                {coach.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{coach.name}</h1>
              <Badge variant={coach.enabled ? "default" : "secondary"}>
                {coach.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {coach.role && (
                <span>{coach.role}</span>
              )}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{coach.nationality}</span>
              </div>
              {coach.birthDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(coach.birthDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditForm(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Coach
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
                  <p className="text-base">{coach.name}</p>
                </div>
                {coach.role && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Role</p>
                    <p className="text-base">{coach.role}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                  <p className="text-base">{coach.nationality}</p>
                </div>
                {coach.birthDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
                    <p className="text-base">{new Date(coach.birthDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={coach.enabled ? "default" : "secondary"} className="mt-1">
                    {coach.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-base">{new Date(coach.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                  <p className="text-base">{new Date(coach.updatedAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coach.imagePrimaryUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Primary Image</p>
                    <img
                      src={coach.imagePrimaryUrl}
                      alt="Primary"
                      className="h-32 w-32 object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setLightboxImage(coach.imagePrimaryUrl!)}
                    />
                  </div>
                )}
                {coach.imageSecondaryUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Secondary Image (Banner)</p>
                    <img
                      src={coach.imageSecondaryUrl}
                      alt="Banner"
                      className="h-32 w-full object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setLightboxImage(coach.imageSecondaryUrl!)}
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
