import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Tag, Calendar, Play, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  description: string;
  label: "VOD" | "LIVE";
  releaseYear?: number;
  scheduleDate: string;
  isPublished: boolean;
  badge?: "NEW" | "NEW EPISODES" | "SOON";
  cardImageUrl?: string;
  bannerImageUrl?: string;
  streamUrl?: string;
  ageRating?: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  // Legacy fields for list page compatibility
  genre?: string[];
  tags?: string[];
  views?: number;
  duration?: string;
  available?: boolean;
  publishDate?: string;
  coverImage?: string;
  videoUrl?: string;
}

// Mock data - updated with new structure
const mockVideos: Video[] = [
  {
    id: "1",
    title: "Gols da vitória por 3x1 contra o Rival FC",
    description: "Melhores momentos da partida válida pelo campeonato estadual",
    label: "VOD",
    releaseYear: 2024,
    scheduleDate: "2024-01-15T20:30:00",
    isPublished: true,
    badge: "NEW",
    cardImageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400",
    bannerImageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200",
    streamUrl: "https://example.com/stream1",
    ageRating: "12+",
    createdAt: "2024-01-10T10:00:00",
    updatedAt: "2024-01-15T20:30:00",
    enabled: true,
    // Legacy fields for list compatibility
    genre: ["Goals and Highlights", "Best Moments"],
    tags: ["gols", "vitória", "campeonato"],
    publishDate: "2024-01-15T20:30:00",
    views: 15420,
    duration: "05:32",
    available: true
  },
  {
    id: "2",
    title: "Entrevista com novo atacante contratado",
    description: "Primeiro bate-papo com o jogador que chegou para reforçar o ataque",
    label: "VOD",
    releaseYear: 2024,
    scheduleDate: "2025-12-15T14:00:00",
    isPublished: false,
    badge: "SOON",
    cardImageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400",
    bannerImageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
    streamUrl: "https://example.com/stream2",
    ageRating: "L",
    createdAt: "2024-01-05T09:00:00",
    updatedAt: "2024-01-12T10:00:00",
    enabled: false,
    // Legacy fields for list compatibility
    genre: ["Interviews", "Backstage"],
    tags: ["entrevista", "contratação", "atacante"],
    publishDate: "2025-12-15T14:00:00",
    views: 8931,
    duration: "12:18",
    available: false
  },
  {
    id: "3",
    title: "Bastidores do treino tático",
    description: "Como o time se prepara taticamente para os próximos jogos",
    label: "VOD",
    releaseYear: 2024,
    scheduleDate: "2024-01-10T16:45:00",
    isPublished: true,
    cardImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
    bannerImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200",
    streamUrl: "https://example.com/stream3",
    ageRating: "L",
    createdAt: "2024-01-08T08:00:00",
    updatedAt: "2024-01-10T16:45:00",
    enabled: false,
    // Legacy fields for list compatibility
    genre: ["Behind the Scenes"],
    tags: ["treino", "tática", "preparação"],
    publishDate: "2024-01-10T16:45:00",
    views: 5672,
    duration: "08:15",
    available: false
  },
];

export default function VideoDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Mock API call - replace with actual API
        const videoData = mockVideos.find(v => v.id === id);
        
        if (!videoData) {
          throw new Error("Video not found");
        }
        
        setVideo(videoData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error loading video data.",
          variant: "destructive",
        });
        navigate('/videos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/videos/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/videos')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Button>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Video
        </Button>
      </div>

      {/* Video Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Play className="h-6 w-6" />
            {video.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Video Cover */}
            <div className="flex-shrink-0 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Card Image</label>
                <div 
                  className="relative w-full md:w-64 aspect-[3/4] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => video.cardImageUrl && setLightboxImage(video.cardImageUrl)}
                >
                  {video.cardImageUrl ? (
                    <img 
                      src={video.cardImageUrl} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              
              {video.bannerImageUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">Banner Image</label>
                  <div 
                    className="relative w-full md:w-64 aspect-[21/9] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage(video.bannerImageUrl!)}
                  >
                    <img 
                      src={video.bannerImageUrl} 
                      alt={`${video.title} banner`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="flex-1 space-y-5">
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">Label</p>
                <p className="text-sm">{video.label}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Schedule Date</p>
                  <p className="text-sm">
                    {new Date(video.scheduleDate).toLocaleDateString("en-US")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-[9px] bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                      {video.enabled ? "Enabled" : "Disabled"}
                    </span>
                    {video.isPublished && (
                      <span className="inline-flex items-center rounded-[9px] bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                        Published
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {video.releaseYear && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Release Year</label>
                    <div className="text-sm">{video.releaseYear}</div>
                  </div>
                )}
                {video.ageRating && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Age Rating</label>
                    <p className="text-sm">{video.ageRating}</p>
                  </div>
                )}
              </div>

              {video.badge && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Badge</label>
                  <p className="text-sm">{video.badge}</p>
                </div>
              )}

            {video.scheduleDate && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wide">Schedule Date</p>
                    <div className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(video.scheduleDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </div>
                  </div>
                </div>
            )}

              {video.genre && video.genre.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Genres</p>
                  <p className="text-sm">
                    {video.genre.join(", ")}
                  </p>
                </div>
              )}

              {video.streamUrl && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Stream URL</p>
                  <p className="text-sm text-muted-foreground font-mono text-xs break-all bg-muted/50 p-2 rounded">
                    {video.streamUrl}
                  </p>
                </div>
              )}

              {video.description && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Description</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">{video.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(video.createdAt).toLocaleString("en-US")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Updated At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(video.updatedAt).toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Player Card (Optional - if video URL exists) */}
      {video.videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Video Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
              <video 
                src={video.videoUrl} 
                controls 
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
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
