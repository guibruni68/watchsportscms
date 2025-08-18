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
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const catalogueSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  tipo_catalogo: z.enum(["serie", "colecao", "playlist", "outro"]),
  status: z.boolean(),
  ordem_exibicao: z.number().min(0),
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