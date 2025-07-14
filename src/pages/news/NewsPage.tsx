import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Calendar, Star } from "lucide-react"
import { NewsForm } from "@/components/forms/NewsForm"
import { ListControls } from "@/components/ui/list-controls"

interface News {
  id: string
  titulo: string
  conteudo: string
  destaque: boolean
  imagemCapa?: string
  dataPublicacao: string
  views: number
}

const mockNews: News[] = [
  {
    id: "1",
    titulo: "Nova City Sparks anuncia contratação de novo armador para 2024",
    conteudo: "O clube confirmou hoje a contratação do armador Marcus Johnson, de 28 anos, que vem da liga americana. O jogador assinou contrato por três temporadas e já está liberado para jogar.",
    destaque: true,
    dataPublicacao: "2024-01-18T14:30:00",
    views: 3421
  },
  {
    id: "2",
    titulo: "Ingressos para a final já estão à venda",
    conteudo: "A partir de hoje, os torcedores já podem adquirir seus ingressos para a grande final do campeonato estadual. Os preços variam de R$ 50 a R$ 200.",
    destaque: false,
    dataPublicacao: "2024-01-17T10:15:00",
    views: 1876
  },
  {
    id: "3",
    titulo: "Time feminino conquista acesso à primeira divisão",
    conteudo: "Com uma campanha brilhante, o time feminino garantiu o acesso à primeira divisão do campeonato estadual. A equipe não perdeu nenhum jogo na fase final.",
    destaque: true,
    dataPublicacao: "2024-01-16T16:45:00",
    views: 2987
  }
]

export default function NewsPage() {
  const [news, setNews] = useState<News[]>(mockNews)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const filteredNews = news.filter(item =>
    item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem)
    setShowForm(true)
  }

  const handleNewNews = () => {
    setEditingNews(null)
    setShowForm(true)
  }

  if (showForm) {
    return (
      <NewsForm 
        initialData={editingNews ? {
          titulo: editingNews.titulo,
          conteudo: editingNews.conteudo,
          destaque: editingNews.destaque,
          imagemCapa: editingNews.imagemCapa
        } : undefined}
        isEdit={!!editingNews}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notícias</h1>
          <p className="text-muted-foreground">Gerencie as notícias e artigos do clube</p>
        </div>
        <Button onClick={handleNewNews} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Notícia
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar notícias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ListControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items)
          setCurrentPage(1)
        }}
        totalItems={filteredNews.length}
      />

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "grid gap-4"}>
        {paginatedNews.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{item.titulo}</h3>
                        {item.destaque && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {item.conteudo.replace(/<[^>]*>/g, "")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {item.destaque && (
                        <Badge variant="default">
                          Destaque
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.dataPublicacao).toLocaleDateString("pt-BR")}
                    </div>
                    <div>
                      {item.views.toLocaleString()} visualizações
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {paginatedNews.length === 0 && filteredNews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm ? "Nenhuma notícia encontrada com este termo." : "Nenhuma notícia cadastrada ainda."}
            </div>
            {!searchTerm && (
              <Button onClick={handleNewNews} className="mt-4">
                Criar Primeira Notícia
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}