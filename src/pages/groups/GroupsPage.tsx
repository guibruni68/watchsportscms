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
import { GroupForm } from "@/components/forms/GroupForm"
import { useToast } from "@/hooks/use-toast"

interface Group {
  id: string
  name: string
  acronym: string
  genre: "league" | "team"
  description: string
  logoUrl?: string
  cardImageUrl?: string
  bannerImageUrl?: string
  originDate?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "FC Barcelona",
    acronym: "FCB",
    genre: "team",
    description: "Professional football club based in Barcelona, Catalonia, Spain",
    logoUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100",
    cardImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400",
    bannerImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200",
    originDate: "1899-11-29",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true
  },
  {
    id: "2",
    name: "Real Madrid CF",
    acronym: "RMA",
    genre: "team",
    description: "Spanish professional football club based in Madrid",
    logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100",
    cardImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
    originDate: "1902-03-06",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  },
]

export default function GroupsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Data states
  const [groups, setGroups] = useState<Group[]>(mockGroups)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  
  const { toast } = useToast()

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingGroup(null)
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

  // Filter groups
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "Enabled" && group.enabled) ||
      (statusFilter === "Disabled" && !group.enabled)
    
    return matchesSearch && matchesStatus
  })

  const handleEdit = (group: Group) => {
    setEditingGroup(group)
    setShowForm(true)
  }

  const handleView = (id: string) => {
    navigate(`/groups/${id}`)
  }

  const handleNewGroup = () => {
    setEditingGroup(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setGroups(groups.filter(group => group.id !== id))
    toast({
      title: "Group deleted",
      description: "The group was removed successfully.",
    })
  }

  if (showForm) {
    return (
      <GroupForm 
        initialData={editingGroup ? {
          name: editingGroup.name,
          acronym: editingGroup.acronym,
          description: editingGroup.description,
          logoUrl: editingGroup.logoUrl,
          cardImageUrl: editingGroup.cardImageUrl,
          bannerImageUrl: editingGroup.bannerImageUrl,
          originDate: editingGroup.originDate ? new Date(editingGroup.originDate) : undefined,
          enabled: editingGroup.enabled
        } : undefined}
        isEdit={!!editingGroup}
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
          <p className="text-muted-foreground">Loading groups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewGroup} className="gap-2">
            <Plus className="h-4 w-4" />
            New Group
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
          { value: "all", label: "All groups" }
        ]}
        statuses={[
          { value: "all", label: "All statuses" },
          { value: "Enabled", label: "Enabled" },
          { value: "Disabled", label: "Disabled" }
        ]}
        searchPlaceholder="Search groups..."
        categoryPlaceholder="Category"
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    {group.logoUrl ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={group.logoUrl} alt={group.name} />
                        <AvatarFallback>{group.acronym}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback><Users className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/groups/${group.id}`} className="font-medium hover:underline">
                      {group.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{group.acronym}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {group.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onView={() => handleView(group.id)}
                      onEdit={() => handleEdit(group)}
                      onDelete={() => handleDelete(group.id)}
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
        totalPages={Math.ceil(filteredGroups.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {}}
        totalItems={filteredGroups.length}
      />
    </div>
  )
}
