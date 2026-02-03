import React, { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Eye, Calendar, Play, Filter } from "lucide-react"
import { ImportButton } from "@/components/ui/import-button"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { VideoForm } from "@/components/forms/VideoForm"
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils"

interface Video {
  id: string
  title: string
  description: string
  genre: string[]
  tags: string[]
  publishDate: string
  views: number
  duration: string
  available: boolean
  thumbnail?: string
}

const mockVideos: Video[] = [
  {
    id: "1",
    title: "Buzzer Beater: Vitória épica no último segundo",
    description: "Os melhores momentos da vitória dramática com cesta no estouro do cronômetro",
    genre: ["Goals and Highlights", "Best Moments"],
    tags: ["buzzer beater", "vitória", "playoffs"],
    publishDate: "2024-01-15T20:30:00",
    views: 15420,
    duration: "05:32",
    available: true,
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/04542e4202afd169555c7c2693804706a2fa64e5.png"
  },
  {
    id: "2",
    title: "Triple-Double histórico do armador",
    description: "Reveja a performance incrível com pontos, assistências e rebotes",
    genre: ["Interviews", "Backstage"],
    tags: ["triple-double", "armador", "recorde"],
    publishDate: "2025-12-15T14:00:00",
    views: 8931,
    duration: "12:18",
    available: false,
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/1d986d6d01b285b9919ce7999ac9e722c4840aaf.png"
  },
  {
    id: "3",
    title: "Treino intenso de arremessos de 3 pontos",
    description: "Veja como os jogadores aprimoram a precisão nos arremessos de longa distância",
    genre: ["Behind the Scenes"],
    tags: ["treino", "arremesso", "3 pontos"],
    publishDate: "2024-01-10T16:45:00",
    views: 5672,
    duration: "08:15",
    available: false,
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/1d986d6d01b285b9919ce7999ac9e722c4840aaf.png"
  },
  {
    id: "4",
    title: "Enterradas espetaculares da temporada",
    description: "As melhores dunks que eletrificaram a torcida nesta temporada",
    genre: ["Press Conference"],
    tags: ["enterradas", "dunks", "highlights"],
    publishDate: "2024-01-08T11:00:00",
    views: 3245,
    duration: "15:42",
    available: true,
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/27356cffab990f52a5f57edf87e0c6b97602eebc.png"
  },
  {
    id: "5",
    title: "Análise tática: Defesa zona 2-3",
    description: "Entenda como a defesa em zona tem sido decisiva nos jogos",
    genre: ["Analysis"],
    tags: ["análise", "tática", "defesa"],
    publishDate: "2024-01-06T19:30:00",
    views: 12850,
    duration: "18:22",
    available: true,
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/27356cffab990f52a5f57edf87e0c6b97602eebc.png"
  },
  {
    id: "6",
    title: "Tocos memoráveis: Os bloqueios da semana",
    description: "As melhores defesas e bloqueios que salvaram o time",
    genre: ["Training"],
    tags: ["tocos", "bloqueios", "defesa"],
    publishDate: "2024-01-05T09:15:00",
    views: 7423,
    duration: "06:45",
    available: true,
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/34d1567ec77c0dfb903c34f17dc09bf06c7fdf4a.png"
  },
  {
    id: "7",
    title: "Alley-oop perfeito: Conexão entre armador e pivô",
    description: "A jogada ensaiada que virou marca registrada do time",
    genre: ["Institutional"],
    tags: ["alley-oop", "jogada", "parceria"],
    publishDate: "2024-01-04T16:20:00",
    views: 21340,
    duration: "04:18",
    available: true,
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/3b9955fd994fada0c92464563b2a10537e8ac849.png"
  },
  {
    id: "8",
    title: "Crossover e dribles: A arte do ala-armador",
    description: "Os movimentos mais impressionantes do nosso craque",
    genre: ["Goals and Highlights"],
    tags: ["crossover", "dribles", "skills"],
    publishDate: "2024-01-03T20:00:00",
    views: 18765,
    duration: "09:33",
    available: true,
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/509f32f74898993508d86eb0ef535dc2691ff80f.png"
  },
  {
    id: "9",
    title: "Entrevista com técnico sobre renovação",
    description: "Comandante fala sobre a renovação de contrato",
    genre: ["Interviews"],
    tags: ["entrevista", "técnico", "renovação"],
    publishDate: "2024-01-02T14:30:00",
    views: 9876,
    duration: "08:52",
    available: false
  },
  {
    id: "10",
    title: "Bastidores da viagem para São Paulo",
    description: "Acompanhe a delegação na viagem para o jogo fora",
    genre: ["Behind the Scenes"],
    tags: ["bastidores", "viagem", "são paulo"],
    publishDate: "2024-01-01T07:45:00",
    views: 6543,
    duration: "11:27",
    available: true
  },
  {
    id: "11",
    title: "Defesas incríveis do goleiro",
    description: "As melhores defesas do arqueiro da temporada",
    genre: ["Goals and Highlights"],
    tags: ["defesas", "goleiro", "incríveis"],
    publishDate: "2023-12-30T18:15:00",
    views: 13245,
    duration: "07:20",
    available: true
  },
  {
    id: "12",
    title: "Treino físico intenso",
    description: "Preparação física para a sequência de jogos",
    genre: ["Training"],
    tags: ["treino", "físico", "intenso"],
    publishDate: "2023-12-29T08:30:00",
    views: 4567,
    duration: "12:08",
    available: true
  },
  {
    id: "13",
    title: "Homenagem aos veteranos",
    description: "Clube presta homenagem aos jogadores mais experientes",
    genre: ["Institutional"],
    tags: ["homenagem", "veteranos", "clube"],
    publishDate: "2023-12-28T17:00:00",
    views: 8901,
    duration: "14:35",
    available: true
  },
  {
    id: "14",
    title: "Análise do sistema defensivo",
    description: "Como a defesa tem se comportado nas últimas partidas",
    genre: ["Analysis"],
    tags: ["análise", "defesa", "sistema"],
    publishDate: "2023-12-27T15:45:00",
    views: 6789,
    duration: "16:12",
    available: false
  },
  {
    id: "15",
    title: "Concentração antes do clássico",
    description: "Ambiente no hotel antes do grande jogo",
    genre: ["Behind the Scenes"],
    tags: ["concentração", "clássico", "hotel"],
    publishDate: "2023-12-26T19:30:00",
    views: 15432,
    duration: "09:47",
    available: true
  },
  {
    id: "16",
    title: "Entrevista com jovem promessa",
    description: "Conversamos com o jovem que vem se destacando",
    genre: ["Interviews"],
    tags: ["entrevista", "jovem", "promessa"],
    publishDate: "2023-12-25T13:20:00",
    views: 7654,
    duration: "10:33",
    available: true
  },
  {
    id: "17",
    title: "Dribles e jogadas especiais",
    description: "Os melhores dribles e jogadas da temporada",
    genre: ["Goals and Highlights"],
    tags: ["dribles", "jogadas", "especiais"],
    publishDate: "2023-12-24T16:00:00",
    views: 19876,
    duration: "08:24",
    available: true
  },
  {
    id: "18",
    title: "Treino tático para o próximo jogo",
    description: "Preparação específica para enfrentar o adversário",
    genre: ["Training"],
    tags: ["treino", "tático", "próximo"],
    publishDate: "2023-12-23T10:15:00",
    views: 5432,
    duration: "13:56",
    available: false
  },
  {
    id: "19",
    title: "Coletiva pós-vitória épica",
    description: "Reações após a vitória no último minuto",
    genre: ["Press Conference"],
    tags: ["coletiva", "vitória", "épica"],
    publishDate: "2023-12-22T22:45:00",
    views: 11234,
    duration: "12:47",
    available: true
  },
  {
    id: "20",
    title: "Projeto social do clube",
    description: "Conheca as ações sociais desenvolvidas pelo clube",
    genre: ["Institutional"],
    tags: ["projeto", "social", "clube"],
    publishDate: "2023-12-21T14:30:00",
    views: 6789,
    duration: "17:22",
    available: true
  }
]

