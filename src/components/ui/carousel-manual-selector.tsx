import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Content {
  id: string;
  title: string;
  type: string;
  thumbnail?: string;
}

interface CarouselManualSelectorProps {
  domain: string;
  selectedContent: string[];
  onContentChange: (content: string[]) => void;
}

export function CarouselManualSelector({ 
  domain, 
  selectedContent, 
  onContentChange 
}: CarouselManualSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchContent = async (term: string) => {
    if (!term.trim() || !domain) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      let results: Content[] = [];

      switch (domain) {
        case 'agent':
          const { data: players } = await supabase
            .from('players')
            .select('id, name, position, avatar_url')
            .ilike('name', `%${term}%`)
            .limit(10);
          
          results = players?.map(p => ({
            id: p.id,
            title: p.name,
            type: 'player',
            thumbnail: p.avatar_url
          })) || [];
          break;

        case 'group':
          const { data: teams } = await supabase
            .from('teams')
            .select('id, name, category, logo_url')
            .ilike('name', `%${term}%`)
            .limit(10);
          
          results = teams?.map(t => ({
            id: t.id,
            title: t.name,
            type: 'team',
            thumbnail: t.logo_url
          })) || [];
          break;

        case 'collection':
          const { data: catalogues } = await supabase
            .from('catalogues')
            .select('id, titulo, tipo_catalogo')
            .ilike('titulo', `%${term}%`)
            .eq('status', true)
            .limit(10);
          
          results = catalogues?.map(c => ({
            id: c.id,
            title: c.titulo,
            type: 'catalogue'
          })) || [];
          break;

        case 'agenda':
          const { data: championships } = await supabase
            .from('championships')
            .select('id, name, type')
            .ilike('name', `%${term}%`)
            .limit(10);
          
          results = championships?.map(ch => ({
            id: ch.id,
            title: ch.name,
            type: 'championship'
          })) || [];
          break;

        case 'news':
        case 'content':
          // Mock data for now since these tables don't exist yet
          results = [
            { id: '1', title: `${term} Notícia 1`, type: 'news' },
            { id: '2', title: `${term} Conteúdo 1`, type: 'content' },
          ].filter(item => item.title.toLowerCase().includes(term.toLowerCase()));
          break;
      }

      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar o conteúdo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchContent(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, domain]);

  const handleContentSelect = (contentId: string) => {
    if (!selectedContent.includes(contentId)) {
      onContentChange([...selectedContent, contentId]);
    }
    setSearchTerm("");
    setShowResults(false);
  };

  const handleRemoveContent = (contentId: string) => {
    onContentChange(selectedContent.filter(id => id !== contentId));
  };

  const getSelectedContentDetails = () => {
    // In a real implementation, you'd fetch the full details of selected content
    return selectedContent.map((id, index) => ({
      id,
      title: `Conteúdo ${index + 1}`, // Placeholder - should fetch real data
    }));
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <h3 className="text-lg font-medium">Conteúdos do Catálogo</h3>
      
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Adicionar Conteúdos
        </label>
        <div className="space-y-4 mt-2">
          <div className="relative">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar conteúdos para adicionar..." 
                className="flex-1" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="p-3 text-center text-sm text-muted-foreground">
                    Buscando...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((content) => (
                    <Button
                      key={content.id}
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto text-left"
                      onClick={() => handleContentSelect(content.id)}
                      disabled={selectedContent.includes(content.id)}
                    >
                      <div>
                        <div className="font-medium">{content.title}</div>
                        <div className="text-xs text-muted-foreground capitalize">{content.type}</div>
                      </div>
                    </Button>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-muted-foreground">
                    Nenhum resultado encontrado
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Selected Content Display */}
          {selectedContent.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Conteúdos selecionados ({selectedContent.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {getSelectedContentDetails().map((content) => (
                  <Badge key={content.id} variant="secondary" className="flex items-center gap-1">
                    {content.title}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveContent(content.id)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}