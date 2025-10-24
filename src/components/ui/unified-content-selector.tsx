import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export interface Content {
  id: string;
  title: string;
  type: string;
  thumbnail?: string;
  domain: string;
}

interface UnifiedContentSelectorProps {
  domain: 'agent' | 'group' | 'collection' | 'agenda' | 'news' | 'content';
  value: string[];
  onChange: (ids: string[], details: Content[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const getDomainLabel = (domain: string): string => {
  const labels: Record<string, string> = {
    agent: "jogadores",
    group: "times",
    collection: "catálogos",
    agenda: "campeonatos",
    news: "notícias",
    content: "conteúdos"
  };
  return labels[domain] || domain;
};

export function UnifiedContentSelector({ 
  domain, 
  value = [], 
  onChange, 
  placeholder,
  disabled 
}: UnifiedContentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Busca com debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim()) {
        searchContent(searchTerm);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, domain]);

  // Carrega detalhes dos IDs existentes
  useEffect(() => {
    if (value.length > 0) {
      fetchDetailsForIds(value);
    } else {
      setSelectedDetails([]);
    }
  }, [value.join(','), domain]);

  const searchContent = async (term: string) => {
    setLoading(true);
    setShowDropdown(true);
    
    try {
      let results: Content[] = [];
      const searchLower = term.toLowerCase();

      switch (domain) {
        case 'agent': {
          // Busca players
          const { data: players } = await supabase
            .from('players')
            .select('id, name, avatar_url')
            .ilike('name', `%${term}%`)
            .limit(10);
          
          results = (players || []).map(p => ({
            id: p.id,
            title: p.name,
            type: 'player',
            thumbnail: p.avatar_url,
            domain: 'agent'
          }));
          break;
        }
        
        case 'group': {
          // Busca teams
          const { data: teams } = await supabase
            .from('teams')
            .select('id, name, logo_url')
            .ilike('name', `%${term}%`)
            .limit(10);
          
          results = (teams || []).map(t => ({
            id: t.id,
            title: t.name,
            type: 'team',
            thumbnail: t.logo_url,
            domain: 'group'
          }));
          break;
        }
        
        case 'collection': {
          // Dados mockados temporários (tabela não existe)
          results = [
            { id: 'cat-1', title: 'Melhores Momentos', type: 'catalogue', domain: 'collection' },
            { id: 'cat-2', title: 'Gols da Semana', type: 'catalogue', domain: 'collection' },
            { id: 'cat-3', title: 'Entrevistas', type: 'catalogue', domain: 'collection' },
          ].filter(item => item.title.toLowerCase().includes(searchLower));
          break;
        }
        
        case 'agenda': {
          // Busca championships
          const { data: championships } = await supabase
            .from('championships')
            .select('id, name, logo_url')
            .ilike('name', `%${term}%`)
            .limit(10);
          
          results = (championships || []).map(c => ({
            id: c.id,
            title: c.name,
            type: 'championship',
            thumbnail: c.logo_url,
            domain: 'agenda'
          }));
          break;
        }
        
        case 'news': {
          // Dados mockados temporários
          results = [
            { id: 'news-1', title: 'Flamengo vence clássico', type: 'news', domain: 'news' },
            { id: 'news-2', title: 'Palmeiras contrata reforço', type: 'news', domain: 'news' },
            { id: 'news-3', title: 'Corinthians na final', type: 'news', domain: 'news' },
          ].filter(item => item.title.toLowerCase().includes(searchLower));
          break;
        }
        
        case 'content': {
          // Dados mockados temporários
          results = [
            { id: 'content-1', title: 'Vídeo Melhores Momentos', type: 'video', domain: 'content' },
            { id: 'content-2', title: 'Gols da Semana', type: 'video', domain: 'content' },
            { id: 'content-3', title: 'Entrevista do Técnico', type: 'video', domain: 'content' },
          ].filter(item => item.title.toLowerCase().includes(searchLower));
          break;
        }
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Erro ao buscar conteúdos:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailsForIds = async (ids: string[]) => {
    try {
      let details: Content[] = [];

      switch (domain) {
        case 'agent': {
          const { data: players } = await supabase
            .from('players')
            .select('id, name, avatar_url')
            .in('id', ids);
          
          details = (players || []).map(p => ({
            id: p.id,
            title: p.name,
            type: 'player',
            thumbnail: p.avatar_url,
            domain: 'agent'
          }));
          break;
        }
        
        case 'group': {
          const { data: teams } = await supabase
            .from('teams')
            .select('id, name, logo_url')
            .in('id', ids);
          
          details = (teams || []).map(t => ({
            id: t.id,
            title: t.name,
            type: 'team',
            thumbnail: t.logo_url,
            domain: 'group'
          }));
          break;
        }
        
        case 'collection': {
          // Dados mockados temporários (tabela não existe)
          const mockCatalogues = [
            { id: 'cat-1', title: 'Melhores Momentos' },
            { id: 'cat-2', title: 'Gols da Semana' },
            { id: 'cat-3', title: 'Entrevistas' },
          ];
          details = ids.map(id => {
            const found = mockCatalogues.find(c => c.id === id);
            return {
              id,
              title: found?.title || `Catálogo ${id}`,
              type: 'catalogue',
              domain: 'collection'
            };
          });
          break;
        }
        
        case 'agenda': {
          const { data: championships } = await supabase
            .from('championships')
            .select('id, name, logo_url')
            .in('id', ids);
          
          details = (championships || []).map(c => ({
            id: c.id,
            title: c.name,
            type: 'championship',
            thumbnail: c.logo_url,
            domain: 'agenda'
          }));
          break;
        }
        
        case 'news':
        case 'content': {
          // Para dados mockados, não temos detalhes reais
          details = ids.map(id => ({
            id,
            title: `Item ${id}`,
            type: domain,
            domain
          }));
          break;
        }
      }

      setSelectedDetails(details);
    } catch (error) {
      console.error('Erro ao buscar detalhes dos IDs:', error);
    }
  };

  const handleSelect = (content: Content) => {
    if (!value.includes(content.id)) {
      const newIds = [...value, content.id];
      const newDetails = [...selectedDetails, content];
      setSelectedDetails(newDetails);
      onChange(newIds, newDetails);
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemove = (contentId: string) => {
    const newIds = value.filter(id => id !== contentId);
    const newDetails = selectedDetails.filter(item => item.id !== contentId);
    setSelectedDetails(newDetails);
    onChange(newIds, newDetails);
  };

  return (
    <div className="space-y-4">
      {/* Input de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder || `Buscar ${getDomainLabel(domain)}...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value.trim()) {
              setShowDropdown(true);
            }
          }}
          onFocus={() => {
            if (searchTerm.trim()) {
              setShowDropdown(true);
            }
          }}
          onBlur={() => {
            // Delay para permitir cliques nos resultados
            setTimeout(() => setShowDropdown(false), 200);
          }}
          className="pl-10"
          disabled={disabled}
        />
        
        {/* Dropdown de resultados */}
        {showDropdown && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Buscando...
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map(result => {
                const isSelected = value.includes(result.id);
                return (
                  <Button
                    key={result.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left h-auto py-2 px-3",
                      isSelected && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => !isSelected && handleSelect(result)}
                    disabled={isSelected}
                    type="button"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {result.thumbnail && (
                        <img 
                          src={result.thumbnail} 
                          alt={result.title}
                          className="h-8 w-8 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{result.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {result.type}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-xs text-muted-foreground">✓ Selecionado</span>
                      )}
                    </div>
                  </Button>
                );
              })
            ) : (
              <div className="p-3 text-center text-muted-foreground">
                Nenhum resultado encontrado
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de selecionados */}
      {selectedDetails.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {getDomainLabel(domain)} selecionados ({selectedDetails.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedDetails.map(item => (
              <Badge key={item.id} variant="secondary" className="flex items-center gap-1 pr-1">
                {item.thumbnail && (
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="h-4 w-4 rounded object-cover"
                  />
                )}
                <span className="max-w-[200px] truncate">{item.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemove(item.id)}
                  disabled={disabled}
                  type="button"
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
