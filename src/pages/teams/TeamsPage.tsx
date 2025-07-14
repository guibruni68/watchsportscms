import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
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
  UserCheck,
  Loader2
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ListControls, ListPagination } from "@/components/ui/list-controls"
import { useToast } from "@/hooks/use-toast"
import { getTeams, getPlayers, getChampionships, initializeSampleData, type Team, type Player, type Championship } from "@/lib/supabase-helpers"

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState("teams")
  const [teamsViewMode, setTeamsViewMode] = useState<"list" | "grid">("grid")
  const [playersViewMode, setPlayersViewMode] = useState<"list" | "grid">("grid")
  const [teamsCurrentPage, setTeamsCurrentPage] = useState(1)
  const [playersCurrentPage, setPlayersCurrentPage] = useState(1)
  const [teamsItemsPerPage, setTeamsItemsPerPage] = useState(6)
  const [playersItemsPerPage, setPlayersItemsPerPage] = useState(12)
  
  // Data states
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [loading, setLoading] = useState(true)
  
  const { toast } = useToast()

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Initialize sample data if needed
      await initializeSampleData()
      
      // Load all data
      const [teamsData, playersData, championshipsData] = await Promise.all([
        getTeams(),
        getPlayers(),
        getChampionships()
      ])
      
      setTeams(teamsData)
      setPlayers(playersData)
      setChampionships(championshipsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

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
          <Button variant="outline" onClick={loadData} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            {loading ? "Carregando..." : "Recarregar Dados"}
          </Button>
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
            itemsPerPage={teamsItemsPerPage}
            onItemsPerPageChange={(items) => {
              setTeamsItemsPerPage(items)
              setTeamsCurrentPage(1)
            }}
            totalItems={teams.length}
          />
          
          <div className={teamsViewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid gap-4"}>
            {teams.slice((teamsCurrentPage - 1) * teamsItemsPerPage, teamsCurrentPage * teamsItemsPerPage).map((team) => (
              <Link key={team.id} to={`/teams/${team.id}`} className="block">
                <Card className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300 cursor-pointer">
                  <CardHeader className="pb-2 p-4">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-card border border-border rounded-lg flex items-center justify-center flex-shrink-0">
                        <img src="/placeholder.svg" alt={`Logo ${team.name}`} className="w-12 h-12 object-scale-down" />
                      </div>
                    <div className="text-center">
                      <CardTitle className="text-base truncate">{team.name}</CardTitle>
                      <CardDescription className="text-sm">{team.category}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-center text-sm text-muted-foreground">
                    {team.division}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <ListPagination
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
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Idade</p>
                        <p className="font-semibold">{player.age} anos</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time</p>
                        <p className="font-semibold text-xs">{player.team_id ? 'Time associado' : 'Sem time'}</p>
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
                      <span className="text-xs text-muted-foreground">
                        {player.market_value || 'N/A'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {player.matches} jogos
                      </span>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <ListPagination
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
                      <p className="font-semibold">{championship.teams_count}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Jogos</p>
                      <p className="font-semibold">{championship.matches_count}</p>
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
                        {new Date(championship.start_date).toLocaleDateString('pt-BR')} - {new Date(championship.end_date).toLocaleDateString('pt-BR')}
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