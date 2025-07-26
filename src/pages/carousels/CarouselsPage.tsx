import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Eye, Trash2, Grid3X3, List, GripVertical } from "lucide-react";
import { CarouselForm } from "@/components/forms/CarouselForm";
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { SearchFilters } from "@/components/ui/search-filters"
import { ListControls, ListPagination } from "@/components/ui/list-controls";
import { useToast } from "@/hooks/use-toast";
import { getAgentsByType } from "@/data/mockData";
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

interface Carousel {
  id: string;
  title: string;
  carouselType: "vod" | "lives" | "news" | "ads" | "players" | "store" | "top5";
  layout: "horizontal" | "grid" | "slider";
  order: number;
  status: "active" | "inactive";
  showMoreButton: boolean;
  createdAt: string;
  sortType: "alphabetical" | "random" | "mostWatched" | "newest";
  contentLimit?: number;
  planType: "all" | "free" | "premium" | "vip";
  // Campos específicos por tipo
  contentSource?: "agent" | "genre" | "recommendations" | "manual";
  agentType?: string;
  agentIds?: string[];
  genreType?: string;
  algorithmType?: string;
  manualContent?: string[];
  adCategory?: string;
  adPosition?: string;
  productCategory?: string;
  priceRange?: string;
}

const mockCarousels: Carousel[] = [
  {
    id: "1",
    title: "VOD - Melhores Momentos Marcus Johnson",
    carouselType: "vod",
    layout: "horizontal",
    contentSource: "agent",
    order: 1,
    status: "active",
    showMoreButton: true,
    createdAt: "2024-01-15",
    sortType: "mostWatched",
    contentLimit: 15,
    planType: "all",
    agentType: "player",
    agentIds: ["player1"],
  },
  {
    id: "2", 
    title: "Notícias - Gols Históricos",
    carouselType: "news",
    layout: "grid",
    contentSource: "genre",
    order: 2,
    status: "active",
    showMoreButton: false,
    createdAt: "2024-01-10",
    sortType: "alphabetical",
    contentLimit: 20,
    planType: "premium",
    genreType: "goals",
  },
  {
    id: "3",
    title: "TOP 5 - Melhores Jogadas",
    carouselType: "top5",
    layout: "slider",
    order: 3,
    status: "inactive",
    showMoreButton: true,
    createdAt: "2024-01-05",
    sortType: "random",
    planType: "vip",
  },
  {
    id: "4",
    title: "ADS - Banners Promocionais",
    carouselType: "ads",
    layout: "horizontal",
    order: 4,
    status: "active",
    showMoreButton: false,
    createdAt: "2024-01-20",
    sortType: "newest",
    contentLimit: 8,
    planType: "all",
    adCategory: "banner",
    adPosition: "top",
  },
  {
    id: "5",
    title: "Loja - Camisas Premium",
    carouselType: "store",
    layout: "grid",
    order: 5,
    status: "active",
    showMoreButton: true,
    createdAt: "2024-01-18",
    sortType: "newest",
    contentLimit: 12,
    planType: "premium",
    productCategory: "jerseys",
    priceRange: "100-200",
  },
];

const getCarouselTypeLabel = (type: string) => {
  const labels = {
    vod: "VOD",
    lives: "Canais ao Vivo",
    news: "Notícias",
    ads: "Anúncios/ADS",
    players: "Jogadores",
    store: "Loja",
    top5: "TOP 5"
  };
  return labels[type as keyof typeof labels];
};

const getLayoutLabel = (layout: string) => {
  const labels = {
    horizontal: "Horizontal Scroll",
    grid: "Grade com Destaques", 
    slider: "Slider com Fundo"
  };
  return labels[layout as keyof typeof labels];
};

const getSortTypeLabel = (sortType: string) => {
  const labels = {
    alphabetical: "Alfabética",
    random: "Aleatória",
    mostWatched: "Mais Assistidos",
    newest: "Mais Recentes"
  };
  return labels[sortType as keyof typeof labels];
};

const getPlanTypeLabel = (planType: string) => {
  const labels = {
    all: "Todos",
    free: "Gratuito",
    premium: "Premium",
    vip: "VIP"
  };
  return labels[planType as keyof typeof labels];
};

const getPlanTypeBadgeVariant = (planType: string) => {
  const variants = {
    all: "outline",
    free: "secondary",
    premium: "default",
    vip: "destructive"
  };
  return variants[planType as keyof typeof variants] as any;
};

const getContentSourceLabel = (source: string) => {
  const labels = {
    agent: "Agente",
    genre: "Gênero",
    recommendations: "Recomendação Personalizada",
    manual: "Manual"
  };
  return labels[source as keyof typeof labels];
};

const getAgentNames = (carousel: Carousel) => {
  if (!carousel.agentType || !carousel.agentIds?.length) return "Nenhum agente selecionado";
  const agents = getAgentsByType(carousel.agentType);
  const selectedAgents = agents.filter(agent => carousel.agentIds!.includes(agent.id));
  return selectedAgents.map(agent => agent.name).join(", ");
};

