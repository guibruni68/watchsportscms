import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CatalogueForm from "@/components/forms/CatalogueForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function EditCataloguePage() {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogue = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('catalogues')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setInitialData(data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar catálogo.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogue();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Catálogo não encontrado.</p>
        </div>
      </div>
    );
  }

  return <CatalogueForm catalogueId={id} initialData={initialData} />;
}