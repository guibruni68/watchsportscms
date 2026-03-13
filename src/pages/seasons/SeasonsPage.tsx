import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Plus, Loader2, Trophy } from "lucide-react"
import { ListPagination } from "@/components/ui/list-controls"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { SeasonForm } from "@/components/forms/SeasonForm"
import { useToast } from "@/hooks/use-toast"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { format } from "date-fns"

interface Season {
  id: string
  name: string
  competitionId?: string
  competitionName?: string
  startDate: string
  endDate: string
  status: "upcoming" | "active" | "completed"
  teamsCount: number
  createdAt: string
  updatedAt: string
}

const mockSeasons: Season[] = [
  {
    id: "1",
    name: "Temporada 2024/2025",
    competitionId: "1",
    competitionName: "A League Basketball",
    startDate: "2024-09-01",
    endDate: "2025-05-30",
    status: "active",
    teamsCount: 12,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00"
  },
  {
    id: "2",
    name: "Temporada 2023/2024",
    competitionId: "1",
    competitionName: "A League Basketball",
    startDate: "2023-09-01",
    endDate: "2024-05-30",
    status: "completed",
    teamsCount: 12,
    createdAt: "2023-01-01T00:00:00",
    updatedAt: "2024-05-30T00:00:00"
  },
  {
    id: "3",
    name: "Copa Brasil 2025",
    competitionId: "2",
    competitionName: "B League Basketball",
    startDate: "2025-01-15",
    endDate: "2025-04-20",
    status: "upcoming",
    teamsCount: 16,
    createdAt: "2024-10-01T00:00:00",
    updatedAt: "2024-10-01T00:00:00"
  },
  {
    id: "4",
    name: "Temporada 2024",
    competitionId: "3",
    competitionName: "International Basketball League",
    startDate: "2024-03-01",
    endDate: "2024-11-30",
    status: "active",
    teamsCount: 24,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-03-01T00:00:00"
  },
  {
    id: "5",
    name: "Torneio de Verão 2025",
    startDate: "2025-06-01",
    endDate: "2025-08-30",
    status: "upcoming",
    teamsCount: 8,
    createdAt: "2024-11-01T00:00:00",
    updatedAt: "2024-11-01T00:00:00"
  },
]

export default function SeasonsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Data states
  const [seasons, setSeasons] = useState<Season[]>(mockSeasons)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSeason, setEditingSeason] = useState<Season | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null })

  const { toast } = useToast()

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingSeason(null)
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

  // Filter seasons
  const filteredSeasons = seasons.filter(season => {
    const matchesSearch = season.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (season.competitionName && season.competitionName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || season.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleEdit = (season: Season) => {
    setEditingSeason(season)
    setShowForm(true)
  }

  const handleView = (id: string) => {
    navigate(`/seasons/${id}`)
  }

  const handleNewSeason = () => {
    setEditingSeason(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setDeleteDialog({ open: true, id })
  }

  const confirmDelete = () => {
    if (!deleteDialog.id) return
    setSeasons(prev => prev.filter(season => season.id !== deleteDialog.id))
    setDeleteDialog({ open: false, id: null })
    toast({ title: "Deleted", description: "Item deleted successfully." })
  }

  const getSeasonStatusVariant = (status: string): "success" | "info" | "outline" => {
    switch (status) {
      case "active":
        return "success"
      case "upcoming":
        return "info"
      case "completed":
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Active"
      case "upcoming": return "Upcoming"
      case "completed": return "Completed"
      default: return status
    }
  }

  if (showForm) {
    return (
      <SeasonForm
        initialData={editingSeason ? {
          name: editingSeason.name,
          competitionId: editingSeason.competitionId,
          startDate: new Date(editingSeason.startDate),
          endDate: new Date(editingSeason.endDate),
          status: editingSeason.status
        } : undefined}
        isEdit={!!editingSeason}
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
          <p className="text-muted-foreground">Loading seasons...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Seasons</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewSeason} className="gap-2">
            <Plus className="h-4 w-4" />
            New Season
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
        categories={[]}
        statuses={[
          { value: "all", label: "All statuses" },
          { value: "upcoming", label: "Upcoming" },
          { value: "active", label: "Active" },
          { value: "completed", label: "Completed" }
        ]}
        searchPlaceholder="Search seasons..."
        categoryPlaceholder=""
        statusPlaceholder="Status"
        showCategoryFilter={false}
      />

      <Card className="border-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSeasons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((season) => (
                <TableRow key={season.id}>
                  <TableCell>
                    <Link to={`/seasons/${season.id}`} className="font-medium hover:underline">
                      {season.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {season.competitionId && season.competitionName ? (
                      <Link
                        to={`/competitions/${season.competitionId}`}
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {season.competitionName}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(season.startDate), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(season.endDate), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {season.teamsCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral">
                      {getStatusLabel(season.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onView={() => handleView(season.id)}
                      onEdit={() => handleEdit(season)}
                      onDelete={() => handleDelete(season.id)}
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
        totalPages={Math.ceil(filteredSeasons.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {}}
        totalItems={filteredSeasons.length}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </div>
  )
}
