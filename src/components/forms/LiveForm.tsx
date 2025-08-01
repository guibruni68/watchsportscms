import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, CalendarIcon, Clock, Upload, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

const liveSchema = z.object({
  nomeEvento: z.string().min(1, "Nome do evento é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  data: z.date(),
  hora: z.string().min(1, "Hora é obrigatória"),
  status: z.string().min(1, "Status é obrigatório"),
  playerEmbed: z.string().optional(),
  imagemCapa: z.string().optional(),
})

type LiveFormData = z.infer<typeof liveSchema>

interface LiveFormProps {
  initialData?: {
    nomeEvento?: string
    descricao?: string
    dataHora?: string
    status?: string
    playerEmbed?: string
    imagemCapa?: string
  }
  isEdit?: boolean
}

export function LiveForm({ initialData, isEdit = false }: LiveFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Parse initial datetime if provided
  const initialDate = initialData?.dataHora ? new Date(initialData.dataHora) : undefined
  const initialTime = initialData?.dataHora ? format(new Date(initialData.dataHora), "HH:mm") : ""

  const form = useForm<LiveFormData>({
    resolver: zodResolver(liveSchema),
    defaultValues: {
      nomeEvento: initialData?.nomeEvento || "",
      descricao: initialData?.descricao || "",
      data: initialDate,
      hora: initialTime,
      status: initialData?.status || "",
      playerEmbed: initialData?.playerEmbed || "",
      imagemCapa: initialData?.imagemCapa || "",
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
                <div className="space-y-6">
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
                                alt="Capa da transmissão" 
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
                        placeholder="Descreva o evento..."
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
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal w-full",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione a data</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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