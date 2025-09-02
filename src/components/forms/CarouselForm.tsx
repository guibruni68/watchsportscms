import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título deve ter no máximo 100 caracteres"),
  layout: z.enum(["default", "highlight", "hero_banner", "mid_banner", "game_result"]),
  carouselType: z.enum(["manual", "personalized", "automatic"]),
  sortType: z.enum(["alphabetical", "random", "mostWatched", "newest"]),
  contentLimit: z.number().min(1, "Deve exibir pelo menos 1 conteúdo").max(50, "Máximo 50 conteúdos"),
  planType: z.enum(["all", "free", "premium", "vip"]),
  status: z.boolean(),
  showMoreButton: z.boolean(),
  order: z.number().min(1, "Ordem deve ser maior que 0").max(100, "Ordem deve ser menor que 100"),
  // Campos condicionais baseados no tipo
  domain: z.enum(["collection", "content", "group", "agent", "agenda", "news"]).optional(),
  // Para Manual - seleção manual de conteúdos do domínio
  manualSelection: z.array(z.string()).optional(),
  // Para Personalized - algoritmo personalizado
  personalizedAlgorithm: z.enum(["because_you_watched", "suggestions_for_you"]).optional(),
  // Para Automatic - valor do domínio (seleção agrupada)
  domainValue: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CarouselFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export function CarouselForm({ initialData, onSubmit, onCancel }: CarouselFormProps) {
  const [teams, setTeams] = useState<any[]>([]);
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Buscar teams
      const { data: teamsData } = await supabase
        .from('teams')
        .select('id, name')
        .order('name');
      
      if (teamsData) setTeams(teamsData);

      // Buscar catalogues
      const { data: cataloguesData } = await supabase
        .from('catalogues')
        .select('id, titulo')
        .order('titulo');
      
      if (cataloguesData) setCatalogues(cataloguesData);

      // Buscar players
      const { data: playersData } = await supabase
        .from('players')
        .select('id, name')
        .order('name');
      
      if (playersData) setPlayers(playersData);

      // Mock news data (não temos tabela ainda)
      setNews([
        { id: "news1", title: "Notícia 1" },
        { id: "news2", title: "Notícia 2" },
        { id: "news3", title: "Notícia 3" }
      ]);
    };
    
    fetchData();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      layout: initialData?.layout || "default",
      carouselType: initialData?.carouselType || "manual",
      sortType: initialData?.sortType || "alphabetical",
      contentLimit: initialData?.contentLimit || 10,
      planType: initialData?.planType || "all",
      status: initialData?.status === "active" || !initialData,
      showMoreButton: initialData?.showMoreButton || false,
      order: initialData?.order || 1,
      domain: initialData?.domain,
      manualSelection: initialData?.manualSelection || [],
      personalizedAlgorithm: initialData?.personalizedAlgorithm,
      domainValue: initialData?.domainValue,
    },
  });

  const carouselType = form.watch("carouselType");
  const domain = form.watch("domain");

  // Obter conteúdos disponíveis baseado no domínio selecionado
  const getAvailableContent = () => {
    switch (domain) {
      case "collection":
        return catalogues.map(cat => ({ id: cat.id, name: cat.titulo }));
      case "content":
        return [
          { id: "content1", name: "Vídeo 1" },
          { id: "content2", name: "Vídeo 2" },
          { id: "content3", name: "Vídeo 3" }
        ];
      case "group":
        return [
          { id: "group1", name: "Grupo A" },
          { id: "group2", name: "Grupo B" },
          { id: "group3", name: "Grupo C" }
        ];
      case "agent":
        return [...teams.map(team => ({ id: team.id, name: team.name })), 
                ...players.map(player => ({ id: player.id, name: player.name }))];
      case "agenda":
        return [
          { id: "event1", name: "Jogo 1" },
          { id: "event2", name: "Jogo 2" },
          { id: "event3", name: "Jogo 3" }
        ];
      case "news":
        return news.map(n => ({ id: n.id, name: n.title }));
      default:
        return [];
    }
  };

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <ScrollArea className="h-[80vh] w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Carrossel</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Melhores Momentos - Jogador Estrela" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="layout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layout do Carrossel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o layout" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="highlight">Highlight Content</SelectItem>
                      <SelectItem value="hero_banner">Hero Banner</SelectItem>
                      <SelectItem value="mid_banner">Mid Banner</SelectItem>
                      <SelectItem value="game_result">Game Result</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carouselType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Carrossel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="personalized">Personalizado</SelectItem>
                      <SelectItem value="automatic">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Configurações universais - sempre habilitadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="sortType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ordenação</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a ordenação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="alphabetical">Alfabética</SelectItem>
                      <SelectItem value="random">Aleatória</SelectItem>
                      <SelectItem value="mostWatched">Mais Assistidos</SelectItem>
                      <SelectItem value="newest">Mais Recentes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de Conteúdos</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="50"
                      placeholder="10"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plano de Exibição</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Todos os Planos</SelectItem>
                      <SelectItem value="free">Apenas Gratuito</SelectItem>
                      <SelectItem value="premium">Apenas Premium</SelectItem>
                      <SelectItem value="vip">Apenas VIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status</FormLabel>
                    <FormDescription>
                      Carrossel ativo na plataforma
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="showMoreButton"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Botão "Ver Mais"</FormLabel>
                    <FormDescription>
                      Exibir botão para ver mais conteúdos
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem de Exibição</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="100"
                      placeholder="1"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Configurações condicionais baseadas no tipo de carrossel */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações Específicas</h3>
            
            {/* Seleção de Domínio - aparece para todos os tipos */}
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domínio</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o domínio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="collection">Collection</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="agenda">Agenda</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Configurações para Tipo Manual */}
            {carouselType === "manual" && domain && (
              <FormField
                control={form.control}
                name="manualSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seleção Manual de Conteúdos</FormLabel>
                    <div className="space-y-3">
                      <Select 
                        onValueChange={(value) => {
                          const currentValues = field.value || [];
                          if (!currentValues.includes(value)) {
                            field.onChange([...currentValues, value]);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione os conteúdos..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAvailableContent()
                            .filter(item => !field.value?.includes(item.id))
                            .map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      
                      {field.value && field.value.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Conteúdos selecionados:</p>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((itemId) => {
                              const item = getAvailableContent().find(c => c.id === itemId);
                              return item ? (
                                <Badge key={itemId} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                                  {item.name}
                                  <X 
                                    className="h-3 w-3 cursor-pointer hover:bg-destructive/20 rounded-full p-0.5" 
                                    onClick={() => {
                                      const newValues = field.value?.filter(id => id !== itemId) || [];
                                      field.onChange(newValues);
                                    }}
                                  />
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Configurações para Tipo Personalizado */}
            {carouselType === "personalized" && domain && (
              <FormField
                control={form.control}
                name="personalizedAlgorithm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Algoritmo Personalizado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o algoritmo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="because_you_watched">Because You Watched</SelectItem>
                        <SelectItem value="suggestions_for_you">Suggestions for You</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Configurações para Tipo Automático */}
            {carouselType === "automatic" && domain && (
              <FormField
                control={form.control}
                name="domainValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Domínio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o valor agrupado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getAvailableContent().map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Seleção automática de todos os conteúdos deste {domain}.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Atualizar Carrossel" : "Criar Carrossel"}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}