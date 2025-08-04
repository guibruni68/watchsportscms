import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, CalendarIcon, X, User, Users, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { mockPlayers, mockTeams } from "@/data/mockData"

const videoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  tags: z.string(),
  generos: z.array(z.string()).min(1, "Pelo menos um gênero é obrigatório"),
  tag: z.string().min(1, "Tag é obrigatória"),
  dataPublicacao: z.date(),
  videoFile: z.string().optional(),
  imagemCapa: z.string().optional(),
  agentesRelacionados: z.array(z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.enum(["jogador", "time"]),
  })).optional(),
})

type VideoFormData = z.infer<typeof videoSchema>

interface VideoFormProps {
  initialData?: Partial<VideoFormData>
  isEdit?: boolean
}

export function VideoForm({ initialData, isEdit = false }: VideoFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      titulo: initialData?.titulo || "",
      descricao: initialData?.descricao || "",
      tags: initialData?.tags || "",
      generos: initialData?.generos || [],
      tag: initialData?.tag || "",
      dataPublicacao: initialData?.dataPublicacao || new Date(),
      videoFile: initialData?.videoFile || "",
      imagemCapa: initialData?.imagemCapa || "",
      agentesRelacionados: initialData?.agentesRelacionados || [],
    },
  })

  const onSubmit = (data: VideoFormData) => {
    // Mock save - aqui seria integração com backend
    console.log("Salvando vídeo:", data)
    
    toast({
      title: isEdit ? "Vídeo atualizado!" : "Vídeo criado!",
      description: `${data.titulo} foi ${isEdit ? "atualizado" : "criado"} com sucesso.`,
    })
    
    navigate("/videos")
  }

  const generos = [
    "Gols e Melhores Momentos",
    "Entrevistas",
    "Bastidores",
    "Treinos",
    "Histórico do Clube",
    "Análises Táticas",
    "Documentários",
    "Transmissões"
  ]

  const tagsPreConfiguradas = [
    "Novidade",
    "Novo Episódio",
    "Destaque",
    "Ao Vivo",
    "Exclusivo"
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/videos")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Vídeos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Editar Vídeo" : "Novo Vídeo"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Gols da vitória contra o rival" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gêneros *</FormLabel>
                        <div className="space-y-4">
                          <Select onValueChange={(value) => {
                            if (!field.value?.includes(value)) {
                              field.onChange([...(field.value || []), value]);
                            }
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar gêneros" />
                            </SelectTrigger>
                            <SelectContent>
                              {generos
                                .filter(genero => !field.value?.includes(genero))
                                .map((genero) => (
                                <SelectItem key={genero} value={genero}>
                                  {genero}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.value && field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((genero) => (
                                <Badge key={genero} variant="secondary" className="flex items-center gap-1">
                                  {genero}
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => {
                                      field.onChange(field.value?.filter(g => g !== genero) || []);
                                    }}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tagsPreConfiguradas.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="imagemCapa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem de Capa</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">
                              Clique para fazer upload da capa
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG até 5MB
                            </p>
                            <Input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  field.onChange(url);
                                }
                              }}
                            />
                          </div>
                          {field.value && (
                            <div className="relative">
                              <img 
                                src={field.value} 
                                alt="Capa do vídeo" 
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => field.onChange("")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o conteúdo do vídeo..."
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Palavras-chave</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: gols, vitória, campeonato (separadas por vírgula)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataPublicacao"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Publicação *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="agentesRelacionados"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agentes Relacionados</FormLabel>
                    <div className="space-y-4">
                      {/* Select unificado para todos os agentes */}
                       <div>
                         <Select onValueChange={(agenteId) => {
                           // Procurar primeiro nos jogadores
                           let agenteSelecionado: any = mockPlayers.find(p => p.id === agenteId);
                           let tipo: "jogador" | "time" = "jogador";
                           
                           // Se não encontrou nos jogadores, procurar nos times
                           if (!agenteSelecionado) {
                             agenteSelecionado = mockTeams.find(t => t.id === agenteId);
                             tipo = "time";
                           }
                           
                           if (agenteSelecionado && !field.value?.find(a => a.id === agenteId)) {
                             const novoAgente = {
                               id: agenteSelecionado.id,
                               nome: agenteSelecionado.name,
                               tipo: tipo
                             };
                             field.onChange([...(field.value || []), novoAgente]);
                           }
                         }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Buscar e selecionar agentes (jogadores e times)" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Jogadores disponíveis */}
                            {mockPlayers
                              .filter(jogador => !field.value?.find(a => a.id === jogador.id))
                              .map((jogador) => (
                              <SelectItem key={`jogador-${jogador.id}`} value={jogador.id}>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-blue-500" />
                                  <span>{jogador.name} - #{jogador.number}</span>
                                  <Badge variant="outline" className="text-xs">Jogador</Badge>
                                </div>
                              </SelectItem>
                            ))}
                            
                            {/* Times disponíveis */}
                            {mockTeams
                              .filter(time => !field.value?.find(a => a.id === time.id))
                              .map((time) => (
                              <SelectItem key={`time-${time.id}`} value={time.id}>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-green-500" />
                                  <span>{time.name}</span>
                                  <Badge variant="outline" className="text-xs">Time</Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Lista dos agentes selecionados */}
                      {field.value && field.value.length > 0 && (
                        <div className="border rounded-lg p-4 bg-muted/50">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium">Agentes Selecionados ({field.value.length})</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => field.onChange([])}
                              className="text-destructive hover:text-destructive"
                            >
                              Limpar todos
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {field.value.map((agente, index) => (
                              <div 
                                key={`${agente.id}-${index}`} 
                                className="flex items-center justify-between p-2 bg-background border rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  {agente.tipo === 'jogador' ? (
                                    <User className="h-4 w-4 text-blue-500" />
                                  ) : (
                                    <Users className="h-4 w-4 text-green-500" />
                                  )}
                                  <span className="text-sm font-medium">{agente.nome}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {agente.tipo === 'jogador' ? 'Jogador' : 'Time'}
                                  </Badge>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const novosAgentes = field.value?.filter((_, i) => i !== index) || [];
                                    field.onChange(novosAgentes);
                                  }}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arquivo de Vídeo</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Clique para fazer upload ou arraste o arquivo aqui
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Formatos aceitos: MP4, AVI, MOV (máx. 500MB)
                        </p>
                        <Input 
                          type="file" 
                          accept="video/*" 
                          className="hidden" 
                          onChange={(e) => field.onChange(e.target.files?.[0]?.name || "")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  {isEdit ? "Atualizar Vídeo" : "Criar Vídeo"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/videos")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}