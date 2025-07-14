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

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título deve ter no máximo 100 caracteres"),
  contentSource: z.enum(["agent", "genre", "recommendations", "manual"]),
  type: z.enum(["horizontal", "grid", "slider"]),
  order: z.number().min(1, "Ordem deve ser maior que 0").max(100, "Ordem deve ser menor que 100"),
  status: z.boolean(),
  showMoreButton: z.boolean(),
  // Campos condicionais
  agentType: z.string().optional(),
  agentId: z.string().optional(),
  genreType: z.string().optional(),
  algorithmType: z.string().optional(),
  manualContent: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CarouselFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export function CarouselForm({ initialData, onSubmit, onCancel }: CarouselFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      contentSource: initialData?.contentSource || "agent",
      type: initialData?.type || "horizontal", 
      order: initialData?.order || 1,
      status: initialData?.status === "active" || !initialData,
      showMoreButton: initialData?.showMoreButton || false,
      agentType: initialData?.agentType || "",
      agentId: initialData?.agentId || "",
      genreType: initialData?.genreType || "",
      algorithmType: initialData?.algorithmType || "",
      manualContent: initialData?.manualContent || [],
    },
  });

  const contentSource = form.watch("contentSource");

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

          <FormField
            control={form.control}
            name="type"
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

        {/* Campos condicionais baseados na fonte de conteúdo */}
        {contentSource === "agent" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="agentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Agente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField
              control={form.control}
              name="agentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecionar Agente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o agente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="agent1">João Silva (Jogador)</SelectItem>
                      <SelectItem value="agent2">Carlos Santos (Técnico)</SelectItem>
                      <SelectItem value="agent3">Flamengo (Time)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
  );
}