export default function VideosPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingVideo(null)
      // Remove the param from URL
      searchParams.delete('new')
      setSearchParams(searchParams)
    }
  }, [searchParams, setSearchParams])

  const categories = Array.from(new Set(videos.flatMap(v => v.genre || [])))

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.genre || []).some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === "all" || (video.genre || []).includes(categoryFilter)
    
    const videoStatus = getContentStatus(video.available, video.publishDate)
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "Active" && videoStatus === "Active") ||
      (statusFilter === "Inactive" && videoStatus === "Inactive") ||
      (statusFilter === "Publishing" && videoStatus === "Publishing")
    
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

  const handleView = (id: string) => {
    navigate(`/videos/${id}`)
  }

  const handleNewVideo = () => {
    setEditingVideo(null)
    setShowForm(true)
  }

  if (showForm) {
    return (
      <VideoForm 
        initialData={editingVideo ? {
          titulo: editingVideo.title,
          descricao: editingVideo.description,
          generos: editingVideo.genre || [],
          tag: "Destaque",
          tags: editingVideo.tags.join(", "),
          scheduleDate: new Date(editingVideo.publishDate),
        } : undefined}
        isEdit={!!editingVideo}
        onClose={() => setShowForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Videos (VOD)</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewVideo} className="gap-2">
            <Plus className="h-4 w-4" />
            New Video
          </Button>
        </div>
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
          { value: "all", label: "All Genres" },
          ...categories.map(cat => ({ value: cat, label: cat }))
        ]}
        statuses={[
          { value: "all", label: "All Statuses" },
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
          { value: "Publishing", label: "Publishing" }
        ]}
        searchPlaceholder="Search Video..."
        categoryPlaceholder="Genre"
        statusPlaceholder="Status"
      />

      {/* Tabela */}
      <Card className="border-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Thumb</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="min-w-[250px]">Genres</TableHead>
              <TableHead className="w-32">Publish Date</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVideos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <div className="w-24 aspect-[3/2] bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {video.thumbnail ? (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium truncate">{video.title}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {(video.genre || []).join(", ")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(video.publishDate).toLocaleDateString("pt-BR")}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                    {getContentStatus(video.available, video.publishDate)}
                  </span>
                </TableCell>
                <TableCell>
                  <ActionDropdown
                    onView={() => handleView(video.id)}
                    onEdit={() => handleEdit(video)}
                    onDelete={() => handleDelete(video.id)}
                    showView={true}
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
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVideos.length)} of {filteredVideos.length} videos
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
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {filteredVideos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "No videos found with the applied filters."
                : "No videos registered yet."}
            </div>
            {!searchTerm && categoryFilter === "all" && statusFilter === "all" && (
              <Button onClick={handleNewVideo} className="mt-4">
                Create First Video
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}