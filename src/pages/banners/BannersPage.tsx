import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { toast } from "@/hooks/use-toast";
import { mockBanners, Banner } from "@/data/mockData";
import { Plus, Edit, Trash2, Eye, BarChart3, Activity, MousePointer, Clock, Play, Image, GripVertical } from "lucide-react";
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { format } from "date-fns";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';


interface BannerStats {
  total_banners: number;
  banners_ativos: number;
  total_visualizacoes: number;
  total_cliques: number;
  total_tempo_reproducao: number;
}

const isExpired = (dataFim: string) => {
  return new Date(dataFim) < new Date();
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

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

// Componente para linha sortável
function SortableRow({ banner, children }: { 
  banner: Banner; 
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell>
        <div 
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
          {...listeners}
          {...(banner.status && !isExpired(banner.data_fim) ? {} : { style: { cursor: 'not-allowed', opacity: 0.5 } })}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      {children}
    </TableRow>
  );
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stats, setStats] = useState<BannerStats>({
    total_banners: 0,
    banners_ativos: 0,
    total_visualizacoes: 0,
    total_cliques: 0,
    total_tempo_reproducao: 0
  });
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const categories = [
    { value: "all", label: "Todos os tipos" },
    { value: "vod", label: "VOD" },
    { value: "live_agora", label: "Ao Vivo Agora" },
    { value: "live_programado", label: "Live Programada" },
    { value: "campanha", label: "Campanha" },
    { value: "recomendado", label: "Recomendado" },
    { value: "institucional", label: "Institucional" }
  ];

  const statuses = [
    { value: "all", label: "Todos os status" },
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" },
    { value: "expired", label: "Expirado" }
  ];

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || banner.tipo_conteudo === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && banner.status && !isExpired(banner.data_fim)) ||
      (statusFilter === "inactive" && !banner.status) ||
      (statusFilter === "expired" && isExpired(banner.data_fim));
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filtrar banners ativos para o carrossel
  const activeBanners = filteredBanners.filter(banner => 
    banner.status && 
    !isExpired(banner.data_fim) && 
    (banner.planos_permitidos?.includes(selectedPlan) || !banner.planos_permitidos?.length)
  ).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  const fetchBanners = () => {
    // Usar dados mockados
    const data = mockBanners;
    setBanners(data);
    
    // Calcular estatísticas
    const totalBanners = data.length;
    const bannersAtivos = data.filter(b => b.status).length;
    const totalVisualizacoes = data.reduce((sum, b) => sum + (b.visualizacoes || 0), 0);
    const totalCliques = data.reduce((sum, b) => sum + (b.cliques || 0), 0);
    const totalTempoReproducao = data.reduce((sum, b) => sum + (b.tempo_total_reproducao || 0), 0);

    setStats({
      total_banners: totalBanners,
      banners_ativos: bannersAtivos,
      total_visualizacoes: totalVisualizacoes,
      total_cliques: totalCliques,
      total_tempo_reproducao: totalTempoReproducao
    });
    
    setLoading(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setBanners((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Atualizar a ordem dos banners
        const updatedBanners = newOrder.map((banner, index) => ({
          ...banner,
          ordem: index + 1
        }));
        
        return updatedBanners;
      });
      
      toast({
        title: "Ordem atualizada",
        description: "A ordem dos banners foi atualizada com sucesso.",
      });
    }
  };

  const deleteBanner = (id: string) => {
    // Simular exclusão
    setBanners(banners.filter(b => b.id !== id));
    
    toast({
      title: "Sucesso",
      description: "Banner excluído com sucesso.",
    });
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

      {/* Filtros */}
      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={categories}
        statuses={statuses}
        searchPlaceholder="Buscar banners..."
        categoryPlaceholder="Tipo de Conteúdo"
        statusPlaceholder="Status"
      />

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

      {/* Carrossel de Pré-visualização */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pré-visualização dos Banners</CardTitle>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione o plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Plano Free</SelectItem>
                <SelectItem value="premium">Plano Premium</SelectItem>
                <SelectItem value="pro">Plano Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Visualize como os banners aparecerão para usuários do plano {selectedPlan}
          </p>
        </CardHeader>
        <CardContent>
          {activeBanners.length > 0 ? (
            <Carousel 
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {activeBanners.map((banner, index) => (
                  <CarouselItem key={banner.id}>
                    <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                      {/* Background com overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                      
                      {/* Logo no canto superior esquerdo */}
                      <div className="absolute top-6 left-6 z-10">
                        <div className="flex items-center gap-2 text-white">
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <Play className="h-4 w-4 text-black" />
                          </div>
                          <span className="text-sm font-medium uppercase tracking-wider">B-LEAGUE ORIGINALS</span>
                        </div>
                      </div>

                      {/* Conteúdo principal */}
                      <div className="absolute inset-0 flex items-center">
                        <div className="flex w-full h-full">
                          {/* Lado esquerdo - Texto e botões */}
                          <div className="flex-1 flex items-center">
                            <div className="pl-6 max-w-lg">
                              <h1 className="text-5xl font-bold text-white mb-4 leading-tight uppercase tracking-wide">
                                {banner.titulo}
                              </h1>
                              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                {banner.tipo_conteudo === 'vod' ? 'Cooper Flagg struggles shooting in his Summer League debut, but shows plenty of everything he\'s waiting to unleash on the NBA.' : 
                                 banner.tipo_conteudo === 'live_agora' ? 'Assista ao vivo este emocionante confronto com os melhores atletas.' :
                                 'Conteúdo exclusivo disponível para você.'}
                              </p>
                              <div className="flex gap-4">
                                <Button 
                                  size="lg" 
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium"
                                >
                                  {banner.texto_botao || 'Assistir'}
                                </Button>
                                <Button 
                                  size="lg" 
                                  variant="secondary"
                                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 text-base font-medium"
                                >
                                  Definir Lembrete
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Lado direito - Imagem */}
                          <div className="flex-1 relative">
                            {banner.midia_url ? (
                              <img 
                                src={banner.midia_url} 
                                alt={banner.titulo}
                                className="absolute right-0 top-0 h-full w-full object-cover object-center"
                              />
                            ) : (
                              <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-l from-slate-700 to-transparent flex items-center justify-center">
                                <div className="text-center text-white/50">
                                  <Image className="h-20 w-20 mx-auto mb-4" />
                                  <p className="text-sm">Imagem do banner</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Badge de ordem */}
                      <div className="absolute top-6 right-6 z-10">
                        <Badge variant="secondary" className="text-xs bg-black/50 text-white border-white/20">
                          #{banner.ordem}
                        </Badge>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                Nenhum banner ativo encontrado para o plano {selectedPlan}.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Banners */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Banners</CardTitle>
          <p className="text-sm text-muted-foreground">
            Arraste e solte para reordenar os banners ativos
          </p>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Thumb</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Layout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        Nenhum banner encontrado.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext
                     items={filteredBanners.map(banner => banner.id)} 
                     strategy={verticalListSortingStrategy}
                   >
                     {filteredBanners.map((banner) => (
                      <SortableRow key={banner.id} banner={banner}>
                        <TableCell>
                          <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
                            <Image className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{banner.titulo}</TableCell>
                        <TableCell>{getTipoConteudoLabel(banner.tipo_conteudo)}</TableCell>
                        <TableCell>{getLayoutLabel(banner.layout_banner)}</TableCell>
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
                          <ActionDropdown
                            onView={() => {}} // Dialog de preview será mostrado
                            onEdit={() => window.location.href = `/banners/${banner.id}/editar`}
                            onDelete={() => deleteBanner(banner.id)}
                          />
                        </TableCell>
                      </SortableRow>
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}