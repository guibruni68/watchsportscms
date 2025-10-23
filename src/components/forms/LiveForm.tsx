import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarIcon, Clock, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { mockPlayers, mockTeams } from "@/data/mockData";


const liveSchema = z.object({
  nomeEvento: z.string().min(1, "Nome do evento é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  generos: z.array(z.string()).min(1, "Pelo menos um gênero é obrigatório"),
  data: z.date(),
  hora: z.string().min(1, "Hora é obrigatória"),
  status: z.string().min(1, "Status é obrigatório"),
  playerEmbed: z.string().optional(),
  imagemCapa: z.string().optional(),
  
  agentesRelacionados: z.array(z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.enum(["jogador", "time"]),
  })).optional(),
});
type LiveFormData = z.infer<typeof liveSchema>;
interface LiveFormProps {
  initialData?: {
    nomeEvento?: string;
    descricao?: string;
    generos?: string[];
    dataHora?: string;
    status?: string;
    playerEmbed?: string;
    imagemCapa?: string;
    
    agentesRelacionados?: Array<{
      id: string;
      nome: string;
      tipo: "jogador" | "time";
    }>;
  };
  isEdit?: boolean;
}
export function LiveForm({
  initialData,
  isEdit = false
}: LiveFormProps) {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // Parse initial datetime if provided
  const initialDate = initialData?.dataHora ? new Date(initialData.dataHora) : undefined;
  const initialTime = initialData?.dataHora ? format(new Date(initialData.dataHora), "HH:mm") : "";
  const form = useForm<LiveFormData>({
    resolver: zodResolver(liveSchema),
    defaultValues: {
      nomeEvento: initialData?.nomeEvento || "",
      descricao: initialData?.descricao || "",
      generos: initialData?.generos || [],
      data: initialDate,
      hora: initialTime,
      status: initialData?.status || "",
      playerEmbed: initialData?.playerEmbed || "",
      imagemCapa: initialData?.imagemCapa || "",
      
      agentesRelacionados: initialData?.agentesRelacionados || [],
    }
  });
  const onSubmit = (data: LiveFormData) => {
    console.log("Salvando live:", data);
    toast({
      title: isEdit ? "Live atualizada!" : "Live criada!",
      description: `${data.nomeEvento} foi ${isEdit ? "atualizada" : "criada"} com sucesso.`
    });
    navigate("/lives");
  };
  const statusOptions = [{
    value: "em_breve",
    label: "Em Breve"
  }, {
    value: "ao_vivo",
    label: "Ao Vivo"
  }, {
    value: "encerrado",
    label: "Encerrado"
  }];

  const generos = [
    "Gols e Melhores Momentos",
    "Entrevistas", 
    "Bastidores",
    "Treinos",
    "Histórico do Clube",
    "Análises Táticas",
    "Documentários",
    "Transmissões"
  ];
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/lives")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Lives
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Editar Transmissão" : "Nova Transmissão"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField control={form.control} name="nomeEvento" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Nome do Evento *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Final do Campeonato Estadual" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="generos" render={({
                  field
                }) => <FormItem>
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
                      </FormItem>} />

                  <FormField control={form.control} name="status" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />

                </div>

                <FormField control={form.control} name="imagemCapa" render={({
                field
              }) => <FormItem>
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
                            <Input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          field.onChange(url);
                        }
                      }} />
                          </div>
                          {field.value && <div className="relative">
                              <img src={field.value} alt="Capa da transmissão" className="w-full h-32 object-cover rounded-lg border" />
                              <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => field.onChange("")}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <FormField control={form.control} name="descricao" render={({
              field
            }) => <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva o evento..." className="min-h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="data" render={({
                field
              }) => <FormItem>
                      <FormLabel>Data *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className={cn("justify-start text-left font-normal w-full", !field.value && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP", {
                          locale: ptBR
                        }) : <span>Selecione a data</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="hora" render={({
                field
              }) => <FormItem>
                      <FormLabel>Hora *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              {field.value ? field.value : "Selecionar hora"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-3 pointer-events-auto">
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                              {Array.from({ length: 24 }, (_, hour) => {
                                return Array.from({ length: 4 }, (_, quarter) => {
                                  const minutes = quarter * 15;
                                  const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                                  return (
                                    <Button
                                      key={timeString}
                                      variant="ghost"
                                      size="sm"
                                      className="justify-start"
                                      onClick={() => field.onChange(timeString)}
                                    >
                                      {timeString}
                                    </Button>
                                  );
                                });
                              }).flat()}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <FormField control={form.control} name="agentesRelacionados" render={({
              field
            }) => <FormItem>
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
                                {jogador.name} - #{jogador.number}
                              </SelectItem>
                            ))}
                            
                            {/* Times disponíveis */}
                            {mockTeams
                              .filter(time => !field.value?.find(a => a.id === time.id))
                              .map((time) => (
                              <SelectItem key={`time-${time.id}`} value={time.id}>
                                {time.name}
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
                                  <span className="text-sm font-medium">{agente.nome}</span>
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
                  </FormItem>} />

              <FormField control={form.control} name="playerEmbed" render={({
              field
            }) => <FormItem>
                    <FormLabel>Link da Transmissão
              </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Cole aqui o código embed do YouTube, Twitch ou outro player..." className="min-h-24 font-mono text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  {isEdit ? "Atualizar Live" : "Criar Live"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/lives")} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>;
}