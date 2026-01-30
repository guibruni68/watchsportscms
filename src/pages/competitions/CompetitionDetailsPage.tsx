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
import { ArrowLeft, Edit, Calendar, Trophy, Users, X, Search, MapPin } from "lucide-react"
import { CompetitionForm } from "@/components/forms/CompetitionForm"
import { ActionDropdown } from "@/components/ui/action-dropdown"

interface Competition {
  id: string
  name: string
  acronym: string
  description: string
  type: "league" | "cup" | "tournament"
  logoUrl?: string
  cardImageUrl?: string
  bannerImageUrl?: string
  originDate?: string
  country?: string
  teamsCount?: number
  createdAt: string
  updatedAt: string
  enabled: boolean
}

interface Team {
  id: string
  name: string
  acronym: string
  logoUrl?: string
  city?: string
  country?: string
  enabled: boolean
}

const mockCompetition: Competition = {
  id: "1",
  name: "La Liga",
  acronym: "LaLiga",
  description: "The top professional football division of the Spanish football league system. La Liga is contested by 20 teams and operates on a system of promotion and relegation with the Segunda División.",
  type: "league",
  logoUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100",
  cardImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400",
  bannerImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200",
  originDate: "1929-02-10",
  country: "Spain",
  teamsCount: 20,
  createdAt: "2024-01-01T00:00:00",
  updatedAt: "2024-01-15T00:00:00",
  enabled: true
}

const mockParticipatingTeams: Team[] = [
  {
    id: "1",
    name: "FC Barcelona",
    acronym: "FCB",
    logoUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100",
    city: "Barcelona",
    country: "Spain",
    enabled: true
  },
  {
    id: "2",
    name: "Real Madrid CF",
    acronym: "RMA",
    logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100",
    city: "Madrid",
    country: "Spain",
    enabled: true
  },
  {
    id: "3",
    name: "Atlético Madrid",
    acronym: "ATM",
    city: "Madrid",
    country: "Spain",
    enabled: true
  },
]

const mockAvailableTeams: Team[] = [
  {
    id: "4",
    name: "Sevilla FC",
    acronym: "SEV",
    logoUrl: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=100",
    city: "Sevilla",
    country: "Spain",
    enabled: true
  },
  {
    id: "5",
    name: "Valencia CF",
    acronym: "VAL",
    city: "Valencia",
    country: "Spain",
    enabled: true
  },
  {
    id: "6",
    name: "Real Betis",
    acronym: "BET",
    city: "Sevilla",
    country: "Spain",
    enabled: true
  },
]

export default function CompetitionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [competition] = useState<Competition>(mockCompetition)
  const [teams] = useState<Team[]>(mockParticipatingTeams)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Add Team Dialog state
  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false)
  const [teamSearchTerm, setTeamSearchTerm] = useState("")
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([])

  // Filter available teams based on search
  const filteredAvailableTeams = mockAvailableTeams.filter(team =>
    team.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
    team.acronym.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
    (team.city && team.city.toLowerCase().includes(teamSearchTerm.toLowerCase()))
  )

  const handleAddTeams = () => {
    console.log("Adding teams:", selectedTeamIds)
    setShowAddTeamDialog(false)
    setSelectedTeamIds([])
    setTeamSearchTerm("")
  }

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeamIds(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    )
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "league": return "League"
      case "cup": return "Cup"
      case "tournament": return "Tournament"
      default: return type
    }
  }

  if (showEditForm) {
    return (
      <CompetitionForm
        initialData={{
          name: competition.name,
          acronym: competition.acronym,
          description: competition.description,
          type: competition.type,
          logoUrl: competition.logoUrl,
          cardImageUrl: competition.cardImageUrl,
          bannerImageUrl: competition.bannerImageUrl,
          originDate: competition.originDate ? new Date(competition.originDate) : undefined,
          country: competition.country,
          enabled: competition.enabled
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
          onClick={() => navigate("/competitions")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Competitions
        </Button>
      </div>

      {/* Banner */}
      {competition.bannerImageUrl && (
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
          <img
            src={competition.bannerImageUrl}
            alt={competition.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Competition Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          {competition.logoUrl ? (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={competition.logoUrl} alt={competition.name} />
              <AvatarFallback className="text-2xl">{competition.acronym}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarFallback className="text-2xl"><Trophy className="h-12 w-12" /></AvatarFallback>
            </Avatar>
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{competition.name}</h1>
              <Badge variant="outline" className="text-base px-3 py-1">
                {competition.acronym}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {getTypeLabel(competition.type)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                {competition.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-2xl">{competition.description}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {competition.country && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{competition.country}</span>
                </div>
              )}
              {competition.originDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Founded: {new Date(competition.originDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{teams.length} Teams</span>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditForm(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Competition
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="pb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teams">Teams ({teams.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competition Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base">{competition.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Acronym</p>
                  <p className="text-base">{competition.acronym}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-base">{getTypeLabel(competition.type)}</p>
                </div>
                {competition.country && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Country/Region</p>
                    <p className="text-base">{competition.country}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-base">{competition.description}</p>
                </div>
                {competition.originDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">First Edition</p>
                    <p className="text-base">{new Date(competition.originDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border mt-1">
                    {competition.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {competition.logoUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Logo</p>
                    <img
                      src={competition.logoUrl}
                      alt="Logo"
                      className="h-32 w-32 object-contain border rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setLightboxImage(competition.logoUrl!)}
                    />
                  </div>
                )}
                {competition.cardImageUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Card Image</p>
                    <img
                      src={competition.cardImageUrl}
                      alt="Card"
                      className="h-48 w-auto object-contain border rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setLightboxImage(competition.cardImageUrl!)}
                    />
                  </div>
                )}
                {competition.bannerImageUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Banner Image</p>
                    <img
                      src={competition.bannerImageUrl}
                      alt="Banner"
                      className="h-32 w-full object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setLightboxImage(competition.bannerImageUrl!)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Participating Teams</CardTitle>
              <Button size="sm" onClick={() => setShowAddTeamDialog(true)}>
                <Users className="h-4 w-4 mr-2" />
                Add Team
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Logo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Acronym</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        {team.logoUrl ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={team.logoUrl} alt={team.name} />
                            <AvatarFallback>{team.acronym}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{team.acronym}</AvatarFallback>
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{team.acronym}</Badge>
                      </TableCell>
                      <TableCell>{team.city || "-"}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                          {team.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionDropdown
                          onView={() => navigate(`/teams/${team.id}`)}
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

      {/* Add Team Dialog */}
      <Dialog open={showAddTeamDialog} onOpenChange={setShowAddTeamDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Teams to Competition</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams by name or city..."
                value={teamSearchTerm}
                onChange={(e) => setTeamSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredAvailableTeams.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No teams found
                  </p>
                ) : (
                  filteredAvailableTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => toggleTeamSelection(team.id)}
                    >
                      <Checkbox
                        checked={selectedTeamIds.includes(team.id)}
                        onCheckedChange={() => toggleTeamSelection(team.id)}
                      />
                      {team.logoUrl ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={team.logoUrl} alt={team.name} />
                          <AvatarFallback>{team.acronym}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{team.acronym}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">{team.city}, {team.country}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                        {team.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddTeamDialog(false)
              setSelectedTeamIds([])
              setTeamSearchTerm("")
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddTeams}
              disabled={selectedTeamIds.length === 0}
            >
              Add {selectedTeamIds.length > 0 && `(${selectedTeamIds.length})`} Team{selectedTeamIds.length !== 1 ? 's' : ''}
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
