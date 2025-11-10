import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Tag, Calendar, FileText } from "lucide-react";
import { getCollectionById } from "@/data/mockCatalogues";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SeasonContent {
  id: string;
  title: string;
  status: boolean;
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
  cover_url?: string;
  status: boolean;
  published_at: string;
  updated_at: string;
  seasons?: Season[];
}

export default function CollectionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

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
          cover_url: collectionData.cover_url,
          status: collectionData.status,
          published_at: collectionData.published_at,
          updated_at: collectionData.updated_at,
          seasons: collectionData.seasons
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
          <CardTitle className="flex items-center gap-2">
            {collection.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Collection Cover */}
            {collection.cover_url && (
              <div className="flex-shrink-0">
                <label className="text-sm font-medium text-muted-foreground block mb-2">Collection Cover</label>
                <div className="relative w-full md:w-64 aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={collection.cover_url} 
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Collection Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Publish Date</label>
                  <div className="text-sm">
                    {new Date(collection.published_at).toLocaleDateString("en-US")}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant={collection.status ? "default" : "outline"}>
                    {collection.status ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {collection.description && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">{collection.description}</p>
                </div>
              )}
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
                            <TableRow key={content.id}>
                              <TableCell className="font-medium">
                                {content.title}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {new Date(content.published_at).toLocaleDateString("en-US")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={content.status ? "default" : "outline"}>
                                  {content.status ? "Active" : "Inactive"}
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
    </div>
  );
}