import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Eye, Calendar, Tag } from "lucide-react"
import { VideoForm } from "@/components/forms/VideoForm"
import { ListControls, ListPagination } from "@/components/ui/list-controls"

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
  }
]

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const filteredVideos = videos.filter(video =>
    video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (video: Video) => {
    setEditingVideo(video)
    setShowForm(true)
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

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar vídeos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ListControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items)
          setCurrentPage(1)
        }}
        totalItems={filteredVideos.length}
      />

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "grid gap-4"}>
        {paginatedVideos.map((video) => (
          <Card key={video.id} className="transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 break-words">{video.titulo}</h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{video.descricao}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(video)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(video.dataPublicacao).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {video.views.toLocaleString()} visualizações
                    </div>
                    <div>
                      Duração: {video.duracao}
                    </div>
                    <div>
                      Categoria: {video.categoria}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items)
          setCurrentPage(1)
        }}
        totalItems={filteredVideos.length}
      />

      {paginatedVideos.length === 0 && filteredVideos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm ? "Nenhum vídeo encontrado com este termo." : "Nenhum vídeo cadastrado ainda."}
            </div>
            {!searchTerm && (
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