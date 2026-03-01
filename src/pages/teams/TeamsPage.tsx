import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getEnabledBadgeVariant, getEnabledLabel } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Loader2 } from "lucide-react"
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
    name: "Basement Basketball",
    acronym: "BSM",
    description: "Time de basquete profissional com tradição e história",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
    originDate: "2010-05-15",
    city: "Curitiba",
    country: "Brazil",
    stadiumId: "1",
    stadiumName: "Arena Basement",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true
  },
  {
    id: "2",
    name: "Big City Thunder",
    acronym: "BCT",
    description: "O trovão da grande cidade no basquete nacional",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
    originDate: "2012-03-20",
    city: "São Paulo",
    country: "Brazil",
    stadiumId: "2",
    stadiumName: "Thunder Arena",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-14T00:00:00",
    enabled: true
  },
  {
    id: "3",
    name: "Iron Hill",
    acronym: "IRH",
    description: "Força e determinação do morro de ferro",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-ironhill.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-ironhill.png",
    originDate: "2008-07-10",
    city: "Belo Horizonte",
    country: "Brazil",
    stadiumId: "3",
    stadiumName: "Iron Arena",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-13T00:00:00",
    enabled: true
  },
  {
    id: "4",
    name: "Loriela",
    acronym: "LOR",
    description: "Elegância e técnica em cada jogada",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-loriela.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-loriela.png",
    originDate: "2015-01-25",
    city: "Rio de Janeiro",
    country: "Brazil",
    stadiumId: "4",
    stadiumName: "Loriela Center",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-12T00:00:00",
    enabled: true
  },
  {
    id: "5",
    name: "Luna Sparks",
    acronym: "LSP",
    description: "Brilhando como as estrelas da lua",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-lunasparks.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-lunasparks.png",
    originDate: "2018-09-15",
    city: "Florianópolis",
    country: "Brazil",
    stadiumId: "5",
    stadiumName: "Sparks Arena",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-11T00:00:00",
    enabled: true
  },
  {
    id: "6",
    name: "Northern",
    acronym: "NTH",
    description: "O poder do norte no basquete brasileiro",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-northern.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-northern.png",
    originDate: "2005-11-30",
    city: "Manaus",
    country: "Brazil",
    stadiumId: "6",
    stadiumName: "Northern Dome",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  },
  {
    id: "7",
    name: "Nova City",
    acronym: "NVC",
    description: "A nova geração do basquete urbano",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-novacity.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-novacity.png",
    originDate: "2020-02-14",
    city: "Brasília",
    country: "Brazil",
    stadiumId: "7",
    stadiumName: "Nova Arena",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-09T00:00:00",
    enabled: true
  },
  {
    id: "8",
    name: "Outlaws",
    acronym: "OUT",
    description: "Jogando fora das regras, dentro das quadras",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-outlaws.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-outlaws.png",
    originDate: "2016-06-01",
    city: "Porto Alegre",
    country: "Brazil",
    stadiumId: "8",
    stadiumName: "Outlaws Den",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-08T00:00:00",
    enabled: false
  },
  {
    id: "9",
    name: "Pinevale",
    acronym: "PNV",
    description: "Do vale dos pinheiros para as quadras",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-pinevale.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-pinevale.png",
    originDate: "2011-04-22",
    city: "Curitiba",
    country: "Brazil",
    stadiumId: "9",
    stadiumName: "Pinevale Court",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-07T00:00:00",
    enabled: true
  },
  {
    id: "10",
    name: "Queens",
    acronym: "QNS",
    description: "Rainhas da quadra, dominando o jogo",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-queens.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-queens.png",
    originDate: "2019-08-08",
    city: "Salvador",
    country: "Brazil",
    stadiumId: "10",
    stadiumName: "Queens Palace",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-06T00:00:00",
    enabled: true
  },
  {
    id: "11",
    name: "Red Rock",
    acronym: "RRK",
    description: "Sólidos como a rocha vermelha",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-redrock.png",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-redrock.png",
    originDate: "2007-12-05",
    city: "Recife",
    country: "Brazil",
    stadiumId: "11",
    stadiumName: "Red Rock Arena",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-05T00:00:00",
    enabled: true
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <div className="w-14 h-14 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      {team.logoUrl ? (
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
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
                    <Badge variant="neutral">
                      {team.enabled ? "Enabled" : "Disabled"}
                    </Badge>
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
