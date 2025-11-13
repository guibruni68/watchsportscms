import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Edit, Calendar, Users, User, X, Search } from "lucide-react"
import { GroupForm } from "@/components/forms/GroupForm"
import { ActionDropdown } from "@/components/ui/action-dropdown"

// Mock data - replace with actual data fetching
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

interface Agent {
  id: string
  name: string
  label: "player" | "coach" | "writer"
  genre?: string  // Position for agents
  originDate?: string
  nationality: string
  imagePrimaryUrl?: string
  imageSecondaryUrl?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
}

const mockGroup: Group = {
  id: "1",
  name: "FC Barcelona",
  acronym: "FCB",
  genre: "team",
  description: "Professional football club based in Barcelona, Catalonia, Spain. Founded in 1899 by a group of Swiss, Catalan, German, and English footballers led by Joan Gamper, the club has become a symbol of Catalan culture and Catalanism.",
  logoUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100",
  cardImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400",
  bannerImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200",
  originDate: "1899-11-29",
  createdAt: "2024-01-01T00:00:00",
  updatedAt: "2024-01-15T00:00:00",
  enabled: true
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Lionel Messi",
    label: "player",
    genre: "Forward",
    nationality: "Argentina",
    originDate: "1987-06-24",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    enabled: true
  },
  {
    id: "2",
    name: "Gerard Piqué",
    label: "player",
    genre: "Defender",
    nationality: "Spain",
    originDate: "1987-02-02",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  },
  {
    id: "3",
    name: "Pep Guardiola",
    label: "coach",
    genre: "Head Coach",
    nationality: "Spain",
    originDate: "1971-01-18",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    enabled: true
  }
]

// Available agents not yet in the group
const mockAvailableAgents: Agent[] = [
  {
    id: "4",
    name: "Cristiano Ronaldo",
    label: "player",
    genre: "Forward",
    nationality: "Portugal",
    originDate: "1985-02-05",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  },
  {
    id: "5",
    name: "Neymar Jr",
    label: "player",
    genre: "Forward",
    nationality: "Brazil",
    originDate: "1992-02-05",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  },
  {
    id: "6",
    name: "Carlo Ancelotti",
    label: "coach",
    genre: "Head Coach",
    nationality: "Italy",
    originDate: "1959-06-10",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  },
  {
    id: "7",
    name: "Sergio Ramos",
    label: "player",
    genre: "Defender",
    nationality: "Spain",
    originDate: "1986-03-30",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  },
  {
    id: "8",
    name: "John Smith",
    label: "writer",
    genre: "Sports Journalist",
    nationality: "United Kingdom",
    originDate: "1985-08-15",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  },
  {
    id: "9",
    name: "Virgil van Dijk",
    label: "player",
    genre: "Defender",
    nationality: "Netherlands",
    originDate: "1991-07-08",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1564510714747-69c3e0354c63?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1564510714747-69c3e0354c63?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  },
  {
    id: "10",
    name: "Kylian Mbappé",
    label: "player",
    genre: "Forward",
    nationality: "France",
    originDate: "1998-12-20",
    imagePrimaryUrl: "https://images.unsplash.com/photo-1586555877784-e929e42a5ad4?w=100",
    imageSecondaryUrl: "https://images.unsplash.com/photo-1586555877784-e929e42a5ad4?w=1200",
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    enabled: true
  }
]


