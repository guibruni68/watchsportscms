
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search } from "lucide-react";
import { getAgentsByType } from "@/data/mockData";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título deve ter no máximo 100 caracteres"),
  carouselType: z.enum(["vod", "lives", "news", "ads", "players", "store", "top5"]),
  layout: z.enum(["horizontal", "grid", "slider"]),
  order: z.number().min(1, "Ordem deve ser maior que 0").max(100, "Ordem deve ser menor que 100"),
  status: z.boolean(),
  showMoreButton: z.boolean(),
  // Campos universais
  sortType: z.enum(["alphabetical", "random", "mostWatched", "newest"]).optional(),
  contentLimit: z.number().min(1, "Deve exibir pelo menos 1 conteúdo").max(50, "Máximo 50 conteúdos").optional(),
  planType: z.enum(["all", "free", "premium", "vip"]),
  // Campos específicos por tipo
  contentSource: z.enum(["agent", "genre", "recommendations", "manual"]).optional(),
  agentType: z.string().optional(),
  agentIds: z.array(z.string()).optional(),
  genreType: z.string().optional(),
  algorithmType: z.string().optional(),
  manualContent: z.array(z.string()).optional(),
  // Campos específicos para ADS
  adId: z.string().optional(),
  // Campos específicos para Loja
  productCategory: z.string().optional(),
  priceRange: z.string().optional(),
  // Campos específicos para Canais ao Vivo
  channelIds: z.array(z.string()).optional(),
  // Campos específicos para Jogadores
  teamFilter: z.enum(["all", "specific", "none"]).optional(),
  teamIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CarouselFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export function CarouselForm({ initialData, onSubmit, onCancel }: CarouselFormProps) {
  const [agentSearch, setAgentSearch] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      carouselType: initialData?.carouselType || "vod",
      layout: initialData?.layout || initialData?.type || "horizontal", 
      order: initialData?.order || 1,
      status: initialData?.status === "active" || !initialData,
      showMoreButton: initialData?.showMoreButton || false,
      sortType: initialData?.sortType || "alphabetical",
      contentLimit: initialData?.contentLimit || 10,
      planType: initialData?.planType || "all",
      contentSource: initialData?.contentSource,
      agentType: initialData?.agentType,
      agentIds: initialData?.agentIds || [],
      genreType: initialData?.genreType,
      algorithmType: initialData?.algorithmType,
      manualContent: initialData?.manualContent || [],
      adId: initialData?.adId,
      productCategory: initialData?.productCategory,
      priceRange: initialData?.priceRange,
      channelIds: initialData?.channelIds || [],
      teamFilter: initialData?.teamFilter || "all",
      teamIds: initialData?.teamIds || [],
    },
  });

  const carouselType = form.watch("carouselType");
  const contentSource = form.watch("contentSource");
  const agentType = form.watch("agentType");
  const selectedAgentIds = form.watch("agentIds") || [];

  // Buscar agentes baseado no tipo selecionado
  const availableAgents = agentType ? getAgentsByType(agentType) : [];
  const filteredAgents = availableAgents.filter(agent =>
    agent.name.toLowerCase().includes(agentSearch.toLowerCase())
  );

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
              <FormDescription>
                Nome que será exibido para identificar o carrossel
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="vod">VOD (Vídeos On Demand)</SelectItem>
                    <SelectItem value="lives">Canais ao Vivo</SelectItem>
                    <SelectItem value="news">Notícias</SelectItem>
                    <SelectItem value="ads">Anúncios/ADS</SelectItem>
                    <SelectItem value="players">Jogadores</SelectItem>
                    <SelectItem value="store">Loja</SelectItem>
                    <SelectItem value="top5">TOP 5 Conteúdos</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Define o tipo de conteúdo do carrossel
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <SelectItem value="horizontal">Horizontal scroll</SelectItem>
                    <SelectItem value="grid">Grade com destaques</SelectItem>
                    <SelectItem value="slider">Slider com fundo</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Layout visual que será utilizado para exibir o carrossel
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Configurações universais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Campo de ordenação - não aparece para TOP5 */}
          {carouselType !== "top5" && (
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
                  <FormDescription>
                    Como os conteúdos serão ordenados
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Campo de quantidade de conteúdos - não aparece para TOP5 */}
          {carouselType !== "top5" && (
            <FormField
              control={form.control}
              name="contentLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {carouselType === "lives" ? "Quantidade de Canais" : "Quantidade de Conteúdos"}
                  </FormLabel>
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
                  <FormDescription>
                    {carouselType === "lives" ? "Número máximo de canais a exibir" : "Número máximo de conteúdos a exibir"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
                <FormDescription>
                  Para quais planos o carrossel será exibido
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Configurações específicas por tipo de carrossel */}
        {(carouselType === "vod" || carouselType === "news" || carouselType === "top5") && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações de Conteúdo</h3>
            <FormField
              control={form.control}
              name="contentSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonte de Conteúdo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a fonte" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="agent">Agente (Jogador, Técnico, Time, etc.)</SelectItem>
                      <SelectItem value="genre">Gênero/Categoria</SelectItem>
                      <SelectItem value="recommendations">Recomendação Personalizada</SelectItem>
                      <SelectItem value="manual">Carrossel Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Define que tipo de conteúdo será exibido no carrossel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {carouselType === "lives" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações de Canais ao Vivo</h3>
            <FormField
              control={form.control}
              name="channelIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canais Selecionados</FormLabel>
                  <Select>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione os canais" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="channel1">Canal Esporte Total</SelectItem>
                      <SelectItem value="channel2">Transmissão Oficial</SelectItem>
                      <SelectItem value="channel3">Canal da Copa</SelectItem>
                      <SelectItem value="channel4">Esportes 24h</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione quais canais serão exibidos no carrossel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {carouselType === "players" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações de Jogadores</h3>
            <FormField
              control={form.control}
              name="teamFilter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filtro por Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o filtro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Todos os Jogadores</SelectItem>
                      <SelectItem value="specific">Times Específicos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Como filtrar os jogadores por time
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("teamFilter") === "specific" && (
              <FormField
                control={form.control}
                name="teamIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Times Selecionados</FormLabel>
                    <Select>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione os times" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="team1">Flamengo</SelectItem>
                        <SelectItem value="team2">Palmeiras</SelectItem>
                        <SelectItem value="team3">São Paulo</SelectItem>
                        <SelectItem value="team4">Corinthians</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione de quais times mostrar os jogadores
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        {carouselType === "ads" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações de Anúncios</h3>
            <FormField
              control={form.control}
              name="adId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anúncio Selecionado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o anúncio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ad1">Banner Patrocinador Principal</SelectItem>
                      <SelectItem value="ad2">Vídeo Promocional Copa</SelectItem>
                      <SelectItem value="ad3">Banner Fornecedor Esportivo</SelectItem>
                      <SelectItem value="ad4">Anúncio Parceiro Oficial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione qual anúncio será exibido no carrossel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {carouselType === "store" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações da Loja</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria de Produtos</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="jerseys">Camisas</SelectItem>
                        <SelectItem value="accessories">Acessórios</SelectItem>
                        <SelectItem value="equipment">Equipamentos</SelectItem>
                        <SelectItem value="collectibles">Colecionáveis</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faixa de Preço</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a faixa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0-50">R$ 0 - R$ 50</SelectItem>
                        <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                        <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                        <SelectItem value="200+">R$ 200+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Campos condicionais baseados na fonte de conteúdo */}
        {contentSource === "agent" && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="agentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Agente</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("agentIds", []);
                    setAgentSearch("");
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="player">Jogador</SelectItem>
                      <SelectItem value="coach">Técnico</SelectItem>
                      <SelectItem value="team">Time</SelectItem>
                      <SelectItem value="staff">Comissão Técnica</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {agentType && (
              <FormField
                control={form.control}
                name="agentIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecionar Agentes</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {/* Campo de busca */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={`Buscar ${agentType === 'player' ? 'jogadores' : agentType === 'coach' ? 'técnicos' : agentType === 'team' ? 'times' : 'membros da comissão'}...`}
                            value={agentSearch}
                            onChange={(e) => setAgentSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        {/* Agentes selecionados */}
                        {selectedAgentIds.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedAgentIds.map(agentId => {
                              const agent = availableAgents.find(a => a.id === agentId);
                              if (!agent) return null;
                              return (
                                <Badge key={agentId} variant="secondary" className="flex items-center gap-1">
                                  {agent.name}
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => {
                                      const newIds = selectedAgentIds.filter(id => id !== agentId);
                                      field.onChange(newIds);
                                    }}
                                  />
                                </Badge>
                              );
                            })}
                          </div>
                        )}

                        {/* Lista de agentes disponíveis */}
                        <div className="border rounded-md max-h-40 overflow-y-auto">
                          {filteredAgents.length > 0 ? (
                            filteredAgents.map(agent => (
                              <div
                                key={agent.id}
                                className="flex items-center space-x-2 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                                onClick={() => {
                                  const newIds = selectedAgentIds.includes(agent.id)
                                    ? selectedAgentIds.filter(id => id !== agent.id)
                                    : [...selectedAgentIds, agent.id];
                                  field.onChange(newIds);
                                }}
                              >
                                <Checkbox 
                                  checked={selectedAgentIds.includes(agent.id)}
                                  onChange={() => {}}
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{agent.name}</p>
                                  {'team' in agent && (
                                    <p className="text-sm text-muted-foreground">{agent.team}</p>
                                  )}
                                  {'category' in agent && (
                                    <p className="text-sm text-muted-foreground">{agent.category}</p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-muted-foreground">
                              Nenhum {agentType === 'player' ? 'jogador' : agentType === 'coach' ? 'técnico' : agentType === 'team' ? 'time' : 'membro'} encontrado
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {selectedAgentIds.length} {agentType === 'player' ? 'jogador(es)' : agentType === 'coach' ? 'técnico(s)' : agentType === 'team' ? 'time(s)' : 'membro(s)'} selecionado(s)
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        {contentSource === "genre" && (
          <FormField
            control={form.control}
            name="genreType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Conteúdo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de conteúdo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="goals">Gols</SelectItem>
                    <SelectItem value="highlights">Melhores Momentos</SelectItem>
                    <SelectItem value="interviews">Entrevistas</SelectItem>
                    <SelectItem value="training">Treinos</SelectItem>
                    <SelectItem value="behind-scenes">Bastidores</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Tipo de conteúdo que será exibido no carrossel
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {contentSource === "recommendations" && (
          <FormField
            control={form.control}
            name="algorithmType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Algoritmo de Recomendação</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o algoritmo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="trending">Mais Populares</SelectItem>
                    <SelectItem value="personalized">Personalizado por Usuário</SelectItem>
                    <SelectItem value="similar">Conteúdos Similares</SelectItem>
                    <SelectItem value="recent">Mais Recentes</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Algoritmo usado para gerar as recomendações
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {contentSource === "manual" && (
          <FormField
            control={form.control}
            name="manualContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conteúdos Selecionados</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {field.value?.length || 0} conteúdos selecionados
                    </div>
                    <Button type="button" variant="outline" className="w-full">
                      + Adicionar Conteúdos
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Selecione manualmente os conteúdos que aparecerão no carrossel
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormDescription>
                Define a posição do carrossel na página (1 = primeiro, 2 = segundo, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Status</FormLabel>
                  <FormDescription>
                    Carrossel ativo será exibido na plataforma
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
                  <FormLabel className="text-base">Exibir botão "Ver mais"</FormLabel>
                  <FormDescription>
                    Adiciona botão para expandir o carrossel
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
