import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Edit, Eye, MousePointer, Clock, Calendar, Link as LinkIcon, Settings, Play } from "lucide-react";
import { format } from "date-fns";

interface Banner {
  id: string;
  titulo: string;
  tipo_conteudo: string;
  layout_banner: string;
  midia_url?: string;
  midia_tipo?: string;
  texto_botao?: string;
  exibir_botao: boolean;
  url_acao?: string;
  data_inicio: string;
  data_fim: string;
  status: boolean;
  ordem: number;
  conteudo_vinculado_id?: string;
  planos_permitidos: string[];
  visualizacoes: number;
  cliques: number;
  tempo_total_reproducao: number;
  created_at: string;
  updated_at: string;
}

export default function BannerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBanner = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBanner(data);
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

  const getTipoConteudoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      vod: "VOD - Vídeo sob demanda",
      live_agora: "Ao Vivo Agora",
      live_programado: "Live Programada",
      campanha: "Campanha Publicitária",
      recomendado: "Conteúdo Recomendado",
      institucional: "Banner Institucional"
    };
    return tipos[tipo] || tipo;
  };

  const getLayoutLabel = (layout: string) => {
    const layouts: Record<string, string> = {
      imagem_botao: "Imagem com Botão",
      video_texto: "Vídeo com Texto Sobreposto",
      hero_cta: "Banner Hero com CTA",
      mini_card: "Mini Card Horizontal"
    };
    return layouts[layout] || layout;
  };

  const getPlanosLabel = (planos: string[]) => {
    const planosMap: Record<string, string> = {
      gratuito: "Gratuito",
      basico: "Básico", 
      premium: "Premium",
      vip: "VIP"
    };
    
    if (!planos || planos.length === 0) return "Todos os planos";
    return planos.map(p => planosMap[p] || p).join(", ");
  };

  const isExpired = (dataFim: string) => {
    return new Date(dataFim) < new Date();
  };

  const isActive = (banner: Banner) => {
    const now = new Date();
    const inicio = new Date(banner.data_inicio);
    const fim = new Date(banner.data_fim);
    return banner.status && now >= inicio && now <= fim;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const calculateCTR = (visualizacoes: number, cliques: number) => {
    if (visualizacoes === 0) return "0%";
    return ((cliques / visualizacoes) * 100).toFixed(2) + "%";
  };

  const calculateEngagement = (tempoTotal: number, visualizacoes: number) => {
    if (visualizacoes === 0) return "0s";
    const avgTime = tempoTotal / visualizacoes;
    return formatTime(Math.round(avgTime));
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

  if (!banner) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Banner não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/banners')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{banner.titulo}</h1>
            <p className="text-muted-foreground">
              Detalhes e estatísticas do banner
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/banners/${banner.id}/editar`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Banner
          </Link>
        </Button>
      </div>

      {/* Status do Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Status e Configurações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status Atual</label>
              <div className="mt-1">
                <Badge 
                  variant={
                    !banner.status ? "secondary" : 
                    isExpired(banner.data_fim) ? "outline" : 
                    isActive(banner) ? "default" : "secondary"
                  }
                >
                  {!banner.status ? "Inativo" : 
                   isExpired(banner.data_fim) ? "Expirado" : 
                   isActive(banner) ? "Ativo" : "Programado"}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Conteúdo</label>
              <p className="mt-1 text-sm">{getTipoConteudoLabel(banner.tipo_conteudo)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Layout</label>
              <p className="mt-1 text-sm">{getLayoutLabel(banner.layout_banner)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Ordem</label>
              <p className="mt-1 text-sm">#{banner.ordem}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Período de Exibição</label>
              <div className="mt-1 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Início: {format(new Date(banner.data_inicio), 'dd/MM/yyyy HH:mm')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Fim: {format(new Date(banner.data_fim), 'dd/MM/yyyy HH:mm')}</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Planos Permitidos</label>
              <p className="mt-1 text-sm">{getPlanosLabel(banner.planos_permitidos)}</p>
            </div>
          </div>

          {banner.exibir_botao && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Texto do Botão</label>
                  <p className="mt-1 text-sm">{banner.texto_botao || "N/A"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">URL de Ação</label>
                  <div className="mt-1">
                    {banner.url_acao ? (
                      <a 
                        href={banner.url_acao} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <LinkIcon className="h-3 w-3" />
                        {banner.url_acao}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Preview do Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Pré-visualização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-4xl mx-auto">
            {banner.midia_url ? (
              <div className="relative rounded-lg overflow-hidden bg-muted">
                {banner.midia_tipo === 'video' ? (
                  <video 
                    src={banner.midia_url} 
                    controls 
                    className="w-full h-64 md:h-96 object-cover"
                    poster={banner.midia_url}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-16 w-16 text-white/80" />
                    </div>
                  </video>
                ) : (
                  <img 
                    src={banner.midia_url} 
                    alt={banner.titulo}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                )}
                
                {/* Overlay com informações do banner */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">{banner.titulo}</h3>
                  <p className="text-white/90 text-sm mb-4">{getTipoConteudoLabel(banner.tipo_conteudo)}</p>
                  
                  {banner.exibir_botao && banner.texto_botao && (
                    <Button variant="secondary" className="w-fit">
                      {banner.texto_botao}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 md:h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma mídia configurada</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas do Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="h-5 w-5" />
            Estatísticas de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {banner.visualizacoes.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Visualizações</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {banner.cliques.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Cliques</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {calculateCTR(banner.visualizacoes, banner.cliques)}
              </div>
              <div className="text-sm text-muted-foreground">CTR (Click Through Rate)</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatTime(banner.tempo_total_reproducao)}
              </div>
              <div className="text-sm text-muted-foreground">Tempo Total</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {calculateEngagement(banner.tempo_total_reproducao, banner.visualizacoes)}
              </div>
              <div className="text-sm text-muted-foreground">Tempo Médio</div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="font-medium text-muted-foreground">Criado em</label>
              <p>{format(new Date(banner.created_at), 'dd/MM/yyyy HH:mm')}</p>
            </div>
            
            <div>
              <label className="font-medium text-muted-foreground">Última atualização</label>
              <p>{format(new Date(banner.updated_at), 'dd/MM/yyyy HH:mm')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}