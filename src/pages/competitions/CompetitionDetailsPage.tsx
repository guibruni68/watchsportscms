import { useState } from "react"
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
import { ArrowLeft, Calendar, Trophy, Users, X, Search, MapPin, Plus, Globe } from "lucide-react"
import { CompetitionForm } from "@/components/forms/CompetitionForm"
import { SeasonForm } from "@/components/forms/SeasonForm"
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
}

interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "upcoming" | "active" | "completed"
  teamsCount: number
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
    teamsCount: 12
  },
  {
    id: "2",
    name: "Season 2023/2024",
    startDate: "2023-09-01",
    endDate: "2024-05-31",
    status: "completed",
    teamsCount: 12
  },
  {
    id: "3",
    name: "Season 2022/2023",
    startDate: "2022-09-01",
    endDate: "2023-05-31",
    status: "completed",
    teamsCount: 10
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "league": return "League"
      case "cup": return "Cup"
      case "tournament": return "Tournament"
      default: return type
    }
  }

  const getSeasonStatusStyle = (status: Season["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground border-border"
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

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "seasons", label: "Seasons", count: seasons.length },
    { id: "teams", label: "Teams", count: teams.length },
    { id: "media", label: "Media" }
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                  {competition.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {competition.acronym} • {getTypeLabel(competition.type)}
              </p>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setShowEditForm(true)}
              className="bg-[#153A8A] hover:bg-[#1a4aa8] text-white rounded-[10px] px-6 h-10 mt-16"
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
              {tab.count !== undefined && ` (${tab.count})`}
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
          <CardContent className="px-12 pt-12 pb-16">
            <div className="flex justify-between gap-[140px]">
              {/* Left Column - Description & Details */}
              <div className="flex-1 space-y-4">
                {/* Description */}
                <div className="space-y-0">
                  <p className="text-sm text-[#999999] leading-5">Description</p>
                  <p className="text-base text-white leading-6 max-w-[603px]">
                    {competition.description || "No description available."}
                  </p>
                </div>

                {/* Full Name */}
                <div className="space-y-0 pt-4">
                  <p className="text-sm text-[#999999] leading-5">Full Name</p>
                  <p className="text-base text-white leading-6">{competition.name}</p>
                </div>

                {/* Acronym */}
                <div className="space-y-0">
                  <p className="text-sm text-[#999999] leading-5">Acronym</p>
                  <p className="text-base text-white leading-6">{competition.acronym}</p>
                </div>
              </div>

              {/* Right Column - Info Cards */}
              <div className="w-[189px] space-y-6">
                {/* Country */}
                {competition.country && (
                  <div className="flex items-center gap-[13px]">
                    <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#262626] flex items-center justify-center flex-shrink-0">
                      <Globe className="h-[18px] w-[18px] text-white/50" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-white leading-[14px]">{competition.country}</p>
                      <p className="text-xs text-white/50 leading-[18px]">Country</p>
                    </div>
                  </div>
                )}

                {/* Founded */}
                {competition.originDate && (
                  <div className="flex items-center gap-[10px]">
                    <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#262626] flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-[18px] w-[18px] text-white/50" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-white leading-[14px]">Founded</p>
                      <p className="text-xs text-white/50 leading-[18px]">{formatDate(competition.originDate)}</p>
                    </div>
                  </div>
                )}

                {/* Type */}
                <div className="flex items-center gap-[10px]">
                  <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#262626] flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-[18px] w-[18px] text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-white leading-[14px]">Type</p>
                    <p className="text-xs text-white/50 leading-[18px]">{getTypeLabel(competition.type)}</p>
                  </div>
                </div>

                {/* Teams Count */}
                <div className="flex items-center gap-[10px]">
                  <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#262626] flex items-center justify-center flex-shrink-0">
                    <Users className="h-[18px] w-[18px] text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-white leading-[14px]">Teams</p>
                    <p className="text-xs text-white/50 leading-[18px]">{teams.length} participating</p>
                  </div>
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
              className="bg-[#153A8A] hover:bg-[#1a4aa8] text-white rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Season
            </Button>
          </div>
          <div className="p-0">
            {seasons.length === 0 ? (
              <div className="p-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No seasons registered yet.</p>
                <Button onClick={handleNewSeason} className="bg-[#153A8A] hover:bg-[#1a4aa8]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Season
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#1f1f1f] hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Start Date</TableHead>
                    <TableHead className="text-muted-foreground">End Date</TableHead>
                    <TableHead className="text-muted-foreground">Teams</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seasons.map((season) => (
                    <TableRow key={season.id} className="border-[#1f1f1f]">
                      <TableCell className="font-medium text-white">{season.name}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(season.startDate)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(season.endDate)}</TableCell>
                      <TableCell className="text-muted-foreground">{season.teamsCount}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium border capitalize",
                          getSeasonStatusStyle(season.status)
                        )}>
                          {season.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionDropdown
                          onView={() => navigate(`/competitions/${competition.id}/seasons/${season.id}`)}
                          onEdit={() => handleEditSeason(season)}
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

      {activeTab === "teams" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <div className="p-6 flex items-center justify-between border-b border-[#1f1f1f]">
            <h3 className="text-lg font-semibold text-white">Participating Teams</h3>
            <Button
              size="sm"
              onClick={() => setShowAddTeamDialog(true)}
              className="bg-[#153A8A] hover:bg-[#1a4aa8] text-white rounded-lg"
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
                  className="bg-[#153A8A] hover:bg-[#1a4aa8]"
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
              className="bg-[#153A8A] hover:bg-[#1a4aa8]"
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
    </div>
  )
}
