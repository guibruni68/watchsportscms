import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ListPagination } from "@/components/ui/list-controls"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { PlayerForm } from "@/components/forms/PlayerForm"
import { useToast } from "@/hooks/use-toast"

interface Player {
  id: string
  name: string
  position?: string
  nationality: string
  birthDate?: string
  imagePrimaryUrl?: string
  imageSecondaryUrl?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
  groupId?: string
}

const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Lionel Messi",
    position: "Forward",
    nationality: "Argentina",
    birthDate: "1987-06-24",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true,
    groupId: "1"
  },
  {
    id: "2",
    name: "Gerard Piqué",
    position: "Defender",
    nationality: "Spain",
    birthDate: "1987-02-02",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true,
    groupId: "1"
  },
  {
    id: "3",
    name: "Cristiano Ronaldo",
    position: "Forward",
    nationality: "Portugal",
    birthDate: "1985-02-05",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true,
    groupId: "2"
  },
  {
    id: "4",
    name: "Neymar Jr",
    position: "Forward",
    nationality: "Brazil",
    birthDate: "1992-02-05",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: false
  }
]

export default function PlayersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Data states
  const [players, setPlayers] = useState<Player[]>(mockPlayers)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  const { toast } = useToast()

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingPlayer(null)
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

  // Filter players
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.position?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      player.nationality.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "Enabled" && player.enabled) ||
      (statusFilter === "Disabled" && !player.enabled)

    return matchesSearch && matchesStatus
  })

  const handleEdit = (player: Player) => {
    setEditingPlayer(player)
    setShowForm(true)
  }

  const handleView = (id: string) => {
    navigate(`/players/${id}`)
  }

  const handleNewPlayer = () => {
    setEditingPlayer(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setPlayers(players.filter(player => player.id !== id))
    toast({
      title: "Player deleted",
      description: "The player was removed successfully.",
    })
  }

  if (showForm) {
    return (
      <PlayerForm
        initialData={editingPlayer ? {
          name: editingPlayer.name,
          position: editingPlayer.position,
          nationality: editingPlayer.nationality,
          birthDate: editingPlayer.birthDate ? new Date(editingPlayer.birthDate) : undefined,
          imagePrimaryUrl: editingPlayer.imagePrimaryUrl,
          imageSecondaryUrl: editingPlayer.imageSecondaryUrl,
          enabled: editingPlayer.enabled
        } : undefined}
        isEdit={!!editingPlayer}
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
          <p className="text-muted-foreground">Loading players...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Players</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewPlayer} className="gap-2">
            <Plus className="h-4 w-4" />
            New Player
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
          { value: "all", label: "All players" }
        ]}
        statuses={[
          { value: "all", label: "All statuses" },
          { value: "Enabled", label: "Enabled" },
          { value: "Disabled", label: "Disabled" }
        ]}
        searchPlaceholder="Search players..."
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
                <TableHead>Position</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    {player.imagePrimaryUrl ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={player.imagePrimaryUrl} alt={player.name} />
                        <AvatarFallback>
                          {player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/players/${player.id}`} className="font-medium hover:underline">
                      {player.name}
                    </Link>
                  </TableCell>
                  <TableCell>{player.position || "-"}</TableCell>
                  <TableCell>{player.nationality}</TableCell>
                  <TableCell>
                    <Badge variant={player.enabled ? "default" : "secondary"}>
                      {player.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onView={() => handleView(player.id)}
                      onEdit={() => handleEdit(player)}
                      onDelete={() => handleDelete(player.id)}
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
        totalPages={Math.ceil(filteredPlayers.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {}}
        totalItems={filteredPlayers.length}
      />
    </div>
  )
}
