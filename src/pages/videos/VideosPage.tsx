import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Play, 
  Upload, 
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Clock,
  Edit,
  Trash2,
  Download
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const videos = [
    {
      id: 1,
      title: "Treino da Semana - Preparação para o Clássico",
      thumbnail: "/placeholder.svg",
      category: "Treinos",
      duration: "8:45",
      views: 1250,
      status: "published",
      publishedAt: "2024-01-15",
      size: "145 MB"
    },
    {
      id: 2,
      title: "Entrevista: Novo Reforço do Time",
      thumbnail: "/placeholder.svg",
      category: "Entrevistas",
      duration: "15:30",
      views: 890,
      status: "published",
      publishedAt: "2024-01-14",
      size: "287 MB"
    },
    {
      id: 3,
      title: "Bastidores: Concentração antes do Jogo",
      thumbnail: "/placeholder.svg",
      category: "Bastidores",
      duration: "12:15",
      views: 2140,
      status: "published",
      publishedAt: "2024-01-13",
      size: "198 MB"
    },
    {
      id: 4,
      title: "Gols da Partida - Vitória por 3x1",
      thumbnail: "/placeholder.svg",
      category: "Melhores Momentos",
      duration: "5:20",
      views: 3420,
      status: "published",
      publishedAt: "2024-01-12",
      size: "89 MB"
    },
    {
      id: 5,
      title: "Análise Táctica da Temporada",
      thumbnail: "/placeholder.svg",
      category: "Análises",
      duration: "22:10",
      views: 0,
      status: "draft",
      publishedAt: "",
      size: "385 MB"
    },
    {
      id: 6,
      title: "Tour pelas Instalações do Clube",
      thumbnail: "/placeholder.svg",
      category: "Institucional",
      duration: "18:45",
      views: 156,
      status: "processing",
      publishedAt: "",
      size: "312 MB"
    }
  ]

  const categories = ["Treinos", "Entrevistas", "Bastidores", "Melhores Momentos", "Análises", "Institucional"]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-secondary text-secondary-foreground">Publicado</Badge>
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>
      case "processing":
        return <Badge className="bg-warning text-warning-foreground">Processando</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || video.category === filterCategory
    const matchesStatus = filterStatus === "all" || video.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vídeos VOD</h1>
          <p className="text-muted-foreground">Gerencie sua biblioteca de vídeos sob demanda</p>
        </div>
        <Button className="bg-gradient-primary shadow-glow hover:shadow-lg transition-all">
          <Upload className="h-4 w-4 mr-2" />
          Upload de Vídeo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Vídeos</p>
                <p className="text-2xl font-bold text-foreground">127</p>
              </div>
              <Play className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visualizações</p>
                <p className="text-2xl font-bold text-foreground">45.2K</p>
              </div>
              <Eye className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Duração Total</p>
                <p className="text-2xl font-bold text-foreground">18h</p>
              </div>
              <Clock className="h-6 w-6 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Armazenamento</p>
                <p className="text-2xl font-bold text-foreground">2.4GB</p>
              </div>
              <Download className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vídeos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300 group">
            <CardContent className="p-0">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {video.duration}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  {getStatusBadge(video.status)}
                </div>
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70">
                        <MoreVertical className="h-4 w-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {video.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{video.views.toLocaleString()}</span>
                  </div>
                  <span>{video.size}</span>
                </div>

                {video.publishedAt && (
                  <p className="text-xs text-muted-foreground">
                    Publicado em {new Date(video.publishedAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center">
            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum vídeo encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não há vídeos que correspondam aos filtros selecionados.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("")
              setFilterCategory("all")
              setFilterStatus("all")
            }}>
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}