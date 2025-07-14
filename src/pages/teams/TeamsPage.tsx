import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Plus, 
  Search, 
  Trophy,
  User,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Star,
  UserCheck
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ListControls } from "@/components/ui/list-controls"

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState("teams")
  const [teamsViewMode, setTeamsViewMode] = useState<"list" | "grid">("grid")
  const [playersViewMode, setPlayersViewMode] = useState<"list" | "grid">("grid")
  const [teamsCurrentPage, setTeamsCurrentPage] = useState(1)
  const [playersCurrentPage, setPlayersCurrentPage] = useState(1)
  const [teamsItemsPerPage, setTeamsItemsPerPage] = useState(6)
  const [playersItemsPerPage, setPlayersItemsPerPage] = useState(12)

  const teams = [
    {
      id: 1,
      name: "Time Principal",
      category: "Profissional",
      players: 28,
      coach: "João Silva",
      founded: "1995",
      division: "Série A",
      position: 3,
      points: 45,
      matches: 20,
      wins: 14,
      draws: 3,
      losses: 3
    },
    {
      id: 2,
      name: "Time Sub-20",
      category: "Juvenil",
      players: 25,
      coach: "Pedro Santos",
      founded: "2010",
      division: "Estadual Sub-20",
      position: 1,
      points: 52,
      matches: 18,
      wins: 16,
      draws: 2,
      losses: 0
    },
    {
      id: 3,
      name: "Time Sub-17",
      category: "Juvenil",
      players: 22,
      coach: "Ana Costa",
      founded: "2012",
      division: "Estadual Sub-17",
      position: 2,
      points: 38,
      matches: 16,
      wins: 11,
      draws: 5,
      losses: 0
    },
    {
      id: 4,
      name: "Time Feminino",
      category: "Feminino",
      players: 24,
      coach: "Maria Oliveira",
      founded: "2018",
      division: "Série B Feminina",
      position: 4,
      points: 32,
      matches: 15,
      wins: 9,
      draws: 5,
      losses: 1
    }
  ]

  const players = [
    {
      id: 1,
      name: "Carlos Augusto",
      position: "Atacante",
      number: 9,
      age: 28,
      team: "Time Principal",
      nationality: "Brasileiro",
      goals: 15,
      assists: 8,
      matches: 18,
      status: "active",
      marketValue: "R$ 2.5M"
    },
    {
      id: 2,
      name: "Roberto Silva",
      position: "Meio-campo",
      number: 10,
      age: 25,
      team: "Time Principal",
      nationality: "Brasileiro",
      goals: 8,
      assists: 12,
      matches: 19,
      status: "active",
      marketValue: "R$ 1.8M"
    },
    {
      id: 3,
      name: "Miguel Santos",
      position: "Goleiro",
      number: 1,
      age: 31,
      team: "Time Principal",
      nationality: "Brasileiro",
      goals: 0,
      assists: 0,
      matches: 20,
      status: "active",
      marketValue: "R$ 1.2M"
    },
    {
      id: 4,
      name: "Felipe Costa",
      position: "Zagueiro",
      number: 4,
      age: 27,
      team: "Time Principal",
      nationality: "Brasileiro",
      goals: 2,
      assists: 1,
      matches: 18,
      status: "injured",
      marketValue: "R$ 900K"
    },
    {
      id: 5,
      name: "Lucas Mendes",
      position: "Atacante",
      number: 11,
      age: 19,
      team: "Time Sub-20",
      nationality: "Brasileiro",
      goals: 22,
      assists: 6,
      matches: 16,
      status: "active",
      marketValue: "R$ 500K"
    }
  ]

  const championships = [
    {
      id: 1,
      name: "Campeonato Estadual 2024",
      type: "Estadual",
      startDate: "2024-02-01",
      endDate: "2024-06-30",
      teams: 16,
      matches: 120,
      status: "ongoing",
      ourPosition: 3,
      phase: "Quartas de Final"
    },
    {
      id: 2,
      name: "Copa Regional Sub-20",
      type: "Regional",
      startDate: "2024-03-15",
      endDate: "2024-05-20",
      teams: 8,
      matches: 28,
      status: "ongoing",
      ourPosition: 1,
      phase: "Final"
    },
    {
      id: 3,
      name: "Torneio de Verão 2024",
      type: "Amistoso",
      startDate: "2024-01-10",
      endDate: "2024-01-25",
      teams: 4,
      matches: 6,
      status: "finished",
      ourPosition: 2,
      phase: "Finalizado"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-secondary text-secondary-foreground">Ativo</Badge>
      case "injured":
        return <Badge className="bg-warning text-warning-foreground">Lesionado</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspenso</Badge>
      default:
        return <Badge variant="outline">Inativo</Badge>
    }
  }

  const getChampionshipStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Badge className="bg-primary text-primary-foreground">Em andamento</Badge>
      case "finished":
        return <Badge className="bg-secondary text-secondary-foreground">Finalizado</Badge>
      case "scheduled":
        return <Badge variant="outline">Agendado</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Times & Elencos</h1>
          <p className="text-muted-foreground">Gerencie times, jogadores e campeonatos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Novo Jogador
          </Button>
          <Button className="bg-gradient-primary shadow-glow hover:shadow-lg transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Novo Time
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Times</p>
                <p className="text-2xl font-bold text-foreground">{teams.length}</p>
              </div>
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Jogadores</p>
                <p className="text-2xl font-bold text-foreground">{players.length}</p>
              </div>
              <User className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Campeonatos</p>
                <p className="text-2xl font-bold text-foreground">{championships.length}</p>
              </div>
              <Trophy className="h-6 w-6 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Títulos</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <Star className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teams">Times</TabsTrigger>
          <TabsTrigger value="players">Jogadores</TabsTrigger>
          <TabsTrigger value="championships">Campeonatos</TabsTrigger>
        </TabsList>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          <ListControls
            viewMode={teamsViewMode}
            onViewModeChange={setTeamsViewMode}
            currentPage={teamsCurrentPage}
            totalPages={Math.ceil(teams.length / teamsItemsPerPage)}
            onPageChange={setTeamsCurrentPage}
            itemsPerPage={teamsItemsPerPage}
            onItemsPerPageChange={(items) => {
              setTeamsItemsPerPage(items)
              setTeamsCurrentPage(1)
            }}
            totalItems={teams.length}
          />
          
          <div className={teamsViewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid gap-4"}>
            {teams.slice((teamsCurrentPage - 1) * teamsItemsPerPage, teamsCurrentPage * teamsItemsPerPage).map((team) => (
              <Card key={team.id} className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription>{team.category}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {team.division}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Jogadores</p>
                      <p className="font-semibold">{team.players}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Técnico</p>
                      <p className="font-semibold">{team.coach}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Posição</p>
                      <p className="font-semibold">{team.position}º lugar</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pontos</p>
                      <p className="font-semibold">{team.points} pts</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="bg-secondary/20 rounded p-2">
                      <p className="text-secondary font-semibold">{team.wins}</p>
                      <p className="text-muted-foreground">Vitórias</p>
                    </div>
                    <div className="bg-muted/50 rounded p-2">
                      <p className="font-semibold">{team.draws}</p>
                      <p className="text-muted-foreground">Empates</p>
                    </div>
                    <div className="bg-destructive/20 rounded p-2">
                      <p className="text-destructive font-semibold">{team.losses}</p>
                      <p className="text-muted-foreground">Derrotas</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      Fundado em {team.founded}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Players Tab */}
        <TabsContent value="players" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar jogadores..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os times</SelectItem>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Posição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as posições</SelectItem>
                    <SelectItem value="goleiro">Goleiro</SelectItem>
                    <SelectItem value="zagueiro">Zagueiro</SelectItem>
                    <SelectItem value="meio-campo">Meio-campo</SelectItem>
                    <SelectItem value="atacante">Atacante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <ListControls
            viewMode={playersViewMode}
            onViewModeChange={setPlayersViewMode}
            currentPage={playersCurrentPage}
            totalPages={Math.ceil(players.length / playersItemsPerPage)}
            onPageChange={setPlayersCurrentPage}
            itemsPerPage={playersItemsPerPage}
            onItemsPerPageChange={(items) => {
              setPlayersItemsPerPage(items)
              setPlayersCurrentPage(1)
            }}
            totalItems={players.length}
          />

          <div className={playersViewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid gap-4"}>
            {players.slice((playersCurrentPage - 1) * playersItemsPerPage, playersCurrentPage * playersItemsPerPage).map((player) => (
              <Card key={player.id} className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/placeholder.svg`} alt={player.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{player.name}</h3>
                          <p className="text-sm text-muted-foreground">{player.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                          {player.number}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Idade</p>
                        <p className="font-semibold">{player.age} anos</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time</p>
                        <p className="font-semibold text-xs">{player.team}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gols</p>
                        <p className="font-semibold">{player.goals}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Assistências</p>
                        <p className="font-semibold">{player.assists}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {getStatusBadge(player.status)}
                      <span className="text-xs text-muted-foreground">
                        {player.marketValue}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        {player.matches} jogos
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <UserCheck className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Championships Tab */}
        <TabsContent value="championships" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {championships.map((championship) => (
              <Card key={championship.id} className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{championship.name}</CardTitle>
                      <CardDescription>{championship.type}</CardDescription>
                    </div>
                    {getChampionshipStatusBadge(championship.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Times</p>
                      <p className="font-semibold">{championship.teams}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Jogos</p>
                      <p className="font-semibold">{championship.matches}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Nossa Posição</p>
                      <p className="font-semibold">{championship.ourPosition}º lugar</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fase</p>
                      <p className="font-semibold text-xs">{championship.phase}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(championship.startDate).toLocaleDateString('pt-BR')} - {new Date(championship.endDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button variant="outline" size="sm">
                      <Trophy className="h-3 w-3 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}