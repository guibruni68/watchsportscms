import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ArrowLeft, Calendar, Trophy, Users, X, Search, MapPin, Plus, ChevronRight, Info, ImageIcon } from "lucide-react"
import { CompetitionForm } from "@/components/forms/CompetitionForm"
import { SeasonForm } from "@/components/forms/SeasonForm"
import { ManageSquadDialog } from "@/components/dialogs/ManageSquadDialog"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { cn } from "@/lib/utils"

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
  squadCount?: number
}

interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "upcoming" | "active" | "completed"
  teamsCount: number
  teams: Team[]
}

const mockCompetition: Competition = {
  id: "1",
  name: "A League Basketball",
  acronym: "ALB",
  description: "Principal liga de basquete profissional da região sul do Brasil. Uma competição que reúne os melhores times e jogadores, promovendo o esporte e desenvolvendo novos talentos para o cenário nacional.",
  type: "league",
  logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20A%20League.png",
  cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20A%20League.png",
  bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20A%20League.png",
  originDate: "2015-03-15",
  country: "Brazil",
  teamsCount: 12,
  createdAt: "2024-01-01T00:00:00",
  updatedAt: "2024-01-15T00:00:00",
  enabled: true
}

const mockParticipatingTeams: Team[] = [
  {
    id: "1",
    name: "Basement Basketball",
    acronym: "BSM",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
    city: "Curitiba",
    country: "Brazil",
    enabled: true
  },
  {
    id: "2",
    name: "Big City Thunder",
    acronym: "BCT",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
    city: "São Paulo",
    country: "Brazil",
    enabled: true
  },
  {
    id: "3",
    name: "Watch Thunders",
    acronym: "WTH",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png",
    city: "Rio de Janeiro",
    country: "Brazil",
    enabled: true
  },
]

const mockAvailableTeams: Team[] = [
  {
    id: "4",
    name: "Nova Thunder",
    acronym: "NTH",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-novathunder.png",
    city: "Belo Horizonte",
    country: "Brazil",
    enabled: true
  },
  {
    id: "5",
    name: "Red Rock Stars",
    acronym: "RRS",
    city: "Porto Alegre",
    country: "Brazil",
    enabled: true
  },
]

const mockSeasons: Season[] = [
  {
    id: "1",
    name: "Season 2024/2025",
    startDate: "2024-09-01",
    endDate: "2025-05-31",
    status: "active",
    teamsCount: 3,
    teams: [
      {
        id: "1",
        name: "Basement Basketball",
        acronym: "BSM",
        logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
        city: "Curitiba",
        country: "Brazil",
        enabled: true,
        squadCount: 15
      },
      {
        id: "2",
        name: "Big City Thunder",
        acronym: "BCT",
        logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
        city: "São Paulo",
        country: "Brazil",
        enabled: true,
        squadCount: 12
      },
      {
        id: "3",
        name: "Watch Thunders",
        acronym: "WTH",
        logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png",
        city: "Rio de Janeiro",
        country: "Brazil",
        enabled: true,
        squadCount: 14
      },
    ]
  },
  {
    id: "2",
    name: "Season 2023/2024",
    startDate: "2023-09-01",
    endDate: "2024-05-31",
    status: "completed",
    teamsCount: 2,
    teams: [
      {
        id: "1",
        name: "Basement Basketball",
        acronym: "BSM",
        logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
        city: "Curitiba",
        country: "Brazil",
        enabled: true,
        squadCount: 12
      },
      {
        id: "2",
        name: "Big City Thunder",
        acronym: "BCT",
        logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
        city: "São Paulo",
        country: "Brazil",
        enabled: true,
        squadCount: 11
      },
    ]
  },
  {
    id: "3",
    name: "Season 2022/2023",
    startDate: "2022-09-01",
    endDate: "2023-05-31",
    status: "completed",
    teamsCount: 1,
    teams: [
      {
        id: "1",
        name: "Basement Basketball",
        acronym: "BSM",
        logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
        city: "Curitiba",
        country: "Brazil",
        enabled: true,
        squadCount: 10
      },
    ]
  },
]

type TabType = "overview" | "seasons" | "teams" | "media"

