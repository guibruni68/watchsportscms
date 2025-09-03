import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CarouselForm } from "@/components/forms/CarouselForm";
import { toast } from "@/hooks/use-toast";

// Mock data for now - this should be replaced with actual database calls when needed
const mockCarousels = [
  {
    id: "1",
    title: "Destaques da Semana",
    layout: "default",
    carouselType: "manual",
    sortType: "recent",
    contentLimit: 10,
    planType: "basic",
    status: true,
    showMoreButton: true,
    order: 1,
    domain: "collection",
    selectedContent: ["1", "2", "3"],
  },
  // Add more mock data as needed
];

export default function EditCarouselPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  const fetchCarousel = async () => {
    if (!id) return;
    
    try {
      // For now using mock data - replace with actual Supabase call when table exists
      const carousel = mockCarousels.find(c => c.id === id);
      
      if (!carousel) {
        throw new Error("Carrossel não encontrado");
      }

      setInitialData(carousel);
    } catch (error) {
      console.error('Erro ao carregar carrossel:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o carrossel.",
        variant: "destructive",
      });
      navigate('/carousels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarousel();
  }, [id]);

  const handleSubmit = (formData: any) => {
    console.log("Updating carousel:", formData);
    toast({
      title: "Sucesso",
      description: "Carrossel atualizado com sucesso!",
    });
    navigate("/carousels");
  };

  const handleCancel = () => {
    navigate("/carousels");
  };

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
        <p className="text-muted-foreground">Carrossel não encontrado.</p>
      </div>
    );
  }

  return (
    <CarouselForm 
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}