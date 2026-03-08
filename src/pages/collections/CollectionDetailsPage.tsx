import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, FileText, X, Info, CalendarDays, Globe } from "lucide-react";
import { getCollectionById } from "@/data/mockCatalogues";
import { toast } from "@/hooks/use-toast";
import { getContentStatus, cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SeasonContent {
  id: string;
  title: string;
  available: boolean;
  published_at: string;
}

interface Season {
  id: string;
  title: string;
  season_number: number;
  description?: string;
  cover_url?: string;
  published_at: string;
  contents: SeasonContent[];
}

interface Collection {
  id: string;
  title: string;
  description?: string;
  label?: "COLLECTION";
  scheduleDate?: string;
  isPublished?: boolean;
  badge?: "NEW" | "NEW EPISODES" | "SOON";
  cardImageUrl?: string;
  bannerImageUrl?: string;
  ageRating?: string;
  createdAt?: string;
  updatedAt?: string;
  enabled?: boolean;
  // Legacy fields
  cover_url?: string;
  available: boolean;
  published_at: string;
  updated_at: string;
  genres?: string[];
  seasons?: Season[];
}

type TabType = "information" | "seasons" | "publishing"

export default function CollectionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("information")

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const collectionData = getCollectionById(id);
        
        if (!collectionData) {
          throw new Error("Collection not found");
        }
        
        // Map Catalogue to Collection with English property names
        setCollection({
          id: collectionData.id,
          title: collectionData.titulo,
          description: collectionData.descricao,
          label: "COLLECTION",
          scheduleDate: collectionData.published_at,
          isPublished: collectionData.status,
          badge: collectionData.badge as "NEW" | "NEW EPISODES" | "SOON" | undefined,
          cardImageUrl: collectionData.cover_url,
          bannerImageUrl: collectionData.bannerImageUrl,
          ageRating: collectionData.ageRating,
          createdAt: collectionData.published_at,
          updatedAt: collectionData.updated_at,
          enabled: collectionData.status,
          // Legacy fields
          cover_url: collectionData.cover_url,
          available: collectionData.status,
          published_at: collectionData.published_at,
          updated_at: collectionData.updated_at,
          genres: collectionData.genre,
          seasons: collectionData.seasons?.map(season => ({
            ...season,
            contents: season.contents.map(content => ({
              ...content,
              available: content.status
            }))
          }))
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Error loading collection data.",
          variant: "destructive",
        });
        navigate('/collections');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/collections/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Collection not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/collections")}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Collections
      </Button>

      {/* Tabs */}
      <div className="border-b border-[#1f1f1f]">
        <div className="flex gap-0">
          {([
            { id: "information" as TabType, label: "Information", icon: Info },
            { id: "seasons"     as TabType, label: "Seasons",     icon: CalendarDays },
            { id: "publishing"  as TabType, label: "Publishing",  icon: Globe },
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

      {/* Collection Information */}
      {activeTab === "information" && (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {collection.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Collection Cover */}
            <div className="flex-shrink-0 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Card Image</label>
                <div 
                  className="relative w-full md:w-64 aspect-[3/4] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => collection.cardImageUrl && setLightboxImage(collection.cardImageUrl)}
                >
                  {collection.cardImageUrl ? (
                    <img 
                      src={collection.cardImageUrl} 
                      alt={collection.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              
              {collection.bannerImageUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">Banner Image</label>
                  <div 
                    className="relative w-full md:w-64 aspect-[21/9] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage(collection.bannerImageUrl!)}
                  >
                    <img 
                      src={collection.bannerImageUrl} 
                      alt={`${collection.title} banner`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Collection Info */}
            <div className="flex-1 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {collection.ageRating && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wide">Age Rating</p>
                    <p className="text-sm">{collection.ageRating}</p>
                  </div>
                )}
              </div>

              {collection.genres && collection.genres.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Genres</p>
                  <p className="text-sm">
                    {collection.genres.join(", ")}
                  </p>
                </div>
              )}

              {collection.description && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Description</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">{collection.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(collection.createdAt || collection.published_at).toLocaleDateString("en-US")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(collection.updatedAt || collection.updated_at).toLocaleDateString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Seasons and Contents */}
      {activeTab === "seasons" && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Seasons ({collection.seasons?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!collection.seasons || collection.seasons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No seasons available for this collection yet.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {collection.seasons.map((season) => (
                <AccordionItem key={season.id} value={season.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{season.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground ml-auto mr-2">
                        {season.contents.length} {season.contents.length === 1 ? 'episode' : 'episodes'}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {season.description && (
                      <p className="text-sm text-muted-foreground mb-4 px-1">
                        {season.description}
                      </p>
                    )}
                    {season.contents.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        No content in this season yet.
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead className="w-32">Publish Date</TableHead>
                            <TableHead className="w-24">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {season.contents.map((content) => (
                            <TableRow
                              key={content.id}
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => navigate(`/videos/${content.id}`)}
                            >
                              <TableCell className="font-medium">
                                {content.title}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {new Date(content.published_at).toLocaleDateString("en-US")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="neutral">
                                  {getContentStatus(content.available, content.published_at)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
      )}

      {/* Publishing */}
      {activeTab === "publishing" && (
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">Status</p>
                <Badge variant="neutral">
                  {getContentStatus(collection.enabled ?? collection.available, collection.scheduleDate || collection.published_at)}
                </Badge>
              </div>
              {collection.badge && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Badge</p>
                  <p className="text-sm">{collection.badge}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">Label</p>
                <p className="text-sm">{collection.label || "COLLECTION"}</p>
              </div>
              {collection.scheduleDate && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Schedule Date</p>
                  <div className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(collection.scheduleDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          <img 
            src={lightboxImage} 
            alt="Enlarged view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}