export default function CompetitionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [competition] = useState<Competition>(mockCompetition)
  const [teams] = useState<Team[]>(mockParticipatingTeams)
  const [seasons] = useState<Season[]>(mockSeasons)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showSeasonForm, setShowSeasonForm] = useState(false)
  const [editingSeason, setEditingSeason] = useState<Season | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Add Team Dialog state
  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false)
  const [teamSearchTerm, setTeamSearchTerm] = useState("")
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([])

  // Seasons collapsible state
  const [expandedSeasons, setExpandedSeasons] = useState<string[]>([])

  // Manage Squad Dialog state
  const [showSquadDialog, setShowSquadDialog] = useState(false)
  const [selectedTeamForSquad, setSelectedTeamForSquad] = useState<Team | null>(null)
  const [selectedSeasonForSquad, setSelectedSeasonForSquad] = useState<Season | null>(null)

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

  const handleNewSeason = () => {
    setEditingSeason(null)
    setShowSeasonForm(true)
  }

  const handleEditSeason = (season: Season) => {
    setEditingSeason(season)
    setShowSeasonForm(true)
  }

  const handleCloseSeasonForm = () => {
    setShowSeasonForm(false)
    setEditingSeason(null)
  }

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeamIds(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    )
  }

  const toggleSeasonExpanded = (seasonId: string) => {
    setExpandedSeasons(prev =>
      prev.includes(seasonId)
        ? prev.filter(id => id !== seasonId)
        : [...prev, seasonId]
    )
  }

  const handleManageSquad = (team: Team, season: Season) => {
    setSelectedTeamForSquad(team)
    setSelectedSeasonForSquad(season)
    setShowSquadDialog(true)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "league": return "League"
      case "cup": return "Cup"
      case "tournament": return "Tournament"
      default: return type
    }
  }

  const getSeasonStatusVariant = (status: Season["status"]): "success" | "info" | "outline" => {
    switch (status) {
      case "active":
        return "success"
      case "upcoming":
        return "info"
      case "completed":
      default:
        return "outline"
    }
  }

  // Format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
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

  if (showSeasonForm) {
    return (
      <SeasonForm
        competitionId={id || "1"}
        competitionName={competition.name}
        initialData={editingSeason ? {
          name: editingSeason.name,
          startDate: new Date(editingSeason.startDate),
          endDate: new Date(editingSeason.endDate),
          status: editingSeason.status
        } : undefined}
        isEdit={!!editingSeason}
        onClose={handleCloseSeasonForm}
      />
    )
  }

  const tabs: { id: TabType; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "seasons", label: "Seasons", icon: Calendar, count: seasons.length },
    { id: "teams", label: "Teams", icon: Users, count: teams.length },
    { id: "media", label: "Media", icon: ImageIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/competitions")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Competitions
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
        {/* Top banner bar - 128px height */}
        <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />

        {/* Header Content */}
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            {/* Left Section: Logo + Info */}
            <div className="flex flex-col">
              {/* Competition Logo - circular */}
              <div className="w-[116px] h-[116px] rounded-full bg-white overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {competition.logoUrl ? (
                  <img
                    src={competition.logoUrl}
                    alt={competition.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Trophy className="h-12 w-12 text-gray-400" />
                )}
              </div>

              {/* Competition Info */}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">
                  {competition.name}
                </h1>
                <Badge variant="neutral">
                  {competition.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {competition.acronym} • {getTypeLabel(competition.type)}
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
              {tab.count !== undefined && ` (${tab.count})`}
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
                    {competition.description || "No description available."}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Full Name</h3>
                  <p className="text-sm text-white/80">{competition.name}</p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Acronym</h3>
                  <p className="text-sm text-white/80">{competition.acronym}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-64 space-y-8">
                {competition.country && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Country</h3>
                    <p className="text-sm text-white/80">{competition.country}</p>
                  </div>
                )}

                {competition.originDate && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Founded</h3>
                    <p className="text-sm text-white/80">{formatDate(competition.originDate)}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Type</h3>
                  <p className="text-sm text-white/80">{getTypeLabel(competition.type)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "seasons" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <div className="p-6 flex items-center justify-between border-b border-[#1f1f1f]">
            <h3 className="text-lg font-semibold text-white">Seasons</h3>
            <Button
              size="sm"
              onClick={handleNewSeason}
              className="bg-primary hover:bg-primary/80 text-white rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Season
            </Button>
          </div>
          <div className="p-6">
            {seasons.length === 0 ? (
              <div className="p-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No seasons registered yet.</p>
                <Button onClick={handleNewSeason} className="bg-primary hover:bg-primary/80">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Season
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {seasons.map((season) => (
                  <Collapsible
                    key={season.id}
                    open={expandedSeasons.includes(season.id)}
                    onOpenChange={() => toggleSeasonExpanded(season.id)}
                  >
                    <div className="bg-muted rounded-md">
                      <div className="flex items-center gap-3 px-3 py-4">
                        <CollapsibleTrigger asChild>
                          <button className="p-1 rounded hover:bg-accent transition-colors">
                            <ChevronRight className={cn(
                              "h-5 w-5 text-muted-foreground transition-transform duration-200",
                              expandedSeasons.includes(season.id) && "rotate-90"
                            )} />
                          </button>
                        </CollapsibleTrigger>
                        <span className="font-medium text-white min-w-[180px]">{season.name}</span>
                        <span className="text-sm text-muted-foreground min-w-[100px]">{formatDate(season.startDate)}</span>
                        <span className="text-sm text-muted-foreground min-w-[100px]">{formatDate(season.endDate)}</span>
                        <span className="text-sm text-muted-foreground min-w-[80px]">{season.teams.length} teams</span>
                        <Badge variant={getSeasonStatusVariant(season.status)} className="capitalize min-w-[80px] justify-center">
                          {season.status}
                        </Badge>
                        <div className="flex-1" />
                        <ActionDropdown
                          onView={() => navigate(`/competitions/${competition.id}/seasons/${season.id}`)}
                          onEdit={() => handleEditSeason(season)}
                          onDelete={() => {}}
                        />
                      </div>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-0">
                          <div className="border-t border-[#1f1f1f] pt-4">
                            {season.teams.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-2">No teams in this season.</p>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Participating Teams</p>
                                <div className="space-y-2">
                                  {season.teams.map((team) => (
                                    <div
                                      key={team.id}
                                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#1f1f1f]/50 transition-colors"
                                    >
                                      <div className="w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                                        {team.logoUrl ? (
                                          <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                          <span className="text-xs font-bold text-gray-400">{team.acronym}</span>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <span className="text-sm text-white">{team.name}</span>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleManageSquad(team, season)}
                                        className="h-7 px-2 text-xs border-[#1f1f1f]"
                                      >
                                        Manage Squad
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === "teams" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <div className="p-6 flex items-center justify-between border-b border-[#1f1f1f]">
            <h3 className="text-lg font-semibold text-white">Participating Teams</h3>
            <Button
              size="sm"
              onClick={() => setShowAddTeamDialog(true)}
              className="bg-primary hover:bg-primary/80 text-white rounded-lg"
            >
              <Users className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </div>
          <div className="p-0">
            {teams.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No teams added yet.</p>
                <Button
                  onClick={() => setShowAddTeamDialog(true)}
                  className="bg-primary hover:bg-primary/80"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add First Team
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#1f1f1f] hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Logo</TableHead>
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Acronym</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id} className="border-[#1f1f1f]">
                      <TableCell>
                        <div className="w-10 h-10 rounded-lg bg-white overflow-hidden flex items-center justify-center">
                          {team.logoUrl ? (
                            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-gray-400">{team.acronym}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">{team.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{team.acronym}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="neutral">
                          {team.enabled ? "Enabled" : "Disabled"}
                        </Badge>
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
            )}
          </div>
        </Card>
      )}

      {activeTab === "media" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <h3 className="text-lg font-semibold text-white">Media Assets</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo */}
              {competition.logoUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Logo</p>
                  <div
                    className="aspect-square rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center p-6"
                    onClick={() => setLightboxImage(competition.logoUrl!)}
                  >
                    <img
                      src={competition.logoUrl}
                      alt="Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Card Image */}
              {competition.cardImageUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Card Image</p>
                  <div
                    className="aspect-square rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxImage(competition.cardImageUrl!)}
                  >
                    <img
                      src={competition.cardImageUrl}
                      alt="Card"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Banner Image */}
              {competition.bannerImageUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Banner Image</p>
                  <div
                    className="aspect-square rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxImage(competition.bannerImageUrl!)}
                  >
                    <img
                      src={competition.bannerImageUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {!competition.logoUrl && !competition.cardImageUrl && !competition.bannerImageUrl && (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No media assets uploaded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Team Dialog */}
      <Dialog open={showAddTeamDialog} onOpenChange={setShowAddTeamDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-[#0d0d0d] border-[#1f1f1f]">
          <DialogHeader>
            <DialogTitle className="text-white">Add Teams to Competition</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams by name or city..."
                value={teamSearchTerm}
                onChange={(e) => setTeamSearchTerm(e.target.value)}
                className="pl-9 bg-[#090909] border-[#1f1f1f]"
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
                      className="flex items-center space-x-3 p-3 rounded-lg border border-[#1f1f1f] hover:bg-[#1f1f1f]/50 cursor-pointer"
                      onClick={() => toggleTeamSelection(team.id)}
                    >
                      <Checkbox
                        checked={selectedTeamIds.includes(team.id)}
                        onCheckedChange={() => toggleTeamSelection(team.id)}
                      />
                      <div className="w-10 h-10 rounded-lg bg-white overflow-hidden flex items-center justify-center">
                        {team.logoUrl ? (
                          <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-gray-400">{team.acronym}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{team.name}</p>
                        <p className="text-sm text-muted-foreground">{team.city}, {team.country}</p>
                      </div>
                      <Badge variant="neutral">
                        {team.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddTeamDialog(false)
                setSelectedTeamIds([])
                setTeamSearchTerm("")
              }}
              className="border-[#1f1f1f]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTeams}
              disabled={selectedTeamIds.length === 0}
              className="bg-primary hover:bg-primary/80"
            >
              Add {selectedTeamIds.length > 0 && `(${selectedTeamIds.length})`} Team{selectedTeamIds.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Manage Squad Dialog */}
      {selectedTeamForSquad && selectedSeasonForSquad && (
        <ManageSquadDialog
          open={showSquadDialog}
          onOpenChange={setShowSquadDialog}
          team={{
            ...selectedTeamForSquad,
            squadCount: selectedTeamForSquad.squadCount || 0
          }}
          seasonId={selectedSeasonForSquad.id}
          seasonName={selectedSeasonForSquad.name}
        />
      )}
    </div>
  )
}