// Componente para linha sortável
function SortableRow({ carousel, children }: { 
  carousel: Carousel; 
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: carousel.id });

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
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      {children}
    </TableRow>
  );
}

export default function CarouselsPage() {
  const [carousels, setCarousels] = useState<Carousel[]>(mockCarousels);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewingCarousel, setViewingCarousel] = useState<Carousel | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const categories = [
    { value: "all", label: "Todos os tipos" },
    { value: "vod", label: "VOD" },
    { value: "lives", label: "Canais ao Vivo" },
    { value: "news", label: "Notícias" },
    { value: "ads", label: "Anúncios/ADS" },
    { value: "players", label: "Jogadores" },
    { value: "store", label: "Loja" },
    { value: "top5", label: "TOP 5" }
  ];

  const statuses = [
    { value: "all", label: "Todos os status" },
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" }
  ];

  const filteredCarousels = carousels.filter(carousel => {
    const matchesSearch = carousel.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || carousel.carouselType === categoryFilter;
    const matchesStatus = statusFilter === "all" || carousel.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCarousels((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Atualizar a ordem dos carrosséis
        const updatedCarousels = newOrder.map((carousel, index) => ({
          ...carousel,
          order: index + 1
        }));
        
        return updatedCarousels;
      });
      
      toast({
        title: "Ordem atualizada",
        description: "A ordem dos carrosséis foi atualizada com sucesso.",
      });
    }
  };

  const handleCreateCarousel = (data: any) => {
    const newCarousel: Carousel = {
      id: String(Date.now()),
      title: data.title,
      carouselType: data.carouselType,
      layout: data.layout,
      contentSource: data.contentSource,
      order: data.order,
      status: data.status ? "active" : "inactive",
      showMoreButton: data.showMoreButton,
      createdAt: new Date().toISOString().split('T')[0],
      sortType: data.sortType,
      contentLimit: data.contentLimit,
      planType: data.planType,
      agentType: data.agentType,
      agentIds: data.agentIds,
      genreType: data.genreType,
      algorithmType: data.algorithmType,
      manualContent: data.manualContent,
      adCategory: data.adCategory,
      adPosition: data.adPosition,
      productCategory: data.productCategory,
      priceRange: data.priceRange,
    };
    
    setCarousels([...carousels, newCarousel]);
    setIsFormOpen(false);
    toast({
      title: "Carrossel criado com sucesso!",
      description: `O carrossel "${data.title}" foi adicionado.`,
    });
  };

  const handleEditCarousel = (data: any) => {
    if (!editingCarousel) return;
    
    const updatedCarousel: Carousel = {
      ...editingCarousel,
      title: data.title,
      carouselType: data.carouselType,
      layout: data.layout,
      contentSource: data.contentSource,
      order: data.order,
      status: data.status ? "active" : "inactive",
      showMoreButton: data.showMoreButton,
      sortType: data.sortType,
      contentLimit: data.contentLimit,
      planType: data.planType,
      agentType: data.agentType,
      agentIds: data.agentIds,
      genreType: data.genreType,
      algorithmType: data.algorithmType,
      manualContent: data.manualContent,
      adCategory: data.adCategory,
      adPosition: data.adPosition,
      productCategory: data.productCategory,
      priceRange: data.priceRange,
    };
    
    setCarousels(carousels.map(c => c.id === editingCarousel.id ? updatedCarousel : c));
    setEditingCarousel(null);
    setIsFormOpen(false);
    toast({
      title: "Carrossel atualizado com sucesso!",
      description: `O carrossel "${data.title}" foi modificado.`,
    });
  };

  const handleDeleteCarousel = (id: string) => {
    setCarousels(carousels.filter(c => c.id !== id));
    toast({
      title: "Carrossel removido",
      description: "O carrossel foi excluído com sucesso.",
    });
  };

  const openEditForm = (carousel: Carousel) => {
    setEditingCarousel(carousel);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingCarousel(null);
    setIsFormOpen(true);
  };

  const totalPages = Math.ceil(filteredCarousels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCarousels = filteredCarousels.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Carrosséis</h1>
          <p className="text-muted-foreground">
            Configure e gerencie os carrosséis de conteúdo da plataforma
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateForm} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Carrossel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCarousel ? "Editar Carrossel" : "Criar Novo Carrossel"}
              </DialogTitle>
            </DialogHeader>
            <CarouselForm
              initialData={editingCarousel}
              onSubmit={editingCarousel ? handleEditCarousel : handleCreateCarousel}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={categories}
        statuses={statuses}
        searchPlaceholder="Buscar carrosséis..."
        categoryPlaceholder="Tipo de Carrossel"
        statusPlaceholder="Status"
      />

      <ListControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={filteredCarousels.length}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {viewMode === "list" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
            Carrosséis Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "list" ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Layout</TableHead>
                      <TableHead>Ordenação</TableHead>
                      <TableHead>Limite</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext 
                      items={currentCarousels.map(carousel => carousel.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      {currentCarousels.map((carousel) => (
                        <SortableRow key={carousel.id} carousel={carousel}>
                          <TableCell className="font-medium">{carousel.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getCarouselTypeLabel(carousel.carouselType)}</Badge>
                          </TableCell>
                          <TableCell>{getLayoutLabel(carousel.layout)}</TableCell>
                          <TableCell>{getSortTypeLabel(carousel.sortType)}</TableCell>
                          <TableCell>{carousel.carouselType === "top5" ? "5" : carousel.contentLimit}</TableCell>
                          <TableCell>
                            <Badge variant={carousel.status === "active" ? "default" : "secondary"}>
                              {carousel.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <ActionDropdown
                              onView={() => setViewingCarousel(carousel)}
                              onEdit={() => openEditForm(carousel)}
                              onDelete={() => handleDeleteCarousel(carousel.id)}
                            />
                          </TableCell>
                        </SortableRow>
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </div>
            </DndContext>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCarousels.map((carousel) => (
                <Card key={carousel.id} className="transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{carousel.title}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => openEditForm(carousel)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Tipo:</span> 
                        <Badge variant="outline" className="ml-2">{getCarouselTypeLabel(carousel.carouselType)}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">Layout:</span> {getLayoutLabel(carousel.layout)}
                      </div>
                      <div>
                        <span className="font-medium">Ordenação:</span> {getSortTypeLabel(carousel.sortType)}
                      </div>
                      <div>
                        <span className="font-medium">Limite:</span> {carousel.carouselType === "top5" ? "5" : carousel.contentLimit} conteúdos
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

        <ListPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCarousels.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={filteredCarousels.length}
        />

      {/* Modal de Visualização do Carrossel */}
      <Dialog open={!!viewingCarousel} onOpenChange={() => setViewingCarousel(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Visualizar Carrossel</DialogTitle>
          </DialogHeader>
          {viewingCarousel && (
            <div className="space-y-6">
              {/* Informações do Carrossel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Informações Básicas</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Título:</span> {viewingCarousel.title}</div>
                    <div><span className="font-medium">Tipo:</span> 
                      <Badge variant="outline" className="ml-2">{getCarouselTypeLabel(viewingCarousel.carouselType)}</Badge>
                    </div>
                    <div><span className="font-medium">Layout:</span> {getLayoutLabel(viewingCarousel.layout)}</div>
                    <div><span className="font-medium">Ordenação:</span> {getSortTypeLabel(viewingCarousel.sortType)}</div>
                    <div><span className="font-medium">Limite:</span> {viewingCarousel.carouselType === "top5" ? "5" : viewingCarousel.contentLimit} conteúdos</div>
                    <div><span className="font-medium">Ordem:</span> {viewingCarousel.order}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge variant={viewingCarousel.status === "active" ? "default" : "secondary"} className="ml-2">
                        {viewingCarousel.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Configurações</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Plano:</span>
                      <Badge variant={getPlanTypeBadgeVariant(viewingCarousel.planType)}>
                        {getPlanTypeLabel(viewingCarousel.planType)}
                      </Badge>
                    </div>
                    {viewingCarousel.contentSource === "agent" && (
                      <>
                        <div><span className="font-medium">Tipo de Agente:</span> {viewingCarousel.agentType}</div>
                        <div><span className="font-medium">Agentes:</span> {getAgentNames(viewingCarousel)}</div>
                      </>
                    )}
                    {viewingCarousel.contentSource === "genre" && (
                      <div><span className="font-medium">Gênero:</span> {viewingCarousel.genreType}</div>
                    )}
                    {viewingCarousel.contentSource === "recommendations" && (
                      <div><span className="font-medium">Algoritmo:</span> {viewingCarousel.algorithmType}</div>
                    )}
                    <div><span className="font-medium">Botão "Ver mais":</span> {viewingCarousel.showMoreButton ? "Sim" : "Não"}</div>
                  </div>
                </div>
              </div>

              {/* Lista de Conteúdos */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Conteúdos do Carrossel</h3>
                  <Badge variant="outline">
                    {viewingCarousel.contentSource === "manual" 
                      ? `${viewingCarousel.manualContent?.length || 0} conteúdos`
                      : "12 conteúdos"
                    } total
                  </Badge>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5].map((item) => (
                        <TableRow key={item}>
                          <TableCell className="font-medium">
                            {viewingCarousel.contentSource === "manual" 
                              ? `Conteúdo Manual ${item}`
                              : `Conteúdo Automático ${item}`
                            }
                          </TableCell>
                          <TableCell>Vídeo</TableCell>
                          <TableCell>02:30</TableCell>
                          <TableCell>15/01/2024</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
