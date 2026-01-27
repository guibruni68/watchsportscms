import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ListPagination } from "@/components/ui/list-controls"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { AgentForm } from "@/components/forms/AgentForm"
import { useToast } from "@/hooks/use-toast"

interface Agent {
  id: string
  name: string
  label: "player" | "coach" | "writer"
  genres?: string[]
  originDate?: string
  nationality: string
  imagePrimaryUrl?: string
  imageSecondaryUrl?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
  groupId?: string
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Lionel Messi",
    label: "player",
    genres: ["genre-agent-10"],
    nationality: "Argentina",
    originDate: "1987-06-24",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true,
    groupId: "1"
  },
  {
    id: "2",
    name: "Gerard Piqué",
    label: "player",
    genres: ["genre-agent-2"],
    nationality: "Spain",
    originDate: "1987-02-02",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true,
    groupId: "1"
  },
  {
    id: "3",
    name: "Pep Guardiola",
    label: "coach",
    genres: ["genre-agent-12"],
    nationality: "Spain",
    originDate: "1971-01-18",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true,
    groupId: "1"
  },
  {
    id: "4",
    name: "Cristiano Ronaldo",
    label: "player",
    genres: ["genre-agent-10"],
    nationality: "Portugal",
    originDate: "1985-02-05",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true,
    groupId: "2"
  },
  {
    id: "5",
    name: "John Smith",
    label: "writer",
    genres: ["genre-agent-14"],
    nationality: "United Kingdom",
    originDate: "1985-08-15",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  }
]

export default function AgentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Data states
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  
  const { toast } = useToast()

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingAgent(null)
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

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.nationality.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || agent.label === categoryFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "Enabled" && agent.enabled) ||
      (statusFilter === "Disabled" && !agent.enabled)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent)
    setShowForm(true)
  }

  const handleNewAgent = () => {
    setEditingAgent(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setAgents(agents.filter(agent => agent.id !== id))
    toast({
      title: "Agent deleted",
      description: "The agent was removed successfully.",
    })
  }

  if (showForm) {
    return (
      <AgentForm
        initialData={editingAgent ? {
          name: editingAgent.name,
          label: editingAgent.label,
          genres: editingAgent.genres,
          nationality: editingAgent.nationality,
          originDate: editingAgent.originDate ? new Date(editingAgent.originDate) : undefined,
          imagePrimaryUrl: editingAgent.imagePrimaryUrl,
          imageSecondaryUrl: editingAgent.imageSecondaryUrl,
          enabled: editingAgent.enabled
        } : undefined}
        isEdit={!!editingAgent}
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
          <p className="text-muted-foreground">Loading agents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewAgent} className="gap-2">
            <Plus className="h-4 w-4" />
            New Agent
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
          { value: "all", label: "All labels" },
          { value: "player", label: "Player" },
          { value: "coach", label: "Coach" },
          { value: "writer", label: "Writer" }
        ]}
        statuses={[
          { value: "all", label: "All statuses" },
          { value: "Enabled", label: "Enabled" },
          { value: "Disabled", label: "Disabled" }
        ]}
        searchPlaceholder="Search agents..."
        categoryPlaceholder="Label"
        statusPlaceholder="Status"
      />

      <Card className="bg-gradient-card border-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    {agent.imagePrimaryUrl ? (
                      <Avatar className="h-10 w-10">
                        <img src={agent.imagePrimaryUrl} alt={agent.name} className="object-cover" />
                        <AvatarFallback>
                          {agent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {agent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>
                    <span className="capitalize">{agent.label}</span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {agent.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onView={() => navigate(`/agents/${agent.id}`)}
                      onEdit={() => handleEditAgent(agent)}
                      onDelete={() => handleDelete(agent.id)}
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
        totalPages={Math.ceil(filteredAgents.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {}}
        totalItems={filteredAgents.length}
      />
    </div>
  )
}
