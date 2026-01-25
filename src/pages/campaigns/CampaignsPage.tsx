import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Calendar, Target } from "lucide-react"
import { ImportButton } from "@/components/ui/import-button"
import { CampaignForm } from "@/components/forms/CampaignForm"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { toast } from "@/hooks/use-toast"

interface Campaign {
  id: string
  name: string
  type: "banner" | "video" | "conteudo_destacado"
  status: "active" | "inactive"
  startDate: string
  endDate: string
  associations: string[]
  allowPreview: boolean
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Campanha Final do Campeonato",
    type: "banner",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-01-30",
    associations: ["final-campeonato", "ingressos"],
    allowPreview: true
  },
  {
    id: "2",
    name: "Promoção Novos Jogadores",
    type: "video",
    status: "active",
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    associations: ["apresentacao-elenco"],
    allowPreview: false
  },
  {
    id: "3",
    name: "Destaque Time Feminino",
    type: "conteudo_destacado",
    status: "inactive",
    startDate: "2024-01-05",
    endDate: "2024-01-20",
    associations: ["time-feminino"],
    allowPreview: true
  }
]

const typeLabels = {
  banner: "Banner",
  video: "Vídeo",
  conteudo_destacado: "Conteúdo Destacado"
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const categories = [
    { value: "all", label: "Todos os tipos" },
    { value: "banner", label: "Banner" },
    { value: "video", label: "Vídeo" },
    { value: "conteudo_destacado", label: "Conteúdo Destacado" }
  ]
  const statuses = [
    { value: "all", label: "Todos os status" },
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" }
  ]

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || campaign.type === categoryFilter
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setShowForm(true)
  }

  const handleNewCampaign = () => {
    setEditingCampaign(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id))
    toast({
      title: "Campanha excluída",
      description: "A campanha foi removida com sucesso.",
    })
  }

  if (showForm) {
    return (
      <CampaignForm 
        initialData={editingCampaign}
        isEdit={!!editingCampaign}
        onClose={() => setShowForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campanhas</h1>
          <p className="text-muted-foreground">Gerencie campanhas e promoções do clube</p>
        </div>
        <div className="flex gap-2">
          <ImportButton entityName="campanhas" />
          <Button onClick={handleNewCampaign} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Campanha
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
        searchPlaceholder="Buscar campanhas..."
        categoryPlaceholder="Tipo"
        statusPlaceholder="Status"
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Campanha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">{campaign.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {typeLabels[campaign.type]}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                    {campaign.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(campaign.startDate).toLocaleDateString("pt-BR")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(campaign.endDate).toLocaleDateString("pt-BR")}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    onEdit={() => handleEdit(campaign)}
                    onDelete={() => handleDelete(campaign.id)}
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

      {paginatedCampaigns.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" ? "Nenhuma campanha encontrada com os filtros aplicados." : "Nenhuma campanha cadastrada ainda."}
            </div>
            {!searchTerm && categoryFilter === "all" && statusFilter === "all" && (
              <Button onClick={handleNewCampaign} className="mt-4">
                Criar Primeira Campanha
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}