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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Eye, Trash2, Grid3X3, List, GripVertical, Save, X } from "lucide-react";
import { ImportButton } from "@/components/ui/import-button";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { SearchFilters } from "@/components/ui/search-filters";
import { ListControls, ListPagination } from "@/components/ui/list-controls";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
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
  layout: "default" | "highlight" | "hero_banner" | "mid_banner" | "game_result";
  carouselType: "manual" | "personalized" | "automatic";
  order: number;
  status: "active" | "inactive";
  showMoreButton: boolean;
  createdAt: string;
  sortType: "alphabetical" | "random" | "mostWatched" | "newest";
  contentLimit?: number;
  planType: "all" | "free" | "premium" | "vip";
  domain?: "collection" | "content" | "group" | "agent" | "agenda" | "news";
  manualSelection?: string[];
  personalizedAlgorithm?: "because_you_watched" | "suggestions_for_you";
  domainValue?: string;
}

const mockCarousels: Carousel[] = [
  {
    id: "1",
    title: "Melhores Momentos Marcus Johnson",
    carouselType: "manual",
    layout: "default",
    order: 1,
    status: "active",
    showMoreButton: true,
    createdAt: "2024-01-15",
    sortType: "mostWatched",
    contentLimit: 15,
    planType: "all",
    domain: "agent",
    manualSelection: ["player1"],
  },
  {
    id: "2", 
    title: "Notícias - Gols Históricos",
    carouselType: "personalized",
    layout: "highlight",
    order: 2,
    status: "active",
    showMoreButton: false,
    createdAt: "2024-01-10",
    sortType: "alphabetical",
    contentLimit: 20,
    planType: "premium",
    domain: "news",
    personalizedAlgorithm: "because_you_watched",
  },
  {
    id: "3",
    title: "Conteúdos Automáticos",
    carouselType: "automatic",
    layout: "hero_banner",
    order: 3,
    status: "inactive",
    showMoreButton: true,
    createdAt: "2024-01-05",
    sortType: "random",
    planType: "vip",
    domain: "content",
    domainValue: "content1",
  },
];

const getCarouselTypeLabel = (type: string) => {
  const labels = {
    manual: "Manual",
    personalized: "Personalizado", 
    automatic: "Automático"
  };
  return labels[type as keyof typeof labels];
};

const getLayoutLabel = (layout: string) => {
  const labels = {
    default: "Default",
    highlight: "Highlight Content",
    hero_banner: "Hero Banner",
    mid_banner: "Mid Banner",
    game_result: "Game Result"
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
    collection: "Collection",
    content: "Content", 
    group: "Group",
    agent: "Agent",
    agenda: "Agenda",
    news: "News"
  };
  return labels[source as keyof typeof labels];
};

function SortableRow({ carousel, children, isEditingOrder }: { 
  carousel: Carousel; 
  children: React.ReactNode;
  isEditingOrder: boolean;
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
      <TableCell className="w-8">
        {isEditingOrder ? (
          <div 
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        ) : (
          <div className="p-1">
            <span className="text-xs text-muted-foreground font-mono">
              {carousel.order}
            </span>
          </div>
        )}
      </TableCell>
      {children}
    </TableRow>
  );
}

export default function CarouselsPage() {
  const [carousels, setCarousels] = useState<Carousel[]>(mockCarousels);
  const [originalCarousels, setOriginalCarousels] = useState<Carousel[]>(mockCarousels);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewingCarousel, setViewingCarousel] = useState<Carousel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const categories = [
    { value: "all", label: "Todos os tipos" },
    { value: "manual", label: "Manual" },
    { value: "personalized", label: "Personalizado" },
    { value: "automatic", label: "Automático" }
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
        const updatedCarousels = newOrder.map((carousel, index) => ({
          ...carousel,
          order: index + 1
        }));
        
        setHasUnsavedChanges(true);
        return updatedCarousels;
      });
    }
  };

  const handleToggleEditOrder = () => {
    if (isEditingOrder) {
      setCarousels(originalCarousels);
      setHasUnsavedChanges(false);
    } else {
      setOriginalCarousels([...carousels]);
    }
    setIsEditingOrder(!isEditingOrder);
  };

  const handleSaveOrder = () => {
    setOriginalCarousels([...carousels]);
    setIsEditingOrder(false);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Ordem salva com sucesso!",
      description: "A nova ordem dos carrosséis foi confirmada.",
    });
  };

  const handleDeleteCarousel = (id: string) => {
    setCarousels(carousels.filter(c => c.id !== id));
    toast({
      title: "Carrossel removido",
      description: "O carrossel foi excluído com sucesso.",
    });
  };

  const totalPages = Math.ceil(filteredCarousels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCarousels = filteredCarousels.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Carrosséis</h1>
        <div className="flex gap-2">
          <ImportButton entityName="carrosséis" />
          <Link to="/carousels/novo">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Carrossel
            </Button>
          </Link>
        </div>
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

      <Card className="mt-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {viewMode === "list" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
              Carrosséis Cadastrados
            </CardTitle>
            {!isEditingOrder && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleToggleEditOrder}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar Ordenação
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={isEditingOrder ? sensors : []}
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
                    items={currentCarousels.map(c => c.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    {currentCarousels.map((carousel) => (
                      <SortableRow key={carousel.id} carousel={carousel} isEditingOrder={isEditingOrder}>
                        <TableCell className="font-medium">{carousel.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getCarouselTypeLabel(carousel.carouselType)}</Badge>
                        </TableCell>
                        <TableCell>{getLayoutLabel(carousel.layout)}</TableCell>
                        <TableCell>{getSortTypeLabel(carousel.sortType)}</TableCell>
                        <TableCell>{carousel.contentLimit}</TableCell>
                        <TableCell>
                          <Badge variant={carousel.status === "active" ? "default" : "secondary"}>
                            {carousel.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <ActionDropdown
                            onView={() => setViewingCarousel(carousel)}
                            onEdit={() => window.location.href = `/carousels/${carousel.id}/editar`}
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
        </CardContent>
      </Card>

      <ListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={filteredCarousels.length}
      />
    </div>
  );
}
