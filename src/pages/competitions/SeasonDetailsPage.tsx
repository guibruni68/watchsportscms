import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Trophy, Users, Search, Plus } from "lucide-react"
import { SeasonForm } from "@/components/forms/SeasonForm"
import { ManageSquadDialog } from "@/components/dialogs/ManageSquadDialog"
import { ActionDropdown } from "@/components/ui/action-dropdown"
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

interface Player {
  id: string
  name: string
  position?: string
  nationality: string
  imagePrimaryUrl?: string
}

interface Coach {
  id: string
  name: string
  role?: string
  nationality: string
  imagePrimaryUrl?: string
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
]

const mockAvailableTeams: Team[] = [
  {
    id: "3",
    name: "Watch Thunders",
    acronym: "WTH",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png",
    city: "Rio de Janeiro",
    country: "Brazil",
    squadCount: 0
  },
  {
    id: "4",
    name: "Nova Thunder",
    acronym: "NTH",
    city: "Belo Horizonte",
    country: "Brazil",
    squadCount: 0
  },
]

type TabType = "overview" | "teams"

export default function SeasonDetailsPage() {
  const { competitionId, seasonId } = useParams<{ competitionId: string; seasonId: string }>()
  const navigate = useNavigate()
  const [season] = useState<Season>(mockSeason)
  const [teams, setTeams] = useState<Team[]>(mockSeasonTeams)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("overview")

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

  const getStatusStyle = (status: Season["status"]) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (showEditForm) {
    return (
      <SeasonForm
        competitionId={competitionId || "1"}
        competitionName={season.competitionName}
        initialData={{
          name: season.name,
          startDate: new Date(season.startDate),
          endDate: new Date(season.endDate),
          status: season.status
        }}
        isEdit={true}
        onClose={() => setShowEditForm(false)}
      />
    )
  }

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "teams", label: "Teams", count: teams.length }
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/competitions/${competitionId}`)}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {season.competitionName}
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
        {/* Top banner bar */}
        <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />

        {/* Header Content */}
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            {/* Left Section: Icon + Info */}
            <div className="flex flex-col">
              {/* Season Icon */}
              <div className="w-[116px] h-[116px] rounded-full bg-[#153A8A] overflow-hidden flex items-center justify-center shadow-lg mb-4">
                <Trophy className="h-12 w-12 text-white" />
              </div>

              {/* Season Info */}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">
                  {season.name}
                </h1>
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium border capitalize",
                  getStatusStyle(season.status)
                )}>
                  {season.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {season.competitionName}
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

      {/* Tabs */}
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
            <div className="grid grid-cols-2 gap-x-[140px] gap-y-8">
              {/* Competition */}
              <div className="space-y-0">
                <p className="text-sm text-[#999999] leading-5">Competition</p>
                <p className="text-base text-white leading-6">{season.competitionName}</p>
              </div>

              {/* Season Name */}
              <div className="space-y-0">
                <p className="text-sm text-[#999999] leading-5">Season Name</p>
                <p className="text-base text-white leading-6">{season.name}</p>
              </div>

              {/* Start Date */}
              <div className="space-y-0">
                <p className="text-sm text-[#999999] leading-5">Start Date</p>
                <p className="text-base text-white leading-6">{formatDate(season.startDate)}</p>
              </div>

              {/* End Date */}
              <div className="space-y-0">
                <p className="text-sm text-[#999999] leading-5">End Date</p>
                <p className="text-base text-white leading-6">{formatDate(season.endDate)}</p>
              </div>

              {/* Teams */}
              <div className="space-y-0">
                <p className="text-sm text-[#999999] leading-5">Teams</p>
                <p className="text-base text-white leading-6">{teams.length}</p>
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
              className="bg-[#153A8A] hover:bg-[#1a4aa8] text-white rounded-lg"
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
                  className="bg-[#153A8A] hover:bg-[#1a4aa8]"
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
              className="bg-[#153A8A] hover:bg-[#1a4aa8]"
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
          seasonId={seasonId || "1"}
          seasonName={season.name}
        />
      )}
    </div>
  )
}
