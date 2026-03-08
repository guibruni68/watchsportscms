import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Newspaper, FileText, Globe, X } from "lucide-react"
import { NewsForm } from "@/components/forms/NewsForm"
import { mockNews, mockGenres } from "@/data/mockData"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showEditForm, setShowEditForm] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"content" | "publishing">("content")

  // Find the news item
  const newsItem = mockNews.find(n => n.id === id)

  if (!newsItem) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/news")}
          className="text-muted-foreground hover:text-foreground gap-2 px-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Button>
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
  ).filter(Boolean) as string[] || []

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
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/news")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#171717] rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#262626] to-[#171717]" />
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="w-[116px] h-[116px] rounded-full bg-[#262626] border border-[#1f1f1f] overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {newsItem.firstImageUrl ? (
                  <img src={newsItem.firstImageUrl} alt={newsItem.header} className="w-full h-full object-cover" />
                ) : (
                  <Newspaper className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{newsItem.header}</h1>
                <Badge variant="neutral">{newsItem.enabled ? "Enabled" : "Disabled"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{format(new Date(newsItem.date), "PPP")}</p>
            </div>
            <Button
              onClick={() => setShowEditForm(true)}
              className="bg-primary hover:bg-primary/80 text-white rounded-[10px] px-6 h-10 mt-16"
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-[#1f1f1f]">
        <div className="flex gap-0">
          {([
            { id: "content"    as const, label: "Content",    icon: FileText },
            { id: "publishing" as const, label: "Publishing", icon: Globe },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-xs font-normal uppercase tracking-wider transition-colors relative flex items-center gap-1.5",
                activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-white/80"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Tab */}
      {activeTab === "content" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-8">
            {newsItem.firstImageUrl && (
              <img
                src={newsItem.firstImageUrl}
                alt={newsItem.header}
                className="w-full h-80 object-cover rounded-xl cursor-pointer"
                onClick={() => setLightboxImage(newsItem.firstImageUrl!)}
              />
            )}
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Content</h3>
              <p className="text-sm text-white/80 leading-relaxed">{newsItem.firstText}</p>
            </div>
            {newsItem.secondImageUrl && (
              <img
                src={newsItem.secondImageUrl}
                alt="Mid content"
                className="w-full h-56 object-cover rounded-xl cursor-pointer"
                onClick={() => setLightboxImage(newsItem.secondImageUrl!)}
              />
            )}
            {newsItem.lastText && (
              <p className="text-sm text-white/80 leading-relaxed">{newsItem.lastText}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Publishing Tab */}
      {activeTab === "publishing" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Internal Title</h3>
                  <p className="text-sm text-white/80">{newsItem.title}</p>
                </div>
                {newsGenres.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">News Types</h3>
                    <div className="flex flex-wrap gap-2">
                      {newsGenres.map(genre => (
                        <Badge key={genre} variant="neutral">{genre}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="neutral">{newsItem.published ? "Published" : "Draft"}</Badge>
                    {newsItem.highlighted && <Badge variant="neutral">Highlighted</Badge>}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Publication Date</h3>
                  <p className="text-sm text-white/80">{format(new Date(newsItem.date), "PPP")}</p>
                </div>
                {newsItem.scheduleDate && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Scheduled Date</h3>
                    <p className="text-sm text-white/80">{format(new Date(newsItem.scheduleDate), "PPP")}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Created At</h3>
                  <p className="text-sm text-white/80">{format(new Date(newsItem.createdAt), "PPP")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-6xl p-0">
          <div className="relative">
            <img src={lightboxImage!} alt="Full size" className="w-full h-auto" />
            <Button variant="ghost" size="icon"
              className="absolute top-2 right-2 text-white hover:bg-white/20"
              onClick={() => setLightboxImage(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
