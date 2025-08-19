import { useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentSelector } from "@/components/ui/content-selector";

const catalogueSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  tipo_catalogo: z.enum(["serie", "colecao", "playlist", "outro"]),
  status: z.boolean(),
  ordem_exibicao: z.number().min(0),
  conteudos: z.array(z.string()).optional(),
});

type CatalogueFormData = z.infer<typeof catalogueSchema>;

interface CatalogueFormProps {
  catalogueId?: string;
  initialData?: Partial<CatalogueFormData>;
  onSuccess?: () => void;
  isInline?: boolean;
}

const tiposCatalogo = [
  { value: "serie", label: "Série" },
  { value: "colecao", label: "Coleção" },
  { value: "playlist", label: "Playlist" },
  { value: "outro", label: "Outro" },
];

export default function CatalogueForm({ catalogueId, initialData, onSuccess, isInline = false }: CatalogueFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<CatalogueFormData>({
    resolver: zodResolver(catalogueSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      tipo_catalogo: "colecao",
      status: true,
      ordem_exibicao: 0,
      conteudos: [],
      ...initialData,
    },
  });

  const onSubmit = async (data: CatalogueFormData) => {
    setLoading(true);
    
    try {
      if (catalogueId) {
        const { error } = await supabase
          .from('catalogues')
          .update(data)
          .eq('id', catalogueId);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Catálogo atualizado com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('catalogues')
          .insert([data]);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Catálogo criado com sucesso.",
        });
      }

      if (onSuccess) {
        onSuccess();
      } else if (!isInline) {
        navigate('/catalogues');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o catálogo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-6">
      {!isInline && (
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {catalogueId ? 'Editar Catálogo' : 'Novo Catálogo'}
            </h1>
            <p className="text-muted-foreground">
              {catalogueId ? 'Edite as informações do catálogo' : 'Crie um novo catálogo de conteúdo'}
            </p>
          </div>
        </div>
      )}

      <Card>
        {isInline && (
          <CardHeader>
            <CardTitle>
              {catalogueId ? 'Editar Catálogo' : 'Novo Catálogo'}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={isInline ? "pt-0" : ""}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Catálogo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o título..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo_catalogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Catálogo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposCatalogo.map((tipo) => (
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

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o conteúdo deste catálogo..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Descrição opcional do catálogo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ordem_exibicao"
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

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Status do Catálogo
                        </FormLabel>
                        <FormDescription>
                          Catálogo ativo poderá ser selecionado em conteúdos
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

              {/* Seção de Conteúdos Manuais */}
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="text-lg font-medium">Conteúdos do Catálogo</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione conteúdos manualmente a este catálogo. Você pode buscar por vídeos, lives ou notícias existentes.
                </p>
                
                <FormField
                  control={form.control}
                  name="conteudos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adicionar Conteúdos</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Buscar conteúdos para adicionar..."
                              className="flex-1"
                            />
                            <Button type="button" size="sm" variant="outline">
                              <Plus className="h-4 w-4 mr-1" />
                              Adicionar Manual
                            </Button>
                          </div>
                          
                          {/* Lista de conteúdos selecionados */}
                          {field.value && field.value.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Conteúdos selecionados ({field.value.length})</p>
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((contentId, index) => (
                                  <Badge key={`content-${index}`} variant="secondary" className="flex items-center gap-1">
                                    Conteúdo {index + 1}
                                    <X 
                                      className="h-3 w-3 cursor-pointer" 
                                      onClick={() => {
                                        const newValue = field.value?.filter((_, i) => i !== index) || [];
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground">
                            Funcionalidade de busca será implementada em breve. Por ora, use o botão "Adicionar Manual" para simular a adição de conteúdos.
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : catalogueId ? "Atualizar" : "Criar"} Catálogo
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}