export default function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [group] = useState<Group>(mockGroup)
  const [agents] = useState<Agent[]>(mockAgents)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  
  // Add Agent Dialog state
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false)
  const [agentSearchTerm, setAgentSearchTerm] = useState("")
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([])
  
  // Filter available agents based on search
  const filteredAvailableAgents = mockAvailableAgents.filter(agent =>
    agent.name.toLowerCase().includes(agentSearchTerm.toLowerCase()) ||
    agent.label.toLowerCase().includes(agentSearchTerm.toLowerCase()) ||
    agent.nationality.toLowerCase().includes(agentSearchTerm.toLowerCase())
  )
  
  const handleAddAgents = () => {
    // Here you would add the selected agents to the group
    console.log("Adding agents:", selectedAgentIds)
    setShowAddAgentDialog(false)
    setSelectedAgentIds([])
    setAgentSearchTerm("")
  }
  
  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgentIds(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  if (showEditForm) {
    return (
      <GroupForm
        initialData={{
          name: group.name,
          acronym: group.acronym,
          genre: group.genre,
          description: group.description,
          logoUrl: group.logoUrl,
          cardImageUrl: group.cardImageUrl,
          bannerImageUrl: group.bannerImageUrl,
          originDate: group.originDate ? new Date(group.originDate) : undefined,
          enabled: group.enabled
        }}
        isEdit={true}
        onClose={() => setShowEditForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/groups")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
      </div>

      {/* Banner */}
      {group.bannerImageUrl && (
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
          <img
            src={group.bannerImageUrl}
            alt={group.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Group Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          {group.logoUrl ? (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={group.logoUrl} alt={group.name} />
              <AvatarFallback className="text-2xl">{group.acronym}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarFallback className="text-2xl"><Users className="h-12 w-12" /></AvatarFallback>
            </Avatar>
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{group.name}</h1>
              <Badge variant="outline" className="text-base px-3 py-1">
                {group.acronym}
              </Badge>
              <Badge variant={group.enabled ? "default" : "secondary"}>
                {group.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4 max-w-2xl">{group.description}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {group.originDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Founded: {new Date(group.originDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{agents.length} Agents</span>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditForm(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Group
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents ({agents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base">{group.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Acronym</p>
                  <p className="text-base">{group.acronym}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Genre</p>
                  <Badge variant="outline" className="capitalize">{group.genre}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-base">{group.description}</p>
                </div>
                {group.originDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Origin Date</p>
                    <p className="text-base">{new Date(group.originDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={group.enabled ? "default" : "secondary"} className="mt-1">
                    {group.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.logoUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Logo</p>
                    <img 
                      src={group.logoUrl} 
                      alt="Logo" 
                      className="h-32 w-32 object-contain border rounded cursor-pointer hover:opacity-75 transition-opacity" 
                      onClick={() => setLightboxImage(group.logoUrl!)}
                    />
                  </div>
                )}
                {group.cardImageUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Card Image</p>
                    <img 
                      src={group.cardImageUrl} 
                      alt="Card" 
                      className="h-48 w-auto object-contain border rounded cursor-pointer hover:opacity-75 transition-opacity" 
                      onClick={() => setLightboxImage(group.cardImageUrl!)}
                    />
                  </div>
                )}
                {group.bannerImageUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Banner Image</p>
                    <img 
                      src={group.bannerImageUrl} 
                      alt="Banner" 
                      className="h-32 w-full object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity" 
                      onClick={() => setLightboxImage(group.bannerImageUrl!)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Group Agents</CardTitle>
              <Button size="sm" onClick={() => setShowAddAgentDialog(true)}>
                <User className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        {agent.imagePrimaryUrl ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={agent.imagePrimaryUrl} alt={agent.name} />
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
                        <Badge variant="outline" className="capitalize">{agent.label}</Badge>
                      </TableCell>
                      <TableCell>{agent.nationality}</TableCell>
                      <TableCell>
                        <Badge variant={agent.enabled ? "default" : "secondary"}>
                          {agent.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(agent.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <ActionDropdown
                          onView={() => navigate(`/agents/${agent.id}`)}
                          onEdit={() => {}}
                          onDelete={() => {}}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Agent Dialog */}
      <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Agents to Group</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents by name or position..."
                value={agentSearchTerm}
                onChange={(e) => setAgentSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Agents List */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredAvailableAgents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No agents found
                  </p>
                ) : (
                  filteredAvailableAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => toggleAgentSelection(agent.id)}
                    >
                      <Checkbox
                        checked={selectedAgentIds.includes(agent.id)}
                        onCheckedChange={() => toggleAgentSelection(agent.id)}
                      />
                      {agent.imagePrimaryUrl ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={agent.imagePrimaryUrl} alt={agent.name} />
                          <AvatarFallback>
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{agent.label} • {agent.nationality}</p>
                      </div>
                      <Badge variant={agent.enabled ? "default" : "secondary"}>
                        {agent.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddAgentDialog(false)
              setSelectedAgentIds([])
              setAgentSearchTerm("")
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddAgents}
              disabled={selectedAgentIds.length === 0}
            >
              Add {selectedAgentIds.length > 0 && `(${selectedAgentIds.length})`} Agent{selectedAgentIds.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setLightboxImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            {lightboxImage && (
              <img
                src={lightboxImage}
                alt="Full size preview"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
