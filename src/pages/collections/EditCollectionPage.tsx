import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CollectionForm from "@/components/forms/CollectionForm";
import { getCollectionById } from "@/data/mockCatalogues";
import { toast } from "@/hooks/use-toast";

export default function EditCollectionPage() {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return;

      try {
        const data = getCollectionById(id);
        
        if (!data) {
          throw new Error("Collection not found");
        }

        // Transform mock data from Portuguese to English structure
        const transformedData = {
          title: data.titulo,
          description: data.descricao,
          cover_url: data.cover_url,
          genres: data.genre || [],
          available: data.status,
          agendarPublicacao: false,
          published_at: data.published_at ? new Date(data.published_at) : undefined,
          seasons: data.seasons?.map(season => ({
            ...season,
            published_at: new Date(season.published_at),
            agendarPublicacao: false,
            dataPublicacao: undefined,
            available: true // Default to available for existing seasons
          })) || []
        };

        setInitialData(transformedData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error loading collection.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [id]);

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

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Collection not found.</p>
        </div>
      </div>
    );
  }

  return <CollectionForm collectionId={id} initialData={initialData} />;
}