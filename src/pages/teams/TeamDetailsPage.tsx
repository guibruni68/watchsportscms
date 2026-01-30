import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Edit, Calendar, Users, User, X, Search, MapPin } from "lucide-react"
import { TeamForm } from "@/components/forms/TeamForm"
import { ActionDropdown } from "@/components/ui/action-dropdown"

interface Team {
  id: string
  name: string
  acronym: string
  description: string
  logoUrl?: string
  cardImageUrl?: string
  bannerImageUrl?: string
  originDate?: string
  city?: string
  country?: string
  stadiumId?: string
  stadiumName?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
}

interface Agent {
  id: string
  name: string
  label: "player" | "coach" | "writer"
  genre?: string
  originDate?: string
  nationality: string
  imagePrimaryUrl?: string
  imageSecondaryUrl?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
}

const mockTeam: Team = {
  id: "1",
  name: "FC Barcelona",
  acronym: "FCB",
  description: "Professional football club based in Barcelona, Catalonia, Spain. Founded in 1899 by a group of Swiss, Catalan, German, and English footballers led by Joan Gamper, the club has become a symbol of Catalan culture and Catalanism.",
  logoUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100",
  cardImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400",
  bannerImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200",
  originDate: "1899-11-29",
  city: "Barcelona",
  country: "Spain",
  stadiumId: "1",
  stadiumName: "Camp Nou",
  createdAt: "2024-01-01T00:00:00",
  updatedAt: "2024-01-15T00:00:00",
  enabled: true
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Lionel Messi",
    label: "player",
    genre: "Forward",
    nationality: "Argentina",
    originDate: "1987-06-24",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true
  },
  {
    id: "2",
    name: "Gerard Piqué",
    label: "player",
    genre: "Defender",
    nationality: "Spain",
    originDate: "1987-02-02",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  },
  {
    id: "3",
    name: "Pep Guardiola",
    label: "coach",
    genre: "Head Coach",
    nationality: "Spain",
    originDate: "1971-01-18",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  }
]

const mockAvailableAgents: Agent[] = [
  {
    id: "4",
    name: "Cristiano Ronaldo",
    label: "player",
    genre: "Forward",
    nationality: "Portugal",
    originDate: "1985-02-05",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  },
  {
    id: "5",
    name: "Neymar Jr",
    label: "player",
    genre: "Forward",
    nationality: "Brazil",
    originDate: "1992-02-05",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  },
  {
    id: "6",
    name: "Carlo Ancelotti",
    label: "coach",
    genre: "Head Coach",
    nationality: "Italy",
    originDate: "1959-06-10",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  }
]

export default function TeamDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [team] = useState<Team>(mockTeam)
  const [agents] = useState<Agent[]>(mockAgents)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Add Agent Dialog state
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false)
  const [agentSearchTerm, setAgentSearchTerm] = useState("")
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([])

  // Filter available agents based on search
  const filteredAvailableAgents = mockAvailableAgents.filter(agent =>
    agent.name.toLowerCase().includes(agentSearchTerm.toLowerCase()) ||
    agent.label.toLowerCase().includes(agentSearchTerm.toLowerCase()) ||
    agent.nationality.toLowerCase().includes(agentSearchTerm.toLowerCase())
  )

  const handleAddAgents = () => {
    console.log("Adding agents:", selectedAgentIds)
    setShowAddAgentDialog(false)
    setSelectedAgentIds([])
    setAgentSearchTerm("")
  }

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgentIds(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  if (showEditForm) {
    return (
      <TeamForm
        initialData={{
          name: team.name,
          acronym: team.acronym,
          description: team.description,
          logoUrl: team.logoUrl,
          cardImageUrl: team.cardImageUrl,
          bannerImageUrl: team.bannerImageUrl,
          originDate: team.originDate ? new Date(team.originDate) : undefined,
          city: team.city,
          country: team.country,
          stadiumId: team.stadiumId,
          enabled: team.enabled
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
          onClick={() => navigate("/teams")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teams
        </Button>
      </div>

      {/* Banner */}
      {team.bannerImageUrl && (
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
          <img
            src={team.bannerImageUrl}
            alt={team.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Team Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          {team.logoUrl ? (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={team.logoUrl} alt={team.name} />
              <AvatarFallback className="text-2xl">{team.acronym}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarFallback className="text-2xl"><Users className="h-12 w-12" /></AvatarFallback>
            </Avatar>
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{team.name}</h1>
              <Badge variant="outline" className="text-base px-3 py-1">
                {team.acronym}
              </Badge>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                {team.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-2xl">{team.description}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {team.city && team.country && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{team.city}, {team.country}</span>
                </div>
              )}
              {team.originDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Founded: {new Date(team.originDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{agents.length} Members</span>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditForm(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Team
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="pb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members ({agents.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base">{team.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Acronym</p>
                  <p className="text-base">{team.acronym}</p>
                </div>
                {team.city && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">City</p>
                    <p className="text-base">{team.city}</p>
                  </div>
                )}
                {team.country && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Country</p>
                    <p className="text-base">{team.country}</p>
                  </div>
                )}
                {team.stadiumName && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stadium</p>
                    <p className="text-base">{team.stadiumName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-base">{team.description}</p>
                </div>
                {team.originDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Foundation Date</p>
                    <p className="text-base">{new Date(team.originDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border mt-1">
                    {team.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.logoUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Logo</p>
                    <img
                      src={team.logoUrl}
                      alt="Logo"
                      className="h-32 w-32 object-contain border rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setLightboxImage(team.logoUrl!)}
                    />
                  </div>
                )}
                {team.cardImageUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Card Image</p>
                    <img
                      src={team.cardImageUrl}
                      alt="Card"
                      className="h-48 w-auto object-contain border rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setLightboxImage(team.cardImageUrl!)}
                    />
                  </div>
                )}
                {team.bannerImageUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Banner Image</p>
                    <img
                      src={team.bannerImageUrl}
                      alt="Banner"
                      className="h-32 w-full object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setLightboxImage(team.bannerImageUrl!)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <Button size="sm" onClick={() => setShowAddAgentDialog(true)}>
                <User className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        {agent.imagePrimaryUrl ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={agent.imagePrimaryUrl} alt={agent.name} />
                            <AvatarFallback>
                              {agent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {agent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{agent.label}</Badge>
                      </TableCell>
                      <TableCell>{agent.nationality}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                          {agent.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(agent.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <ActionDropdown
                          onView={() => navigate(`/agents/${agent.id}`)}
                          onEdit={() => {}}
                          onDelete={() => {}}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Agent Dialog */}
      <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Members to Team</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or position..."
                value={agentSearchTerm}
                onChange={(e) => setAgentSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredAvailableAgents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No members found
                  </p>
                ) : (
                  filteredAvailableAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => toggleAgentSelection(agent.id)}
                    >
                      <Checkbox
                        checked={selectedAgentIds.includes(agent.id)}
                        onCheckedChange={() => toggleAgentSelection(agent.id)}
                      />
                      {agent.imagePrimaryUrl ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={agent.imagePrimaryUrl} alt={agent.name} />
                          <AvatarFallback>
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{agent.label} • {agent.nationality}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                        {agent.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddAgentDialog(false)
              setSelectedAgentIds([])
              setAgentSearchTerm("")
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddAgents}
              disabled={selectedAgentIds.length === 0}
            >
              Add {selectedAgentIds.length > 0 && `(${selectedAgentIds.length})`} Member{selectedAgentIds.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
