import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, User, X, Search, MapPin, Calendar, Building2, Briefcase, Trophy, Info, Users, ImageIcon } from "lucide-react"
import { TeamForm } from "@/components/forms/TeamForm"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const teamTypeLabels: Record<string, string> = {
  futebol: "Futebol",
  futsal: "Futsal",
  futebol_feminino: "Futebol Feminino",
}

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
  presidentName?: string
  teamType?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
  skills?: string[]
  jobFunction?: string
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

// Mock data using real team from TeamsPage
const mockTeams: Record<string, Team> = {
  "1": {
    id: "1",
    name: "Basement Basketball",
    acronym: "BSM",
    description: "Time de basquete profissional com tradição e história. Uma equipe que representa a força e determinação dos jogadores que começaram nas quadras de bairro e chegaram ao profissionalismo através de muito trabalho e dedicação.",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
    originDate: "2010-05-15",
    city: "Curitiba",
    country: "Brazil",
    stadiumId: "1",
    stadiumName: "Arena Basement",
    presidentName: "João da Silva",
    teamType: "futebol",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true,
    skills: ["Basketball", "Professional", "Training", "Youth Development", "Community"],
    jobFunction: "Sports"
  },
  "2": {
    id: "2",
    name: "Big City Thunder",
    acronym: "BCT",
    description: "O trovão da grande cidade no basquete nacional. Time conhecido por sua velocidade de jogo e jogadas explosivas que eletriziam a torcida a cada partida.",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
    originDate: "2012-03-20",
    city: "São Paulo",
    country: "Brazil",
    stadiumId: "2",
    stadiumName: "Thunder Arena",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-14T00:00:00",
    enabled: true,
    skills: ["Basketball", "Athletics", "Speed", "Entertainment"],
    jobFunction: "Sports"
  }
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Carlos Silva",
    label: "player",
    genre: "Point Guard",
    nationality: "Brazil",
    originDate: "1995-06-24",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true
  },
  {
    id: "2",
    name: "João Santos",
    label: "player",
    genre: "Shooting Guard",
    nationality: "Brazil",
    originDate: "1998-02-02",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  },
  {
    id: "3",
    name: "Roberto Oliveira",
    label: "coach",
    genre: "Head Coach",
    nationality: "Brazil",
    originDate: "1971-01-18",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  }
]

const mockAvailableAgents: Agent[] = [
  {
    id: "4",
    name: "Pedro Costa",
    label: "player",
    genre: "Center",
    nationality: "Brazil",
    originDate: "1997-02-05",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  },
  {
    id: "5",
    name: "Lucas Ferreira",
    label: "player",
    genre: "Small Forward",
    nationality: "Brazil",
    originDate: "1999-02-05",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  }
]

type TabType = "overview" | "members" | "media"

