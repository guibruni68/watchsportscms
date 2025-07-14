import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Video, 
  Radio, 
  Users, 
  Calendar, 
  Newspaper, 
  Eye, 
  TrendingUp, 
  Play,
  Plus,
  Activity
} from "lucide-react"

export default function DashboardIndex() {
  const stats = [
    {
      title: "Vídeos VOD",
      value: "127",
      change: "+12%",
      changeType: "positive" as const,
      icon: Video,
      color: "text-primary"
    },
    {
      title: "Lives Agendadas",
      value: "8",
      change: "+3",
      changeType: "positive" as const,
      icon: Radio,
      color: "text-warning"
    },
    {
      title: "Visualizações",
      value: "45.2K",
      change: "+18%",
      changeType: "positive" as const,
      icon: Eye,
      color: "text-secondary"
    },
    {
      title: "Engajamento",
      value: "78%",
      change: "+5%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-primary"
    }
  ]

  const recentVideos = [
    {
      id: 1,
      title: "Treino da Semana - Preparação para o Clássico",
      thumbnail: "/placeholder.svg",
      views: 1250,
      duration: "8:45",
      status: "published",
      publishedAt: "Há 2 horas"
    },
    {
      id: 2,
      title: "Entrevista: Novo Reforço do Time",
      thumbnail: "/placeholder.svg",
      views: 890,
      duration: "15:30",
      status: "published",
      publishedAt: "Há 1 dia"
    },
    {
      id: 3,
      title: "Bastidores: Concentração antes do Jogo",
      thumbnail: "/placeholder.svg",
      views: 2140,
      duration: "12:15",
      status: "published",
      publishedAt: "Há 2 dias"
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Live: Transmissão do Jogo vs Rival FC",
      type: "live",
      date: "Hoje, 20:00",
      status: "scheduled"
    },
    {
      id: 2,
      title: "Coletiva de Imprensa",
      type: "event",
      date: "Amanhã, 14:00",
      status: "scheduled"
    },
    {
      id: 3,
      title: "Treino Aberto aos Torcedores",
      type: "event",
      date: "Sexta, 16:00",
      status: "scheduled"
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao painel de controle da FNB</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gradient-primary shadow-glow hover:shadow-lg transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Novo Conteúdo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge 
                      variant={stat.changeType === "positive" ? "default" : "destructive"} 
                      className="text-xs px-2 py-0 bg-secondary text-secondary-foreground"
                    >
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs. mês anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-muted/50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Videos */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Vídeos Recentes</CardTitle>
              <CardDescription>Últimos conteúdos publicados</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentVideos.map((video) => (
              <div key={video.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <div className="w-16 h-12 bg-muted rounded-md flex items-center justify-center">
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Badge className="absolute -bottom-1 -right-1 text-xs px-1 py-0 bg-primary text-primary-foreground">
                    {video.duration}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">{video.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.views.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">{video.publishedAt}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Publicado
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Próximos Eventos</CardTitle>
              <CardDescription>Agenda e transmissões</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Agenda
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={`p-2 rounded-lg ${event.type === 'live' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
                  {event.type === 'live' ? 
                    <Radio className="h-4 w-4" /> : 
                    <Calendar className="h-4 w-4" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground">{event.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                </div>
                <Badge 
                  variant={event.type === 'live' ? 'default' : 'outline'}
                  className={event.type === 'live' ? 'bg-warning text-warning-foreground' : ''}
                >
                  {event.type === 'live' ? 'AO VIVO' : 'Agendado'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcionalidades mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Video className="h-6 w-6" />
              <span className="text-sm">Upload Vídeo</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Radio className="h-6 w-6" />
              <span className="text-sm">Nova Live</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Newspaper className="h-6 w-6" />
              <span className="text-sm">Criar Notícia</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Gerir Times</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}