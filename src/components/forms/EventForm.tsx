import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Save, AlertCircle, CalendarIcon, Clock, Upload, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface EventFormData {
  type: "jogo" | "treino" | "coletiva" | ""
  title: string
  date: Date | undefined
  time: string
  description: string
  status: "planejado" | "concluido"
  imagemCapa: string
  generos: string[]
  tag: string
}

interface EventFormProps {
  initialData?: {
    id: string
    type: "jogo" | "treino" | "coletiva"
    title: string
    datetime: string
    description: string
    status: "planejado" | "concluido"
    imagemCapa?: string
    generos?: string[]
    tag?: string
  } | null
  isEdit?: boolean
  onClose: () => void
}

export function EventForm({ initialData, isEdit, onClose }: EventFormProps) {
  // Parse initial datetime if provided
  const initialDate = initialData?.datetime ? new Date(initialData.datetime) : undefined
  const initialTime = initialData?.datetime ? format(new Date(initialData.datetime), "HH:mm") : ""
  
  const [formData, setFormData] = useState<EventFormData>({
    type: initialData?.type || "",
    title: initialData?.title || "",
    date: initialDate,
    time: initialTime,
    description: initialData?.description || "",
    status: initialData?.status || "planejado",
    imagemCapa: initialData?.imagemCapa || "",
    generos: initialData?.generos || [],
    tag: initialData?.tag || ""
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.type) {
      newErrors.type = "Tipo do evento é obrigatório"
    }
    
    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório"
    }
    
    if (!formData.date) {
      newErrors.date = "Data é obrigatória"
    }
    
    if (!formData.time) {
      newErrors.time = "Hora é obrigatória"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: isEdit ? "Evento atualizado" : "Evento criado",
        description: isEdit ? "O evento foi atualizado com sucesso." : "O novo evento foi criado com sucesso.",
      })
      
      onClose()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o evento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generos = [
    "Futebol Profissional",
    "Categorias de Base",
    "Futebol Feminino",
    "Eventos Especiais",
    "Amistosos",
    "Competições Oficiais"
  ]

  const tagsPreConfiguradas = [
    "Destaque",
    "Importante",
    "Oficial",
    "Especial",
    "Clássico",
    "Derby"
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Editar Evento" : "Novo Evento"}
        </h1>
        <p className="text-muted-foreground">
          {isEdit ? "Modifique os dados do evento" : "Cadastre um novo evento na agenda"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo do Evento</Label>
                <Select value={formData.type} onValueChange={(value: "jogo" | "treino" | "coletiva") => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jogo">Jogo</SelectItem>
                    <SelectItem value="treino">Treino</SelectItem>
                    <SelectItem value="coletiva">Coletiva</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.type}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: "planejado" | "concluido") => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejado">Planejado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Jogo contra o Rival FC"
                />
                {errors.title && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.title}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="generos">Gêneros</Label>
                  <div className="space-y-4">
                    <Select onValueChange={(value) => {
                      if (!formData.generos?.includes(value)) {
                        setFormData(prev => ({ ...prev, generos: [...(prev.generos || []), value] }));
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar gêneros" />
                      </SelectTrigger>
                      <SelectContent>
                        {generos
                          .filter(genero => !formData.generos?.includes(genero))
                          .map((genero) => (
                          <SelectItem key={genero} value={genero}>
                            {genero}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.generos && formData.generos.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.generos.map((genero) => (
                          <Badge key={genero} variant="secondary" className="flex items-center gap-1">
                            {genero}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  generos: prev.generos?.filter(g => g !== genero) || [] 
                                }));
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tag">Tag</Label>
                  <Select value={formData.tag} onValueChange={(value) => setFormData(prev => ({ ...prev, tag: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tagsPreConfiguradas.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.time && "text-muted-foreground"
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {formData.time ? formData.time : "Selecionar hora"}
                    </Button>
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
                                onClick={() => setFormData(prev => ({ ...prev, time: timeString }))}
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
                {errors.time && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.time}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagemCapa">Imagem de Capa</Label>
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
                        setFormData(prev => ({ ...prev, imagemCapa: url }));
                      }
                    }}
                  />
                </div>
                {formData.imagemCapa && (
                  <div className="relative">
                    <img 
                      src={formData.imagemCapa} 
                      alt="Capa do evento" 
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ ...prev, imagemCapa: "" }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva os detalhes do evento..."
                rows={4}
              />
              {errors.description && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEdit ? "Atualizar" : "Criar"} Evento
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}