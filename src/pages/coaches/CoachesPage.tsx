import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ListPagination } from "@/components/ui/list-controls"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { CoachForm } from "@/components/forms/CoachForm"
import { useToast } from "@/hooks/use-toast"

interface Coach {
  id: string
  name: string
  role?: string
  nationality: string
  birthDate?: string
  imagePrimaryUrl?: string
  imageSecondaryUrl?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
  groupId?: string
}

const mockCoaches: Coach[] = [
  {
    id: "1",
    name: "Pep Guardiola",
    role: "Head Coach",
    nationality: "Spain",
    birthDate: "1971-01-18",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true,
    groupId: "1"
  },
  {
    id: "2",
    name: "Carlo Ancelotti",
    role: "Head Coach",
    nationality: "Italy",
    birthDate: "1959-06-10",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true,
    groupId: "2"
  },
  {
    id: "3",
    name: "Jurgen Klopp",
    role: "Head Coach",
    nationality: "Germany",
    birthDate: "1967-06-16",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: false
  }
]

export default function CoachesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Data states
  const [coaches, setCoaches] = useState<Coach[]>(mockCoaches)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null)

  const { toast } = useToast()

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingCoach(null)
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

  // Filter coaches
  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coach.role?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      coach.nationality.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "Enabled" && coach.enabled) ||
      (statusFilter === "Disabled" && !coach.enabled)

    return matchesSearch && matchesStatus
  })

  const handleEdit = (coach: Coach) => {
    setEditingCoach(coach)
    setShowForm(true)
  }

  const handleView = (id: string) => {
    navigate(`/coaches/${id}`)
  }

  const handleNewCoach = () => {
    setEditingCoach(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setCoaches(coaches.filter(coach => coach.id !== id))
    toast({
      title: "Coach deleted",
      description: "The coach was removed successfully.",
    })
  }

  if (showForm) {
    return (
      <CoachForm
        initialData={editingCoach ? {
          name: editingCoach.name,
          role: editingCoach.role,
          nationality: editingCoach.nationality,
          birthDate: editingCoach.birthDate ? new Date(editingCoach.birthDate) : undefined,
          imagePrimaryUrl: editingCoach.imagePrimaryUrl,
          imageSecondaryUrl: editingCoach.imageSecondaryUrl,
          enabled: editingCoach.enabled
        } : undefined}
        isEdit={!!editingCoach}
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
          <p className="text-muted-foreground">Loading coaches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Coaches</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewCoach} className="gap-2">
            <Plus className="h-4 w-4" />
            New Coach
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
          { value: "all", label: "All coaches" }
        ]}
        statuses={[
          { value: "all", label: "All statuses" },
          { value: "Enabled", label: "Enabled" },
          { value: "Disabled", label: "Disabled" }
        ]}
        searchPlaceholder="Search coaches..."
        categoryPlaceholder="Category"
        statusPlaceholder="Status"
      />

      <Card className="border-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoaches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((coach) => (
                <TableRow key={coach.id}>
                  <TableCell>
                    {coach.imagePrimaryUrl ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={coach.imagePrimaryUrl} alt={coach.name} />
                        <AvatarFallback>
                          {coach.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {coach.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/coaches/${coach.id}`} className="font-medium hover:underline">
                      {coach.name}
                    </Link>
                  </TableCell>
                  <TableCell>{coach.role || "-"}</TableCell>
                  <TableCell>{coach.nationality}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {coach.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onView={() => handleView(coach.id)}
                      onEdit={() => handleEdit(coach)}
                      onDelete={() => handleDelete(coach.id)}
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
        totalPages={Math.ceil(filteredCoaches.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {}}
        totalItems={filteredCoaches.length}
      />
    </div>
  )
}
