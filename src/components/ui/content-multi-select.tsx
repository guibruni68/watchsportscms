import { useState, useMemo, useRef, useEffect } from "react";
import { Video, Radio, Newspaper, Search, Plus, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export interface ContentItem {
  id: string;
  titulo: string;
  tipo: "video" | "live" | "news";
  thumbnail?: string;
}

interface ContentMultiSelectProps {
  value: ContentItem[];
  onChange: (contents: ContentItem[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ContentMultiSelect({
  value = [],
  onChange,
  placeholder = "Buscar e selecionar conteúdos...",
  disabled = false,
}: ContentMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allContents, setAllContents] = useState<ContentItem[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);

  // Atualizar largura do popover quando abrir
  useEffect(() => {
    if (open && triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  // Buscar conteúdos quando o popover abrir ou quando a busca mudar
  useEffect(() => {
    if (open) {
      searchContents(search);
    }
  }, [open, search]);

  const searchContents = async (searchTerm: string) => {
    setLoading(true);
    try {
      const contents: ContentItem[] = [];

      // Buscar vídeos (VOD) - tentar tabela 'videos'
      try {
        let query = supabase
          .from('videos')
          .select('id, titulo, imagem_capa')
          .limit(searchTerm ? 10 : 20);

        if (searchTerm) {
          query = query.ilike('titulo', `%${searchTerm}%`);
        }

        const { data: videos, error: videoError } = await query;

        if (!videoError && videos) {
          contents.push(...videos.map(v => ({
            id: v.id,
            titulo: v.titulo || `Vídeo ${v.id}`,
            tipo: "video" as const,
            thumbnail: v.imagem_capa
          })));
        }
      } catch (e) {
        console.log('Tabela de videos não disponível ou erro:', e);
      }

      // Buscar lives - tentar tabela 'lives'
      if (searchTerm) {
        try {
          const { data: lives, error: livesError } = await supabase
            .from('lives')
            .select('id, nome_evento, imagem_capa')
            .ilike('nome_evento', `%${searchTerm}%`)
            .limit(10);

          if (!livesError && lives) {
            contents.push(...lives.map(l => ({
              id: l.id,
              titulo: l.nome_evento || `Live ${l.id}`,
              tipo: "live" as const,
              thumbnail: l.imagem_capa
            })));
          }
        } catch (e) {
          console.log('Tabela de lives não disponível:', e);
        }
      }

      // Buscar notícias - tentar tabela 'news'
      if (searchTerm) {
        try {
          const { data: news, error: newsError } = await supabase
            .from('news')
            .select('id, titulo, imagem_capa')
            .ilike('titulo', `%${searchTerm}%`)
            .limit(10);

          if (!newsError && news) {
            contents.push(...news.map(n => ({
              id: n.id,
              titulo: n.titulo || `Notícia ${n.id}`,
              tipo: "news" as const,
              thumbnail: n.imagem_capa
            })));
          }
        } catch (e) {
          console.log('Tabela de news não disponível:', e);
        }
      }

      setAllContents(contents);
    } catch (error) {
      console.error('Erro ao buscar conteúdos:', error);
      setAllContents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar conteúdos já adicionados
  const availableContents = useMemo(() => {
    return allContents.filter(
      (content) => !value.find((added) => added.id === content.id && added.tipo === content.tipo)
    );
  }, [allContents, value]);

  // Filtrar conteúdos baseado na busca
  const filteredContents = useMemo(() => {
    if (!search.trim()) return availableContents;

    const searchLower = search.toLowerCase();
    return availableContents.filter((content) =>
      content.titulo.toLowerCase().includes(searchLower)
    );
  }, [availableContents, search]);

  // Agrupar por tipo
  const groupedContents = useMemo(() => {
    const videos = filteredContents.filter((c) => c.tipo === "video");
    const lives = filteredContents.filter((c) => c.tipo === "live");
    const news = filteredContents.filter((c) => c.tipo === "news");
    return { videos, lives, news };
  }, [filteredContents]);

  const handleSelect = (contentId: string, contentType: "video" | "live" | "news") => {
    setSelectedId(`${contentType}-${contentId}`);
  };

  const handleAdd = () => {
    if (!selectedId) return;

    const [contentType, contentId] = selectedId.split('-', 2) as [string, string];
    const content = availableContents.find(
      (c) => c.id === contentId && c.tipo === contentType as "video" | "live" | "news"
    );
    
    if (content) {
      onChange([...value, content]);
      setSelectedId(null);
      setSearch("");
    }
  };

  const handleRemove = (contentId: string, contentType: "video" | "live" | "news") => {
    onChange(value.filter((content) => !(content.id === contentId && content.tipo === contentType)));
  };

  const selectedContent = selectedId
    ? availableContents.find((c) => `${c.tipo}-${c.id}` === selectedId)
    : null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
      case "vod":
        return <Video className="h-4 w-4 text-muted-foreground shrink-0" />;
      case "live":
        return <Radio className="h-4 w-4 text-muted-foreground shrink-0" />;
      case "news":
        return <Newspaper className="h-4 w-4 text-muted-foreground shrink-0" />;
      default:
        return <Video className="h-4 w-4 text-muted-foreground shrink-0" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
      case "vod":
        return "Vídeo";
      case "live":
        return "Live";
      case "news":
        return "Notícia";
      default:
        return "Conteúdo";
    }
  };

  return (
    <div className="space-y-4">
      {/* Campo de busca e seleção */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between h-auto min-h-[52px]"
          >
            <div className="flex items-center gap-2 flex-1 text-left">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">
                {placeholder}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 flex flex-col" 
          align="start" 
          sideOffset={4}
          style={{
            width: popoverWidth ? `${popoverWidth}px` : undefined,
            maxHeight: '70vh'
          }}
        >
          <Command className="flex flex-col">
            <CommandInput
              placeholder="Buscar vídeos, lives ou notícias..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-[250px] overflow-y-auto flex-1">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Buscando...
                  </div>
                </div>
              ) : (
                <>
                  <CommandEmpty>Nenhum conteúdo encontrado.</CommandEmpty>

                  {/* Grupo de Vídeos */}
                  {groupedContents.videos.length > 0 && (
                    <CommandGroup heading="Vídeos (VOD)">
                      {groupedContents.videos.map((content) => {
                        const isSelected = selectedId === `video-${content.id}`;
                        return (
                          <CommandItem
                            key={`video-${content.id}`}
                            value={`video-${content.id}`}
                            onSelect={() => handleSelect(content.id, "video")}
                            className={cn(
                              "cursor-pointer",
                              isSelected && "bg-primary/10"
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                    isSelected
                                      ? "border-primary bg-primary"
                                      : "border-muted-foreground/50"
                                  )}
                                >
                                  {isSelected && (
                                    <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                                  )}
                                </div>
                                {getTypeIcon("video")}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {content.titulo}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}

                  {/* Grupo de Lives */}
                  {groupedContents.lives.length > 0 && (
                    <CommandGroup heading="Lives">
                      {groupedContents.lives.map((content) => {
                        const isSelected = selectedId === `live-${content.id}`;
                        return (
                          <CommandItem
                            key={`live-${content.id}`}
                            value={`live-${content.id}`}
                            onSelect={() => handleSelect(content.id, "live")}
                            className={cn(
                              "cursor-pointer",
                              isSelected && "bg-primary/10"
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                    isSelected
                                      ? "border-primary bg-primary"
                                      : "border-muted-foreground/50"
                                  )}
                                >
                                  {isSelected && (
                                    <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                                  )}
                                </div>
                                {getTypeIcon("live")}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {content.titulo}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}

                  {/* Grupo de Notícias */}
                  {groupedContents.news.length > 0 && (
                    <CommandGroup heading="Notícias">
                      {groupedContents.news.map((content) => {
                        const isSelected = selectedId === `news-${content.id}`;
                        return (
                          <CommandItem
                            key={`news-${content.id}`}
                            value={`news-${content.id}`}
                            onSelect={() => handleSelect(content.id, "news")}
                            className={cn(
                              "cursor-pointer",
                              isSelected && "bg-primary/10"
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                    isSelected
                                      ? "border-primary bg-primary"
                                      : "border-muted-foreground/50"
                                  )}
                                >
                                  {isSelected && (
                                    <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                                  )}
                                </div>
                                {getTypeIcon("news")}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {content.titulo}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>

          {/* Botão de adicionar - sempre visível quando há seleção */}
          {selectedContent && (
            <div className="border-t p-3 bg-muted/30 shrink-0">
              <Button
                type="button"
                onClick={handleAdd}
                className="w-full"
                disabled={!selectedId}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar {getTypeLabel(selectedContent.tipo)}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Lista de conteúdos adicionados */}
      {value.length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">
              Conteúdos Selecionados ({value.length})
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              className="text-destructive hover:text-destructive h-auto py-1 px-2 text-xs"
            >
              Limpar todos
            </Button>
          </div>
          <div className="space-y-2">
            {value.map((content, index) => (
              <div
                key={`${content.tipo}-${content.id}-${index}`}
                className="flex items-center justify-between p-3 bg-background border rounded-md hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getTypeIcon(content.tipo)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {content.titulo}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs mt-1"
                    >
                      {getTypeLabel(content.tipo)}
                    </Badge>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(content.id, content.tipo)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

