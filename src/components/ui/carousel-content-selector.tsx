import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Content {
  id: string;
  title: string;
  type: string;
  thumbnail?: string;
  domain: string;
}

interface CarouselContentSelectorProps {
  domain: string;
  selectedContent: string[];
  onContentChange: (content: string[]) => void;
}

export function CarouselContentSelector({ 
  domain, 
  selectedContent = [], 
  onContentChange 
}: CarouselContentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableContent, setAvailableContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch content based on domain
  useEffect(() => {
    if (!isOpen || !domain) return;
    
    const fetchContent = async () => {
      setLoading(true);
      try {
        let data: any[] = [];
        
        switch (domain) {
          case "agent":
            const { data: players } = await supabase.from('players').select('*');
            data = (players || []).map(player => ({
              id: player.id,
              title: player.name,
              type: "player",
              thumbnail: player.avatar_url,
              domain: "agent"
            }));
            break;
            
          case "group":
            const { data: teams } = await supabase.from('teams').select('*');
            data = (teams || []).map(team => ({
              id: team.id,
              title: team.name,
              type: "team",
              thumbnail: team.logo_url,
              domain: "group"
            }));
            break;
            
          case "collection":
            const { data: catalogues } = await supabase.from('catalogues').select('*');
            data = (catalogues || []).map(catalogue => ({
              id: catalogue.id,
              title: catalogue.titulo,
              type: "catalogue",
              domain: "collection"
            }));
            break;
            
          case "news":
            // Mock news data for now
            data = [
              { id: "news1", title: "Vitória épica do time principal", type: "news", domain: "news" },
              { id: "news2", title: "Transferência do século confirmada", type: "news", domain: "news" },
              { id: "news3", title: "Novo técnico assume o comando", type: "news", domain: "news" }
            ];
            break;
            
          case "content":
            // Mock content data for now  
            data = [
              { id: "content1", title: "Melhores momentos da partida", type: "video", domain: "content" },
              { id: "content2", title: "Entrevista pós-jogo", type: "video", domain: "content" },
              { id: "content3", title: "Bastidores do treino", type: "video", domain: "content" }
            ];
            break;
            
          case "agenda":
            // Mock agenda data for now
            data = [
              { id: "agenda1", title: "Próximo jogo - Final do campeonato", type: "match", domain: "agenda" },
              { id: "agenda2", title: "Treino aberto ao público", type: "training", domain: "agenda" },
              { id: "agenda3", title: "Coletiva de imprensa", type: "press", domain: "agenda" }
            ];
            break;
        }
        
        setAvailableContent(data);
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
        setAvailableContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [domain, isOpen]);

  const filteredContent = availableContent.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContentToggle = (contentId: string) => {
    if (selectedContent.includes(contentId)) {
      onContentChange(selectedContent.filter(id => id !== contentId));
    } else {
      onContentChange([...selectedContent, contentId]);
    }
  };

  const handleRemoveContent = (contentId: string) => {
    onContentChange(selectedContent.filter(id => id !== contentId));
  };

  const getSelectedContentDetails = () => {
    return selectedContent.map(id => 
      availableContent.find(content => content.id === id)
    ).filter(Boolean) as Content[];
  };

  const getDomainLabel = (domain: string) => {
    const labels = {
      collection: "Coleções",
      content: "Conteúdos",
      group: "Times",
      agent: "Jogadores", 
      agenda: "Agenda",
      news: "Notícias"
    };
    return labels[domain as keyof typeof labels] || domain;
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            disabled={!domain}
          >
            <Plus className="h-4 w-4 mr-2" />
            {selectedContent.length > 0 
              ? `Selecionados: ${selectedContent.length} ${getDomainLabel(domain).toLowerCase()}`
              : `Selecionar ${getDomainLabel(domain)}`
            }
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Selecionar {getDomainLabel(domain)}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={`Buscar ${getDomainLabel(domain).toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Content List */}
            <ScrollArea className="h-96">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredContent.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={content.id}
                        checked={selectedContent.includes(content.id)}
                        onCheckedChange={() => handleContentToggle(content.id)}
                      />
                      
                      {content.thumbnail && (
                        <img 
                          src={content.thumbnail} 
                          alt={content.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      
                      <div className="flex-1">
                        <p className="font-medium">{content.title}</p>
                        <p className="text-sm text-muted-foreground capitalize">{content.type}</p>
                      </div>
                    </div>
                  ))}
                  
                  {filteredContent.length === 0 && !loading && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum conteúdo encontrado
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Summary */}
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {selectedContent.length} item(s) selecionado(s)
              </p>
              <Button onClick={() => setIsOpen(false)}>
                Confirmar Seleção
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected Content Display */}
      {selectedContent.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Conteúdos Selecionados:</h4>
          <div className="flex flex-wrap gap-2">
            {getSelectedContentDetails().map((content) => (
              <Badge
                key={content.id}
                variant="secondary"
                className="flex items-center gap-2 pr-1 py-1"
              >
                <span className="truncate max-w-32">{content.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveContent(content.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}