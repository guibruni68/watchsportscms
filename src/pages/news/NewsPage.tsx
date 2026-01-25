import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Star } from "lucide-react"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { NewsForm } from "@/components/forms/NewsForm"
import { toast } from "@/hooks/use-toast"
import { mockNews, News, mockGenres } from "@/data/mockData"
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils"

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [news, setNews] = useState<News[]>(mockNews)
  const [searchTerm, setSearchTerm] = useState("")
  const [genreFilter, setGenreFilter] = useState<string>("all") 
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Check for new param on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setEditingNews(null)
      searchParams.delete('new')
      setSearchParams(searchParams)
    }
  }, [searchParams, setSearchParams])

  // Get unique genres from mockGenres for filter
  const newsGenres = mockGenres.filter(g => g.type === "news")
  const genreOptions = [
    { value: "all", label: "All Genres" },
    ...newsGenres.map(g => ({ value: g.id, label: g.name }))
  ]
  
  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Publishing", label: "Publishing" },
    { value: "Inactive", label: "Inactive" }
  ]

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.header.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.firstText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = genreFilter === "all" || item.genres?.includes(genreFilter)
    const itemStatus = getContentStatus(item.enabled, item.scheduleDate)
    const matchesStatus = statusFilter === "all" || itemStatus === statusFilter
    return matchesSearch && matchesGenre && matchesStatus
  })

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem)
    setShowForm(true)
  }

  const handleNewNews = () => {
    setEditingNews(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setNews(news.filter(item => item.id !== id))
    toast({
      title: "News deleted",
      description: "The news item was removed successfully.",
    })
  }

  if (showForm) {
    return (
      <NewsForm 
        initialData={editingNews ? {
          title: editingNews.title,
          header: editingNews.header,
          firstText: editingNews.firstText,
          lastText: editingNews.lastText,
          firstImageUrl: editingNews.firstImageUrl,
          secondImageUrl: editingNews.secondImageUrl,
          highlighted: editingNews.highlighted,
          date: new Date(editingNews.date),
          scheduleDate: editingNews.scheduleDate ? new Date(editingNews.scheduleDate) : undefined,
          enabled: editingNews.enabled,
          genres: editingNews.genres,
        } : undefined}
        isEdit={!!editingNews}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">News</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewNews} className="gap-2">
            <Plus className="h-4 w-4" />
            New News
          </Button>
        </div>
      </div>

      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={genreFilter}
        onCategoryChange={setGenreFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={genreOptions}
        statuses={statuses}
        searchPlaceholder="Search news..."
        categoryPlaceholder="Genre"
        statusPlaceholder="Status"
      />

      <Card className="border-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumb</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Publish Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNews.map((item) => {
              const status = getContentStatus(item.enabled, item.scheduleDate)
              const newsGenres = item.genres?.map(genreId => 
                mockGenres.find(g => g.id === genreId)?.name
              ).filter(Boolean) || []
              
              return (
                <TableRow key={item.id} className="cursor-pointer" onClick={() => navigate(`/news/${item.id}`)}>
                  <TableCell>
                    {item.firstImageUrl ? (
                      <img 
                        src={item.firstImageUrl} 
                        alt={item.header}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <p className="font-medium line-clamp-1">{item.header}</p>
                        {item.highlighted && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.firstText}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {newsGenres.length > 0 ? newsGenres.join(", ") : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item.id)}
                      onView={() => navigate(`/news/${item.id}`)}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
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
            Anterior
          </Button>
          <span className="flex items-center px-4 text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {paginatedNews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || genreFilter !== "all" || statusFilter !== "all" ? "No news found with the applied filters." : "No news registered yet."}
            </div>
            {!searchTerm && genreFilter === "all" && statusFilter === "all" && (
              <Button onClick={handleNewNews} className="mt-4">
                Create First News
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}