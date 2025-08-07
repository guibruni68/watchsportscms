import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Film, FileText, Users, Store } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data para demonstração
const mockContent = {
  vod: [
    { id: "v1", title: "Melhores Gols da Temporada 2024", type: "vod", thumbnail: "/placeholder.svg" },
    { id: "v2", title: "Entrevista com o Técnico", type: "vod", thumbnail: "/placeholder.svg" },
    { id: "v3", title: "Bastidores do Último Jogo", type: "vod", thumbnail: "/placeholder.svg" },
    { id: "v4", title: "Treino Tático da Semana", type: "vod", thumbnail: "/placeholder.svg" },
    { id: "v5", title: "Análise do Jogo: Time A vs Time B", type: "vod", thumbnail: "/placeholder.svg" },
    { id: "v6", title: "História do Clube", type: "vod", thumbnail: "/placeholder.svg" },
  ],
  news: [
    { id: "n1", title: "Nova contratação chega ao clube", type: "news", thumbnail: "/placeholder.svg" },
    { id: "n2", title: "Resultados da última rodada", type: "news", thumbnail: "/placeholder.svg" },
    { id: "n3", title: "Preparação para o próximo jogo", type: "news", thumbnail: "/placeholder.svg" },
    { id: "n4", title: "Entrevista coletiva do técnico", type: "news", thumbnail: "/placeholder.svg" },
  ],
  players: [
    { id: "p1", title: "João Silva - Atacante", type: "players", thumbnail: "/placeholder.svg" },
    { id: "p2", title: "Maria Santos - Meio-campo", type: "players", thumbnail: "/placeholder.svg" },
    { id: "p3", title: "Pedro Costa - Defensor", type: "players", thumbnail: "/placeholder.svg" },
  ],
  store: [
    { id: "s1", title: "Camisa Oficial 2024", type: "store", thumbnail: "/placeholder.svg" },
    { id: "s2", title: "Boné do Time", type: "store", thumbnail: "/placeholder.svg" },
    { id: "s3", title: "Cachecol Personalizado", type: "store", thumbnail: "/placeholder.svg" },
  ]
};

interface Content {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
}

interface ContentSelectorProps {
  carouselType: string;
  selectedContent: string[];
  onContentChange: (selectedIds: string[]) => void;
}

export function ContentSelector({ carouselType, selectedContent, onContentChange }: ContentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const availableContent = mockContent[carouselType as keyof typeof mockContent] || [];
  
  const filteredContent = availableContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || content.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleContentToggle = (contentId: string) => {
    const updatedSelection = selectedContent.includes(contentId)
      ? selectedContent.filter(id => id !== contentId)
      : [...selectedContent, contentId];
    
    onContentChange(updatedSelection);
  };

  const handleRemoveContent = (contentId: string) => {
    onContentChange(selectedContent.filter(id => id !== contentId));
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'vod': return <Film className="h-4 w-4" />;
      case 'news': return <FileText className="h-4 w-4" />;
      case 'players': return <Users className="h-4 w-4" />;
      case 'store': return <Store className="h-4 w-4" />;
      default: return <Film className="h-4 w-4" />;
    }
  };

  const getSelectedContent = () => {
    return selectedContent.map(id => {
      const content = availableContent.find(c => c.id === id);
      return content;
    }).filter(Boolean) as Content[];
  };

  return (
    <div className="space-y-3">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full">
            + Adicionar Conteúdos
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Selecionar Conteúdos</DialogTitle>
            <DialogDescription>
              Escolha os conteúdos que serão exibidos no carrossel
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Filtros e busca */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conteúdos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              {carouselType === 'vod' && (
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="goals">Gols</SelectItem>
                    <SelectItem value="highlights">Melhores Momentos</SelectItem>
                    <SelectItem value="interviews">Entrevistas</SelectItem>
                    <SelectItem value="training">Treinos</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Lista de conteúdos */}
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {filteredContent.map((content) => (
                  <div
                    key={content.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={content.id}
                      checked={selectedContent.includes(content.id)}
                      onCheckedChange={() => handleContentToggle(content.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getContentIcon(content.type)}
                        <span className="text-sm font-medium truncate">
                          {content.title}
                        </span>
                      </div>
                      <div className="w-full h-20 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">
                        Thumbnail
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredContent.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum conteúdo encontrado
                </div>
              )}
            </ScrollArea>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                {selectedContent.length} conteúdos selecionados
              </span>
              <Button onClick={() => setIsOpen(false)}>
                Confirmar Seleção
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conteúdos selecionados */}
      {selectedContent.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Conteúdos selecionados:</p>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {getSelectedContent().map((content) => (
              <div
                key={content.id}
                className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {getContentIcon(content.type)}
                  <span className="text-sm truncate max-w-[300px]">
                    {content.title}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveContent(content.id)}
                  className="h-6 w-6 p-0 hover:bg-destructive/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}