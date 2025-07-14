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
import { Plus, Edit, Eye, Trash2, Grid3X3, List } from "lucide-react";
import { CarouselForm } from "@/components/forms/CarouselForm";
import { ListControls } from "@/components/ui/list-controls";
import { useToast } from "@/hooks/use-toast";

interface Carousel {
  id: string;
  title: string;
  type: "horizontal" | "grid" | "slider";
  contentSource: "agent" | "genre" | "recommendations" | "manual";
  order: number;
  status: "active" | "inactive";
  showMoreButton: boolean;
  createdAt: string;
  agentType?: string;
  agentId?: string;
  genreType?: string;
  algorithmType?: string;
  manualContent?: string[];
}

const mockCarousels: Carousel[] = [
  {
    id: "1",
    title: "Melhores Momentos - João Silva",
    type: "horizontal",
    contentSource: "agent",
    order: 1,
    status: "active",
    showMoreButton: true,
    createdAt: "2024-01-15",
    agentType: "player",
    agentId: "agent1",
  },
  {
    id: "2", 
    title: "Categoria: Gols Históricos",
    type: "grid",
    contentSource: "genre",
    order: 2,
    status: "active",
    showMoreButton: false,
    createdAt: "2024-01-10",
    genreType: "goals",
  },
  {
    id: "3",
    title: "Recomendações Personalizadas",
    type: "slider",
    contentSource: "recommendations",
    order: 3,
    status: "inactive",
    showMoreButton: true,
    createdAt: "2024-01-05",
    algorithmType: "personalized",
  },
  {
    id: "4",
    title: "Seleção Manual - Final do Campeonato",
    type: "horizontal",
    contentSource: "manual",
    order: 4,
    status: "active",
    showMoreButton: false,
    createdAt: "2024-01-20",
    manualContent: ["content1", "content2", "content3"],
  },
];

const getTypeLabel = (type: string) => {
  const labels = {
    horizontal: "Horizontal Scroll",
    grid: "Grade com Destaques", 
    slider: "Slider com Fundo"
  };
  return labels[type as keyof typeof labels];
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

export default function CarouselsPage() {
  const [carousels, setCarousels] = useState<Carousel[]>(mockCarousels);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewingCarousel, setViewingCarousel] = useState<Carousel | null>(null);
  const { toast } = useToast();

  const handleCreateCarousel = (data: any) => {
    const newCarousel: Carousel = {
      id: String(Date.now()),
      title: data.title,
      type: data.type,
      contentSource: data.contentSource,
      order: data.order,
      status: data.status ? "active" : "inactive",
      showMoreButton: data.showMoreButton,
      createdAt: new Date().toISOString().split('T')[0],
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
      type: data.type,
      contentSource: data.contentSource,
      order: data.order,
      status: data.status ? "active" : "inactive",
      showMoreButton: data.showMoreButton,
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

  const totalPages = Math.ceil(carousels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCarousels = carousels.slice(startIndex, endIndex);

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

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              {viewMode === "list" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
              Carrosséis Cadastrados
            </CardTitle>
            <ListControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={carousels.length}
            />
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "list" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fonte de Conteúdo</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCarousels.map((carousel) => (
                    <TableRow key={carousel.id}>
                      <TableCell className="font-medium">{carousel.title}</TableCell>
                      <TableCell>{getTypeLabel(carousel.type)}</TableCell>
                      <TableCell>{getContentSourceLabel(carousel.contentSource)}</TableCell>
                      <TableCell>{carousel.order}</TableCell>
                      <TableCell>
                        <Badge variant={carousel.status === "active" ? "default" : "secondary"}>
                          {carousel.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditForm(carousel)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setViewingCarousel(carousel)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteCarousel(carousel.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCarousels.map((carousel) => (
                <Card key={carousel.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{carousel.title}</CardTitle>
                      <Badge variant={carousel.status === "active" ? "default" : "secondary"}>
                        {carousel.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Tipo:</span> {getTypeLabel(carousel.type)}
                      </div>
                      <div>
                        <span className="font-medium">Fonte:</span> {getContentSourceLabel(carousel.contentSource)}
                      </div>
                      <div>
                        <span className="font-medium">Ordem:</span> {carousel.order}
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {carousel.showMoreButton ? "Com botão 'Ver mais'" : "Sem botão 'Ver mais'"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditForm(carousel)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setViewingCarousel(carousel)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteCarousel(carousel.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
                    <div><span className="font-medium">Tipo:</span> {getTypeLabel(viewingCarousel.type)}</div>
                    <div><span className="font-medium">Fonte:</span> {getContentSourceLabel(viewingCarousel.contentSource)}</div>
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
                    {viewingCarousel.contentSource === "agent" && (
                      <>
                        <div><span className="font-medium">Tipo de Agente:</span> {viewingCarousel.agentType}</div>
                        <div><span className="font-medium">Agente:</span> {viewingCarousel.agentId}</div>
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
                      {/* Mock data para demonstração */}
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