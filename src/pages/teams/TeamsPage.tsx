import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Users, 
  Plus, 
  Search, 
  Trophy,
  User,
  Calendar,
  Loader2,
  ChevronDown,
  RefreshCw,
  Star
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImportButton } from "@/components/ui/import-button"
import { ListPagination } from "@/components/ui/list-controls"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { useToast } from "@/hooks/use-toast"
import { getTeams, getPlayers, getChampionships, getLeagues, type Team, type Player, type Championship, type League } from "@/lib/supabase-helpers"

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState("teams")
  const [teamsCurrentPage, setTeamsCurrentPage] = useState(1)
  const [playersCurrentPage, setPlayersCurrentPage] = useState(1)
  const [championshipsCurrentPage, setChampionshipsCurrentPage] = useState(1)
  const [teamsItemsPerPage] = useState(10)
  const [playersItemsPerPage] = useState(10)
  const [championshipsItemsPerPage] = useState(10)
  
  // Data states
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  
  const { toast } = useToast()

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load all data
      const [teamsData, playersData, championshipsData, leaguesData] = await Promise.all([
        getTeams(),
        getPlayers(),
        getChampionships(),
        getLeagues()
      ])
      
      setTeams(teamsData)
      setPlayers(playersData)
      setChampionships(championshipsData)
      setLeagues(leaguesData)
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
          <p className="text-muted-foreground">Loading data...</p>
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
        </div>
        <div className="flex gap-2">
          <ImportButton entityName="times e jogadores" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-primary transition-all" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Ações
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <User className="h-4 w-4 mr-2" />
                Novo Jogador
              </DropdownMenuItem>
              <DropdownMenuItem onClick={loadData} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Dados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <Card className="bg-gradient-card border-border/50">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Liga</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.slice((teamsCurrentPage - 1) * teamsItemsPerPage, teamsCurrentPage * teamsItemsPerPage).map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center">
                          <img src="/placeholder.svg" alt={team.name} className="w-8 h-8 object-scale-down" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link to={`/teams/${team.id}`} className="font-medium hover:underline">
                          {team.name}
                        </Link>
                      </TableCell>
                      <TableCell>{team.category}</TableCell>
                      <TableCell>
                        {team.league_id ? (
                          <Badge variant="outline">
                            {leagues.find(l => l.id === team.league_id)?.name || 'N/A'}
                          </Badge>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionDropdown
                          onView={() => window.location.href = `/teams/${team.id}`}
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
          
          <ListPagination
            currentPage={teamsCurrentPage}
            totalPages={Math.ceil(teams.length / teamsItemsPerPage)}
            onPageChange={setTeamsCurrentPage}
            itemsPerPage={teamsItemsPerPage}
            onItemsPerPageChange={() => {}}
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

          <Card className="bg-gradient-card border-border/50">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Posição</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.slice((playersCurrentPage - 1) * playersItemsPerPage, playersCurrentPage * playersItemsPerPage).map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" alt={player.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell>
                        {player.team_id ? teams.find(t => t.id === player.team_id)?.name || 'Time não encontrado' : 'Sem time'}
                      </TableCell>
                      <TableCell>{getStatusBadge(player.status)}</TableCell>
                      <TableCell className="text-right">
                        <ActionDropdown
                          onEdit={() => {}}
                          onDelete={() => {}}
                          showView={false}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
          
          <ListPagination
            currentPage={playersCurrentPage}
            totalPages={Math.ceil(players.length / playersItemsPerPage)}
            onPageChange={setPlayersCurrentPage}
            itemsPerPage={playersItemsPerPage}
            onItemsPerPageChange={() => {}}
            totalItems={players.length}
          />
        </TabsContent>

        {/* Championships Tab */}
        <TabsContent value="championships" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {championships.slice((championshipsCurrentPage - 1) * championshipsItemsPerPage, championshipsCurrentPage * championshipsItemsPerPage).map((championship) => {
                    const league = championship.league_id 
                      ? leagues.find(l => l.id === championship.league_id) 
                      : null
                    
                    return (
                      <TableRow key={championship.id}>
                        <TableCell>
                          {league?.logo_url ? (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={league.logo_url} />
                              <AvatarFallback>{league.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback><Trophy className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{championship.name}</TableCell>
                        <TableCell>{championship.type}</TableCell>
                        <TableCell>{getChampionshipStatusBadge(championship.status)}</TableCell>
                        <TableCell className="text-right">
                          <ActionDropdown
                            onView={() => {}}
                            showEdit={false}
                            showDelete={false}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
          
          <ListPagination
            currentPage={championshipsCurrentPage}
            totalPages={Math.ceil(championships.length / championshipsItemsPerPage)}
            onPageChange={setChampionshipsCurrentPage}
            itemsPerPage={championshipsItemsPerPage}
            onItemsPerPageChange={() => {}}
            totalItems={championships.length}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}