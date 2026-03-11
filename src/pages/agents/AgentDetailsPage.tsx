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

interface AgentDetailsPageProps {
  agentType?: "player" | "coach"
}

export default function AgentDetailsPage({ agentType }: AgentDetailsPageProps) {
  useParams<{ id: string }>()
  const navigate = useNavigate()
  const [agent] = useState<Agent>(mockAgent)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "media">("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Determine page context based on agentType prop
  const pageTitlePlural = agentType === "player" ? "Players" : agentType === "coach" ? "Coaches" : "Agents"
  const basePath = agentType === "player" ? "/players" : agentType === "coach" ? "/coaches" : "/agents"

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
        defaultLabel={agentType}
        onClose={() => setShowEditForm(false)}
      />
    )
  }

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
      <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl overflow-hidden">
        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: "url(/assets/BackgroundAFA.png)" }} />
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
              <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{agent.name}</h1>
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
}
