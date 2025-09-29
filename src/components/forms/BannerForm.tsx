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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { mockLives, mockVideos } from "@/data/mockData";
import { ArrowLeft, Upload, X, Image, Monitor, Smartphone, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CatalogueSelector } from "@/components/ui/catalogue-selector";
const bannerSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  tipo_conteudo: z.enum(["live", "vod", "personalizado"]),
  layout_banner: z.enum(["imagem_botao", "video_texto", "hero_cta", "mini_card"]),
  midia_web_url: z.string().optional(),
  midia_web_tipo: z.enum(["imagem", "video"]).optional(),
  midia_mobile_url: z.string().optional(),
  midia_mobile_tipo: z.enum(["imagem", "video"]).optional(),
  texto_cta: z.string().optional(),
  data_exibicao: z.date().optional(),
  url_redirecionamento: z.string().optional(),
  status: z.boolean(),
  ordem: z.number().min(0),
  conteudo_vinculado_id: z.string().optional(),
  catalogue_id: z.string().optional(),
  planos_permitidos: z.array(z.string())
});
type BannerFormData = z.infer<typeof bannerSchema>;
interface BannerFormProps {
  bannerId?: string;
  initialData?: Partial<BannerFormData>;
}
export default function BannerForm({
  bannerId,
  initialData
}: BannerFormProps) {
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
      texto_cta: "Saiba mais",
      status: true,
      ordem: 0,
      planos_permitidos: [],
      ...initialData
    }
  });
  const tiposConteudo = [{
    value: "live",
    label: "Ao Vivo"
  }, {
    value: "vod",
    label: "VOD (Vídeo sob Demanda)"
  }, {
    value: "personalizado",
    label: "Personalizado"
  }];
  const layoutsDisponiveis = [{
    value: "imagem_botao",
    label: "Imagem com botão"
  }, {
    value: "video_texto",
    label: "Vídeo com texto sobreposto"
  }, {
    value: "hero_cta",
    label: "Banner hero com CTA"
  }, {
    value: "mini_card",
    label: "Mini-card horizontal"
  }];
  const planosDisponiveis = [{
    id: "gratuito",
    label: "Gratuito"
  }, {
    id: "basico",
    label: "Básico"
  }, {
    id: "premium",
    label: "Premium"
  }, {
    id: "vip",
    label: "VIP"
  }];

  // Determinar o tipo de mídia necessário baseado no layout
  const getRequiredMediaType = (layout: string) => {
    if (layout === "video_texto") return "video";
    return "imagem";
  };
  const handleWebFileUpload = (file: File) => {
    setUploadingWebMedia(true);
    const reader = new FileReader();
    reader.onload = e => {
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
          description: "Mídia web enviada com sucesso."
        });
      }, 1000);
    };
    reader.readAsDataURL(file);
  };
  const handleMobileFileUpload = (file: File) => {
    setUploadingMobileMedia(true);
    const reader = new FileReader();
    reader.onload = e => {
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
          description: "Mídia mobile enviada com sucesso."
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
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    if (data.midia_mobile_url && data.midia_mobile_tipo !== requiredMediaType) {
      toast({
        title: "Erro",
        description: `O layout "${layoutsDisponiveis.find(l => l.value === data.layout_banner)?.label}" requer mídia do tipo ${requiredMediaType} para mobile.`,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Simular salvamento
    setTimeout(() => {
      toast({
        title: "Sucesso",
        description: bannerId ? "Banner atualizado com sucesso." : "Banner criado com sucesso."
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
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
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
                <FormField control={form.control} name="titulo" render={({
                field
              }) => <FormItem>
                      <FormLabel>Título do Banner</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o título..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="ordem" render={({
                field
              }) => <FormItem>
                      <FormLabel>Ordem de Exibição</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormDescription>
                        Ordem de exibição (menor número = maior prioridade)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="tipo_conteudo" render={({
                field
              }) => <FormItem>
                      <FormLabel>Tipo de Banner</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposConteudo.map(tipo => <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="layout_banner" render={({
                field
              }) => <FormItem>
                      <FormLabel>Layout do Banner</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o layout..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {layoutsDisponiveis.map(layout => <SelectItem key={layout.value} value={layout.value}>
                              {layout.label}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />
              </div>

              {/* Conteúdo Vinculado - apenas para Live e VOD */}
              {(form.watch('tipo_conteudo') === 'live' || form.watch('tipo_conteudo') === 'vod') && <FormField control={form.control} name="conteudo_vinculado_id" render={({
              field
            }) => <FormItem>
                      <FormLabel>
                        {form.watch('tipo_conteudo') === 'live' ? 'Evento ao Vivo' : 'Vídeo VOD'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o conteúdo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {form.watch('tipo_conteudo') === 'live' && mockLives.map(live => <SelectItem key={live.id} value={live.id}>
                                {live.name}
                              </SelectItem>)}
                          {form.watch('tipo_conteudo') === 'vod' && mockVideos.map(video => <SelectItem key={video.id} value={video.id}>
                                {video.name}
                              </SelectItem>)}
                        </SelectContent>
                      </Select>
                      
                      <FormMessage />
                    </FormItem>} />}

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
                    
                    {webMediaPreview && webUploadedFileName ? <div className="space-y-3">
                        {/* Input com nome do arquivo e ícone */}
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                          <Image className="h-4 w-4 text-primary" />
                          <span className="flex-1 text-sm font-medium truncate">{webUploadedFileName}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={removeWebMedia} className="text-destructive hover:text-destructive">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Preview da mídia */}
                        <div className="relative w-full">
                          {form.getValues('midia_web_tipo') === 'video' ? <video src={webMediaPreview} controls className="w-full h-32 object-cover rounded-lg" /> : <img src={webMediaPreview} alt="Preview Web" className="w-full h-32 object-cover rounded-lg" />}
                        </div>
                      </div> : <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <input type="file" accept={getRequiredMediaType(form.watch('layout_banner')) === 'video' ? 'video/*' : 'image/*'} onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleWebFileUpload(file);
                    }} className="hidden" id="web-media-upload" />
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
                      </div>}
                    {uploadingWebMedia && <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                        Fazendo upload...
                      </div>}
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
                    
                    {mobileMediaPreview && mobileUploadedFileName ? <div className="space-y-3">
                        {/* Input com nome do arquivo e ícone */}
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                          <Image className="h-4 w-4 text-primary" />
                          <span className="flex-1 text-sm font-medium truncate">{mobileUploadedFileName}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={removeMobileMedia} className="text-destructive hover:text-destructive">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Preview da mídia */}
                        <div className="relative w-full">
                          {form.getValues('midia_mobile_tipo') === 'video' ? <video src={mobileMediaPreview} controls className="w-full h-32 object-cover rounded-lg" /> : <img src={mobileMediaPreview} alt="Preview Mobile" className="w-full h-32 object-cover rounded-lg" />}
                        </div>
                      </div> : <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <input type="file" accept={getRequiredMediaType(form.watch('layout_banner')) === 'video' ? 'video/*' : 'image/*'} onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleMobileFileUpload(file);
                    }} className="hidden" id="mobile-media-upload" />
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
                      </div>}
                    {uploadingMobileMedia && <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                        Fazendo upload...
                      </div>}
                  </div>
                </div>
              </div>

              {/* Campos de personalização (para todos os tipos) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="texto_cta" render={({
                field
              }) => <FormItem>
                      <FormLabel>Texto do CTA</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Assista agora, Saiba mais..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Deixe vazio para usar texto padrão do tipo de banner
                      </FormDescription>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="url_redirecionamento" render={({
                field
              }) => <FormItem>
                      <FormLabel>URL de Redirecionamento</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <FormField control={form.control} name="data_exibicao" render={({
                field
              }) => <FormItem className="flex flex-col">
                      <FormLabel>Data de Exibição</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Selecione uma data</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
                        </PopoverContent>
                      </Popover>
                      
                      <FormMessage />
                    </FormItem>} />
              </div>

              {/* Seletor de Catálogo */}
              <FormField control={form.control} name="catalogue_id" render={({
              field
            }) => <FormItem>
                    <FormLabel>Catálogo</FormLabel>
                    <FormControl>
                      <CatalogueSelector value={field.value} onValueChange={field.onChange} placeholder="Selecionar catálogo (opcional)..." />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>} />

              {/* Planos Permitidos */}
              <FormField control={form.control} name="planos_permitidos" render={() => <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Planos Permitidos</FormLabel>
                      <FormDescription>
                        Selecione os planos que podem visualizar este banner. Se nenhum for selecionado, será visível para todos.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {planosDisponiveis.map(plano => <FormField key={plano.id} control={form.control} name="planos_permitidos" render={({
                  field
                }) => {
                  return <FormItem key={plano.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox checked={field.value?.includes(plano.id)} onCheckedChange={checked => {
                        return checked ? field.onChange([...field.value, plano.id]) : field.onChange(field.value?.filter(value => value !== plano.id));
                      }} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {plano.label}
                                </FormLabel>
                              </FormItem>;
                }} />)}
                    </div>
                    <FormMessage />
                  </FormItem>} />

              {/* Status */}
              <FormField control={form.control} name="status" render={({
              field
            }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Status do Banner
                      </FormLabel>
                      <FormDescription>
                        Banner ativo será exibido para os usuários
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>} />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
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
    </div>;
}