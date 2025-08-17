import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  Play,
  Eye,
  MapPin,
  Clock,
  Target,
  TrendingUp,
  Activity,
  Star
} from "lucide-react"

export default function ChampionshipDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - seria obtido via API usando o ID
  const championship = {
    id: 1,
    name: "Campeonato Estadual 2024",
    logo: "/placeholder.svg",
    type: "Estadual",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    teams: 16,
    matches: 120,
    status: "ongoing",
    ourPosition: 3,
    phase: "Quartas de Final",
    description: "Principal competição estadual com os melhores times da região.",
    format: "Pontos corridos + Mata-mata",
    prize: "R$ 500.000"
  }

  const standings = [
    { position: 1, team: "Nova City Sparks", logo: "/placeholder.svg", points: 65, matches: 25, wins: 20, draws: 5, losses: 0 },
    { position: 2, team: "Northbridge Thunder", logo: "/placeholder.svg", points: 58, matches: 25, wins: 18, draws: 4, losses: 3 },
    { position: 3, team: "Brookdale Saints", logo: "/placeholder.svg", points: 52, matches: 25, wins: 16, draws: 4, losses: 5 },
    { position: 4, team: "Luna Sparks", logo: "/placeholder.svg", points: 48, matches: 25, wins: 15, draws: 3, losses: 7 }
  ]

  const upcomingMatches = [
    {
      id: 1,
      homeTeam: "Nova City Sparks",
      awayTeam: "Thunder FC",
      date: "2024-01-20",
      time: "16:00",
      venue: "Estádio Municipal",
      round: "Quartas de Final"
    },
    {
      id: 2,
      homeTeam: "Brookdale Saints",
      awayTeam: "Luna Sparks", 
      date: "2024-01-21",
      time: "18:30",
      venue: "Arena Central",
      round: "Quartas de Final"
    }
  ]

  const statistics = {
    totalGoals: 245,
    averageGoalsPerMatch: 2.04,
    topScorer: "Marcus Johnson (15 gols)",
    topAssists: "André Silva (12 assistências)",
    cleanSheets: 45,
    yellowCards: 128,
    redCards: 8
  }

  const liveStreams = [
    {
      id: 1,
      title: "Nova City vs Thunder - AO VIVO",
      viewers: "2.4k",
      status: "live",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Análise pós-jogo - Saints x Luna",
      viewers: "890",
      status: "scheduled",
      thumbnail: "/placeholder.svg",
      scheduledTime: "20:00"
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Times
        </Button>
      </div>

      {/* Championship Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-secondary rounded-lg mb-6"></div>
        <Card className="absolute -bottom-4 left-6 right-6 bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-card border-2 border-secondary rounded-lg flex items-center justify-center">
                  <img src={championship.logo} alt={championship.name} className="w-20 h-20 object-scale-down" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{championship.name}</h1>
                    <p className="text-muted-foreground">{championship.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendário
                    </Button>
                    <Button size="sm" className="bg-gradient-secondary">
                      <Trophy className="h-4 w-4 mr-2" />
                      Seguir
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{championship.type}</Badge>
                  <Badge className="bg-secondary text-secondary-foreground">{championship.phase}</Badge>
                  <Badge className="bg-primary text-primary-foreground">Nossa posição: {championship.ourPosition}º</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{championship.teams}</div>
            <div className="text-sm text-muted-foreground">Times</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{championship.matches}</div>
            <div className="text-sm text-muted-foreground">Partidas</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{statistics.totalGoals}</div>
            <div className="text-sm text-muted-foreground">Gols</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{statistics.averageGoalsPerMatch}</div>
            <div className="text-sm text-muted-foreground">Média/Jogo</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="classification">Classificação</TabsTrigger>
          <TabsTrigger value="matches">Partidas</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
          <TabsTrigger value="live">Transmissões</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Informações da Competição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Início</p>
                    <p className="font-semibold">{new Date(championship.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Término</p>
                    <p className="font-semibold">{new Date(championship.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Formato</p>
                    <p className="font-semibold">{championship.format}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Premiação</p>
                    <p className="font-semibold">{championship.prize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fase Atual</p>
                    <p className="font-semibold">{championship.phase}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="bg-primary text-primary-foreground">Em andamento</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Destaques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-warning" />
                    <span className="text-sm">Artilheiro: {statistics.topScorer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Assistências: {statistics.topAssists}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm">{statistics.cleanSheets} jogos sem sofrer gols</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Classification Tab */}
        <TabsContent value="classification" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Tabela de Classificação</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Pos</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-center">J</TableHead>
                    <TableHead className="text-center">V</TableHead>
                    <TableHead className="text-center">E</TableHead>
                    <TableHead className="text-center">D</TableHead>
                    <TableHead className="text-center">Pts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((team) => (
                    <TableRow key={team.position} className={team.team === "Nova City Sparks" ? "bg-primary/10" : ""}>
                      <TableCell className="font-medium">{team.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img src={team.logo} alt={team.team} className="w-6 h-6 object-scale-down" />
                          <span className="font-medium">{team.team}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{team.matches}</TableCell>
                      <TableCell className="text-center text-secondary">{team.wins}</TableCell>
                      <TableCell className="text-center text-warning">{team.draws}</TableCell>
                      <TableCell className="text-center text-destructive">{team.losses}</TableCell>
                      <TableCell className="text-center font-bold">{team.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matches Tab */}
        <TabsContent value="matches" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Próximas Partidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-center gap-4 mb-2">
                          <span className="font-semibold">{match.homeTeam}</span>
                          <Badge variant="outline">vs</Badge>
                          <span className="font-semibold">{match.awayTeam}</span>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                          {match.round}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {match.time}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {match.venue}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Estatísticas Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total de Gols</span>
                  <span className="font-semibold">{statistics.totalGoals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Média por Partida</span>
                  <span className="font-semibold">{statistics.averageGoalsPerMatch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Jogos sem Gols</span>
                  <span className="font-semibold">{statistics.cleanSheets}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Disciplina</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Cartões Amarelos</span>
                  <span className="font-semibold text-warning">{statistics.yellowCards}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cartões Vermelhos</span>
                  <span className="font-semibold text-destructive">{statistics.redCards}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Média por Jogo</span>
                  <span className="font-semibold">{((statistics.yellowCards + statistics.redCards) / championship.matches).toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Live Streams Tab */}
        <TabsContent value="live" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveStreams.map((stream) => (
              <Card key={stream.id} className="bg-gradient-card border-border/50">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-primary/80">
                        <Play className="h-4 w-4 mr-2" />
                        {stream.status === 'live' ? 'Assistir' : 'Programada'}
                      </Button>
                    </div>
                    {stream.status === 'live' && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground animate-pulse">
                        ● AO VIVO
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{stream.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {stream.viewers} assistindo
                      </div>
                      {stream.scheduledTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {stream.scheduledTime}
                        </div>
                      )}
                    </div>
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