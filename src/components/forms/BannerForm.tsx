import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { mockCampaigns, mockLives, mockVideos, mockContents } from "@/data/mockData";
import { ArrowLeft, Upload, X, Image, Monitor, Smartphone, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const bannerSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  tipo_conteudo: z.enum(["vod", "live_agora", "live_programado", "campanha", "recomendado", "institucional"]),
  layout_banner: z.enum(["imagem_botao", "video_texto", "hero_cta", "mini_card"]),
  midia_web_url: z.string().optional(),
  midia_web_tipo: z.enum(["imagem", "video"]).optional(),
  midia_mobile_url: z.string().optional(),
  midia_mobile_tipo: z.enum(["imagem", "video"]).optional(),
  texto_botao: z.string().optional(),
  exibir_botao: z.boolean(),
  url_acao: z.string().optional(),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  data_fim: z.string().min(1, "Data de fim é obrigatória"),
  status: z.boolean(),
  ordem: z.number().min(0),
  algoritmo_recomendacao: z.string().optional(),
  conteudo_vinculado_id: z.string().optional(),
  planos_permitidos: z.array(z.string()),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  bannerId?: string;
  initialData?: Partial<BannerFormData>;
}

export default function BannerForm({ bannerId, initialData }: BannerFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingWebMedia, setUploadingWebMedia] = useState(false);
  const [uploadingMobileMedia, setUploadingMobileMedia] = useState(false);
  const [webMediaPreview, setWebMediaPreview] = useState<string | null>(null);
  const [mobileMediaPreview, setMobileMediaPreview] = useState<string | null>(null);
  const [webUploadedFileName, setWebUploadedFileName] = useState<string | null>(null);
  const [mobileUploadedFileName, setMobileUploadedFileName] = useState<string | null>(null);

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      titulo: "",
      tipo_conteudo: "vod",
      layout_banner: "imagem_botao",
      texto_botao: "Saiba mais",
      exibir_botao: true,
      status: true,
      ordem: 0,
      planos_permitidos: [],
      ...initialData,
    },
  });

  const tiposConteudo = [
    { value: "vod", label: "Destaque de Vídeo sob demanda (VOD)" },
    { value: "live_agora", label: "Transmissão ao vivo (ao vivo agora)" },
    { value: "live_programado", label: "Evento ao vivo programado (em breve)" },
    { value: "campanha", label: "Campanha publicitária" },
    { value: "recomendado", label: "Conteúdo recomendado" },
    { value: "institucional", label: "Banner institucional personalizado" },
  ];

  const layoutsDisponiveis = [
    { value: "imagem_botao", label: "Imagem com botão" },
    { value: "video_texto", label: "Vídeo com texto sobreposto" },
    { value: "hero_cta", label: "Banner hero com CTA" },
    { value: "mini_card", label: "Mini-card horizontal" },
  ];

  const planosDisponiveis = [
    { id: "gratuito", label: "Gratuito" },
    { id: "basico", label: "Básico" },
    { id: "premium", label: "Premium" },
    { id: "vip", label: "VIP" },
  ];

  // Determinar o tipo de mídia necessário baseado no layout
  const getRequiredMediaType = (layout: string) => {
    if (layout === "video_texto") return "video";
    return "imagem";
  };

  const handleWebFileUpload = (file: File) => {
    setUploadingWebMedia(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const mediaType = file.type.startsWith('video/') ? 'video' : 'imagem';
      const mockUrl = e.target?.result as string;
      
      form.setValue('midia_web_url', mockUrl);
      form.setValue('midia_web_tipo', mediaType);
      setWebMediaPreview(mockUrl);
      setWebUploadedFileName(file.name);
      
      setTimeout(() => {
        setUploadingWebMedia(false);
        toast({
          title: "Sucesso",
          description: "Mídia web enviada com sucesso.",
        });
      }, 1000);
    };
    
    reader.readAsDataURL(file);
  };

  const handleMobileFileUpload = (file: File) => {
    setUploadingMobileMedia(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const mediaType = file.type.startsWith('video/') ? 'video' : 'imagem';
      const mockUrl = e.target?.result as string;
      
      form.setValue('midia_mobile_url', mockUrl);
      form.setValue('midia_mobile_tipo', mediaType);
      setMobileMediaPreview(mockUrl);
      setMobileUploadedFileName(file.name);
      
      setTimeout(() => {
        setUploadingMobileMedia(false);
        toast({
          title: "Sucesso",
          description: "Mídia mobile enviada com sucesso.",
        });
      }, 1000);
    };
    
    reader.readAsDataURL(file);
  };

  const removeWebMedia = () => {
    form.setValue('midia_web_url', '');
    form.setValue('midia_web_tipo', undefined);
    setWebMediaPreview(null);
    setWebUploadedFileName(null);
  };

  const removeMobileMedia = () => {
    form.setValue('midia_mobile_url', '');
    form.setValue('midia_mobile_tipo', undefined);
    setMobileMediaPreview(null);
    setMobileUploadedFileName(null);
  };

  const onSubmit = (data: BannerFormData) => {
    setLoading(true);
    
    // Validar se a mídia é do tipo correto para o layout
    const requiredMediaType = getRequiredMediaType(data.layout_banner);
    if (data.midia_web_url && data.midia_web_tipo !== requiredMediaType) {
      toast({
        title: "Erro",
        description: `O layout "${layoutsDisponiveis.find(l => l.value === data.layout_banner)?.label}" requer mídia do tipo ${requiredMediaType} para web.`,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (data.midia_mobile_url && data.midia_mobile_tipo !== requiredMediaType) {
      toast({
        title: "Erro",
        description: `O layout "${layoutsDisponiveis.find(l => l.value === data.layout_banner)?.label}" requer mídia do tipo ${requiredMediaType} para mobile.`,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Validar datas
    if (new Date(data.data_inicio) >= new Date(data.data_fim)) {
      toast({
        title: "Erro",
        description: "A data de início deve ser anterior à data de fim.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Simular salvamento
    setTimeout(() => {
      toast({
        title: "Sucesso",
        description: bannerId ? "Banner atualizado com sucesso." : "Banner criado com sucesso.",
      });
      navigate('/banners');
    }, 1000);
  };

  useEffect(() => {
    if (initialData?.midia_web_url) {
      setWebMediaPreview(initialData.midia_web_url);
    }
    if (initialData?.midia_mobile_url) {
      setMobileMediaPreview(initialData.midia_mobile_url);
    }
  }, [initialData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/banners')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {bannerId ? 'Editar Banner' : 'Novo Banner'}
          </h1>
          <p className="text-muted-foreground">
            {bannerId ? 'Edite as informações do banner' : 'Crie um novo banner promocional'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Banner</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o título..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ordem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordem de Exibição</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
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

              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="tipo_conteudo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Conteúdo Destacado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposConteudo.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Upload de Mídia - Web e Mobile lado a lado */}
              <div className="space-y-4">
                <FormLabel className="text-base">
                  Mídia ({getRequiredMediaType(form.watch('layout_banner')) === 'video' ? 'Vídeo' : 'Imagem'})
                </FormLabel>
                

                {/* Container dos dois uploads lado a lado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload Web */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span className="font-medium">Banner Web (Desktop)</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Recomendado: 16:9 (1920x1080px ou 1200x675px)
                    </div>
                    
                    {webMediaPreview && webUploadedFileName ? (
                      <div className="space-y-3">
                        {/* Input com nome do arquivo e ícone */}
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                          <Image className="h-4 w-4 text-primary" />
                          <span className="flex-1 text-sm font-medium truncate">{webUploadedFileName}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeWebMedia}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Preview da mídia */}
                        <div className="relative w-full">
                          {form.getValues('midia_web_tipo') === 'video' ? (
                            <video 
                              src={webMediaPreview} 
                              controls 
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <img 
                              src={webMediaPreview} 
                              alt="Preview Web" 
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <input
                          type="file"
                          accept={getRequiredMediaType(form.watch('layout_banner')) === 'video' ? 'video/*' : 'image/*'}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleWebFileUpload(file);
                          }}
                          className="hidden"
                          id="web-media-upload"
                        />
                        <label htmlFor="web-media-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <div className="text-xs text-center">
                              <p className="font-medium">
                                Upload {getRequiredMediaType(form.watch('layout_banner'))} web
                              </p>
                              <p className="text-muted-foreground">
                                Clique para selecionar
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                    )}
                    {uploadingWebMedia && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                        Fazendo upload...
                      </div>
                    )}
                  </div>

                  {/* Upload Mobile */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="font-medium">Banner Mobile</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Recomendado: 9:16 (1080x1920px ou 375x667px)
                    </div>
                    
                    {mobileMediaPreview && mobileUploadedFileName ? (
                      <div className="space-y-3">
                        {/* Input com nome do arquivo e ícone */}
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                          <Image className="h-4 w-4 text-primary" />
                          <span className="flex-1 text-sm font-medium truncate">{mobileUploadedFileName}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeMobileMedia}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Preview da mídia */}
                        <div className="relative w-full">
                          {form.getValues('midia_mobile_tipo') === 'video' ? (
                            <video 
                              src={mobileMediaPreview} 
                              controls 
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <img 
                              src={mobileMediaPreview} 
                              alt="Preview Mobile" 
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <input
                          type="file"
                          accept={getRequiredMediaType(form.watch('layout_banner')) === 'video' ? 'video/*' : 'image/*'}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMobileFileUpload(file);
                          }}
                          className="hidden"
                          id="mobile-media-upload"
                        />
                        <label htmlFor="mobile-media-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <div className="text-xs text-center">
                              <p className="font-medium">
                                Upload {getRequiredMediaType(form.watch('layout_banner'))} mobile
                              </p>
                              <p className="text-muted-foreground">
                                Clique para selecionar
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                    )}
                    {uploadingMobileMedia && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                        Fazendo upload...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Algoritmo de Recomendação - apenas para tipo recomendado */}
              {form.watch('tipo_conteudo') === 'recomendado' && (
                <FormField
                  control={form.control}
                  name="algoritmo_recomendacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Algoritmo de Recomendação</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o algoritmo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="colaborativo">Filtragem Colaborativa</SelectItem>
                          <SelectItem value="conteudo_similar">Conteúdo Similar</SelectItem>
                          <SelectItem value="tendencias">Baseado em Tendências</SelectItem>
                          <SelectItem value="historico_usuario">Histórico do Usuário</SelectItem>
                          <SelectItem value="mais_assistidos">Mais Assistidos</SelectItem>
                          <SelectItem value="recentes">Recentes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Conteúdo Vinculado - apenas para tipos específicos, exceto recomendado */}
              {(form.watch('tipo_conteudo') === 'vod' || 
                form.watch('tipo_conteudo') === 'live_agora' || 
                form.watch('tipo_conteudo') === 'live_programado' || 
                form.watch('tipo_conteudo') === 'campanha') && (
                <FormField
                  control={form.control}
                  name="conteudo_vinculado_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch('tipo_conteudo') === 'campanha' && 'Campanha Vinculada'}
                        {(form.watch('tipo_conteudo') === 'live_agora' || form.watch('tipo_conteudo') === 'live_programado') && 'Evento ao Vivo'}
                        {form.watch('tipo_conteudo') === 'vod' && 'Vídeo/Conteúdo'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o conteúdo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {form.watch('tipo_conteudo') === 'campanha' && 
                            mockCampaigns.map((campaign) => (
                              <SelectItem key={campaign.id} value={campaign.id}>
                                {campaign.name}
                              </SelectItem>
                            ))
                          }
                          {(form.watch('tipo_conteudo') === 'live_agora' || form.watch('tipo_conteudo') === 'live_programado') && 
                            mockLives.map((live) => (
                              <SelectItem key={live.id} value={live.id}>
                                {live.name}
                              </SelectItem>
                            ))
                          }
                          {form.watch('tipo_conteudo') === 'vod' && 
                            mockVideos.map((video) => (
                              <SelectItem key={video.id} value={video.id}>
                                {video.name}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* CTA e URL */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="exibir_botao"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Exibir Botão
                        </FormLabel>
                        <FormDescription>
                          Mostrar botão de ação no banner
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

                {form.watch('exibir_botao') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="texto_botao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto do Botão (CTA)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Saiba mais, Assista agora..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="url_acao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de Ação/Redirecionamento</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Período de Exibição */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="data_inicio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início da Exibição</FormLabel>
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
                                format(new Date(field.value), "PPP")
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
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_fim"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Fim da Exibição</FormLabel>
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
                                format(new Date(field.value), "PPP")
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
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
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

              {/* Planos Permitidos */}
              <FormField
                control={form.control}
                name="planos_permitidos"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Planos Permitidos</FormLabel>
                      <FormDescription>
                        Selecione os planos que podem visualizar este banner. Se nenhum for selecionado, será visível para todos.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {planosDisponiveis.map((plano) => (
                        <FormField
                          key={plano.id}
                          control={form.control}
                          name="planos_permitidos"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={plano.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(plano.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, plano.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== plano.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {plano.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Status do Banner
                      </FormLabel>
                      <FormDescription>
                        Banner ativo será exibido para os usuários
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

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/banners')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : bannerId ? "Atualizar" : "Criar"} Banner
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
