import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Calendar, Target } from "lucide-react"
import { CampaignForm } from "@/components/forms/CampaignForm"
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
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || campaign.type === typeFilter
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
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
        <Button onClick={handleNewCampaign} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar campanhas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="banner">Banner</SelectItem>
            <SelectItem value="video">Vídeo</SelectItem>
            <SelectItem value="conteudo_destacado">Conteúdo Destacado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
                  <Badge variant="secondary">
                    {typeLabels[campaign.type]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={campaign.status === "active" ? "default" : "outline"}>
                    {campaign.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
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
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Campanha</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a campanha "{campaign.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(campaign.id)}>
                            Confirmar exclusão
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
              {searchTerm || typeFilter !== "all" || statusFilter !== "all" ? "Nenhuma campanha encontrada com os filtros aplicados." : "Nenhuma campanha cadastrada ainda."}
            </div>
            {!searchTerm && typeFilter === "all" && statusFilter === "all" && (
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