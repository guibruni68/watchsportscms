import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  Calendar,
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Play,
  Download,
  Filter
} from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [contentType, setContentType] = useState("all")

  const analyticsData = {
    overview: {
      totalViews: 156780,
      totalHours: 8932,
      avgRetention: 68.5,
      totalUsers: 23456,
      viewsChange: 12.5,
      hoursChange: 8.3,
      retentionChange: -2.1,
      usersChange: 15.8
    },
    topContent: [
      {
        id: 1,
        title: "Final do Campeonato Sub-20",
        type: "live",
        views: 12500,
        retention: 85.2,
        avgDuration: "01:45:30",
        date: "2024-01-10"
      },
      {
        id: 2,
        title: "Treino da Semana - Preparação",
        type: "video",
        views: 8900,
        retention: 72.1,
        avgDuration: "00:06:15",
        date: "2024-01-15"
      },
      {
        id: 3,
        title: "Entrevista: Novo Reforço",
        type: "video",
        views: 7650,
        retention: 68.9,
        avgDuration: "00:11:20",
        date: "2024-01-12"
      },
      {
        id: 4,
        title: "Transmissão vs Rival FC",
        type: "live",
        views: 6800,
        retention: 91.5,
        avgDuration: "01:52:45",
        date: "2024-01-08"
      },
      {
        id: 5,
        title: "Bastidores: Concentração",
        type: "video",
        views: 5400,
        retention: 64.3,
        avgDuration: "00:08:30",
        date: "2024-01-14"
      }
    ],
    demographics: {
      ageGroups: [
        { range: "18-24", percentage: 22.5, count: 5280 },
        { range: "25-34", percentage: 35.8, count: 8398 },
        { range: "35-44", percentage: 25.1, count: 5888 },
        { range: "45-54", percentage: 12.3, count: 2885 },
        { range: "55+", percentage: 4.3, count: 1009 }
      ],
      devices: [
        { type: "Mobile", percentage: 65.2, count: 15298 },
        { type: "Desktop", percentage: 28.9, count: 6779 },
        { type: "Tablet", percentage: 5.9, count: 1384 }
      ],
      locations: [
        { city: "São Paulo", percentage: 35.2, count: 8257 },
        { city: "Rio de Janeiro", percentage: 18.7, count: 4386 },
        { city: "Belo Horizonte", percentage: 12.8, count: 3002 },
        { city: "Salvador", percentage: 8.9, count: 2088 },
        { city: "Outros", percentage: 24.4, count: 5723 }
      ]
    },
    engagement: {
      totalLikes: 15847,
      totalComments: 3294,
      totalShares: 1582,
      avgEngagement: 4.7,
      peakViewingTime: "20:00-22:00",
      mostActiveDay: "Domingo"
    }
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4 text-secondary" /> : <TrendingDown className="h-4 w-4 text-destructive" />
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-secondary" : "text-destructive"
  }

  const getContentTypeIcon = (type: string) => {
    return type === "live" ? <Play className="h-4 w-4 text-warning" /> : <Play className="h-4 w-4 text-primary" />
  }

  const getContentTypeBadge = (type: string) => {
    return type === "live" 
      ? <Badge className="bg-warning text-warning-foreground text-xs">AO VIVO</Badge>
      : <Badge variant="outline" className="text-xs">VOD</Badge>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Métricas e Analytics</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho do seu conteúdo</p>
        </div>
        <div className="flex gap-2">
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo de conteúdo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="video">Vídeos VOD</SelectItem>
              <SelectItem value="live">Lives</SelectItem>
              <SelectItem value="news">Notícias</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visualizações</p>
                <p className="text-2xl font-bold text-foreground">
                  {analyticsData.overview.totalViews.toLocaleString()}
                </p>
                <div className={`flex items-center gap-1 mt-1 ${getChangeColor(analyticsData.overview.viewsChange)}`}>
                  {getChangeIcon(analyticsData.overview.viewsChange)}
                  <span className="text-xs font-medium">
                    {analyticsData.overview.viewsChange > 0 ? '+' : ''}{analyticsData.overview.viewsChange}%
                  </span>
                </div>
              </div>
              <Eye className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Horas Assistidas</p>
                <p className="text-2xl font-bold text-foreground">
                  {analyticsData.overview.totalHours.toLocaleString()}
                </p>
                <div className={`flex items-center gap-1 mt-1 ${getChangeColor(analyticsData.overview.hoursChange)}`}>
                  {getChangeIcon(analyticsData.overview.hoursChange)}
                  <span className="text-xs font-medium">
                    {analyticsData.overview.hoursChange > 0 ? '+' : ''}{analyticsData.overview.hoursChange}%
                  </span>
                </div>
              </div>
              <Clock className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Retenção Média</p>
                <p className="text-2xl font-bold text-foreground">
                  {analyticsData.overview.avgRetention}%
                </p>
                <div className={`flex items-center gap-1 mt-1 ${getChangeColor(analyticsData.overview.retentionChange)}`}>
                  {getChangeIcon(analyticsData.overview.retentionChange)}
                  <span className="text-xs font-medium">
                    {analyticsData.overview.retentionChange > 0 ? '+' : ''}{analyticsData.overview.retentionChange}%
                  </span>
                </div>
              </div>
              <BarChart3 className="h-6 w-6 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuários Únicos</p>
                <p className="text-2xl font-bold text-foreground">
                  {analyticsData.overview.totalUsers.toLocaleString()}
                </p>
                <div className={`flex items-center gap-1 mt-1 ${getChangeColor(analyticsData.overview.usersChange)}`}>
                  {getChangeIcon(analyticsData.overview.usersChange)}
                  <span className="text-xs font-medium">
                    {analyticsData.overview.usersChange > 0 ? '+' : ''}{analyticsData.overview.usersChange}%
                  </span>
                </div>
              </div>
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Conteúdo Mais Assistido</CardTitle>
            <CardDescription>Top 5 vídeos e lives por visualizações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topContent.map((content, index) => (
              <div key={content.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
                  <span className="text-sm font-bold text-primary">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-foreground truncate">{content.title}</h4>
                    {getContentTypeBadge(content.type)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {content.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {content.retention}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {content.avgDuration}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(content.date).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Engajamento</CardTitle>
            <CardDescription>Interações e comportamento da audiência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-secondary/10">
                <p className="text-2xl font-bold text-secondary">
                  {analyticsData.engagement.totalLikes.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Curtidas</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/10">
                <p className="text-2xl font-bold text-primary">
                  {analyticsData.engagement.totalComments.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Comentários</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-warning/10">
                <p className="text-2xl font-bold text-warning">
                  {analyticsData.engagement.totalShares.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Compartilhamentos</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Taxa de Engajamento</span>
                <span className="text-lg font-bold text-primary">
                  {analyticsData.engagement.avgEngagement}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Horário de Pico</span>
                <Badge variant="outline">
                  {analyticsData.engagement.peakViewingTime}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Dia Mais Ativo</span>
                <Badge variant="outline">
                  {analyticsData.engagement.mostActiveDay}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Groups */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Faixa Etária</CardTitle>
            <CardDescription>Distribuição por idade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.demographics.ageGroups.map((group) => (
              <div key={group.range} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{group.range} anos</span>
                  <span className="text-muted-foreground">{group.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${group.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {group.count.toLocaleString()} usuários
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Devices */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Dispositivos</CardTitle>
            <CardDescription>Plataformas de acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.demographics.devices.map((device) => (
              <div key={device.type} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{device.type}</span>
                  <span className="text-muted-foreground">{device.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {device.count.toLocaleString()} usuários
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Locations */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Localização</CardTitle>
            <CardDescription>Principais cidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.demographics.locations.map((location) => (
              <div key={location.city} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{location.city}</span>
                  <span className="text-muted-foreground">{location.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full transition-all duration-300"
                    style={{ width: `${location.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {location.count.toLocaleString()} usuários
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}