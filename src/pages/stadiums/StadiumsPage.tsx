import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Loader2, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ListPagination } from "@/components/ui/list-controls"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { StadiumForm } from "@/components/forms/StadiumForm"
import { useToast } from "@/hooks/use-toast"

interface Stadium {
  id: string
  name: string
  city: string
  country: string
  address?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
}

const mockStadiums: Stadium[] = [
  {
    id: "1",
    name: "Camp Nou",
    city: "Barcelona",
    country: "Spain",
    address: "C. d'Arístides Maillol, 12-18",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true
  },
  {
    id: "2",
    name: "Santiago Bernabéu",
    city: "Madrid",
    country: "Spain",
    address: "Av. de Concha Espina, 1",
    imageUrl: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  },
  {
    id: "3",
    name: "Old Trafford",
    city: "Manchester",
    country: "United Kingdom",
    address: "Sir Matt Busby Way, Old Trafford",
    imageUrl: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: false
  }
]

export default function StadiumsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Data states
  const [stadiums, setStadiums] = useState<Stadium[]>(mockStadiums)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStadium, setEditingStadium] = useState<Stadium | null>(null)

  const { toast } = useToast()

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingStadium(null)
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

  // Filter stadiums
  const filteredStadiums = stadiums.filter(stadium => {
    const matchesSearch = stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "Enabled" && stadium.enabled) ||
      (statusFilter === "Disabled" && !stadium.enabled)

    return matchesSearch && matchesStatus
  })

  const handleEdit = (stadium: Stadium) => {
    setEditingStadium(stadium)
    setShowForm(true)
  }

  const handleNewStadium = () => {
    setEditingStadium(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setStadiums(stadiums.filter(stadium => stadium.id !== id))
    toast({
      title: "Stadium deleted",
      description: "The stadium was removed successfully.",
    })
  }

  if (showForm) {
    return (
      <StadiumForm
        initialData={editingStadium ? {
          name: editingStadium.name,
          city: editingStadium.city,
          country: editingStadium.country,
          address: editingStadium.address,
          imageUrl: editingStadium.imageUrl,
          enabled: editingStadium.enabled
        } : undefined}
        isEdit={!!editingStadium}
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
          <p className="text-muted-foreground">Loading stadiums...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stadiums</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewStadium} className="gap-2">
            <Plus className="h-4 w-4" />
            New Stadium
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
          { value: "all", label: "All stadiums" }
        ]}
        statuses={[
          { value: "all", label: "All statuses" },
          { value: "Enabled", label: "Enabled" },
          { value: "Disabled", label: "Disabled" }
        ]}
        searchPlaceholder="Search stadiums..."
        categoryPlaceholder="Category"
        statusPlaceholder="Status"
      />

      <Card className="border-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStadiums.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((stadium) => (
                <TableRow key={stadium.id}>
                  <TableCell>
                    {stadium.imageUrl ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={stadium.imageUrl} alt={stadium.name} />
                        <AvatarFallback>
                          <MapPin className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <MapPin className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {stadium.name}
                    </span>
                  </TableCell>
                  <TableCell>{stadium.city}</TableCell>
                  <TableCell>{stadium.country}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {stadium.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onEdit={() => handleEdit(stadium)}
                      onDelete={() => handleDelete(stadium.id)}
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
        totalPages={Math.ceil(filteredStadiums.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {}}
        totalItems={filteredStadiums.length}
      />
    </div>
  )
}
