import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Video, Radio, Users, Calendar, Newspaper, Eye, TrendingUp, Play, Plus, Activity, LayoutPanelTop } from "lucide-react";
export default function DashboardIndex() {
  const navigate = useNavigate();
  const stats = [{
    title: "Vídeos VOD",
    value: "127",
    change: "+12%",
    changeType: "positive" as const,
    icon: Video,
    color: "text-muted-foreground"
  }, {
    title: "Lives Agendadas",
    value: "8",
    change: "+3",
    changeType: "positive" as const,
    icon: Radio,
    color: "text-muted-foreground"
  }, {
    title: "Visualizações",
    value: "45.2K",
    change: "+18%",
    changeType: "positive" as const,
    icon: Eye,
    color: "text-muted-foreground"
  }, {
    title: "Engajamento",
    value: "78%",
    change: "+5%",
    changeType: "positive" as const,
    icon: TrendingUp,
    color: "text-muted-foreground"
  }];
  const recentVideos = [{
    id: 1,
    title: "Buzzer Beater: Vitória épica no último segundo",
    description: "Os melhores momentos da vitória dramática com cesta no estouro do cronômetro",
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/04542e4202afd169555c7c2693804706a2fa64e5.png",
    duration: "05:32"
  }, {
    id: 2,
    title: "Triple-Double histórico do armador",
    description: "Reveja a performance incrível com pontos, assistências e rebotes",
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/1d986d6d01b285b9919ce7999ac9e722c4840aaf.png",
    duration: "12:18"
  }, {
    id: 3,
    title: "Enterradas espetaculares da temporada",
    description: "As melhores dunks que eletrificaram a torcida nesta temporada",
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/27356cffab990f52a5f57edf87e0c6b97602eebc.png",
    duration: "15:42"
  }, {
    id: 4,
    title: "Alley-oop perfeito: Conexão entre armador e pivô",
    description: "A jogada ensaiada que virou marca registrada do time",
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/curitibawatchersCards/3b9955fd994fada0c92464563b2a10537e8ac849.png",
    duration: "04:18"
  }];
  const upcomingEvents = [{
    id: 1,
    title: "State Championship Final",
    description: "Live broadcast of the grand final against traditional rival",
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchThunders.png",
    dateTime: "2025-12-20T16:00:00"
  }, {
    id: 2,
    title: "Open Training for Fans",
    description: "Follow the team's training before the decisive game",
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-NovaThunder.png",
    dateTime: "2026-01-22T09:00:00"
  }, {
    id: 3,
    title: "2024 Squad Presentation",
    description: "Press conference with presentation of new players",
    thumbnail: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/content/cardImageUrl/cardGame-WatchersIron.png",
    dateTime: "2024-01-18T10:00:00"
  }];
  return <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Home</h1>
          <p className="text-muted-foreground">Welcome!</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="bg-gradient-card border-border/50 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
            onClick={() => navigate('/videos?new=true')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <Video className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-base font-medium text-foreground">Upload Video</span>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-card border-border/50 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
            onClick={() => navigate('/lives?new=true')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <Radio className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-base font-medium text-foreground">New Livestream</span>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-card border-border/50 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
            onClick={() => navigate('/news?new=true')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <Newspaper className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-base font-medium text-foreground">Create News</span>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-card border-border/50 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
            onClick={() => navigate('/pages')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <LayoutPanelTop className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-base font-medium text-foreground">Manage Pages</span>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Videos */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Uploaded Videos</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/videos')}>
              See All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentVideos.map(video => <div key={video.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/videos/${video.id}`)}>
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-14 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <Play className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">{video.duration}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">{video.title}</h4>
                  <p className="text-xs text-muted-foreground truncate mt-1">{video.description}</p>
                </div>
              </div>)}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/schedule')}>
              <Calendar className="h-4 w-4 mr-2" />
              Agenda
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map(event => <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/lives/${event.id}`)}>
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-14 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {event.thumbnail ? (
                      <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <Radio className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">{event.title}</h4>
                  <p className="text-xs text-muted-foreground truncate mt-1">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(event.dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {new Date(event.dateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>)}
          </CardContent>
        </Card>
      </div>
    </div>;
}