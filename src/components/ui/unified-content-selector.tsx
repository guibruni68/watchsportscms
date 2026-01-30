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
  domain: 'agent' | 'group' | 'collection' | 'agenda' | 'news' | 'content' | 'banner';
  value: string[];
  onChange: (ids: string[], details: Content[]) => void;
  placeholder?: string;
  disabled?: boolean;
  hideSelectedList?: boolean;
}

// Mock data for all domains
const mockData = {
  agent: [
    { id: 'agent-1', title: 'Cristiano Ronaldo', type: 'player', domain: 'agent' },
    { id: 'agent-2', title: 'Lionel Messi', type: 'player', domain: 'agent' },
    { id: 'agent-3', title: 'Neymar Jr', type: 'player', domain: 'agent' },
    { id: 'agent-4', title: 'Kylian Mbappé', type: 'player', domain: 'agent' },
    { id: 'agent-5', title: 'Erling Haaland', type: 'player', domain: 'agent' },
    { id: 'agent-6', title: 'Kevin De Bruyne', type: 'player', domain: 'agent' },
    { id: 'agent-7', title: 'Mohamed Salah', type: 'player', domain: 'agent' },
    { id: 'agent-8', title: 'Robert Lewandowski', type: 'player', domain: 'agent' },
  ],
  group: [
    { id: 'group-1', title: 'Real Madrid', type: 'team', domain: 'group' },
    { id: 'group-2', title: 'Barcelona', type: 'team', domain: 'group' },
    { id: 'group-3', title: 'Manchester City', type: 'team', domain: 'group' },
    { id: 'group-4', title: 'Bayern Munich', type: 'team', domain: 'group' },
    { id: 'group-5', title: 'Liverpool', type: 'team', domain: 'group' },
    { id: 'group-6', title: 'Paris Saint-Germain', type: 'team', domain: 'group' },
    { id: 'group-7', title: 'Chelsea', type: 'team', domain: 'group' },
    { id: 'group-8', title: 'Juventus', type: 'team', domain: 'group' },
  ],
  collection: [
    { id: 'collection-1', title: 'Best Goals of 2024', type: 'catalogue', domain: 'collection' },
    { id: 'collection-2', title: 'Top Saves', type: 'catalogue', domain: 'collection' },
    { id: 'collection-3', title: 'Match Highlights', type: 'catalogue', domain: 'collection' },
    { id: 'collection-4', title: 'Player Interviews', type: 'catalogue', domain: 'collection' },
    { id: 'collection-5', title: 'Behind the Scenes', type: 'catalogue', domain: 'collection' },
    { id: 'collection-6', title: 'Training Sessions', type: 'catalogue', domain: 'collection' },
    { id: 'collection-7', title: 'Classic Matches', type: 'catalogue', domain: 'collection' },
  ],
  agenda: [
    { id: 'agenda-1', title: 'UEFA Champions League', type: 'championship', domain: 'agenda' },
    { id: 'agenda-2', title: 'Premier League', type: 'championship', domain: 'agenda' },
    { id: 'agenda-3', title: 'La Liga', type: 'championship', domain: 'agenda' },
    { id: 'agenda-4', title: 'Serie A', type: 'championship', domain: 'agenda' },
    { id: 'agenda-5', title: 'Bundesliga', type: 'championship', domain: 'agenda' },
    { id: 'agenda-6', title: 'Ligue 1', type: 'championship', domain: 'agenda' },
    { id: 'agenda-7', title: 'Copa Libertadores', type: 'championship', domain: 'agenda' },
    { id: 'agenda-8', title: 'World Cup Qualifiers', type: 'championship', domain: 'agenda' },
  ],
  news: [
    { id: 'news-1', title: 'Transfer Market: Latest Updates', type: 'news', domain: 'news' },
    { id: 'news-2', title: 'Champions League Final Preview', type: 'news', domain: 'news' },
    { id: 'news-3', title: 'Injury Report: Key Players Out', type: 'news', domain: 'news' },
    { id: 'news-4', title: 'Manager Press Conference Highlights', type: 'news', domain: 'news' },
    { id: 'news-5', title: 'Youth Academy Success Stories', type: 'news', domain: 'news' },
    { id: 'news-6', title: 'Stadium Renovation Plans Announced', type: 'news', domain: 'news' },
    { id: 'news-7', title: 'Record-Breaking Performance Analysis', type: 'news', domain: 'news' },
  ],
  content: [
    { id: 'content-1', title: 'Match Day Highlights - Real Madrid vs Barcelona', type: 'video', domain: 'content' },
    { id: 'content-2', title: 'Top 10 Goals of the Week', type: 'video', domain: 'content' },
    { id: 'content-3', title: 'Exclusive: Manager Interview', type: 'video', domain: 'content' },
    { id: 'content-4', title: 'Tactical Analysis: Defensive Strategies', type: 'video', domain: 'content' },
    { id: 'content-5', title: 'Player Profile: Rising Star', type: 'video', domain: 'content' },
    { id: 'content-6', title: 'Full Match Replay', type: 'video', domain: 'content' },
    { id: 'content-7', title: 'Training Ground Access', type: 'video', domain: 'content' },
    { id: 'content-8', title: 'Documentary: Season Review', type: 'video', domain: 'content' },
  ],
  banner: [
    { id: 'banner-1', title: 'Season Tickets Now Available', type: 'banner', domain: 'banner' },
    { id: 'banner-2', title: 'New Kit Launch 2024/25', type: 'banner', domain: 'banner' },
    { id: 'banner-3', title: 'Watch Live: Next Match', type: 'banner', domain: 'banner' },
    { id: 'banner-4', title: 'Special Offer: Premium Membership', type: 'banner', domain: 'banner' },
    { id: 'banner-5', title: 'Fan Zone Activities', type: 'banner', domain: 'banner' },
  ],
};

