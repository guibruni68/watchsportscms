import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Eye, BarChart3, Activity, MousePointer, Clock } from "lucide-react";
import { format } from "date-fns";

interface Banner {
  id: string;
  titulo: string;
  tipo_conteudo: string;
  layout_banner: string;
  midia_url?: string;
  midia_tipo?: string;
  data_inicio: string;
  data_fim: string;
  status: boolean;
  ordem: number;
  visualizacoes: number;
  cliques: number;
  tempo_total_reproducao: number;
  created_at: string;
}

interface BannerStats {
  total_banners: number;
  banners_ativos: number;
  total_visualizacoes: number;
  total_cliques: number;
  total_tempo_reproducao: number;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [stats, setStats] = useState<BannerStats>({
    total_banners: 0,
    banners_ativos: 0,
    total_visualizacoes: 0,
    total_cliques: 0,
    total_tempo_reproducao: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;

      setBanners(data || []);
      
      // Calcular estatísticas
      const totalBanners = data?.length || 0;
      const bannersAtivos = data?.filter(b => b.status).length || 0;
      const totalVisualizacoes = data?.reduce((sum, b) => sum + (b.visualizacoes || 0), 0) || 0;
      const totalCliques = data?.reduce((sum, b) => sum + (b.cliques || 0), 0) || 0;
      const totalTempoReproducao = data?.reduce((sum, b) => sum + (b.tempo_total_reproducao || 0), 0) || 0;

      setStats({
        total_banners: totalBanners,
        banners_ativos: bannersAtivos,
        total_visualizacoes: totalVisualizacoes,
        total_cliques: totalCliques,
        total_tempo_reproducao: totalTempoReproducao
      });
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os banners.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Banner excluído com sucesso.",
      });
      
      fetchBanners();
    } catch (error) {
      console.error('Erro ao excluir banner:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o banner.",
        variant: "destructive",
      });
    }
  };

  const getTipoConteudoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      vod: "VOD",
      live_agora: "Ao Vivo Agora",
      live_programado: "Live Programada",
      campanha: "Campanha",
      recomendado: "Recomendado",
      institucional: "Institucional"
    };
    return tipos[tipo] || tipo;
  };

  const getLayoutLabel = (layout: string) => {
    const layouts: Record<string, string> = {
      imagem_botao: "Imagem + Botão",
      video_texto: "Vídeo + Texto",
      hero_cta: "Hero + CTA",
      mini_card: "Mini Card"
    };
    return layouts[layout] || layout;
  };

  const isExpired = (dataFim: string) => {
    return new Date(dataFim) < new Date();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
          <p className="text-muted-foreground">
            Gerencie banners promocionais e de destaque
          </p>
        </div>
        <Button asChild>
          <Link to="/banners/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Banner
          </Link>
        </Button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Banners</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_banners}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banners Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.banners_ativos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_visualizacoes.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_cliques.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.total_tempo_reproducao)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Banners */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Thumb</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Estatísticas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-muted-foreground">
                      Nenhum banner encontrado. Crie seu primeiro banner.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell className="font-medium">{banner.titulo}</TableCell>
                    <TableCell>
                      {banner.midia_url ? (
                        <div className="w-16 h-10 bg-muted rounded overflow-hidden">
                          {banner.midia_tipo === 'video' ? (
                            <video 
                              src={banner.midia_url} 
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : (
                            <img 
                              src={banner.midia_url} 
                              alt={banner.titulo}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Sem mídia</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getTipoConteudoLabel(banner.tipo_conteudo)}</TableCell>
                    <TableCell>{getLayoutLabel(banner.layout_banner)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(new Date(banner.data_inicio), 'dd/MM/yyyy HH:mm')}</div>
                        <div className="text-muted-foreground">
                          {format(new Date(banner.data_fim), 'dd/MM/yyyy HH:mm')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          !banner.status ? "secondary" : 
                          isExpired(banner.data_fim) ? "outline" : 
                          "default"
                        }
                      >
                        {!banner.status ? "Inativo" : 
                         isExpired(banner.data_fim) ? "Expirado" : 
                         "Ativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{banner.ordem}</TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>{banner.visualizacoes} views</div>
                        <div>{banner.cliques} cliques</div>
                        <div>{formatTime(banner.tempo_total_reproducao)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/banners/${banner.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/banners/${banner.id}/editar`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o banner "{banner.titulo}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteBanner(banner.id)}>
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}