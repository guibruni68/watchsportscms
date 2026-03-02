import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trophy, Users, Search, Plus, Calendar, MapPin, ChevronDown, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Info, CalendarDays } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SeasonForm } from "@/components/forms/SeasonForm"
import { GameForm } from "@/components/forms/GameForm"
import { ManageSquadDialog } from "@/components/dialogs/ManageSquadDialog"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Season {
  id: string
  name: string
  competitionId: string
  competitionName: string
  startDate: string
  endDate: string
  status: "upcoming" | "active" | "completed"
}

interface Team {
  id: string
  name: string
  acronym: string
  logoUrl?: string
  city?: string
  country?: string
  squadCount: number
}

interface Game {
  id: string
  round: number
  homeTeam: {
    id: string
    name: string
    acronym: string
    logoUrl?: string
  }
  awayTeam: {
    id: string
    name: string
    acronym: string
    logoUrl?: string
  }
  dateTime: string
  venue: string
  venueId: string
  refereeId?: string
  refereeName?: string
  status: "scheduled" | "finished"
  homeScore?: number
  awayScore?: number
}

interface Stadium {
  id: string
  name: string
  city: string
}

interface Referee {
  id: string
  name: string
}

const mockSeason: Season = {
  id: "1",
  name: "Temporada 2024/2025",
  competitionId: "1",
  competitionName: "A League Basketball",
  startDate: "2024-09-01",
  endDate: "2025-05-31",
  status: "active"
}

const mockSeasonTeams: Team[] = [
  {
    id: "1",
    name: "Basement Basketball",
    acronym: "BSM",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
    city: "Curitiba",
    country: "Brazil",
    squadCount: 15
  },
  {
    id: "2",
    name: "Big City Thunder",
    acronym: "BCT",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
    city: "São Paulo",
    country: "Brazil",
    squadCount: 12
  },
  {
    id: "3",
    name: "Watch Thunders",
    acronym: "WTH",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png",
    city: "Rio de Janeiro",
    country: "Brazil",
    squadCount: 10
  },
  {
    id: "4",
    name: "Nova Thunder",
    acronym: "NTH",
    city: "Belo Horizonte",
    country: "Brazil",
    squadCount: 11
  },
]

const mockAvailableTeams: Team[] = [
  {
    id: "5",
    name: "Red Stars",
    acronym: "RST",
    city: "Porto Alegre",
    country: "Brazil",
    squadCount: 0
  },
  {
    id: "6",
    name: "Golden Eagles",
    acronym: "GEA",
    city: "Salvador",
    country: "Brazil",
    squadCount: 0
  },
]

const mockStadiums: Stadium[] = [
  { id: "1", name: "Arena Curitiba", city: "Curitiba" },
  { id: "2", name: "Ginásio do Ibirapuera", city: "São Paulo" },
  { id: "3", name: "Maracanãzinho", city: "Rio de Janeiro" },
  { id: "4", name: "Arena BH", city: "Belo Horizonte" },
  { id: "5", name: "Arena do Grêmio", city: "Porto Alegre" },
]

const mockReferees: Referee[] = [
  { id: "1", name: "Carlos Silva" },
  { id: "2", name: "Maria Santos" },
  { id: "3", name: "João Oliveira" },
  { id: "4", name: "Ana Costa" },
]

