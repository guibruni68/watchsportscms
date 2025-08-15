import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Play, Users } from "lucide-react"
import { ImportButton } from "@/components/ui/import-button"
import { LiveForm } from "@/components/forms/LiveForm"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { toast } from "@/hooks/use-toast"

interface Live {
  id: string
  nomeEvento: string
  descricao: string
  dataHora: string
  status: "em_breve" | "ao_vivo" | "encerrado"
  viewers?: number
  playerEmbed?: string
}

const mockLives: Live[] = [
  {
    id: "1",
    nomeEvento: "Final do Campeonato Estadual",
    descricao: "Transmissão ao vivo da grande final contra o tradicional rival",
    dataHora: "2024-01-20T16:00:00",
    status: "em_breve",
    viewers: 0
  },
  {
    id: "2",
    nomeEvento: "Apresentação do novo elenco 2024",
    descricao: "Coletiva de imprensa com apresentação dos novos jogadores",
    dataHora: "2024-01-18T10:00:00",
    status: "ao_vivo",
    viewers: 1247
  },
  {
    id: "3",
    nomeEvento: "Jogo-treino preparatório",
    descricao: "Último teste antes da estreia no campeonato",
    dataHora: "2024-01-15T15:00:00",
    status: "encerrado",
    viewers: 892
  },
  {
    id: "4",
    nomeEvento: "Entrevista com o técnico",
    descricao: "Conversa exclusiva sobre a temporada 2024",
    dataHora: "2024-01-14T14:00:00",
    status: "encerrado",
    viewers: 567
  },
  {
    id: "5",
    nomeEvento: "Treino aberto para torcedores",
    descricao: "Acompanhe o treino da equipe antes do jogo decisivo",
    dataHora: "2024-01-22T09:00:00",
    status: "em_breve",
    viewers: 0
  }
]

const statusLabels = {
  em_breve: "Em Breve",
  ao_vivo: "Ao Vivo",
  encerrado: "Encerrado"
}

export default function LivesPage() {
  const [lives, setLives] = useState<Live[]>(mockLives)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingLive, setEditingLive] = useState<Live | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const categories = [{ value: "all", label: "Todas as categorias" }]
  const statuses = [
    { value: "all", label: "Todos os status" },
    { value: "em_breve", label: "Em Breve" },
    { value: "ao_vivo", label: "Ao Vivo" },
    { value: "encerrado", label: "Encerrado" }
  ]

  const filteredLives = lives.filter(live => {
    const matchesSearch = live.nomeEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      live.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all"
    const matchesStatus = statusFilter === "all" || live.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.ceil(filteredLives.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLives = filteredLives.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (live: Live) => {
    setEditingLive(live)
    setShowForm(true)
  }

  const handleNewLive = () => {
    setEditingLive(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setLives(lives.filter(live => live.id !== id))
    toast({
      title: "Live excluída",
      description: "A transmissão foi removida com sucesso.",
    })
  }

  if (showForm) {
    return (
      <LiveForm 
        initialData={editingLive ? {
          nomeEvento: editingLive.nomeEvento,
          descricao: editingLive.descricao,
          dataHora: editingLive.dataHora.slice(0, 16),
          status: editingLive.status,
          playerEmbed: editingLive.playerEmbed
        } : undefined}
        isEdit={!!editingLive}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transmissões ao Vivo</h1>
          <p className="text-muted-foreground">Gerencie as lives e eventos do clube</p>
        </div>
        <div className="flex gap-2">
          <ImportButton entityName="transmissões" />
          <Button onClick={handleNewLive} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Live
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
        searchPlaceholder="Buscar transmissões..."
        categoryPlaceholder="Categoria"
        statusPlaceholder="Status"
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Viewers</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLives.map((live) => (
              <TableRow key={live.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{live.nomeEvento}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{live.descricao}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{new Date(live.dataHora).toLocaleDateString("pt-BR")}</p>
                    <p className="text-muted-foreground">
                      {new Date(live.dataHora).toLocaleTimeString("pt-BR", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    live.status === "ao_vivo" ? "default" : 
                    live.status === "em_breve" ? "secondary" : "outline"
                  }>
                    {live.status === "ao_vivo" && <Play className="h-3 w-3 mr-1" />}
                    {statusLabels[live.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {live.viewers || 0}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    onEdit={() => handleEdit(live)}
                    onDelete={() => handleDelete(live.id)}
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

      {paginatedLives.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" ? "Nenhuma transmissão encontrada com os filtros aplicados." : "Nenhuma transmissão cadastrada ainda."}
            </div>
            {!searchTerm && categoryFilter === "all" && statusFilter === "all" && (
              <Button onClick={handleNewLive} className="mt-4">
                Criar Primeira Live
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}