import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Play, Calendar, Users, X, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getContentStatus, getStatusBadgeVariant } from "@/lib/utils";

interface Live {
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
  
  // Legacy fields for backward compatibility with list pages
  eventName?: string;
  dateTime?: string;
  genre?: string[];
  available?: boolean;
  viewers?: number;
  playerEmbed?: string;
  coverImage?: string;
}

// Mock data
const mockLives: Live[] = [
  {
    id: "1",
    title: "State Championship Final",
    description: "Live broadcast of the grand final against traditional rival",
    label: "LIVE",
    releaseYear: 2025,
    scheduleDate: "2025-12-20T16:00:00",
    isPublished: true,
    badge: "SOON",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchThunders.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardgamewatchers-01.png",
    streamUrl: "https://example.com/stream/championship-final",
    ageRating: "PG",
    createdAt: "2025-11-15T10:00:00",
    updatedAt: "2025-11-20T14:30:00",
    enabled: true,
    // Legacy fields
    eventName: "State Championship Final",
    dateTime: "2025-12-20T16:00:00",
    genre: ["Championship", "Final"],
    available: false,
    viewers: 0
  },
  {
    id: "2",
    title: "2024 Squad Presentation",
    description: "Press conference with presentation of new players",
    label: "LIVE",
    releaseYear: 2024,
    scheduleDate: "2024-01-18T10:00:00",
    isPublished: true,
    badge: "NEW",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchersIron.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardgamewatchers-02.png",
    streamUrl: "https://example.com/stream/squad-presentation",
    ageRating: "G",
    createdAt: "2024-01-10T09:00:00",
    updatedAt: "2024-01-17T16:45:00",
    enabled: true,
    // Legacy fields
    eventName: "2024 Squad Presentation",
    dateTime: "2024-01-18T10:00:00",
    genre: ["Press Conference", "Institutional"],
    available: true,
    viewers: 1247
  },
  {
    id: "3",
    title: "Preparatory Practice Match",
    description: "Last test before championship debut",
    label: "LIVE",
    releaseYear: 2024,
    scheduleDate: "2024-01-15T15:00:00",
    isPublished: true,
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-thunderredrock.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardgamewatchers-03.png",
    streamUrl: "https://example.com/stream/practice-match",
    ageRating: "PG",
    createdAt: "2024-01-08T11:00:00",
    updatedAt: "2024-01-14T13:20:00",
    enabled: false,
    // Legacy fields
    eventName: "Preparatory Practice Match",
    dateTime: "2024-01-15T15:00:00",
    genre: ["Training", "Practice"],
    available: false,
    viewers: 892
  },
  {
    id: "4",
    title: "Coach Interview",
    description: "Exclusive conversation about the 2024 season",
    label: "LIVE",
    releaseYear: 2024,
    scheduleDate: "2024-01-14T14:00:00",
    isPublished: true,
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-RedrockPine.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardgamewatchers-04.png",
    streamUrl: "https://example.com/stream/coach-interview",
    ageRating: "G",
    createdAt: "2024-01-07T09:00:00",
    updatedAt: "2024-01-13T11:00:00",
    enabled: true,
    // Legacy fields
    eventName: "Coach Interview",
    dateTime: "2024-01-14T14:00:00",
    genre: ["Interview"],
    available: false,
    viewers: 567
  },
  {
    id: "5",
    title: "Open Training for Fans",
    description: "Follow the team's training before the decisive game",
    label: "LIVE",
    releaseYear: 2026,
    scheduleDate: "2026-01-22T09:00:00",
    isPublished: false,
    badge: "SOON",
    cardImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-NovaThunder.png",
    bannerImageUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-BasementPine.png",
    streamUrl: "https://example.com/stream/open-training",
    ageRating: "G",
    createdAt: "2026-01-10T08:00:00",
    updatedAt: "2026-01-20T10:00:00",
    enabled: true,
    // Legacy fields
    eventName: "Open Training for Fans",
    dateTime: "2026-01-22T09:00:00",
    genre: ["Training", "Behind the Scenes"],
    available: false,
    viewers: 0
  },
];

export default function LiveDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [live, setLive] = useState<Live | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Mock API call - replace with actual API
        const liveData = mockLives.find(l => l.id === id);
        
        if (!liveData) {
          throw new Error("Live stream not found");
        }
        
        setLive(liveData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error loading live stream data.",
          variant: "destructive",
        });
        navigate('/lives');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/lives/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!live) {
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
            onClick={() => navigate('/lives')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Live Streams
          </Button>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Live Stream
        </Button>
      </div>

      {/* Live Stream Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Play className="h-6 w-6" />
            {live.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Live Stream Cover */}
            <div className="flex-shrink-0 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Card Image</label>
                <div 
                  className="relative w-full md:w-64 aspect-[3/4] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => live.cardImageUrl && setLightboxImage(live.cardImageUrl)}
                >
                  {live.cardImageUrl ? (
                    <img 
                      src={live.cardImageUrl} 
                      alt={live.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              
              {live.bannerImageUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">Banner Image</label>
                  <div 
                    className="relative w-full md:w-64 aspect-[21/9] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage(live.bannerImageUrl!)}
                  >
                    <img 
                      src={live.bannerImageUrl} 
                      alt={`${live.title} banner`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Stream Info */}
            <div className="flex-1 space-y-5">
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">Label</p>
                <p className="text-sm">{live.label}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Schedule Date</p>
                  <div className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p>{new Date(live.scheduleDate).toLocaleDateString("en-US")}</p>
                      <p className="text-muted-foreground">
                        {new Date(live.scheduleDate).toLocaleTimeString("en-US", { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-[9px] bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                      {live.enabled ? "Enabled" : "Disabled"}
                    </span>
                    {live.isPublished && (
                      <span className="inline-flex items-center rounded-[9px] bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                        Published
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {live.releaseYear && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wide">Release Year</p>
                    <p className="text-sm">{live.releaseYear}</p>
                  </div>
                )}
                {live.ageRating && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wide">Age Rating</p>
                    <p className="text-sm">{live.ageRating}</p>
                  </div>
                )}
              </div>

              {live.badge && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Badge</p>
                  <p className="text-sm">{live.badge}</p>
                </div>
              )}

              {live.genre && live.genre.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Genres</p>
                  <p className="text-sm">
                    {live.genre.join(", ")}
                  </p>
                </div>
              )}

              {live.streamUrl && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Stream URL</p>
                  <p className="text-sm text-muted-foreground font-mono text-xs break-all bg-muted/50 p-2 rounded">
                    {live.streamUrl}
                  </p>
                </div>
              )}

              {live.description && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Description</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">{live.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(live.createdAt).toLocaleString("en-US")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Updated At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(live.updatedAt).toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Stream Player Card (if embed exists) */}
      {live.playerEmbed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Live Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: live.playerEmbed }}
              />
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
