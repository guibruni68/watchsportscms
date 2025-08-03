
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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título deve ter no máximo 100 caracteres"),
  carouselType: z.enum(["vod", "lives", "news", "ads", "players", "store", "top5"]),
  layout: z.enum(["horizontal", "grid", "slider", "top5"]),
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
  const [teams, setTeams] = useState<any[]>([]);
  const [channels] = useState([
    { id: "channel1", name: "Canal Esporte Total" },
    { id: "channel2", name: "Transmissão Oficial" },
    { id: "channel3", name: "Canal da Copa" },
    { id: "channel4", name: "Esportes 24h" }
  ]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name')
        .order('name');
      
      if (!error && data) {
        setTeams(data);
      }
    };
    
    fetchTeams();
  }, []);

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
                    </SelectContent>
                  </Select>
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
                    {carouselType === "vod" && (
                      <SelectItem value="top5">TOP 5</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Configurações universais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Campo de ordenação - não aparece para TOP5 */}
          {form.watch("layout") !== "top5" && (
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
          )}

          {/* Campo de quantidade de conteúdos - não aparece para TOP5 */}
          {form.watch("layout") !== "top5" && (
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Configurações específicas por tipo de carrossel */}
        {/* TOP 5 só aparece para VOD */}
        {form.watch("layout") === "top5" && carouselType === "vod" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações TOP 5</h3>
            <p className="text-sm text-muted-foreground">
              Este carrossel exibirá automaticamente os 5 conteúdos mais relevantes.
            </p>
          </div>
        )}

        {(carouselType === "vod" || carouselType === "news") && form.watch("layout") !== "top5" && (
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
                      {carouselType === "news" && (
                        <SelectItem value="all">Todos os Conteúdos</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
                  <div className="space-y-3">
                    {/* Multi-select input */}
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
                          <SelectValue placeholder="Selecione os canais..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {channels
                          .filter(channel => !field.value?.includes(channel.id))
                          .map((channel) => (
                            <SelectItem key={channel.id} value={channel.id}>
                              {channel.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Selected channels display */}
                    {field.value && field.value.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Canais selecionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((channelId) => {
                            const channel = channels.find(c => c.id === channelId);
                            return channel ? (
                              <Badge key={channelId} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                                {channel.name}
                                <X 
                                  className="h-3 w-3 cursor-pointer hover:bg-destructive/20 rounded-full p-0.5" 
                                  onClick={() => {
                                    const newValues = field.value?.filter(id => id !== channelId) || [];
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
                    <div className="space-y-2">
                      {teams.map((team) => (
                        <div key={team.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={team.id}
                            checked={field.value?.includes(team.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              if (checked) {
                                field.onChange([...currentValues, team.id]);
                              } else {
                                field.onChange(currentValues.filter(id => id !== team.id));
                              }
                            }}
                          />
                          <label
                            htmlFor={team.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {team.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {field.value && field.value.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-2">Times selecionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((teamId) => {
                            const team = teams.find(t => t.id === teamId);
                            return team ? (
                              <Badge key={teamId} variant="secondary" className="flex items-center gap-1">
                                {team.name}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => {
                                    const newValues = field.value?.filter(id => id !== teamId) || [];
                                    field.onChange(newValues);
                                  }}
                                />
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
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
