import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ListPagination } from "@/components/ui/list-controls"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { RefereeForm } from "@/components/forms/RefereeForm"
import { Badge } from "@/components/ui/badge"
import { getEnabledBadgeVariant, getEnabledLabel } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Referee {
  id: string
  name: string
  fullName: string
  sportType: string
  imagePrimaryUrl?: string
  imageSecondaryUrl?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
}

const sportTypeLabels: Record<string, string> = {
  football: "Football",
  basketball: "Basketball",
  volleyball: "Volleyball",
  handball: "Handball",
  futsal: "Futsal",
  tennis: "Tennis",
  swimming: "Swimming",
  athletics: "Athletics",
}

const mockReferees: Referee[] = [
  {
    id: "1",
    name: "Carlos Silva",
    fullName: "Carlos Alberto da Silva",
    sportType: "basketball",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true
  },
  {
    id: "2",
    name: "Maria Santos",
    fullName: "Maria Eduarda Santos",
    sportType: "volleyball",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  },
  {
    id: "3",
    name: "João Oliveira",
    fullName: "João Pedro Oliveira",
    sportType: "football",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: false
  }
]

export default function RefereesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Data states
  const [referees, setReferees] = useState<Referee[]>(mockReferees)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReferee, setEditingReferee] = useState<Referee | null>(null)

  const { toast } = useToast()

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingReferee(null)
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

  // Filter referees
  const filteredReferees = referees.filter(referee => {
    const matchesSearch = referee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sportTypeLabels[referee.sportType]?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || referee.sportType === categoryFilter
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "Enabled" && referee.enabled) ||
      (statusFilter === "Disabled" && !referee.enabled)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleEdit = (referee: Referee) => {
    setEditingReferee(referee)
    setShowForm(true)
  }

  const handleNewReferee = () => {
    setEditingReferee(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setReferees(referees.filter(referee => referee.id !== id))
    toast({
      title: "Referee deleted",
      description: "The referee was removed successfully.",
    })
  }


  if (showForm) {
    return (
      <RefereeForm
        initialData={editingReferee ? {
          name: editingReferee.name,
          fullName: editingReferee.fullName,
          sportType: editingReferee.sportType,
          imagePrimaryUrl: editingReferee.imagePrimaryUrl,
          imageSecondaryUrl: editingReferee.imageSecondaryUrl,
          enabled: editingReferee.enabled
        } : undefined}
        isEdit={!!editingReferee}
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
          <p className="text-muted-foreground">Loading referees...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Referees</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewReferee} className="gap-2">
            <Plus className="h-4 w-4" />
            New Referee
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
          { value: "all", label: "All sports" },
          { value: "football", label: "Football" },
          { value: "basketball", label: "Basketball" },
          { value: "volleyball", label: "Volleyball" },
          { value: "handball", label: "Handball" },
          { value: "futsal", label: "Futsal" },
          { value: "tennis", label: "Tennis" },
        ]}
        statuses={[
          { value: "all", label: "All statuses" },
          { value: "Enabled", label: "Enabled" },
          { value: "Disabled", label: "Disabled" }
        ]}
        searchPlaceholder="Search referees..."
        categoryPlaceholder="Sport Type"
        statusPlaceholder="Status"
      />

      <Card className="border-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Sport Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReferees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((referee) => (
                <TableRow key={referee.id}>
                  <TableCell>
                    {referee.imagePrimaryUrl ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={referee.imagePrimaryUrl} alt={referee.name} />
                        <AvatarFallback>
                          {referee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {referee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {referee.name}
                  </TableCell>
                  <TableCell>{referee.fullName}</TableCell>
                  <TableCell>{sportTypeLabels[referee.sportType] || referee.sportType}</TableCell>
                  <TableCell>
                    <Badge variant="neutral">
                      {referee.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onEdit={() => handleEdit(referee)}
                      onDelete={() => handleDelete(referee.id)}
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
        totalPages={Math.ceil(filteredReferees.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {}}
        totalItems={filteredReferees.length}
      />
    </div>
  )
}
