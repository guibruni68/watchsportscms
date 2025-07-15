import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { mockCampaigns, mockLives, mockVideos, mockContents } from "@/data/mockData";
import { ArrowLeft, Upload, X } from "lucide-react";

const bannerSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  tipo_conteudo: z.enum(["vod", "live_agora", "live_programado", "campanha", "recomendado", "institucional"]),
  layout_banner: z.enum(["imagem_botao", "video_texto", "hero_cta", "mini_card"]),
  midia_url: z.string().optional(),
  midia_tipo: z.enum(["imagem", "video"]).optional(),
  texto_botao: z.string().optional(),
  exibir_botao: z.boolean(),
  url_acao: z.string().optional(),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  data_fim: z.string().min(1, "Data de fim é obrigatória"),
  status: z.boolean(),
  ordem: z.number().min(0),
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
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

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

  const handleFileUpload = (file: File) => {
    setUploadingMedia(true);
    
    // Simular upload - usar URL local para demonstração
    const reader = new FileReader();
    reader.onload = (e) => {
      const mediaType = file.type.startsWith('video/') ? 'video' : 'imagem';
      const mockUrl = e.target?.result as string;
      
      form.setValue('midia_url', mockUrl);
      form.setValue('midia_tipo', mediaType);
      setMediaPreview(mockUrl);
      
      setTimeout(() => {
        setUploadingMedia(false);
        toast({
          title: "Sucesso",
          description: "Mídia enviada com sucesso.",
        });
      }, 1000);
    };
    
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    form.setValue('midia_url', '');
    form.setValue('midia_tipo', undefined);
    setMediaPreview(null);
  };

  const onSubmit = (data: BannerFormData) => {
    setLoading(true);
    
    // Validar se a mídia é do tipo correto para o layout
    const requiredMediaType = getRequiredMediaType(data.layout_banner);
    if (data.midia_url && data.midia_tipo !== requiredMediaType) {
      toast({
        title: "Erro",
        description: `O layout "${layoutsDisponiveis.find(l => l.value === data.layout_banner)?.label}" requer mídia do tipo ${requiredMediaType}.`,
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
    if (initialData?.midia_url) {
      setMediaPreview(initialData.midia_url);
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <FormField
                  control={form.control}
                  name="layout_banner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout do Banner</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o layout..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {layoutsDisponiveis.map((layout) => (
                            <SelectItem key={layout.value} value={layout.value}>
                              {layout.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Upload de Mídia */}
              <div className="space-y-4">
                <FormLabel>
                  Mídia ({getRequiredMediaType(form.watch('layout_banner')) === 'video' ? 'Vídeo' : 'Imagem'})
                </FormLabel>
                
                {mediaPreview ? (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md">
                      {form.getValues('midia_tipo') === 'video' ? (
                        <video 
                          src={mediaPreview} 
                          controls 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <img 
                          src={mediaPreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeMedia}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    <input
                      type="file"
                      accept={getRequiredMediaType(form.watch('layout_banner')) === 'video' ? 'video/*' : 'image/*'}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                      id="media-upload"
                    />
                    <label htmlFor="media-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div className="text-sm text-center">
                          <p className="font-medium">
                            Clique para fazer upload de {getRequiredMediaType(form.watch('layout_banner'))}
                          </p>
                          <p className="text-muted-foreground">
                            {getRequiredMediaType(form.watch('layout_banner')) === 'video' 
                              ? 'MP4, WebM ou MOV até 50MB'
                              : 'PNG, JPG, GIF ou WebP até 10MB'
                            }
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                )}
                {uploadingMedia && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Fazendo upload...
                  </div>
                )}
              </div>

              {/* Conteúdo Vinculado */}
              {(form.watch('tipo_conteudo') === 'vod' || 
                form.watch('tipo_conteudo') === 'live_agora' || 
                form.watch('tipo_conteudo') === 'live_programado' || 
                form.watch('tipo_conteudo') === 'campanha' ||
                form.watch('tipo_conteudo') === 'recomendado') && (
                <FormField
                  control={form.control}
                  name="conteudo_vinculado_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch('tipo_conteudo') === 'campanha' && 'Campanha Vinculada'}
                        {(form.watch('tipo_conteudo') === 'live_agora' || form.watch('tipo_conteudo') === 'live_programado') && 'Evento ao Vivo'}
                        {(form.watch('tipo_conteudo') === 'vod' || form.watch('tipo_conteudo') === 'recomendado') && 'Vídeo/Conteúdo'}
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
                          {(form.watch('tipo_conteudo') === 'vod' || form.watch('tipo_conteudo') === 'recomendado') && 
                            mockVideos.map((video) => (
                              <SelectItem key={video.id} value={video.id}>
                                {video.name}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione o conteúdo que será destacado por este banner
                      </FormDescription>
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
                    <FormItem>
                      <FormLabel>Data de Início da Exibição</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_fim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Fim da Exibição</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
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