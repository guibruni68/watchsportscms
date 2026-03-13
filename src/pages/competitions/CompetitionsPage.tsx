import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getEnabledBadgeVariant, getEnabledLabel } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Plus, Loader2 } from "lucide-react"
import { ListPagination } from "@/components/ui/list-controls"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { CompetitionForm } from "@/components/forms/CompetitionForm"
import { useToast } from "@/hooks/use-toast"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

interface Competition {
  id: string
  name: string
  acronym: string
  description: string
  type: "league" | "cup" | "tournament"
  logoUrl?: string
  cardImageUrl?: string
  bannerImageUrl?: string
  originDate?: string
  country?: string
  teamsCount?: number
  createdAt: string
  updatedAt: string
  enabled: boolean
}

const mockCompetitions: Competition[] = [
  {
    id: "1",
    name: "A League Basketball",
    acronym: "ALB",
    description: "Principal liga de basquete profissional da região sul do Brasil",
    type: "league",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20A%20League.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20A%20League.png",
    originDate: "2015-03-15",
    country: "Brazil",
    teamsCount: 12,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true
  },
  {
    id: "2",
    name: "B League Basketball",
    acronym: "BLB",
    description: "Segunda divisão do campeonato de basquete com times em desenvolvimento",
    type: "league",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20B%20League.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20B%20League.png",
    originDate: "2018-06-20",
    country: "Brazil",
    teamsCount: 16,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  },
  {
    id: "3",
    name: "International Basketball League",
    acronym: "IBL",
    description: "Competição internacional com os melhores times da América do Sul",
    type: "cup",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20Internation%20League.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20Internation%20League.png",
    originDate: "2010-09-01",
    country: "South America",
    teamsCount: 24,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-05T00:00:00",
    enabled: true
  },
  {
    id: "4",
    name: "Super League Basketball",
    acronym: "SLB",
    description: "Torneio eliminatório com os campeões de cada estado",
    type: "tournament",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20Super%20League.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20Super%20League.png",
    originDate: "2020-01-10",
    country: "Brazil",
    teamsCount: 32,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  },
  {
    id: "5",
    name: "World Basketball League",
    acronym: "WBL",
    description: "Liga mundial com times de elite de todos os continentes",
    type: "cup",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20WBL.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card%20-%20WBL.png",
    originDate: "2005-08-12",
    country: "World",
    teamsCount: 48,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: false
  },
]

export default function CompetitionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Data states
  const [competitions, setCompetitions] = useState<Competition[]>(mockCompetitions)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null })

  const { toast } = useToast()

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingCompetition(null)
      searchParams.delete('new')
      setSearchParams(searchParams)
    }
  }, [searchParams, setSearchParams])

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // Mock data is already loaded, but you can fetch from API here
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter competitions
  const filteredCompetitions = competitions.filter(competition => {
    const matchesSearch = competition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competition.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (competition.country && competition.country.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || competition.type === categoryFilter
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "Enabled" && competition.enabled) ||
      (statusFilter === "Disabled" && !competition.enabled)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition)
    setShowForm(true)
  }

  const handleView = (id: string) => {
    navigate(`/competitions/${id}`)
  }

  const handleNewCompetition = () => {
    setEditingCompetition(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setDeleteDialog({ open: true, id })
  }

  const confirmDelete = () => {
    if (!deleteDialog.id) return
    setCompetitions(prev => prev.filter(competition => competition.id !== deleteDialog.id))
    setDeleteDialog({ open: false, id: null })
    toast({ title: "Deleted", description: "Item deleted successfully." })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "league": return "League"
      case "cup": return "Cup"
      case "tournament": return "Tournament"
      default: return type
    }
  }


  if (showForm) {
    return (
      <CompetitionForm
        initialData={editingCompetition ? {
          name: editingCompetition.name,
          acronym: editingCompetition.acronym,
          description: editingCompetition.description,
          type: editingCompetition.type,
          logoUrl: editingCompetition.logoUrl,
          cardImageUrl: editingCompetition.cardImageUrl,
          bannerImageUrl: editingCompetition.bannerImageUrl,
          originDate: editingCompetition.originDate ? new Date(editingCompetition.originDate) : undefined,
          country: editingCompetition.country,
          enabled: editingCompetition.enabled
        } : undefined}
        isEdit={!!editingCompetition}
        onClose={() => setShowForm(false)}
      />
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading competitions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Competitions</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewCompetition} className="gap-2">
            <Plus className="h-4 w-4" />
            New Competition
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
        categories={[
          { value: "all", label: "All types" },
          { value: "league", label: "League" },
          { value: "cup", label: "Cup" },
          { value: "tournament", label: "Tournament" },
        ]}
        statuses={[
          { value: "all", label: "All statuses" },
          { value: "Enabled", label: "Enabled" },
          { value: "Disabled", label: "Disabled" }
        ]}
        searchPlaceholder="Search competitions..."
        categoryPlaceholder="Type"
        statusPlaceholder="Status"
      />

      <Card className="border-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompetitions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((competition) => (
                <TableRow key={competition.id}>
                  <TableCell>
                    <div className="w-14 h-14 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      {competition.logoUrl ? (
                        <img
                          src={competition.logoUrl}
                          alt={competition.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Trophy className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link to={`/competitions/${competition.id}`} className="font-medium hover:underline">
                      {competition.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {getTypeLabel(competition.type)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral">
                      {competition.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onView={() => handleView(competition.id)}
                      onEdit={() => handleEdit(competition)}
                      onDelete={() => handleDelete(competition.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ListPagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredCompetitions.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {}}
        totalItems={filteredCompetitions.length}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </div>
  )
}
