import { Play, Search, Bell, User, Heart, Share2, Calendar, Users } from "lucide-react"
import { useCustomization } from "@/hooks/useCustomization"

interface StreamingPreviewProps {
  type: 'desktop' | 'mobile'
}

export function StreamingPreview({ type }: StreamingPreviewProps) {
  const { settings } = useCustomization()
  const { primaryColor, secondaryColor, clubName, logoUrl } = settings

  if (type === 'desktop') {
    return (
      <div className="border border-border rounded-lg overflow-hidden bg-background text-foreground">
        {/* Header */}
        <div 
          className="h-12 flex items-center justify-between px-4 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-7 h-7 object-contain" />
              ) : (
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="h-4 w-4" />
                </div>
              )}
              <span className="font-bold text-sm">{clubName}</span>
            </div>
            <nav className="flex items-center gap-4 ml-6">
              <span className="text-sm opacity-90 cursor-pointer hover:opacity-100">Início</span>
              <span className="text-sm opacity-70 cursor-pointer hover:opacity-100">Ao Vivo</span>
              <span className="text-sm opacity-70 cursor-pointer hover:opacity-100">Vídeos</span>
              <span className="text-sm opacity-70 cursor-pointer hover:opacity-100">Notícias</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 opacity-80 cursor-pointer hover:opacity-100" />
            <Bell className="h-4 w-4 opacity-80 cursor-pointer hover:opacity-100" />
            <User className="h-4 w-4 opacity-80 cursor-pointer hover:opacity-100" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="h-20 bg-gradient-to-r from-muted to-muted/50 p-4 flex items-center">
          <div className="flex-1">
            <h2 className="font-bold text-sm mb-1" style={{ color: primaryColor }}>
              Bem-vindo ao {clubName}
            </h2>
            <p className="text-xs text-muted-foreground">Acompanhe os melhores momentos do clube</p>
          </div>
          <div 
            className="px-3 py-1.5 rounded text-white text-xs font-medium cursor-pointer hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Assistir Agora
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-4 space-y-3">
          {/* Live Streams */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-xs" style={{ color: primaryColor }}>
                Transmissões ao Vivo
              </h3>
              <span 
                className="px-2 py-0.5 rounded text-white text-xs"
                style={{ backgroundColor: secondaryColor }}
              >
                2 AO VIVO
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-card border border-border rounded p-2">
                <div className="w-full h-8 bg-muted rounded mb-1 flex items-center justify-center">
                  <Play className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-xs font-medium truncate">Jogo Principal</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="h-2 w-2 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">1.2k</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded p-2">
                <div className="w-full h-8 bg-muted rounded mb-1 flex items-center justify-center">
                  <Play className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-xs font-medium truncate">Bastidores</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="h-2 w-2 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">853</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Videos */}
          <div>
            <h3 className="font-semibold text-xs mb-2" style={{ color: primaryColor }}>
              Vídeos Recentes
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded p-2">
                  <div className="w-full h-6 bg-muted rounded mb-1 flex items-center justify-center">
                    <Play className="h-2 w-2 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium truncate">Vídeo {i}</p>
                  <p className="text-xs text-muted-foreground">2h atrás</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile Preview
  return (
    <div className="max-w-48 mx-auto border border-border rounded-xl overflow-hidden bg-background">
      {/* Mobile Header */}
      <div 
        className="h-10 flex items-center justify-between px-3 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-4 h-4 object-contain" />
          ) : (
            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
              <Play className="h-2 w-2" />
            </div>
          )}
          <span className="font-bold text-xs truncate">{clubName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-3 w-3 opacity-80" />
          <User className="h-3 w-3 opacity-80" />
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-3 space-y-3">
        {/* Live Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-xs" style={{ color: primaryColor }}>
              Ao Vivo
            </h4>
            <span 
              className="px-1.5 py-0.5 rounded text-white text-xs"
              style={{ backgroundColor: secondaryColor }}
            >
              LIVE
            </span>
          </div>
          <div className="bg-card border border-border rounded p-2">
            <div className="w-full h-8 bg-muted rounded mb-1 flex items-center justify-center">
              <Play className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-xs font-medium">Jogo Principal</p>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
                <Users className="h-2 w-2 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">1.2k</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-2 w-2 text-muted-foreground" />
                <Share2 className="h-2 w-2 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Videos */}
        <div>
          <h4 className="font-semibold text-xs mb-2" style={{ color: primaryColor }}>
            Recentes
          </h4>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-2">
                <div className="w-12 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  <Play className="h-2 w-2 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Vídeo {i}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-2 w-2" />
                    <span>2h atrás</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div 
          className="w-full py-2 rounded text-center text-white text-xs font-medium"
          style={{ backgroundColor: primaryColor }}
        >
          Ver Mais Conteúdos
        </div>
      </div>
    </div>
  )
}