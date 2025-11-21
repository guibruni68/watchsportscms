import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, Eye, X } from "lucide-react"
import { NewsForm } from "@/components/forms/NewsForm"
import { mockNews, mockGenres } from "@/data/mockData"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { format } from "date-fns"

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showEditForm, setShowEditForm] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Find the news item
  const newsItem = mockNews.find(n => n.id === id)

  if (!newsItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/news")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">News not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get genre names
  const newsGenres = newsItem.genres?.map(genreId => 
    mockGenres.find(g => g.id === genreId)?.name
  ).filter(Boolean) || []

  if (showEditForm) {
    return (
      <NewsForm
        initialData={{
          title: newsItem.title,
          header: newsItem.header,
          firstText: newsItem.firstText,
          lastText: newsItem.lastText,
          firstImageUrl: newsItem.firstImageUrl,
          secondImageUrl: newsItem.secondImageUrl,
          highlighted: newsItem.highlighted,
          date: new Date(newsItem.date),
          scheduleDate: newsItem.scheduleDate ? new Date(newsItem.scheduleDate) : undefined,
          enabled: newsItem.enabled,
          genres: newsItem.genres,
        }}
        isEdit={true}
        onClose={() => setShowEditForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/news")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </div>
        <Button onClick={() => setShowEditForm(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit News
        </Button>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        {newsItem.highlighted && (
          <Badge variant="default">Highlighted</Badge>
        )}
        {newsItem.published ? (
          <Badge variant="default">Published</Badge>
        ) : (
          <Badge variant="secondary">Draft</Badge>
        )}
        {newsItem.enabled ? (
          <Badge variant="default">Enabled</Badge>
        ) : (
          <Badge variant="destructive">Disabled</Badge>
        )}
        {newsGenres.map(genre => (
          <Badge key={genre} variant="secondary">{genre}</Badge>
        ))}
      </div>

      {/* Main Content Card - Public View */}
      <Card>
        <CardContent className="p-8">
          {/* News Headline */}
          <h1 className="text-4xl font-bold mb-6">{newsItem.header}</h1>

          {/* Publication Date */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(newsItem.date), "PPP")}
            </div>
          </div>

          {/* Main Image */}
          {newsItem.firstImageUrl && (
            <div className="mb-8">
              <img
                src={newsItem.firstImageUrl}
                alt={newsItem.header}
                className="w-full h-96 object-cover rounded-lg cursor-pointer"
                onClick={() => setLightboxImage(newsItem.firstImageUrl!)}
              />
            </div>
          )}

          {/* First Text Block */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg leading-relaxed">{newsItem.firstText}</p>
          </div>

          {/* Mid-Banner Image */}
          {newsItem.secondImageUrl && (
            <div className="my-8">
              <img
                src={newsItem.secondImageUrl}
                alt="Mid content banner"
                className="w-full h-64 object-cover rounded-lg cursor-pointer"
                onClick={() => setLightboxImage(newsItem.secondImageUrl!)}
              />
            </div>
          )}

          {/* Last Text Block */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed">{newsItem.lastText}</p>
          </div>
        </CardContent>
      </Card>

      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Internal Title</p>
              <p className="font-medium">{newsItem.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Publication Date</p>
              <p className="font-medium">{format(new Date(newsItem.date), "PPP")}</p>
            </div>
            {newsItem.scheduleDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Scheduled Date</p>
                <p className="font-medium">{format(new Date(newsItem.scheduleDate), "PPP")}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created At</p>
              <p className="font-medium">{format(new Date(newsItem.createdAt), "PPP")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Updated At</p>
              <p className="font-medium">{format(new Date(newsItem.updatedAt), "PPP")}</p>
            </div>
            {newsGenres.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">News Types</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {newsGenres.map(genre => (
                    <Badge key={genre} variant="secondary">{genre}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Lightbox */}
      {lightboxImage && (
        <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
          <DialogContent className="max-w-6xl p-0">
            <div className="relative">
              <img
                src={lightboxImage}
                alt="Full size preview"
                className="w-full h-auto"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setLightboxImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
