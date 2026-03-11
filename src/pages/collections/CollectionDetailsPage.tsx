import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Info, CalendarDays, Globe, Library } from "lucide-react";
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

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl overflow-hidden">
        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: "url(/assets/BackgroundAFA.png)" }} />
        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="w-[116px] h-[116px] rounded-2xl bg-[#1a1a1a] overflow-hidden flex items-center justify-center shadow-lg mb-4">
                {collection.cardImageUrl || collection.cover_url ? (
                  <img
                    src={collection.cardImageUrl || collection.cover_url}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Library className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-white tracking-[-0.6px]">{collection.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{collection.label || "Collection"}</p>
            </div>
          </div>
        </div>
      </Card>

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
      <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
        <CardContent className="p-7">
          <div className="flex gap-12">
            <div className="flex-1 space-y-8">
              {collection.description && (
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Description</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{collection.description}</p>
                </div>
              )}
              {collection.genres && collection.genres.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {collection.genres.map((genre, i) => (
                      <Badge key={i} variant="neutral">{genre}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-64 space-y-8">
              {collection.ageRating && (
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Age Rating</h3>
                  <p className="text-sm text-white/80">{collection.ageRating}</p>
                </div>
              )}
              <div>
                <h3 className="text-base font-semibold text-white mb-4">Created At</h3>
                <p className="text-sm text-white/80">
                  {new Date(collection.createdAt || collection.published_at).toLocaleDateString("en-US")}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-4">Last Updated</h3>
                <p className="text-sm text-white/80">
                  {new Date(collection.updatedAt || collection.updated_at).toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Seasons and Contents */}
      {activeTab === "seasons" && (
      <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
        <CardContent className="p-7">
          <h3 className="text-base font-semibold text-white mb-6">Seasons ({collection.seasons?.length || 0})</h3>
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
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Status</h3>
                  <Badge variant="neutral">
                    {getContentStatus(collection.enabled ?? collection.available, collection.scheduleDate || collection.published_at)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Label</h3>
                  <p className="text-sm text-white/80">{collection.label || "COLLECTION"}</p>
                </div>
                {collection.badge && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Badge</h3>
                    <p className="text-sm text-white/80">{collection.badge}</p>
                  </div>
                )}
              </div>
              {collection.scheduleDate && (
                <div className="w-64 space-y-8">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Schedule Date</h3>
                    <p className="text-sm text-white/80 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(collection.scheduleDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}