const getDomainLabel = (domain: string): string => {
  const labels: Record<string, string> = {
    agent: "agents",
    group: "teams",
    collection: "collections",
    agenda: "championships",
    news: "news",
    content: "content",
    banner: "banners"
  };
  return labels[domain] || domain;
};

export function UnifiedContentSelector({ 
  domain, 
  value = [], 
  onChange, 
  placeholder,
  disabled,
  hideSelectedList = false
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
        // Show all items when search is empty
        const domainData = mockData[domain] || [];
        setSearchResults(domainData);
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

      // Use mock data for all domains
      const domainData = mockData[domain] || [];
      results = domainData.filter(item => 
        item.title.toLowerCase().includes(searchLower)
      );

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching content:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailsForIds = async (ids: string[]) => {
    try {
      let details: Content[] = [];

      // Use mock data for all domains
      const domainData = mockData[domain] || [];
      details = ids.map(id => {
        const found = domainData.find(item => item.id === id);
        return found || {
          id,
          title: `Item ${id}`,
          type: domain,
          domain
        };
      });

      setSelectedDetails(details);
    } catch (error) {
      console.error('Error fetching details:', error);
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
          placeholder={placeholder || `Search ${getDomainLabel(domain)}...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setShowDropdown(true);
            // Show all items when focusing on empty input
            if (!searchTerm.trim()) {
              const domainData = mockData[domain] || [];
              setSearchResults(domainData);
            }
          }}
          onBlur={() => {
            // Delay to allow clicks on results
            setTimeout(() => setShowDropdown(false), 200);
          }}
          className="pl-10"
          disabled={disabled}
        />
        
        {/* Dropdown de resultados */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Searching...
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
                        <span className="text-xs text-muted-foreground">✓ Selected</span>
                      )}
                    </div>
                  </Button>
                );
              })
            ) : (
              <div className="p-3 text-center text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de selecionados */}
      {!hideSelectedList && selectedDetails.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Selected {getDomainLabel(domain)} ({selectedDetails.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedDetails.map(item => (
              <Badge key={item.id} variant="neutral" className="flex items-center gap-1 pr-1">
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
