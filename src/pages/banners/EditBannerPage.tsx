import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BannerForm from "@/components/forms/BannerForm";
import { toast } from "@/hooks/use-toast";
import { mockBanners } from "@/data/mockCatalogues";
import { format } from "date-fns";

export default function EditBannerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  const fetchBanner = async () => {
    if (!id) return;
    
    try {
      const data = mockBanners.find(b => b.id === id);
      
      if (!data) {
        throw new Error("Banner not found");
      }

      // Converter as datas para o formato esperado pelo input datetime-local
      const formattedData = {
        ...data,
        data_inicio: format(new Date(data.data_inicio), "yyyy-MM-dd'T'HH:mm"),
        data_fim: format(new Date(data.data_fim), "yyyy-MM-dd'T'HH:mm"),
      };

      setInitialData(formattedData);
    } catch (error) {
      console.error('Erro ao carregar banner:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o banner.",
        variant: "destructive",
      });
      navigate('/banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Banner não encontrado.</p>
      </div>
    );
  }

  return <BannerForm bannerId={id} initialData={initialData} />;
}