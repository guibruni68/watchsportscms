import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CarouselContentSelector } from "@/components/ui/carousel-content-selector";
import { CarouselManualSelector } from "@/components/ui/carousel-manual-selector";
import { AICarouselModal } from "@/components/ui/ai-carousel-modal";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título deve ter no máximo 100 caracteres"),
  layout: z.enum(["default", "highlight", "hero_banner", "mid_banner", "game_result"]),
  carouselType: z.enum(["manual", "personalized", "automatic"]).optional(),
  sortType: z.enum(["alphabetical", "random", "mostWatched", "newest"]).optional(),
  contentLimit: z.number().min(1, "Deve exibir pelo menos 1 conteúdo").max(50, "Máximo 50 conteúdos").optional(),
  planType: z.enum(["all", "free", "premium", "vip"]).optional(),
  status: z.boolean(),
  showMoreButton: z.boolean().optional(),
  order: z.number().min(1, "Ordem deve ser maior que 0").max(100, "Ordem deve ser menor que 100"),
  // Campos condicionais baseados no tipo
  domain: z.enum(["collection", "content", "group", "agent", "agenda", "news"]).optional(),
  // Para Manual - seleção manual de conteúdos do domínio
  manualSelection: z.array(z.string()).optional(),
  // Para Personalized - algoritmo personalizado
  personalizedAlgorithm: z.enum(["because_you_watched", "suggestions_for_you"]).optional(),
  // Para Automatic - valor do domínio (seleção agrupada)
  domainValue: z.string().optional(),
  // Para layouts específicos
  selectedGame: z.string().optional(), // Para game_result
  selectedHeroContent: z.string().optional(), // Para hero_banner
});

type FormData = z.infer<typeof formSchema>;

interface CarouselFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export function CarouselForm({ initialData, onSubmit, onCancel }: CarouselFormProps) {
  const navigate = useNavigate();
  
  // Dados mockados para testes da AI
  const mockTeams = [
    { id: "team-1", name: "Flamengo", logo_url: "/lovable-uploads/team-logo.png" },
    { id: "team-2", name: "Palmeiras", logo_url: "/lovable-uploads/team-logo.png" },
    { id: "team-3", name: "Corinthians", logo_url: "/lovable-uploads/team-logo.png" },
  ];

  const mockPlayers = [
    { id: "player-1", name: "Gabriel Barbosa", team_id: "team-1", avatar_url: "" },
    { id: "player-2", name: "Dudu", team_id: "team-2", avatar_url: "" },
    { id: "player-3", name: "Yuri Alberto", team_id: "team-3", avatar_url: "" },
  ];

  const mockChampionships = [
    { id: "champ-1", name: "Brasileirão Série A" },
    { id: "champ-2", name: "Copa do Brasil" },
    { id: "champ-3", name: "Libertadores" },
  ];

  const mockCatalogues = [
    { id: "cat-1", titulo: "Melhores Momentos" },
    { id: "cat-2", titulo: "Gols da Semana" },
    { id: "cat-3", titulo: "Entrevistas" },
  ];

  const mockBanners = [
    { id: "banner-1", title: "Promoção Especial" },
    { id: "banner-2", title: "Novo Patrocinador" },
  ];

  const mockNews = [
    { id: "news-1", title: "Flamengo vence clássico" },
    { id: "news-2", title: "Palmeiras contrata reforço" },
    { id: "news-3", title: "Corinthians na final" },
  ];