export default function TeamDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [team] = useState<Team>(mockTeams[id || "1"] || mockTeams["1"])
  const [agents] = useState<Agent[]>(mockAgents)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("overview")
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
          presidentName: team.presidentName,
          teamType: team.teamType,
          enabled: team.enabled
        }}
        isEdit={true}
        onClose={() => setShowEditForm(false)}
      />
    )
  }

  const tabs: { id: TabType; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "members", label: "Members", icon: Users, count: agents.length },
    { id: "media", label: "Media", icon: ImageIcon }
  ]

  // Format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/teams")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Teams
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
        {/* Top banner bar - 128px height per Figma */}
        <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />

        {/* Header Content */}
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            {/* Left Section: Logo + Info */}
            <div className="flex flex-col">
              {/* Team Logo - circular like in teams table */}
              <div className="w-[116px] h-[116px] rounded-full bg-white overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {team.logoUrl ? (
                  <img
                    src={team.logoUrl}
                    alt={team.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">{team.acronym}</span>
                )}
              </div>

              {/* Team Info */}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">
                  {team.name}
                </h1>
                <Badge variant="neutral">
                  {team.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {team.acronym}
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
          <CardContent className="px-12 pt-12 pb-16">
            <div className="flex justify-between gap-[140px]">
              {/* Left Column - Description & Details */}
              <div className="flex-1 space-y-4">
                {/* Description */}
                <div className="space-y-0">
                  <p className="text-sm text-[#999999] leading-5">Description</p>
                  <p className="text-base text-white leading-6 max-w-[603px]">
                    {team.description}
                  </p>
                </div>

                {/* Full Name */}
                <div className="space-y-0 pt-4">
                  <p className="text-sm text-[#999999] leading-5">Full Name</p>
                  <p className="text-base text-white leading-6">{team.name}</p>
                </div>

                {/* Acronym */}
                <div className="space-y-0">
                  <p className="text-sm text-[#999999] leading-5">Acronym</p>
                  <p className="text-base text-white leading-6">{team.acronym}</p>
                </div>

                {/* President */}
                {team.presidentName && (
                  <div className="space-y-0">
                    <p className="text-sm text-[#999999] leading-5">President</p>
                    <p className="text-base text-white leading-6">{team.presidentName}</p>
                  </div>
                )}

                {/* Team Type */}
                {team.teamType && (
                  <div className="space-y-0">
                    <p className="text-sm text-[#999999] leading-5">Type</p>
                    <p className="text-base text-white leading-6">{teamTypeLabels[team.teamType] || team.teamType}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Info Cards */}
              <div className="w-[189px] space-y-6">
                {/* Location */}
                {team.city && team.country && (
                  <div className="flex items-center gap-[13px]">
                    <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#262626] flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-[18px] w-[18px] text-white/50" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-white leading-[14px]">{team.city}</p>
                      <p className="text-xs text-white/50 leading-[18px]">{team.country}</p>
                    </div>
                  </div>
                )}

                {/* Founded */}
                {team.originDate && (
                  <div className="flex items-center gap-[10px]">
                    <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#262626] flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-[18px] w-[18px] text-white/50" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-white leading-[14px]">Founded</p>
                      <p className="text-xs text-white/50 leading-[18px]">{formatDate(team.originDate)}</p>
                    </div>
                  </div>
                )}

                {/* Stadium */}
                {team.stadiumName && (
                  <div className="flex items-center gap-[10px]">
                    <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#262626] flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-[18px] w-[18px] text-white/50" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-white leading-[14px]">Stadium</p>
                      <p className="text-xs text-white/50 leading-[18px]">{team.stadiumName}</p>
                    </div>
                  </div>
                )}

                {/* President */}
                {team.presidentName && (
                  <div className="flex items-center gap-[10px]">
                    <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#262626] flex items-center justify-center flex-shrink-0">
                      <User className="h-[18px] w-[18px] text-white/50" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-white leading-[14px]">President</p>
                      <p className="text-xs text-white/50 leading-[18px]">{team.presidentName}</p>
                    </div>
                  </div>
                )}

                {/* Team Type */}
                {team.teamType && (
                  <div className="flex items-center gap-[10px]">
                    <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#262626] flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-[18px] w-[18px] text-white/50" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-white leading-[14px]">Type</p>
                      <p className="text-xs text-white/50 leading-[18px]">{teamTypeLabels[team.teamType] || team.teamType}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "members" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <div className="p-6 flex items-center justify-between border-b border-[#1f1f1f]">
            <h3 className="text-lg font-semibold text-white">Team Members</h3>
            <Button
              size="sm"
              onClick={() => setShowAddAgentDialog(true)}
              className="bg-primary hover:bg-primary/80 text-white rounded-lg"
            >
              <User className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-[#1f1f1f] hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Photo</TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Nationality</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id} className="border-[#1f1f1f]">
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={agent.imagePrimaryUrl} alt={agent.name} />
                        <AvatarFallback className="bg-[#1f1f1f] text-white">
                          {agent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-white">{agent.name}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground capitalize">{agent.label}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{agent.nationality}</TableCell>
                    <TableCell>
                      <Badge variant="neutral">
                        {agent.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
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
          </div>
        </Card>
      )}

      {activeTab === "media" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <h3 className="text-lg font-semibold text-white">Media Assets</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo */}
              {team.logoUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Logo</p>
                  <div
                    className="aspect-square rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center p-6"
                    onClick={() => setLightboxImage(team.logoUrl!)}
                  >
                    <img
                      src={team.logoUrl}
                      alt="Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Card Image */}
              {team.cardImageUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Card Image</p>
                  <div
                    className="aspect-square rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxImage(team.cardImageUrl!)}
                  >
                    <img
                      src={team.cardImageUrl}
                      alt="Card"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Banner Image */}
              {team.bannerImageUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Banner Image</p>
                  <div
                    className="aspect-square rounded-xl border border-[#1f1f1f] bg-[#090909] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxImage(team.bannerImageUrl!)}
                  >
                    <img
                      src={team.bannerImageUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Agent Dialog */}
      <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-[#0d0d0d] border-[#1f1f1f]">
          <DialogHeader>
            <DialogTitle className="text-white">Add Members to Team</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or position..."
                value={agentSearchTerm}
                onChange={(e) => setAgentSearchTerm(e.target.value)}
                className="pl-9 bg-[#090909] border-[#1f1f1f]"
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
                      className="flex items-center space-x-3 p-3 rounded-lg border border-[#1f1f1f] hover:bg-[#1f1f1f]/50 cursor-pointer"
                      onClick={() => toggleAgentSelection(agent.id)}
                    >
                      <Checkbox
                        checked={selectedAgentIds.includes(agent.id)}
                        onCheckedChange={() => toggleAgentSelection(agent.id)}
                      />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={agent.imagePrimaryUrl} alt={agent.name} />
                        <AvatarFallback className="bg-[#1f1f1f]">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-white">{agent.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{agent.label} • {agent.nationality}</p>
                      </div>
                      <Badge variant="neutral">
                        {agent.enabled ? "Enabled" : "Disabled"}
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
                setShowAddAgentDialog(false)
                setSelectedAgentIds([])
                setAgentSearchTerm("")
              }}
              className="border-[#1f1f1f]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAgents}
              disabled={selectedAgentIds.length === 0}
              className="bg-primary hover:bg-primary/80"
            >
              Add {selectedAgentIds.length > 0 && `(${selectedAgentIds.length})`} Member{selectedAgentIds.length !== 1 ? 's' : ''}
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
