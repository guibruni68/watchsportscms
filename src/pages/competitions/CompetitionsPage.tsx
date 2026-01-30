import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Plus, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ListPagination } from "@/components/ui/list-controls"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { CompetitionForm } from "@/components/forms/CompetitionForm"
import { useToast } from "@/hooks/use-toast"

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
    name: "La Liga",
    acronym: "LaLiga",
    description: "The top professional football division of the Spanish football league system",
    type: "league",
    logoUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100",
    cardImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400",
    bannerImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200",
    originDate: "1929-02-10",
    country: "Spain",
    teamsCount: 20,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true
  },
  {
    id: "2",
    name: "UEFA Champions League",
    acronym: "UCL",
    description: "Annual club football competition organised by UEFA and contested by top European clubs",
    type: "cup",
    logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100",
    cardImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
    originDate: "1955-09-04",
    country: "Europe",
    teamsCount: 32,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  },
  {
    id: "3",
    name: "Copa del Rey",
    acronym: "CDR",
    description: "Annual knockout football cup competition in Spanish football",
    type: "cup",
    logoUrl: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=100",
    originDate: "1903-01-01",
    country: "Spain",
    teamsCount: 83,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-05T00:00:00",
    enabled: true
  },
  {
    id: "4",
    name: "Premier League",
    acronym: "EPL",
    description: "The top level of the English football league system",
    type: "league",
    originDate: "1992-02-20",
    country: "United Kingdom",
    teamsCount: 20,
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
    setCompetitions(competitions.filter(c => c.id !== id))
    toast({
      title: "Competition deleted",
      description: "The competition was removed successfully.",
    })
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
                <TableHead>Acronym</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompetitions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((competition) => (
                <TableRow key={competition.id}>
                  <TableCell>
                    {competition.logoUrl ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={competition.logoUrl} alt={competition.name} />
                        <AvatarFallback>{competition.acronym}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback><Trophy className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/competitions/${competition.id}`} className="font-medium hover:underline">
                      {competition.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{competition.acronym}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {getTypeLabel(competition.type)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {competition.country || "-"}
                  </TableCell>
                  <TableCell>
                    {competition.teamsCount || "-"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {competition.enabled ? "Enabled" : "Disabled"}
                    </span>
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
    </div>
  )
}
