import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Tag, Calendar, FileText, X, Play } from "lucide-react";
import { getCollectionById } from "@/data/mockCatalogues";
import { toast } from "@/hooks/use-toast";
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils";
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
  releaseYear?: number;
  scheduleDate?: string;
  isPublished?: boolean;
  badge?: "NEW" | "NEW EPISODES" | "SOON";
  visibility?: "FREE" | "BASIC" | "PREMIUM";
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

export default function CollectionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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
          releaseYear: collectionData.releaseYear,
          scheduleDate: collectionData.published_at,
          isPublished: collectionData.status,
          badge: collectionData.badge as "NEW" | "NEW EPISODES" | "SOON" | undefined,
          visibility: (collectionData.visibility || "FREE") as "FREE" | "BASIC" | "PREMIUM",
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Collection
        </Button>
      </div>

      {/* Collection Information */}
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
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Label</label>
                  <div className="text-sm">
                    <Badge variant="outline">{collection.label || "COLLECTION"}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Visibility</label>
                  <div className="text-sm">
                    <Badge variant={
                      collection.visibility === "FREE" ? "default" :
                      collection.visibility === "BASIC" ? "secondary" : "outline"
                    }>
                      {collection.visibility || "FREE"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(getContentStatus(collection.enabled ?? collection.available, collection.scheduleDate || collection.published_at))}>
                      {getContentStatus(collection.enabled ?? collection.available, collection.scheduleDate || collection.published_at)}
                    </Badge>
                  </div>
                </div>
                {collection.badge && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Badge</label>
                    <div className="text-sm">
                      <Badge>{collection.badge}</Badge>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collection.releaseYear && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Release Year</label>
                    <div className="text-sm">{collection.releaseYear}</div>
                  </div>
                )}
                {collection.ageRating && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Age Rating</label>
                    <div className="text-sm">{collection.ageRating}</div>
                  </div>
                )}
              </div>

              {collection.scheduleDate && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Schedule Date</label>
                    <div className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(collection.scheduleDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </div>
                  </div>
                </div>
              )}

              {collection.genres && collection.genres.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {collection.genres.map((genre, index) => (
                      <Badge key={index} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {collection.description && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">{collection.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <div className="text-sm">
                    {new Date(collection.createdAt || collection.published_at).toLocaleDateString("en-US")}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <div className="text-sm">
                    {new Date(collection.updatedAt || collection.updated_at).toLocaleDateString("en-US")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seasons and Contents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
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
                        <Badge variant="secondary">Season {season.season_number}</Badge>
                        <span className="font-medium">{season.title}</span>
                      </div>
                      <Badge variant="outline" className="ml-auto mr-2">
                        {season.contents.length} {season.contents.length === 1 ? 'episode' : 'episodes'}
                      </Badge>
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
                                <Badge variant={getStatusBadgeVariant(getContentStatus(content.available, content.published_at))}>
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