import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Plus, Calendar as CalendarIcon, List } from "lucide-react"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { EventForm } from "@/components/forms/EventForm"
import { toast } from "@/hooks/use-toast"
import { mockEvents, Event } from "@/data/mockData"
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils"
import { format } from "date-fns"

export default function SchedulePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingEvent(null)
      searchParams.delete('new')
      setSearchParams(searchParams)
    }
  }, [searchParams, setSearchParams])

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" }
  ]

  const categories = [{ value: "all", label: "All" }]

  const filteredEvents = events.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const itemStatus = getContentStatus(item.enabled, undefined)
    const matchesStatus = statusFilter === "all" || itemStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  // Get events for selected date
  const selectedDateEvents = selectedDate
    ? events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === selectedDate.toDateString()
      })
    : []

  // Get upcoming events (next 5)
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date() && event.enabled)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  // Get all event dates for calendar highlighting (excluding selected date)
  const eventDates = events
    .map(event => new Date(event.date))
    .filter(date => !selectedDate || date.toDateString() !== selectedDate.toDateString())

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleNewEvent = () => {
    setEditingEvent(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setEvents(events.filter(item => item.id !== id))
    toast({
      title: "Event deleted",
      description: "The event was removed successfully.",
    })
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingEvent(null)
  }

  const handleViewDetails = (id: string) => {
    navigate(`/schedule/${id}`)
  }

  if (showForm) {
    return (
      <EventForm 
        initialData={editingEvent ? {
          title: editingEvent.title,
          description: editingEvent.description,
          date: new Date(editingEvent.date),
          cardImageUrl: editingEvent.cardImageUrl,
          redirectionUrl: editingEvent.redirectionUrl,
          enabled: editingEvent.enabled,
        } : undefined}
        isEdit={!!editingEvent}
        onClose={handleCloseForm}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </div>
          <Button onClick={handleNewEvent} className="gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      {viewMode === "list" && (
        <SearchFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter="all"
          onCategoryChange={() => {}}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          categories={categories}
          statuses={statuses}
          searchPlaceholder="Search events..."
          statusPlaceholder="Status"
        />
      )}

      {viewMode === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Event Calendar</CardTitle>
              <CardDescription>Click on a date to see scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasEvent: eventDates
                }}
                modifiersStyles={{
                  hasEvent: {
                    backgroundColor: 'rgb(59, 130, 246)',
                    color: 'white',
                    fontWeight: '600'
                  },
                  selected: {
                    backgroundColor: 'hsl(var(--secondary))',
                    color: 'hsl(var(--secondary-foreground))',
                    fontWeight: 'bold'
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Selected Date Events */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length > 0 ? `${selectedDateEvents.length} event(s)` : "No events"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => {
                  const status = getContentStatus(event.enabled, undefined)
                  const statusVariant = getStatusBadgeVariant(status)
                  return (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(event.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <Badge variant={statusVariant} className="text-xs">
                            {status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.date), "p")}
                        </p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No events on this date</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {viewMode === "calendar" && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => {
                const status = getContentStatus(event.enabled, undefined)
                const statusVariant = getStatusBadgeVariant(status)
                return (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(event.id)}
                  >
                    {event.cardImageUrl && (
                      <img
                        src={event.cardImageUrl}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    )}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold">{event.title}</h4>
                        <Badge variant={statusVariant}>{status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "PPP 'at' p")}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "list" && paginatedEvents.length > 0 ? (
        <Card className="border-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-48">Event Date</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEvents.map((event) => {
                const status = getContentStatus(event.enabled, undefined)
                const statusVariant = getStatusBadgeVariant(status)
                
                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <img 
                        src={event.cardImageUrl || "/placeholder.svg"} 
                        alt={event.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {event.title}
                    </TableCell>
                    <TableCell>
                      {format(new Date(event.date), "PPP 'at' p")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionDropdown
                        onView={() => handleViewDetails(event.id)}
                        onEdit={() => handleEdit(event)}
                        onDelete={() => handleDelete(event.id)}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      ) : viewMode === "list" ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" ? "No events found with the applied filters." : "No events registered yet."}
            </div>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={handleNewEvent} className="mt-4">
                Create First Event
              </Button>
            )}
          </CardContent>
        </Card>
      ) : null}

      {viewMode === "list" && filteredEvents.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
