import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Newspaper, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Share,
  Heart,
  MessageCircle,
  TrendingUp
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const news = [
    {
      id: 1,
      title: "Clube Anuncia Novo Reforço para a Temporada 2024",
      excerpt: "Atacante argentino de 28 anos assina contrato por três temporadas e chega para fortalecer o elenco principal.",
      content: "O Clube Fictício FC anunciou oficialmente a contratação do atacante Carlos Mendez...",
      category: "Contratações",
      author: "João Silva",
      publishedAt: "2024-01-15T10:30:00",
      status: "published",
      views: 2450,
      likes: 189,
      comments: 45,
      thumbnail: "/placeholder.svg",
      featured: true
    },
    {
      id: 2,
      title: "Vitória por 3x1 Garante Classificação para as Quartas",
      excerpt: "Time principal vence clássico regional e avança na competição estadual com gols de Carlos, Roberto e Miguel.",
      content: "Em um jogo emocionante no Estádio Municipal, o Clube Fictício FC venceu o Rival FC por 3x1...",
      category: "Resultados",
      author: "Maria Santos",
      publishedAt: "2024-01-14T22:15:00",
      status: "published",
      views: 3200,
      likes: 298,
      comments: 78,
      thumbnail: "/placeholder.svg",
      featured: true
    },
    {
      id: 3,
      title: "Time Sub-20 na Final da Copa Regional",
      excerpt: "Jovens talentos vencem semifinal nos pênaltis e disputarão o título da competição no próximo domingo.",
      content: "O time Sub-20 do Clube Fictício FC garantiu vaga na final da Copa Regional...",
      category: "Base",
      author: "Pedro Costa",
      publishedAt: "2024-01-13T16:45:00",
      status: "published",
      views: 1890,
      likes: 156,
      comments: 32,
      thumbnail: "/placeholder.svg",
      featured: false
    },
    {
      id: 4,
      title: "Novo Centro de Treinamento Será Inaugurado em Março",
      excerpt: "Investimento de R$ 15 milhões criará instalações modernas para formação de atletas e preparação profissional.",
      content: "O Clube Fictício FC anunciou que o novo Centro de Treinamento será inaugurado em março...",
      category: "Institucional",
      author: "Ana Oliveira",
      publishedAt: "2024-01-12T14:20:00",
      status: "published",
      views: 1230,
      likes: 89,
      comments: 21,
      thumbnail: "/placeholder.svg",
      featured: false
    },
    {
      id: 5,
      title: "Entrevista Exclusiva com o Novo Técnico",
      excerpt: "José Antonio fala sobre seus planos, filosofia de jogo e expectativas para a nova temporada.",
      content: "Em entrevista exclusiva, o novo técnico José Antonio revelou seus planos...",
      category: "Entrevistas",
      author: "Carlos Mendes",
      publishedAt: "",
      status: "draft",
      views: 0,
      likes: 0,
      comments: 0,
      thumbnail: "/placeholder.svg",
      featured: false
    },
    {
      id: 6,
      title: "Campanha de Sócio-Torcedor Bate Recorde",
      excerpt: "Mais de 10 mil novos associados se cadastraram no programa de fidelidade do clube neste mês.",
      content: "A campanha de sócio-torcedor do Clube Fictício FC bateu todos os recordes...",
      category: "Torcida",
      author: "Lucia Ferreira",
      publishedAt: "",
      status: "scheduled",
      views: 0,
      likes: 0,
      comments: 0,
      thumbnail: "/placeholder.svg",
      featured: false
    }
  ]

  const categories = ["Contratações", "Resultados", "Base", "Institucional", "Entrevistas", "Torcida"]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-secondary text-secondary-foreground">Publicado</Badge>
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>
      case "scheduled":
        return <Badge className="bg-primary text-primary-foreground">Agendado</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || article.category === filterCategory
    const matchesStatus = filterStatus === "all" || article.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const publishedNews = news.filter(article => article.status === 'published')
  const totalViews = publishedNews.reduce((acc, article) => acc + article.views, 0)
  const totalLikes = publishedNews.reduce((acc, article) => acc + article.likes, 0)
  const totalComments = publishedNews.reduce((acc, article) => acc + article.comments, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notícias</h1>
          <p className="text-muted-foreground">Gerencie o conteúdo editorial do clube</p>
        </div>
        <Button className="bg-gradient-primary shadow-glow hover:shadow-lg transition-all">
          <Plus className="h-4 w-4 mr-2" />
          Nova Notícia
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Notícias</p>
                <p className="text-2xl font-bold text-foreground">{news.length}</p>
              </div>
              <Newspaper className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visualizações</p>
                <p className="text-2xl font-bold text-foreground">{totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Curtidas</p>
                <p className="text-2xl font-bold text-foreground">{totalLikes.toLocaleString()}</p>
              </div>
              <Heart className="h-6 w-6 text-warning fill-current" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Comentários</p>
                <p className="text-2xl font-bold text-foreground">{totalComments}</p>
              </div>
              <MessageCircle className="h-6 w-6 text-primary" />
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
                placeholder="Buscar notícias..."
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
                <SelectItem value="scheduled">Agendado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Featured News (if any published) */}
      {filteredNews.some(article => article.featured && article.status === 'published') && (
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Notícias em Destaque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews
                .filter(article => article.featured && article.status === 'published')
                .map((article) => (
                  <div key={article.id} className="group">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Newspaper className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{article.category}</Badge>
                        <Badge className="text-xs bg-warning text-warning-foreground">DESTAQUE</Badge>
                      </div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {article.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {article.comments}
                          </span>
                        </div>
                        <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <Card key={article.id} className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300 group">
            <CardContent className="p-0">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Newspaper className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="absolute top-2 left-2">
                  {getStatusBadge(article.status)}
                </div>
                {article.featured && article.status === 'published' && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-warning text-warning-foreground">DESTAQUE</Badge>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70">
                        <Filter className="h-4 w-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Compartilhar
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
                  <Badge variant="outline" className="text-xs mb-2">
                    {article.category}
                  </Badge>
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {article.excerpt}
                  </p>
                </div>

                {article.status === 'published' && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {article.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {article.comments}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="text-xs text-muted-foreground">
                    <p>Por {article.author}</p>
                    {article.publishedAt && (
                      <p>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Não há notícias que correspondam aos filtros selecionados.
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