import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Star, Eye } from "lucide-react"
import { ImportButton } from "@/components/ui/import-button"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { NewsForm } from "@/components/forms/NewsForm"
import { toast } from "@/hooks/use-toast"

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
  },
  {
    id: "4",
    titulo: "Novo técnico é apresentado para a temporada 2024",
    conteudo: "Roberto Silva, de 45 anos, foi oficialmente apresentado como novo técnico da equipe principal. O profissional chega com vasta experiência em competições nacionais.",
    destaque: false,
    dataPublicacao: "2024-01-15T09:00:00",
    views: 1543
  },
  {
    id: "5",
    titulo: "Inauguração do novo centro de treinamento",
    conteudo: "O clube inaugurou suas novas instalações de treinamento, com academia, piscina e campos de última geração para melhor preparação dos atletas.",
    destaque: true,
    dataPublicacao: "2024-01-14T11:30:00",
    views: 4521
  }
]

export default function NewsPage() {
  const [news, setNews] = useState<News[]>(mockNews)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all") 
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const categories = [{ value: "all", label: "Todas as categorias" }]
  const statuses = [
    { value: "all", label: "Todos os status" },
    { value: "highlight", label: "Apenas destaques" },
    { value: "normal", label: "Apenas normais" }
  ]

  const filteredNews = news.filter(item => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all"
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "highlight" && item.destaque) ||
      (statusFilter === "normal" && !item.destaque)
    return matchesSearch && matchesCategory && matchesStatus
  })

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

  const handleDelete = (id: string) => {
    setNews(news.filter(item => item.id !== id))
    toast({
      title: "Notícia excluída",
      description: "A notícia foi removida com sucesso.",
    })
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
        <div className="flex gap-2">
          <ImportButton entityName="notícias" />
          <Button onClick={handleNewNews} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Notícia
          </Button>
        </div>
      </div>

      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={categories}
        statuses={statuses}
        searchPlaceholder="Buscar notícias..."
        categoryPlaceholder="Categoria"
        statusPlaceholder="Tipo"
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Visualizações</TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNews.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="max-w-md">
                    <p className="font-medium line-clamp-1">{item.titulo}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.conteudo.replace(/<[^>]*>/g, "")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(item.dataPublicacao).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {item.views.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  {item.destaque ? (
                    <Badge variant="default" className="gap-1">
                      <Star className="h-3 w-3" />
                      Destaque
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Normal</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                    showView={false}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {paginatedNews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" ? "Nenhuma notícia encontrada com os filtros aplicados." : "Nenhuma notícia cadastrada ainda."}
            </div>
            {!searchTerm && categoryFilter === "all" && statusFilter === "all" && (
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