const mockGames: Game[] = [
  // Round 1
  {
    id: "g1",
    round: 1,
    homeTeam: { id: "1", name: "Basement Basketball", acronym: "BSM", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png" },
    awayTeam: { id: "2", name: "Big City Thunder", acronym: "BCT", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png" },
    dateTime: "2024-09-15T19:00:00",
    venue: "Arena Curitiba",
    venueId: "1",
    refereeId: "1",
    refereeName: "Carlos Silva",
    status: "finished",
    homeScore: 98,
    awayScore: 92
  },
  {
    id: "g2",
    round: 1,
    homeTeam: { id: "3", name: "Watch Thunders", acronym: "WTH", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png" },
    awayTeam: { id: "4", name: "Nova Thunder", acronym: "NTH" },
    dateTime: "2024-09-15T21:00:00",
    venue: "Maracanãzinho",
    venueId: "3",
    refereeId: "2",
    refereeName: "Maria Santos",
    status: "finished",
    homeScore: 85,
    awayScore: 88
  },
  // Round 2
  {
    id: "g3",
    round: 2,
    homeTeam: { id: "2", name: "Big City Thunder", acronym: "BCT", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png" },
    awayTeam: { id: "3", name: "Watch Thunders", acronym: "WTH", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png" },
    dateTime: "2024-09-22T19:00:00",
    venue: "Ginásio do Ibirapuera",
    venueId: "2",
    status: "finished",
    homeScore: 101,
    awayScore: 95
  },
  {
    id: "g4",
    round: 2,
    homeTeam: { id: "4", name: "Nova Thunder", acronym: "NTH" },
    awayTeam: { id: "1", name: "Basement Basketball", acronym: "BSM", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png" },
    dateTime: "2024-09-22T21:00:00",
    venue: "Arena BH",
    venueId: "4",
    status: "finished",
    homeScore: 78,
    awayScore: 82
  },
  // Round 3
  {
    id: "g5",
    round: 3,
    homeTeam: { id: "1", name: "Basement Basketball", acronym: "BSM", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png" },
    awayTeam: { id: "3", name: "Watch Thunders", acronym: "WTH", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png" },
    dateTime: "2024-09-29T19:00:00",
    venue: "Arena Curitiba",
    venueId: "1",
    status: "scheduled"
  },
  {
    id: "g6",
    round: 3,
    homeTeam: { id: "2", name: "Big City Thunder", acronym: "BCT", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png" },
    awayTeam: { id: "4", name: "Nova Thunder", acronym: "NTH" },
    dateTime: "2024-09-29T21:00:00",
    venue: "Ginásio do Ibirapuera",
    venueId: "2",
    status: "scheduled"
  },
  // Round 4
  {
    id: "g7",
    round: 4,
    homeTeam: { id: "3", name: "Watch Thunders", acronym: "WTH", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png" },
    awayTeam: { id: "1", name: "Basement Basketball", acronym: "BSM", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png" },
    dateTime: "2024-10-06T19:00:00",
    venue: "Maracanãzinho",
    venueId: "3",
    status: "scheduled"
  },
  {
    id: "g8",
    round: 4,
    homeTeam: { id: "4", name: "Nova Thunder", acronym: "NTH" },
    awayTeam: { id: "2", name: "Big City Thunder", acronym: "BCT", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png" },
    dateTime: "2024-10-06T21:00:00",
    venue: "Arena BH",
    venueId: "4",
    status: "scheduled"
  },
  // Round 5
  {
    id: "g9",
    round: 5,
    homeTeam: { id: "1", name: "Basement Basketball", acronym: "BSM", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png" },
    awayTeam: { id: "4", name: "Nova Thunder", acronym: "NTH" },
    dateTime: "2024-10-13T19:00:00",
    venue: "Arena Curitiba",
    venueId: "1",
    status: "scheduled"
  },
  {
    id: "g10",
    round: 5,
    homeTeam: { id: "3", name: "Watch Thunders", acronym: "WTH", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png" },
    awayTeam: { id: "2", name: "Big City Thunder", acronym: "BCT", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png" },
    dateTime: "2024-10-13T21:00:00",
    venue: "Maracanãzinho",
    venueId: "3",
    status: "scheduled"
  },
  // Round 6
  {
    id: "g11",
    round: 6,
    homeTeam: { id: "2", name: "Big City Thunder", acronym: "BCT", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png" },
    awayTeam: { id: "1", name: "Basement Basketball", acronym: "BSM", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png" },
    dateTime: "2024-10-20T19:00:00",
    venue: "Ginásio do Ibirapuera",
    venueId: "2",
    status: "scheduled"
  },
  {
    id: "g12",
    round: 6,
    homeTeam: { id: "4", name: "Nova Thunder", acronym: "NTH" },
    awayTeam: { id: "3", name: "Watch Thunders", acronym: "WTH", logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png" },
    dateTime: "2024-10-20T21:00:00",
    venue: "Arena BH",
    venueId: "4",
    status: "scheduled"
  },
]

type TabType = "overview" | "teams" | "games"

export default function SeasonDetailsPage() {
  const { competitionId, seasonId, id } = useParams<{ competitionId?: string; seasonId?: string; id?: string }>()
  const effectiveSeasonId = seasonId || id
  const navigate = useNavigate()
  const { toast } = useToast()
  const [season] = useState<Season>(mockSeason)
  const [teams, setTeams] = useState<Team[]>(mockSeasonTeams)
  const [games, setGames] = useState<Game[]>(mockGames)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [expandedRounds, setExpandedRounds] = useState<number[]>([3])

  // Rounds pagination
  const ROUNDS_PER_PAGE = 5
  const [currentRoundPage, setCurrentRoundPage] = useState(1)
  const [selectedRoundFilter, setSelectedRoundFilter] = useState<string>("all")

  // Game form state
  const [showGameForm, setShowGameForm] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)

  // Determine back navigation path
  const getBackPath = () => {
    if (competitionId) {
      return `/competitions/${competitionId}`
    }
    return "/seasons"
  }

  const getBackLabel = () => {
    if (competitionId) {
      return `Back to ${season.competitionName}`
    }
    return "Back to Seasons"
  }

  // Add Team Dialog state
  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false)
  const [teamSearchTerm, setTeamSearchTerm] = useState("")
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([])

  // Manage Squad Dialog state
  const [showSquadDialog, setShowSquadDialog] = useState(false)
  const [selectedTeamForSquad, setSelectedTeamForSquad] = useState<Team | null>(null)

  // Filter available teams based on search
  const filteredAvailableTeams = mockAvailableTeams.filter(team =>
    team.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
    team.acronym.toLowerCase().includes(teamSearchTerm.toLowerCase())
  )

  const handleAddTeams = () => {
    const newTeams = mockAvailableTeams.filter(t => selectedTeamIds.includes(t.id))
    setTeams([...teams, ...newTeams])
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

  const handleManageSquad = (team: Team) => {
    setSelectedTeamForSquad(team)
    setShowSquadDialog(true)
  }

  const handleRemoveTeam = (teamId: string) => {
    setTeams(teams.filter(t => t.id !== teamId))
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatGameDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  // Group games by round
  const gamesByRound = games.reduce((acc, game) => {
    if (!acc[game.round]) {
      acc[game.round] = []
    }
    acc[game.round].push(game)
    return acc
  }, {} as Record<number, Game[]>)

  const allRounds = Object.keys(gamesByRound).map(Number).sort((a, b) => a - b)
  const totalRounds = allRounds.length > 0 ? Math.max(...allRounds) : 0

  // Filter and paginate rounds
  const filteredRounds = selectedRoundFilter === "all"
    ? allRounds
    : allRounds.filter(r => r === parseInt(selectedRoundFilter))

  const totalRoundPages = Math.ceil(filteredRounds.length / ROUNDS_PER_PAGE)
  const paginatedRounds = filteredRounds.slice(
    (currentRoundPage - 1) * ROUNDS_PER_PAGE,
    currentRoundPage * ROUNDS_PER_PAGE
  )

  const toggleRound = (round: number) => {
    setExpandedRounds(prev =>
      prev.includes(round)
        ? prev.filter(r => r !== round)
        : [...prev, round]
    )
  }

  // Game form handlers
  const handleNewGame = () => {
    setEditingGame(null)
    setShowGameForm(true)
  }

  const handleEditGame = (game: Game) => {
    setEditingGame(game)
    setShowGameForm(true)
  }

  const handleDeleteGame = (gameId: string) => {
    setGames(games.filter(g => g.id !== gameId))
    toast({
      title: "Match deleted",
      description: "The match was removed successfully.",
    })
  }

  const handleSaveGame = (data: {
    homeTeamId: string
    awayTeamId: string
    date: Date
    time: string
    stadiumId: string
    refereeId?: string
    round: number
  }) => {
    const homeTeam = teams.find(t => t.id === data.homeTeamId)
    const awayTeam = teams.find(t => t.id === data.awayTeamId)
    const stadium = mockStadiums.find(s => s.id === data.stadiumId)
    const referee = mockReferees.find(r => r.id === data.refereeId)

    if (!homeTeam || !awayTeam || !stadium) return

    const dateTime = new Date(data.date)
    const [hours, minutes] = data.time.split(':')
    dateTime.setHours(parseInt(hours), parseInt(minutes))

    if (editingGame) {
      // Update existing game
      setGames(games.map(g => g.id === editingGame.id ? {
        ...g,
        round: data.round,
        homeTeam: { id: homeTeam.id, name: homeTeam.name, acronym: homeTeam.acronym, logoUrl: homeTeam.logoUrl },
        awayTeam: { id: awayTeam.id, name: awayTeam.name, acronym: awayTeam.acronym, logoUrl: awayTeam.logoUrl },
        dateTime: dateTime.toISOString(),
        venue: stadium.name,
        venueId: stadium.id,
        refereeId: referee?.id,
        refereeName: referee?.name,
      } : g))
    } else {
      // Create new game
      const newGame: Game = {
        id: `g${Date.now()}`,
        round: data.round,
        homeTeam: { id: homeTeam.id, name: homeTeam.name, acronym: homeTeam.acronym, logoUrl: homeTeam.logoUrl },
        awayTeam: { id: awayTeam.id, name: awayTeam.name, acronym: awayTeam.acronym, logoUrl: awayTeam.logoUrl },
        dateTime: dateTime.toISOString(),
        venue: stadium.name,
        venueId: stadium.id,
        refereeId: referee?.id,
        refereeName: referee?.name,
        status: "scheduled"
      }
      setGames([...games, newGame])
    }
  }

  if (showEditForm) {
    return (
      <SeasonForm
        competitionId={competitionId || season.competitionId}
        competitionName={season.competitionName}
        initialData={{
          name: season.name,
          competitionId: season.competitionId,
          startDate: new Date(season.startDate),
          endDate: new Date(season.endDate),
          status: season.status
        }}
        isEdit={true}
        onClose={() => setShowEditForm(false)}
      />
    )
  }

  // Prepare game form initial data
  const gameFormInitialData = editingGame ? {
    homeTeamId: editingGame.homeTeam.id,
    awayTeamId: editingGame.awayTeam.id,
    date: new Date(editingGame.dateTime),
    time: `${new Date(editingGame.dateTime).getHours().toString().padStart(2, '0')}:${new Date(editingGame.dateTime).getMinutes().toString().padStart(2, '0')}`,
    stadiumId: editingGame.venueId,
    refereeId: editingGame.refereeId,
    round: editingGame.round
  } : undefined

  const tabs: { id: TabType; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "teams", label: "Teams", icon: Users, count: teams.length },
    { id: "games", label: "Games", icon: CalendarDays, count: games.length }
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(getBackPath())}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        {getBackLabel()}
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="w-[116px] h-[116px] rounded-full bg-primary overflow-hidden flex items-center justify-center shadow-lg mb-4">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">
                  {season.name}
                </h1>
                <Badge variant={getSeasonStatusVariant(season.status)} className="capitalize">
                  {season.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {season.competitionName}
              </p>
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
                  <h3 className="text-base font-semibold text-white mb-4">Competition</h3>
                  <p className="text-sm text-white/80">{season.competitionName}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Season Name</h3>
                  <p className="text-sm text-white/80">{season.name}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Start Date</h3>
                  <p className="text-sm text-white/80">{formatDate(season.startDate)}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">End Date</h3>
                  <p className="text-sm text-white/80">{formatDate(season.endDate)}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Teams</h3>
                  <p className="text-sm text-white/80">{teams.length}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Total Rounds</h3>
                  <p className="text-sm text-white/80">{totalRounds}</p>
                </div>
              </div>
            </div>
          </CardContent>
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
              <Plus className="h-4 w-4 mr-2" />
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
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Team
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#1f1f1f] hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Logo</TableHead>
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">City</TableHead>
                    <TableHead className="text-muted-foreground">Squad</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id} className="border-[#1f1f1f]">
                      <TableCell>
                        <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center">
                          {team.logoUrl ? (
                            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-gray-400">{team.acronym}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">{team.name}</TableCell>
                      <TableCell className="text-muted-foreground">{team.city}, {team.country}</TableCell>
                      <TableCell className="text-muted-foreground">{team.squadCount} members</TableCell>
                      <TableCell className="text-right">
                        <ActionDropdown
                          onManageSquad={() => handleManageSquad(team)}
                          showManageSquad={true}
                          onDelete={() => handleRemoveTeam(team.id)}
                          showEdit={false}
                          showView={false}
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

      {activeTab === "games" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <div className="p-6 flex items-center justify-between border-b border-[#1f1f1f]">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-white">Season Matches</h3>
              {allRounds.length > ROUNDS_PER_PAGE && (
                <Select value={selectedRoundFilter} onValueChange={(value) => {
                  setSelectedRoundFilter(value)
                  setCurrentRoundPage(1)
                }}>
                  <SelectTrigger className="w-[140px] h-8 bg-[#171717] border-[#1f1f1f]">
                    <SelectValue placeholder="Filter by round" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rounds</SelectItem>
                    {allRounds.map(round => (
                      <SelectItem key={round} value={round.toString()}>
                        Round {round}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleNewGame}
              className="bg-primary hover:bg-primary/80 text-white rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Match
            </Button>
          </div>
          <div className="p-4 space-y-3">
            {games.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No matches scheduled yet.</p>
                <Button onClick={handleNewGame} className="bg-primary hover:bg-primary/80">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule First Match
                </Button>
              </div>
            ) : (
              <>
                {paginatedRounds.map((round) => {
                  const roundGames = gamesByRound[round]
                  const isExpanded = expandedRounds.includes(round)

                  return (
                    <Collapsible
                      key={round}
                      open={isExpanded}
                      onOpenChange={() => toggleRound(round)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center gap-3 p-4 bg-[#171717] rounded-lg border border-[#1f1f1f] cursor-pointer hover:border-[#2a2a2a] transition-colors">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium text-white">Round {round}</span>
                          <span className="text-sm text-muted-foreground">({roundGames.length} matches)</span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 pl-7">
                          {roundGames.map((game, index) => {
                            const { date, time } = formatGameDateTime(game.dateTime)
                            const isLastItem = index === roundGames.length - 1
                            return (
                              <div
                                key={game.id}
                                className={`flex items-center py-3 px-2 hover:bg-[#1a1a1a] transition-colors ${!isLastItem ? 'border-b border-[#1f1f1f]' : ''}`}
                              >
                                {/* Date/Time */}
                                <div className="flex items-center gap-2 min-w-[100px] text-sm text-muted-foreground">
                                  <span className="text-white">{date}</span>
                                  <span>{time}</span>
                                </div>

                                {/* Teams and Score */}
                                <div className="flex items-center justify-center flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-white">{game.homeTeam.name}</span>
                                    <div className="w-7 h-7 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
                                      {game.homeTeam.logoUrl ? (
                                        <img src={game.homeTeam.logoUrl} alt={game.homeTeam.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-[10px] font-bold text-gray-400">{game.homeTeam.acronym}</span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center mx-3 min-w-[60px]">
                                    {game.status === "finished" ? (
                                      <div className="flex items-center gap-1">
                                        <span className="text-base font-bold text-white">{game.homeScore}</span>
                                        <span className="text-xs text-muted-foreground">-</span>
                                        <span className="text-base font-bold text-white">{game.awayScore}</span>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">vs</span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
                                      {game.awayTeam.logoUrl ? (
                                        <img src={game.awayTeam.logoUrl} alt={game.awayTeam.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-[10px] font-bold text-gray-400">{game.awayTeam.acronym}</span>
                                      )}
                                    </div>
                                    <span className="text-sm font-medium text-white">{game.awayTeam.name}</span>
                                  </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-1.5 min-w-[140px] text-sm text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{game.venue}</span>
                                </div>

                                {/* Actions */}
                                <ActionDropdown
                                  onEdit={() => handleEditGame(game)}
                                  onDelete={() => handleDeleteGame(game.id)}
                                  showView={false}
                                />
                              </div>
                            )
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}

                {/* Rounds Pagination */}
                {totalRoundPages > 1 && selectedRoundFilter === "all" && (
                  <div className="flex items-center justify-between pt-4 border-t border-[#1f1f1f]">
                    <span className="text-sm text-muted-foreground">
                      Showing rounds {(currentRoundPage - 1) * ROUNDS_PER_PAGE + 1} - {Math.min(currentRoundPage * ROUNDS_PER_PAGE, filteredRounds.length)} of {filteredRounds.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-[#1f1f1f]"
                        onClick={() => setCurrentRoundPage(1)}
                        disabled={currentRoundPage === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-[#1f1f1f]"
                        onClick={() => setCurrentRoundPage(p => Math.max(1, p - 1))}
                        disabled={currentRoundPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="px-3 text-sm text-white">
                        {currentRoundPage} / {totalRoundPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-[#1f1f1f]"
                        onClick={() => setCurrentRoundPage(p => Math.min(totalRoundPages, p + 1))}
                        disabled={currentRoundPage === totalRoundPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-[#1f1f1f]"
                        onClick={() => setCurrentRoundPage(totalRoundPages)}
                        disabled={currentRoundPage === totalRoundPages}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}

      {/* Add Team Dialog */}
      <Dialog open={showAddTeamDialog} onOpenChange={setShowAddTeamDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-[#0d0d0d] border-[#1f1f1f]">
          <DialogHeader>
            <DialogTitle className="text-white">Add Teams to Season</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
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
                      <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center">
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

      {/* Manage Squad Dialog */}
      {selectedTeamForSquad && (
        <ManageSquadDialog
          open={showSquadDialog}
          onOpenChange={setShowSquadDialog}
          team={selectedTeamForSquad}
          seasonId={effectiveSeasonId || "1"}
          seasonName={season.name}
        />
      )}

      {/* Game Form Dialog */}
      <GameForm
        open={showGameForm}
        onOpenChange={(open) => {
          setShowGameForm(open)
          if (!open) setEditingGame(null)
        }}
        teams={teams.map(t => ({ id: t.id, name: t.name, acronym: t.acronym, logoUrl: t.logoUrl }))}
        stadiums={mockStadiums}
        referees={mockReferees}
        totalRounds={totalRounds}
        initialData={gameFormInitialData}
        isEdit={!!editingGame}
        onSave={handleSaveGame}
      />
    </div>
  )
}
