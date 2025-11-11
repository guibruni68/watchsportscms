import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VideoForm } from "@/components/forms/VideoForm";
import { toast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title: string;
  description: string;
  genre: string[];
  tags: string[];
  publishDate: string;
  views: number;
  duration: string;
  status: "published" | "draft" | "scheduled";
  coverImage?: string;
  videoUrl?: string;
}

// Mock data - same as VideosPage and VideoDetailsPage
const mockVideos: Video[] = [
  {
    id: "1",
    title: "Gols da vitória por 3x1 contra o Rival FC",
    description: "Melhores momentos da partida válida pelo campeonato estadual",
    genre: ["Goals and Highlights", "Best Moments"],
    tags: ["gols", "vitória", "campeonato"],
    publishDate: "2024-01-15T20:30:00",
    views: 15420,
    duration: "05:32",
    status: "published"
  },
  {
    id: "2", 
    title: "Entrevista com novo atacante contratado",
    description: "Primeiro bate-papo com o jogador que chegou para reforçar o ataque",
    genre: ["Interviews", "Backstage"],
    tags: ["entrevista", "contratação", "atacante"],
    publishDate: "2024-01-12T14:00:00",
    views: 8931,
    duration: "12:18",
    status: "scheduled"
  },
  {
    id: "3",
    title: "Bastidores do treino tático",
    description: "Como o time se prepara taticamente para os próximos jogos",
    genre: ["Behind the Scenes"],
    tags: ["treino", "tática", "preparação"],
    publishDate: "2024-01-10T16:45:00",
    views: 5672,
    duration: "08:15",
    status: "draft"
  },
];

export default function EditVideoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;

      try {
        // Mock API call - replace with actual API
        const data = mockVideos.find(v => v.id === id);
        
        if (!data) {
          throw new Error("Video not found");
        }

        // Transform mock data to form structure
        const transformedData = {
          titulo: data.title,
          descricao: data.description,
          generos: data.genre || [],
          tag: "Featured", // Default tag - could be extracted from tags array
          tags: data.tags.join(", "),
          dataProducao: new Date(data.publishDate),
          agendarPublicacao: data.status === "scheduled",
          dataPublicacao: data.status === "scheduled" ? new Date(data.publishDate) : undefined,
          available: data.status === "published",
          videoFile: data.videoUrl,
          imagemCapa: data.coverImage,
        };

        setInitialData(transformedData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error loading video.",
          variant: "destructive",
        });
        navigate('/videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Video not found.</p>
        </div>
      </div>
    );
  }

  return (
    <VideoForm 
      initialData={initialData}
      isEdit={true}
      onClose={() => navigate('/videos')}
    />
  );
}
