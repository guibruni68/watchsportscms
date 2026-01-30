import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ListPagination } from "@/components/ui/list-controls"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { TeamForm } from "@/components/forms/TeamForm"
import { useToast } from "@/hooks/use-toast"

interface Team {
  id: string
  name: string
  acronym: string
  description: string
  logoUrl?: string
  cardImageUrl?: string
  bannerImageUrl?: string
  originDate?: string
  city?: string
  country?: string
  stadiumId?: string
  stadiumName?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
}

const mockTeams: Team[] = [
  {
    id: "1",
    name: "FC Barcelona",
    acronym: "FCB",
    description: "Professional football club based in Barcelona, Catalonia, Spain",
    logoUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100",
    cardImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400",
    bannerImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200",
    originDate: "1899-11-29",
    city: "Barcelona",
    country: "Spain",
    stadiumId: "1",
    stadiumName: "Camp Nou",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true
  },
  {
    id: "2",
    name: "Real Madrid CF",
    acronym: "RMA",
    description: "Spanish professional football club based in Madrid",
    logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100",
    cardImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
    originDate: "1902-03-06",
    city: "Madrid",
    country: "Spain",
    stadiumId: "2",
    stadiumName: "Santiago Bernabéu",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  },
  {
    id: "3",
    name: "Manchester United",
    acronym: "MUN",
    description: "English professional football club based in Old Trafford",
    logoUrl: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=100",
    originDate: "1878-01-01",
    city: "Manchester",
    country: "United Kingdom",
    stadiumId: "3",
    stadiumName: "Old Trafford",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-05T00:00:00",
    enabled: false
  },
]

export default function TeamsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Data states
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  const { toast } = useToast()

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingTeam(null)
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

  // Get unique countries for filter
  const countries = Array.from(new Set(teams.map(t => t.country).filter(Boolean))) as string[]

  // Filter teams
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.city && team.city.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || team.country === categoryFilter
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "Enabled" && team.enabled) ||
      (statusFilter === "Disabled" && !team.enabled)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleEdit = (team: Team) => {
    setEditingTeam(team)
    setShowForm(true)
  }

  const handleView = (id: string) => {
    navigate(`/teams/${id}`)
  }

  const handleNewTeam = () => {
    setEditingTeam(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setTeams(teams.filter(team => team.id !== id))
    toast({
      title: "Team deleted",
      description: "The team was removed successfully.",
    })
  }

  if (showForm) {
    return (
      <TeamForm
        initialData={editingTeam ? {
          name: editingTeam.name,
          acronym: editingTeam.acronym,
          description: editingTeam.description,
          logoUrl: editingTeam.logoUrl,
          cardImageUrl: editingTeam.cardImageUrl,
          bannerImageUrl: editingTeam.bannerImageUrl,
          originDate: editingTeam.originDate ? new Date(editingTeam.originDate) : undefined,
          city: editingTeam.city,
          country: editingTeam.country,
          stadiumId: editingTeam.stadiumId,
          enabled: editingTeam.enabled
        } : undefined}
        isEdit={!!editingTeam}
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
          <p className="text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewTeam} className="gap-2">
            <Plus className="h-4 w-4" />
            New Team
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
          { value: "all", label: "All countries" },
          ...countries.map(c => ({ value: c, label: c }))
        ]}
        statuses={[
          { value: "all", label: "All statuses" },
          { value: "Enabled", label: "Enabled" },
          { value: "Disabled", label: "Disabled" }
        ]}
        searchPlaceholder="Search teams..."
        categoryPlaceholder="Country"
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
                <TableHead>Stadium</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    {team.logoUrl ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={team.logoUrl} alt={team.name} />
                        <AvatarFallback>{team.acronym}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback><Users className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/teams/${team.id}`} className="font-medium hover:underline">
                      {team.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{team.acronym}</Badge>
                  </TableCell>
                  <TableCell>
                    {team.stadiumName || "-"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {team.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onView={() => handleView(team.id)}
                      onEdit={() => handleEdit(team)}
                      onDelete={() => handleDelete(team.id)}
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
        totalPages={Math.ceil(filteredTeams.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {}}
        totalItems={filteredTeams.length}
      />
    </div>
  )
}