  const [teams, setTeams] = useState<any[]>(mockTeams);
  const [catalogues, setCatalogues] = useState<any[]>(mockCatalogues);
  const [players, setPlayers] = useState<any[]>(mockPlayers);
  const [news, setNews] = useState<any[]>(mockNews);
  const [championships, setChampionships] = useState<any[]>(mockChampionships);
  const [banners, setBanners] = useState<any[]>(mockBanners);
  const [showAIModal, setShowAIModal] = useState(false);

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
      selectedGame: initialData?.selectedGame,
      selectedHeroContent: initialData?.selectedHeroContent,
    },
  });

  const carouselType = form.watch("carouselType");
  const domain = form.watch("domain");
  const layout = form.watch("layout");

  // Verificar se é um layout simplificado
  const isSimplifiedLayout = layout === "game_result" || layout === "hero_banner";

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

  const handleAIConfigGenerated = (config: any) => {
    console.log("Applying AI generated config:", config);
    
    // Aplicar todas as configurações geradas pela AI
    if (config.title) form.setValue("title", config.title);
    if (config.layout) form.setValue("layout", config.layout);
    if (config.carouselType) form.setValue("carouselType", config.carouselType);
    if (config.sortType) form.setValue("sortType", config.sortType);
    if (config.contentLimit) form.setValue("contentLimit", config.contentLimit);
    if (config.planType) form.setValue("planType", config.planType);
    if (config.status !== undefined) form.setValue("status", config.status);
    if (config.showMoreButton !== undefined) form.setValue("showMoreButton", config.showMoreButton);
    if (config.domain) form.setValue("domain", config.domain);
    if (config.domainValue) form.setValue("domainValue", config.domainValue);
    if (config.manualSelection) form.setValue("manualSelection", config.manualSelection);
    if (config.personalizedAlgorithm) form.setValue("personalizedAlgorithm", config.personalizedAlgorithm);
    if (config.selectedGame) form.setValue("selectedGame", config.selectedGame);
    if (config.selectedHeroContent) form.setValue("selectedHeroContent", config.selectedHeroContent);
    
    // Mostrar toast de sucesso com explicação
    toast({
      title: "Configuração aplicada!",
      description: config.explanation || "Todos os campos foram preenchidos automaticamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {initialData ? 'Editar Carrossel' : 'Novo Carrossel'}
            </h1>
            <p className="text-muted-foreground">
              {initialData ? 'Edite as informações do carrossel' : 'Crie um novo carrossel de conteúdo'}
            </p>
          </div>
        </div>
        <Button 
          variant="gradient-outline" 
          onClick={() => setShowAIModal(true)}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4 text-purple-600" />
          Ask AI
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Carrossel</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <FormDescription>
                        Ordem de exibição (menor número = maior prioridade)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {!isSimplifiedLayout && (
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
                )}
              </div>

          {/* Configurações específicas para layouts simplificados */}
          {layout === "game_result" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Configurações do Game Result</h3>
              <FormField
                control={form.control}
                name="selectedGame"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecionar Jogo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um jogo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {championships.map((championship) => (
                          <SelectItem key={championship.id} value={championship.id}>
                            {championship.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {layout === "hero_banner" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Configurações do Hero Banner</h3>
              <FormField
                control={form.control}
                name="selectedHeroContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecionar Conteúdo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um conteúdo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {banners.map((banner) => (
                          <SelectItem key={banner.id} value={banner.id}>
                            {banner.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Configurações condicionais baseadas no tipo de carrossel - apenas para layouts não simplificados */}
          {!isSimplifiedLayout && (
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
                      <CarouselManualSelector
                        domain={domain}
                        selectedContent={field.value || []}
                        onContentChange={field.onChange}
                      />
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
          )}

          {/* Configurações universais - ocultas para layouts simplificados */}
          {!isSimplifiedLayout && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

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
            </>
          )}

          {/* Status sempre visível */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Botão "Ver Mais" apenas para layouts não simplificados */}
            {!isSimplifiedLayout && (
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
            )}
          </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel || (() => navigate(-1))}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {initialData ? "Atualizar" : "Criar"} Carrossel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AICarouselModal
        open={showAIModal}
        onOpenChange={setShowAIModal}
        onConfigGenerated={handleAIConfigGenerated}
        availableTeams={teams}
        availableCatalogues={catalogues}
        availablePlayers={players}
        availableChampionships={championships}
        availableBanners={banners}
      />
    </div>
  );
}