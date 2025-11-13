import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Edit, Calendar, Globe } from "lucide-react"
import { AgentForm } from "@/components/forms/AgentForm"
import { mockGenres } from "@/data/mockData"
import { X } from "lucide-react"

interface Agent {
  id: string
  name: string
  label: "player" | "coach" | "writer"
  genres?: string[]  // Array of genre IDs for positions/roles
  originDate?: string
  nationality: string
  imagePrimaryUrl?: string
  imageSecondaryUrl?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
}

// Mock data - should match the agent from the list
const mockAgent: Agent = {
  id: "1",
  name: "Lionel Messi",
  label: "player",
  genres: ["genre-agent-10"], // Forward
  nationality: "Argentina",
  originDate: "1987-06-24",
  imagePrimaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
  imageSecondaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=1200",
  createdAt: "2024-01-01T00:00:00",
  updatedAt: "2024-01-15T00:00:00",
  enabled: true
}

export default function AgentDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [agent] = useState<Agent>(mockAgent)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  if (showEditForm) {
    return (
      <AgentForm
        initialData={{
          name: agent.name,
          label: agent.label,
          genres: agent.genres,
          nationality: agent.nationality,
          originDate: agent.originDate ? new Date(agent.originDate) : undefined,
          imagePrimaryUrl: agent.imagePrimaryUrl,
          imageSecondaryUrl: agent.imageSecondaryUrl,
          enabled: agent.enabled
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
          onClick={() => navigate("/agents")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Button>
      </div>

      {/* Banner */}
      {agent.imageSecondaryUrl && (
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
          <img
            src={agent.imageSecondaryUrl}
            alt={agent.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Agent Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {agent.imagePrimaryUrl ? (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={agent.imagePrimaryUrl} alt={agent.name} />
              <AvatarFallback className="text-2xl">
                {agent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarFallback className="text-2xl">
                {agent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{agent.name}</h1>
              <Badge variant="outline" className="text-base px-3 py-1 capitalize">
                {agent.label}
              </Badge>
              <Badge variant={agent.enabled ? "default" : "secondary"}>
                {agent.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-2">
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditForm(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Agent
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{agent.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Label</p>
                  <Badge variant="outline" className="capitalize">{agent.label}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                  <p className="text-base">{agent.nationality}</p>
                </div>
                {agent.genres && agent.genres.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Positions / Roles</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {agent.genres.map(genreId => {
                        const genre = mockGenres.find(g => g.id === genreId)
                        return genre ? (
                          <Badge key={genreId} variant="secondary">
                            {genre.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
                {agent.originDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Origin Date</p>
                    <p className="text-base">{new Date(agent.originDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={agent.enabled ? "default" : "secondary"} className="mt-1">
                    {agent.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-base">{new Date(agent.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                  <p className="text-base">{new Date(agent.updatedAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agent.imagePrimaryUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Primary Image</p>
                    <img 
                      src={agent.imagePrimaryUrl} 
                      alt="Primary" 
                      className="h-32 w-32 object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity" 
                      onClick={() => setLightboxImage(agent.imagePrimaryUrl!)}
                    />
                  </div>
                )}
                {agent.imageSecondaryUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Secondary Image (Banner)</p>
                    <img 
                      src={agent.imageSecondaryUrl} 
                      alt="Banner" 
                      className="h-32 w-full object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity" 
                      onClick={() => setLightboxImage(agent.imageSecondaryUrl!)}
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
