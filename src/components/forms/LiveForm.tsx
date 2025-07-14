import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const liveSchema = z.object({
  nomeEvento: z.string().min(1, "Nome do evento é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  dataHora: z.string().min(1, "Data e hora são obrigatórias"),
  status: z.string().min(1, "Status é obrigatório"),
  playerEmbed: z.string().optional(),
})

type LiveFormData = z.infer<typeof liveSchema>

interface LiveFormProps {
  initialData?: Partial<LiveFormData>
  isEdit?: boolean
}

export function LiveForm({ initialData, isEdit = false }: LiveFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<LiveFormData>({
    resolver: zodResolver(liveSchema),
    defaultValues: {
      nomeEvento: initialData?.nomeEvento || "",
      descricao: initialData?.descricao || "",
      dataHora: initialData?.dataHora || "",
      status: initialData?.status || "",
      playerEmbed: initialData?.playerEmbed || "",
    },
  })

  const onSubmit = (data: LiveFormData) => {
    console.log("Salvando live:", data)
    
    toast({
      title: isEdit ? "Live atualizada!" : "Live criada!",
      description: `${data.nomeEvento} foi ${isEdit ? "atualizada" : "criada"} com sucesso.`,
    })
    
    navigate("/lives")
  }

  const statusOptions = [
    { value: "em_breve", label: "Em Breve" },
    { value: "ao_vivo", label: "Ao Vivo" },
    { value: "encerrado", label: "Encerrado" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/lives")}
          className="text-muted-foreground hover:text-foreground"
        >
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
                <FormField
                  control={form.control}
                  name="nomeEvento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Evento *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Final do Campeonato Estadual" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o evento..."
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataHora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playerEmbed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Embed do Player</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Cole aqui o código embed do YouTube, Twitch ou outro player..."
                        className="min-h-24 font-mono text-sm"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  {isEdit ? "Atualizar Live" : "Criar Live"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/lives")}
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