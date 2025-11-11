import React, { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Play, Users } from "lucide-react"
import { ImportButton } from "@/components/ui/import-button"
import { LiveForm } from "@/components/forms/LiveForm"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { toast } from "@/hooks/use-toast"
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils"

interface Live {
  id: string
  eventName: string
  description: string
  dateTime: string
  genre: string[]
  available: boolean
  viewers?: number
  playerEmbed?: string
  thumbnail?: string
}

const mockLives: Live[] = [
  {
    id: "1",
    eventName: "State Championship Final",
    description: "Live broadcast of the grand final against traditional rival",
    dateTime: "2025-12-20T16:00:00",
    genre: ["Championship", "Final"],
    available: false,
    viewers: 0,
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400"
  },
  {
    id: "2",
    eventName: "2024 Squad Presentation",
    description: "Press conference with presentation of new players",
    dateTime: "2024-01-18T10:00:00",
    genre: ["Press Conference", "Institutional"],
    available: true,
    viewers: 1247,
    thumbnail: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400"
  },
  {
    id: "3",
    eventName: "Preparatory Practice Match",
    description: "Last test before championship debut",
    dateTime: "2024-01-15T15:00:00",
    genre: ["Training", "Practice"],
    available: false,
    viewers: 892,
    thumbnail: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400"
  },
  {
    id: "4",
    eventName: "Coach Interview",
    description: "Exclusive conversation about the 2024 season",
    dateTime: "2024-01-14T14:00:00",
    genre: ["Interview"],
    available: false,
    viewers: 567,
    thumbnail: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=400"
  },
  {
    id: "5",
    eventName: "Open Training for Fans",
    description: "Follow the team's training before the decisive game",
    dateTime: "2026-01-22T09:00:00",
    genre: ["Training", "Behind the Scenes"],
    available: false,
    viewers: 0,
    thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400"
  }
]

export default function LivesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [lives, setLives] = useState<Live[]>(mockLives)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingLive, setEditingLive] = useState<Live | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingLive(null)
      // Remove the param from URL
      searchParams.delete('new')
      setSearchParams(searchParams)
    }
  }, [searchParams, setSearchParams])

  const genres = Array.from(new Set(lives.flatMap(l => l.genre || [])))
  const statuses = [
    { value: "all", label: "All statuses" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Publishing", label: "Publishing" }
  ]

  const filteredLives = lives.filter(live => {
    const matchesSearch = live.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      live.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (live.genre || []).some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || (live.genre || []).includes(categoryFilter)
    
    const liveStatus = getContentStatus(live.available, live.dateTime)
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "Active" && liveStatus === "Active") ||
      (statusFilter === "Inactive" && liveStatus === "Inactive") ||
      (statusFilter === "Publishing" && liveStatus === "Publishing")
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.ceil(filteredLives.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLives = filteredLives.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (live: Live) => {
    setEditingLive(live)
    setShowForm(true)
  }

  const handleView = (id: string) => {
    navigate(`/lives/${id}`)
  }

  const handleNewLive = () => {
    setEditingLive(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setLives(lives.filter(live => live.id !== id))
    toast({
      title: "Live deleted",
      description: "The broadcast was removed successfully.",
    })
  }

  if (showForm) {
    return (
      <LiveForm 
        initialData={editingLive ? {
          nomeEvento: editingLive.eventName,
          descricao: editingLive.description,
          dataHora: editingLive.dateTime,
          generos: editingLive.genre || [],
          playerEmbed: editingLive.playerEmbed
        } : undefined}
        isEdit={!!editingLive}
        onClose={() => setShowForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Live Streams</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewLive} className="gap-2">
            <Plus className="h-4 w-4" />
            New Live Stream
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
          { value: "all", label: "All genres" },
          ...genres.map(genre => ({ value: genre, label: genre }))
        ]}
        statuses={statuses}
        searchPlaceholder="Search live streams..."
        categoryPlaceholder="Genre"
        statusPlaceholder="Status"
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Thumb</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="min-w-[200px]">Genres</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLives.map((live) => (
              <TableRow key={live.id}>
                <TableCell>
                  <div className="w-16 aspect-[3/4] bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {live.thumbnail ? (
                      <img 
                        src={live.thumbnail} 
                        alt={live.eventName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium truncate">{live.eventName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {(live.genre || []).map((g, idx) => (
                      <Badge key={idx} variant="secondary">
                        <span>{g}</span>
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{new Date(live.dateTime).toLocaleDateString("en-US")}</p>
                    <p className="text-muted-foreground">
                      {new Date(live.dateTime).toLocaleTimeString("en-US", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(getContentStatus(live.available, live.dateTime))}>
                    {getContentStatus(live.available, live.dateTime)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    onView={() => handleView(live.id)}
                    onEdit={() => handleEdit(live)}
                    onDelete={() => handleDelete(live.id)}
                    showView={true}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {paginatedLives.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" ? "No live streams found with the applied filters." : "No live streams registered yet."}
            </div>
            {!searchTerm && categoryFilter === "all" && statusFilter === "all" && (
              <Button onClick={handleNewLive} className="mt-4">
                Create First Live Stream
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}