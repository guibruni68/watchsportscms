import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Eye, Calendar, Play, Filter } from "lucide-react"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { VideoForm } from "@/components/forms/VideoForm"

interface Video {
  id: string
  titulo: string
  descricao: string
  categoria: string
  tags: string[]
  dataPublicacao: string
  views: number
  duracao: string
  status: "publicado" | "rascunho"
}

const mockVideos: Video[] = [
  {
    id: "1",
    titulo: "Gols da vitória por 3x1 contra o Rival FC",
    descricao: "Melhores momentos da partida válida pelo campeonato estadual",
    categoria: "Gols e Melhores Momentos",
    tags: ["gols", "vitória", "campeonato"],
    dataPublicacao: "2024-01-15T20:30:00",
    views: 15420,
    duracao: "05:32",
    status: "publicado"
  },
  {
    id: "2", 
    titulo: "Entrevista com novo atacante contratado",
    descricao: "Primeiro bate-papo com o jogador que chegou para reforçar o ataque",
    categoria: "Entrevistas",
    tags: ["entrevista", "contratação", "atacante"],
    dataPublicacao: "2024-01-12T14:00:00",
    views: 8931,
    duracao: "12:18",
    status: "publicado"
  },
  {
    id: "3",
    titulo: "Bastidores do treino tático",
    descricao: "Como o time se prepara taticamente para os próximos jogos",
    categoria: "Bastidores",
    tags: ["treino", "tática", "preparação"],
    dataPublicacao: "2024-01-10T16:45:00",
    views: 5672,
    duracao: "08:15",
    status: "rascunho"
  },
  {
    id: "4",
    titulo: "Coletiva de imprensa pré-jogo",
    descricao: "Técnico e capitão falam sobre a próxima partida",
    categoria: "Coletivas",
    tags: ["coletiva", "imprensa", "pré-jogo"],
    dataPublicacao: "2024-01-08T11:00:00",
    views: 3245,
    duracao: "15:42",
    status: "publicado"
  },
  {
    id: "5",
    titulo: "Análise tática da derrota",
    descricao: "Entenda os pontos que precisam ser melhorados",
    categoria: "Análises",
    tags: ["análise", "tática", "derrota"],
    dataPublicacao: "2024-01-06T19:30:00",
    views: 12850,
    duracao: "18:22",
    status: "publicado"
  },
  {
    id: "6",
    titulo: "Treino de finalizações",
    descricao: "Atacantes trabalham a pontaria no CT",
    categoria: "Treinos",
    tags: ["treino", "finalizações", "atacantes"],
    dataPublicacao: "2024-01-05T09:15:00",
    views: 7423,
    duracao: "06:45",
    status: "publicado"
  },
  {
    id: "7",
    titulo: "Apresentação do novo uniforme",
    descricao: "Conheça os detalhes da nova camisa para 2024",
    categoria: "Institucional",
    tags: ["uniforme", "camisa", "2024"],
    dataPublicacao: "2024-01-04T16:20:00",
    views: 21340,
    duracao: "04:18",
    status: "publicado"
  },
  {
    id: "8",
    titulo: "Gols mais bonitos da temporada",
    descricao: "Relembre os melhores gols marcados pelo time",
    categoria: "Gols e Melhores Momentos",
    tags: ["gols", "temporada", "melhores"],
    dataPublicacao: "2024-01-03T20:00:00",
    views: 18765,
    duracao: "09:33",
    status: "publicado"
  },
  {
    id: "9",
    titulo: "Entrevista com técnico sobre renovação",
    descricao: "Comandante fala sobre a renovação de contrato",
    categoria: "Entrevistas",
    tags: ["entrevista", "técnico", "renovação"],
    dataPublicacao: "2024-01-02T14:30:00",
    views: 9876,
    duracao: "08:52",
    status: "rascunho"
  },
  {
    id: "10",
    titulo: "Bastidores da viagem para São Paulo",
    descricao: "Acompanhe a delegação na viagem para o jogo fora",
    categoria: "Bastidores",
    tags: ["bastidores", "viagem", "são paulo"],
    dataPublicacao: "2024-01-01T07:45:00",
    views: 6543,
    duracao: "11:27",
    status: "publicado"
  },
  {
    id: "11",
    titulo: "Defesas incríveis do goleiro",
    descricao: "As melhores defesas do arqueiro da temporada",
    categoria: "Gols e Melhores Momentos",
    tags: ["defesas", "goleiro", "incríveis"],
    dataPublicacao: "2023-12-30T18:15:00",
    views: 13245,
    duracao: "07:20",
    status: "publicado"
  },
  {
    id: "12",
    titulo: "Treino físico intenso",
    descricao: "Preparação física para a sequência de jogos",
    categoria: "Treinos",
    tags: ["treino", "físico", "intenso"],
    dataPublicacao: "2023-12-29T08:30:00",
    views: 4567,
    duracao: "12:08",
    status: "publicado"
  },
  {
    id: "13",
    titulo: "Homenagem aos veteranos",
    descricao: "Clube presta homenagem aos jogadores mais experientes",
    categoria: "Institucional",
    tags: ["homenagem", "veteranos", "clube"],
    dataPublicacao: "2023-12-28T17:00:00",
    views: 8901,
    duracao: "14:35",
    status: "publicado"
  },
  {
    id: "14",
    titulo: "Análise do sistema defensivo",
    descricao: "Como a defesa tem se comportado nas últimas partidas",
    categoria: "Análises",
    tags: ["análise", "defesa", "sistema"],
    dataPublicacao: "2023-12-27T15:45:00",
    views: 6789,
    duracao: "16:12",
    status: "rascunho"
  },
  {
    id: "15",
    titulo: "Concentração antes do clássico",
    descricao: "Ambiente no hotel antes do grande jogo",
    categoria: "Bastidores",
    tags: ["concentração", "clássico", "hotel"],
    dataPublicacao: "2023-12-26T19:30:00",
    views: 15432,
    duracao: "09:47",
    status: "publicado"
  },
  {
    id: "16",
    titulo: "Entrevista com jovem promessa",
    descricao: "Conversamos com o jovem que vem se destacando",
    categoria: "Entrevistas",
    tags: ["entrevista", "jovem", "promessa"],
    dataPublicacao: "2023-12-25T13:20:00",
    views: 7654,
    duracao: "10:33",
    status: "publicado"
  },
  {
    id: "17",
    titulo: "Dribles e jogadas especiais",
    descricao: "Os melhores dribles e jogadas da temporada",
    categoria: "Gols e Melhores Momentos",
    tags: ["dribles", "jogadas", "especiais"],
    dataPublicacao: "2023-12-24T16:00:00",
    views: 19876,
    duracao: "08:24",
    status: "publicado"
  },
  {
    id: "18",
    titulo: "Treino tático para o próximo jogo",
    descricao: "Preparação específica para enfrentar o adversário",
    categoria: "Treinos",
    tags: ["treino", "tático", "próximo"],
    dataPublicacao: "2023-12-23T10:15:00",
    views: 5432,
    duracao: "13:56",
    status: "rascunho"
  },
  {
    id: "19",
    titulo: "Coletiva pós-vitória épica",
    descricao: "Reações após a vitória no último minuto",
    categoria: "Coletivas",
    tags: ["coletiva", "vitória", "épica"],
    dataPublicacao: "2023-12-22T22:45:00",
    views: 11234,
    duracao: "12:47",
    status: "publicado"
  },
  {
    id: "20",
    titulo: "Projeto social do clube",
    descricao: "Conheca as ações sociais desenvolvidas pelo clube",
    categoria: "Institucional",
    tags: ["projeto", "social", "clube"],
    dataPublicacao: "2023-12-21T14:30:00",
    views: 6789,
    duracao: "17:22",
    status: "publicado"
  }
]

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const categories = Array.from(new Set(videos.map(v => v.categoria)))
  const statuses = Array.from(new Set(videos.map(v => v.status)))

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === "all" || video.categoria === categoryFilter
    const matchesStatus = statusFilter === "all" || video.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (video: Video) => {
    setEditingVideo(video)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setVideos(videos.filter(video => video.id !== id))
  }

  const handleNewVideo = () => {
    setEditingVideo(null)
    setShowForm(true)
  }

  if (showForm) {
    return (
      <VideoForm 
        initialData={editingVideo ? {
          titulo: editingVideo.titulo,
          descricao: editingVideo.descricao,
          categoria: editingVideo.categoria,
          tags: editingVideo.tags.join(", "),
          dataPublicacao: editingVideo.dataPublicacao.slice(0, 16),
        } : undefined}
        isEdit={!!editingVideo}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vídeos VOD</h1>
          <p className="text-muted-foreground">Gerencie o conteúdo de vídeos do clube</p>
        </div>
        <Button onClick={handleNewVideo} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Vídeo
        </Button>
      </div>

      {/* Filtros */}
      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={[
          { value: "all", label: "Todas as categorias" },
          ...categories.map(cat => ({ value: cat, label: cat }))
        ]}
        statuses={[
          { value: "all", label: "Todos os status" },
          ...statuses.map(status => ({ 
            value: status, 
            label: status === "publicado" ? "Publicado" : "Rascunho" 
          }))
        ]}
        searchPlaceholder="Buscar vídeos..."
        categoryPlaceholder="Categoria"
        statusPlaceholder="Status"
      />

      {/* Tabela */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Thumb</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="w-32">Data</TableHead>
              <TableHead className="w-24">Duração</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVideos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <div className="w-16 h-12 bg-muted rounded-md flex items-center justify-center">
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium truncate">{video.titulo}</div>
                    <div className="text-sm text-muted-foreground truncate">{video.descricao}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Eye className="h-3 w-3" />
                      {video.views.toLocaleString()} views
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{video.categoria}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(video.dataPublicacao).toLocaleDateString("pt-BR")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-mono">{video.duracao}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={video.status === "publicado" ? "default" : "outline"}>
                    {video.status === "publicado" ? "Publicado" : "Rascunho"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionDropdown
                    onEdit={() => handleEdit(video)}
                    onDelete={() => handleDelete(video.id)}
                    showView={false}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredVideos.length)} de {filteredVideos.length} vídeos
        </div>
        <div className="flex items-center gap-2">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => {
            setItemsPerPage(parseInt(value))
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>

      {filteredVideos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" 
                ? "Nenhum vídeo encontrado com os filtros aplicados." 
                : "Nenhum vídeo cadastrado ainda."}
            </div>
            {!searchTerm && categoryFilter === "all" && statusFilter === "all" && (
              <Button onClick={handleNewVideo} className="mt-4">
                Criar Primeiro Vídeo
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}