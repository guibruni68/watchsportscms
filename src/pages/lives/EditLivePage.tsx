import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LiveForm } from "@/components/forms/LiveForm";
import { toast } from "@/hooks/use-toast";

interface Live {
  id: string;
  eventName: string;
  description: string;
  dateTime: string;
  genre: string[];
  status: "upcoming" | "live" | "ended";
  viewers?: number;
  playerEmbed?: string;
  coverImage?: string;
}

// Mock data - same as LivesPage and LiveDetailsPage
const mockLives: Live[] = [
  {
    id: "1",
    eventName: "State Championship Final",
    description: "Live broadcast of the grand final against traditional rival",
    dateTime: "2024-01-20T16:00:00",
    genre: ["Championship", "Final"],
    status: "upcoming",
    viewers: 0
  },
  {
    id: "2",
    eventName: "2024 Squad Presentation",
    description: "Press conference with presentation of new players",
    dateTime: "2024-01-18T10:00:00",
    genre: ["Press Conference", "Institutional"],
    status: "live",
    viewers: 1247
  },
  {
    id: "3",
    eventName: "Preparatory Practice Match",
    description: "Last test before championship debut",
    dateTime: "2024-01-15T15:00:00",
    genre: ["Training", "Practice"],
    status: "ended",
    viewers: 892
  },
];

export default function EditLivePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      if (!id) return;

      try {
        // Mock API call - replace with actual API
        const data = mockLives.find(l => l.id === id);
        
        if (!data) {
          throw new Error("Live stream not found");
        }

        // Transform mock data to form structure
        const transformedData = {
          nomeEvento: data.eventName,
          descricao: data.description,
          generos: data.genre || [],
          dataHora: data.dateTime,
          agendarPublicacao: data.status === "upcoming",
          dataPublicacao: data.status === "upcoming" ? new Date(data.dateTime) : undefined,
          available: data.status === "live" || data.status === "ended",
          playerEmbed: data.playerEmbed,
          imagemCapa: data.coverImage,
        };

        setInitialData(transformedData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error loading live stream.",
          variant: "destructive",
        });
        navigate('/lives');
      } finally {
        setLoading(false);
      }
    };

    fetchLive();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading live stream...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Live stream not found.</p>
        </div>
      </div>
    );
  }

  return (
    <LiveForm 
      initialData={initialData}
      isEdit={true}
      onClose={() => navigate('/lives')}
    />
  );
}
