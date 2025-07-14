import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Radio, 
  Plus, 
  Search, 
  Calendar,
  Users,
  Eye,
  Clock,
  Settings,
  Play,
  Pause,
  Square
} from "lucide-react"

export default function LivesPage() {
  const [activeTab, setActiveTab] = useState("scheduled")

  const scheduledLives = [
    {
      id: 1,
      title: "Transmissão do Jogo vs Rival FC",
      description: "Partida decisiva do campeonato estadual",
      scheduledFor: "2024-01-20T20:00:00",
      duration: "120 min",
      category: "Jogos",
      status: "scheduled",
      expectedViewers: 2500
    },
    {
      id: 2,
      title: "Coletiva de Imprensa - Novo Técnico",
      description: "Apresentação oficial do novo comandante",
      scheduledFor: "2024-01-18T14:00:00",
      duration: "45 min",
      category: "Institucional",
      status: "scheduled",
      expectedViewers: 800
    },
    {
      id: 3,
      title: "Treino Aberto aos Torcedores",
      description: "Preparação para a final do campeonato",
      scheduledFor: "2024-01-19T16:00:00",
      duration: "90 min",
      category: "Treinos",
      status: "scheduled",
      expectedViewers: 1200
    }
  ]

  const activeLives = [
    {
      id: 4,
      title: "AO VIVO: Aquecimento pré-jogo",
      description: "Preparação dos jogadores antes da partida",
      startedAt: "2024-01-15T19:30:00",
      duration: "30 min",
      category: "Jogos",
      status: "live",
      currentViewers: 1847,
      peakViewers: 2100
    }
  ]

  const pastLives = [
    {
      id: 5,
      title: "Final do Campeonato Sub-20",
      description: "Transmissão completa da grande final",
      date: "2024-01-10T15:00:00",
      duration: "135 min",
      category: "Jogos",
      status: "finished",
      totalViews: 4520,
      peakViewers: 2800
    },
    {
      id: 6,
      title: "Apresentação dos Novos Uniformes",
      description: "Lançamento da nova coleção 2024",
      date: "2024-01-08T18:00:00",
      duration: "60 min",
      category: "Institucional",
      status: "finished",
      totalViews: 1890,
      peakViewers: 950
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-warning text-warning-foreground animate-pulse">AO VIVO</Badge>
      case "scheduled":
        return <Badge variant="outline">Agendado</Badge>
      case "finished":
        return <Badge className="bg-secondary text-secondary-foreground">Finalizado</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transmissões ao Vivo</h1>
          <p className="text-muted-foreground">Gerencie suas lives e eventos em tempo real</p>
        </div>
        <Button className="bg-gradient-primary shadow-glow hover:shadow-lg transition-all">
          <Plus className="h-4 w-4 mr-2" />
          Agendar Live
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lives Agendadas</p>
                <p className="text-2xl font-bold text-foreground">{scheduledLives.length}</p>
              </div>
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ao Vivo Agora</p>
                <p className="text-2xl font-bold text-foreground">{activeLives.length}</p>
              </div>
              <Radio className="h-6 w-6 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visualizadores</p>
                <p className="text-2xl font-bold text-foreground">
                  {activeLives.reduce((acc, live) => acc + live.currentViewers, 0).toLocaleString()}
                </p>
              </div>
              <Eye className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Lives</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
              <Play className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Lives (if any) */}
      {activeLives.length > 0 && (
        <Card className="bg-gradient-card border-border/50 border-warning/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Radio className="h-5 w-5 text-warning" />
              Transmissões Ativas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeLives.map((live) => (
              <div key={live.id} className="p-4 border border-warning/20 bg-warning/5 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{live.title}</h3>
                      {getStatusBadge(live.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{live.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {live.currentViewers.toLocaleString()} assistindo
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Pico: {live.peakViewers.toLocaleString()}
                      </span>
                      <Badge variant="outline" className="text-xs">{live.category}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Square className="h-4 w-4 mr-2" />
                      Finalizar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <Button
          variant={activeTab === "scheduled" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("scheduled")}
          className={activeTab === "scheduled" ? "bg-primary text-primary-foreground" : ""}
        >
          Agendadas ({scheduledLives.length})
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("past")}
          className={activeTab === "past" ? "bg-primary text-primary-foreground" : ""}
        >
          Anteriores ({pastLives.length})
        </Button>
      </div>

      {/* Scheduled Lives */}
      {activeTab === "scheduled" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduledLives.map((live) => (
            <Card key={live.id} className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{live.title}</h3>
                      <p className="text-sm text-muted-foreground">{live.description}</p>
                    </div>
                    {getStatusBadge(live.status)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDateTime(live.scheduledFor)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Duração: {live.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>~{live.expectedViewers.toLocaleString()} esperados</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {live.category}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-gradient-primary">
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Past Lives */}
      {activeTab === "past" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastLives.map((live) => (
            <Card key={live.id} className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{live.title}</h3>
                      <p className="text-sm text-muted-foreground">{live.description}</p>
                    </div>
                    {getStatusBadge(live.status)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDateTime(live.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Duração: {live.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{live.totalViews.toLocaleString()} visualizações</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Pico: {live.peakViewers.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {live.category}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Relatório
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === "scheduled" && scheduledLives.length === 0) || 
        (activeTab === "past" && pastLives.length === 0)) && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center">
            <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {activeTab === "scheduled" ? "Nenhuma live agendada" : "Nenhuma live anterior"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === "scheduled" 
                ? "Agende sua primeira transmissão ao vivo para engajar com sua audiência."
                : "Suas transmissões anteriores aparecerão aqui após serem finalizadas."
              }
            </p>
            {activeTab === "scheduled" && (
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Agendar Live
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}