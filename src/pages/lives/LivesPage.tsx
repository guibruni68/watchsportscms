import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Calendar, Clock, Users } from "lucide-react"
import { LiveForm } from "@/components/forms/LiveForm"
import { ListControls, ListPagination } from "@/components/ui/list-controls"

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
  const [showForm, setShowForm] = useState(false)
  const [editingLive, setEditingLive] = useState<Live | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const filteredLives = lives.filter(live =>
    live.nomeEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    live.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <Button onClick={handleNewLive} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Live
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transmissões..."
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
        totalItems={filteredLives.length}
      />

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "grid gap-4"}>
        {paginatedLives.map((live) => (
          <Card key={live.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 break-words">{live.nomeEvento}</h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{live.descricao}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(live)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(live.dataHora).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(live.dataHora).toLocaleTimeString("pt-BR", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </div>
                    {live.viewers !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {live.viewers} {live.status === "ao_vivo" ? "assistindo" : "assistiram"}
                      </div>
                    )}
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
        totalItems={filteredLives.length}
      />

      {paginatedLives.length === 0 && filteredLives.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm ? "Nenhuma transmissão encontrada com este termo." : "Nenhuma transmissão cadastrada ainda."}
            </div>
            {!searchTerm && (
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