import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft,
  Users, 
  Trophy,
  Calendar,
  MapPin,
  Edit,
  Share2,
  Heart,
  Play,
  Eye,
  Star,
  TrendingUp,
  Activity
} from "lucide-react"

export default function TeamDetailsPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - seria obtido via API usando o ID
  const team = {
    id: 1,
    name: "Nova City Sparks",
    logo: "/placeholder.svg",
    category: "Profissional",
    players: 28,
    coach: "Roberto Silva",
    founded: "1995",
    division: "Primeira Divisão",
    position: 1,
    points: 65,
    matches: 25,
    wins: 20,
    draws: 3,
    losses: 2,
    description: "Time tradicional da cidade com mais de 25 anos de história. Conhecido por sua garra e determinação em campo.",
    achievements: [
      "Campeão Estadual 2023",
      "Vice-campeão Regional 2022",
      "Campeão Municipal 2021"
    ],
    stadium: "Estádio Municipal",
    capacity: "15.000",
    mascot: "Sparky - A Faísca"
  }

  const players = [
    {
      id: 1,
      name: "Marcus Johnson",
      position: "Armador",
      number: 10,
      age: 28,
      photo: "/placeholder.svg",
      goals: 245,
      assists: 189,
      matches: 25
    },
    {
      id: 2,
      name: "André Silva", 
      position: "Ala-Pivô",
      number: 15,
      age: 26,
      photo: "/placeholder.svg",
      goals: 198,
      assists: 87,
      matches: 24
    }
  ]

  const recentContent = [
    {
      id: 1,
      type: "video",
      title: "Melhores momentos vs Thunder",
      thumbnail: "/placeholder.svg",
      duration: "5:42",
      views: "2.1k",
      date: "2024-01-15"
    },
    {
      id: 2,
      type: "news",
      title: "Preparação para o próximo jogo",
      thumbnail: "/placeholder.svg",
      views: "856",
      date: "2024-01-14"
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/teams">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Times
          </Link>
        </Button>
      </div>

      {/* Team Header */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-card border-2 border-primary rounded-lg flex items-center justify-center">
                <img src={team.logo} alt={team.name} className="w-20 h-20 object-scale-down" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{team.name}</h1>
                  <p className="text-muted-foreground">{team.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button size="sm" className="bg-gradient-primary">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{team.category}</Badge>
                <Badge className="bg-primary text-primary-foreground">{team.position}º Colocado</Badge>
                <Badge className="bg-secondary text-secondary-foreground">{team.division}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50 h-24">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{team.wins}</div>
            <div className="text-sm text-muted-foreground">Vitórias</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 h-24">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{team.draws}</div>
            <div className="text-sm text-muted-foreground">Empates</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 h-24">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{team.losses}</div>
            <div className="text-sm text-muted-foreground">Derrotas</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 h-24">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{team.points}</div>
            <div className="text-sm text-muted-foreground">Pontos</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="players">Elenco</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Informações do Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fundado em</p>
                    <p className="font-semibold">{team.founded}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Técnico</p>
                    <p className="font-semibold">{team.coach}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estádio</p>
                    <p className="font-semibold">{team.stadium}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capacidade</p>
                    <p className="font-semibold">{team.capacity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mascote</p>
                    <p className="font-semibold">{team.mascot}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Divisão</p>
                    <p className="font-semibold">{team.division}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {team.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-warning" />
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Players Tab */}
        <TabsContent value="players" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <Card key={player.id} className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={player.photo} alt={player.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{player.name}</h3>
                      <p className="text-sm text-muted-foreground">{player.position}</p>
                    </div>
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {player.number}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="font-semibold text-primary">{player.goals}</p>
                      <p className="text-muted-foreground text-xs">Gols</p>
                    </div>
                    <div>
                      <p className="font-semibold text-secondary">{player.assists}</p>
                      <p className="text-muted-foreground text-xs">Assist.</p>
                    </div>
                    <div>
                      <p className="font-semibold">{player.matches}</p>
                      <p className="text-muted-foreground text-xs">Jogos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentContent.map((content) => (
              <Card key={content.id} className="bg-gradient-card border-border/50 transition-all">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={content.thumbnail} 
                      alt={content.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-primary/80">
                        <Play className="h-4 w-4 mr-2" />
                        {content.type === 'video' ? 'Assistir' : 'Ler'}
                      </Button>
                    </div>
                    {content.duration && (
                      <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                        {content.duration}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{content.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {content.views} visualizações
                      </div>
                      <span>{new Date(content.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance da Temporada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taxa de Vitórias</span>
                    <span className="font-semibold">{Math.round((team.wins / team.matches) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aproveitamento</span>
                    <span className="font-semibold">{Math.round((team.points / (team.matches * 3)) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Média de Pontos</span>
                    <span className="font-semibold">{(team.points / team.matches).toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Em ascensão na tabela</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-sm">Boa sequência em casa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-sm">Melhor ataque da divisão</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}