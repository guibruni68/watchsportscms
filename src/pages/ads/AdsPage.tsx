import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, 
  Plus, 
  Search, 
  Eye,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  Pause,
  Play,
  Settings,
  ExternalLink
} from "lucide-react"

export default function AdsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const adCampaigns = [
    {
      id: 1,
      name: "Banner Principal - HomePage",
      type: "display",
      position: "header",
      status: "active",
      impressions: 45200,
      clicks: 892,
      ctr: 1.97,
      revenue: 1250.00,
      budget: 2000.00,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      advertiser: "Patrocinador Principal"
    },
    {
      id: 2,
      name: "Video Pre-Roll - Lives",
      type: "video",
      position: "pre-roll",
      status: "active",
      impressions: 12800,
      clicks: 256,
      ctr: 2.00,
      revenue: 640.00,
      budget: 1000.00,
      startDate: "2024-01-10",
      endDate: "2024-02-10",
      advertiser: "Marca Esportiva"
    },
    {
      id: 3,
      name: "Banner Lateral - Notícias",
      type: "display",
      position: "sidebar",
      status: "paused",
      impressions: 23400,
      clicks: 468,
      ctr: 2.00,
      revenue: 468.00,
      budget: 800.00,
      startDate: "2024-01-05",
      endDate: "2024-01-25",
      advertiser: "Loja de Materiais"
    },
    {
      id: 4,
      name: "Patrocínio Match Center",
      type: "sponsorship",
      position: "match-center",
      status: "scheduled",
      impressions: 0,
      clicks: 0,
      ctr: 0,
      revenue: 0,
      budget: 5000.00,
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      advertiser: "Banco Regional"
    },
    {
      id: 5,
      name: "Banner Mobile - App",
      type: "display",
      position: "mobile-banner",
      status: "ended",
      impressions: 67800,
      clicks: 1356,
      ctr: 2.00,
      revenue: 2034.00,
      budget: 2500.00,
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      advertiser: "Concessionária Local"
    }
  ]

  const adPositions = [
    { id: "header", name: "Header Principal", price: "R$ 0,025/impressão", availability: "Disponível" },
    { id: "sidebar", name: "Sidebar Notícias", price: "R$ 0,015/impressão", availability: "Ocupado" },
    { id: "pre-roll", name: "Pre-roll Vídeos", price: "R$ 0,05/visualização", availability: "Disponível" },
    { id: "match-center", name: "Match Center", price: "R$ 5.000/mês", availability: "Reservado" },
    { id: "mobile-banner", name: "Banner Mobile", price: "R$ 0,03/impressão", availability: "Disponível" },
    { id: "newsletter", name: "Newsletter", price: "R$ 200/envio", availability: "Disponível" }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-secondary text-secondary-foreground">Ativo</Badge>
      case "paused":
        return <Badge className="bg-warning text-warning-foreground">Pausado</Badge>
      case "scheduled":
        return <Badge className="bg-primary text-primary-foreground">Agendado</Badge>
      case "ended":
        return <Badge variant="outline">Finalizado</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getPositionBadge = (position: string) => {
    switch (position) {
      case "header":
        return <Badge variant="outline" className="text-xs">Header</Badge>
      case "sidebar":
        return <Badge variant="outline" className="text-xs">Sidebar</Badge>
      case "pre-roll":
        return <Badge variant="outline" className="text-xs">Pre-roll</Badge>
      case "match-center":
        return <Badge variant="outline" className="text-xs">Match Center</Badge>
      case "mobile-banner":
        return <Badge variant="outline" className="text-xs">Mobile</Badge>
      default:
        return <Badge variant="outline" className="text-xs">Outro</Badge>
    }
  }

  const filteredCampaigns = adCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.advertiser.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalRevenue = adCampaigns.reduce((acc, campaign) => acc + campaign.revenue, 0)
  const totalImpressions = adCampaigns.reduce((acc, campaign) => acc + campaign.impressions, 0)
  const totalClicks = adCampaigns.reduce((acc, campaign) => acc + campaign.clicks, 0)
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Anúncios</h1>
          <p className="text-muted-foreground">Monitore e gerencie campanhas publicitárias</p>
        </div>
        <Button className="bg-gradient-primary transition-all">
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-secondary fill-current" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impressões</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalImpressions.toLocaleString()}
                </p>
              </div>
              <Eye className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cliques</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalClicks.toLocaleString()}
                </p>
              </div>
              <Target className="h-6 w-6 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CTR Médio</p>
                <p className="text-2xl font-bold text-foreground">
                  {avgCTR.toFixed(2)}%
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar campanhas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="ended">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns */}
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-gradient-card border-border/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                          {getStatusBadge(campaign.status)}
                          {getPositionBadge(campaign.position)}
                        </div>
                        <p className="text-sm text-muted-foreground">{campaign.advertiser}</p>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === 'active' && (
                          <Button variant="outline" size="sm">
                            <Pause className="h-3 w-3" />
                          </Button>
                        )}
                        {campaign.status === 'paused' && (
                          <Button variant="outline" size="sm">
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Impressões</p>
                        <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cliques</p>
                        <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CTR</p>
                        <p className="font-semibold">{campaign.ctr.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Receita</p>
                        <p className="font-semibold text-secondary">
                          R$ {campaign.revenue.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {campaign.status === 'active' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Orçamento utilizado</span>
                          <span className="font-medium">
                            R$ {campaign.revenue.toFixed(2)} / R$ {campaign.budget.toFixed(2)}
                          </span>
                        </div>
                        <Progress 
                          value={(campaign.revenue / campaign.budget) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(campaign.startDate).toLocaleDateString('pt-BR')} - {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-3 w-3 mr-2" />
                        Relatório
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-8 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma campanha encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Não há campanhas que correspondam aos filtros selecionados.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                }}>
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ad Positions */}
        <div className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Espaços Publicitários</CardTitle>
              <CardDescription>Posições disponíveis para anúncios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adPositions.map((position) => (
                <div key={position.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-foreground">{position.name}</h4>
                      <Badge 
                        variant={position.availability === "Disponível" ? "default" : "outline"}
                        className={`text-xs ${
                          position.availability === "Disponível" 
                            ? "bg-secondary text-secondary-foreground" 
                            : position.availability === "Ocupado" 
                              ? "bg-warning text-warning-foreground"
                              : ""
                        }`}
                      >
                        {position.availability}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{position.price}</p>
                    {position.availability === "Disponível" && (
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Reservar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Mês</CardTitle>
              <CardDescription>Performance geral das campanhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <p className="text-muted-foreground mb-1">Campanhas Ativas</p>
                  <p className="text-xl font-bold text-secondary">
                    {adCampaigns.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <p className="text-muted-foreground mb-1">Meta do Mês</p>
                  <p className="text-xl font-bold text-primary">R$ 5.000</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso da meta</span>
                  <span className="font-medium">
                    {((totalRevenue / 5000) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(totalRevenue / 5000) * 100} className="h-2" />
              </div>

              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Top Performance</p>
                <div className="space-y-1">
                  {adCampaigns
                    .filter(c => c.status === 'active')
                    .sort((a, b) => b.ctr - a.ctr)
                    .slice(0, 2)
                    .map((campaign) => (
                      <div key={campaign.id} className="flex justify-between text-xs">
                        <span className="truncate mr-2">{campaign.name}</span>
                        <span className="font-medium text-secondary">{campaign.ctr.toFixed(2)}%</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}