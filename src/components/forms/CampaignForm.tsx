import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CampaignFormData {
  name: string
  type: "banner" | "video" | "conteudo_destacado" | ""
  status: "active" | "inactive"
  startDate: string
  endDate: string
  associations: string[]
  allowPreview: boolean
}

interface CampaignFormProps {
  initialData?: {
    id: string
    name: string
    type: "banner" | "video" | "conteudo_destacado"
    status: "active" | "inactive"
    startDate: string
    endDate: string
    associations: string[]
    allowPreview: boolean
  } | null
  isEdit?: boolean
  onClose: () => void
}

export function CampaignForm({ initialData, isEdit, onClose }: CampaignFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<CampaignFormData>({
    name: initialData?.name || "",
    type: initialData?.type || "",
    status: initialData?.status || "active",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    associations: initialData?.associations || [],
    allowPreview: initialData?.allowPreview || false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome da campanha é obrigatório"
    }
    
    if (!formData.type) {
      newErrors.type = "Tipo é obrigatório"
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "Data de início é obrigatória"
    }
    
    if (!formData.endDate) {
      newErrors.endDate = "Data de fim é obrigatória"
    }
    
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "Data de fim deve ser posterior à data de início"
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
        title: isEdit ? "Campanha atualizada" : "Campanha criada",
        description: isEdit ? "A campanha foi atualizada com sucesso." : "A nova campanha foi criada com sucesso.",
      })
      
      onClose()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a campanha. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssociationToggle = (association: string) => {
    setFormData(prev => ({
      ...prev,
      associations: prev.associations.includes(association)
        ? prev.associations.filter(a => a !== association)
        : [...prev.associations, association]
    }))
  }

  const availableAssociations = [
    "final-campeonato",
    "ingressos",
    "apresentacao-elenco",
    "time-feminino",
    "novo-tecnico",
    "centro-treinamento"
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Editar Campanha" : "Nova Campanha"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Modifique os dados da campanha" : "Crie uma nova campanha publicitária"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Campanha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Campanha</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Campanha Final do Campeonato"
                />
                {errors.name && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value: "banner" | "video" | "conteudo_destacado") => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="conteudo_destacado">Conteúdo Destacado</SelectItem>
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
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
                {errors.startDate && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.startDate}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
                {errors.endDate && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.endDate}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowPreview"
                    checked={formData.allowPreview}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowPreview: checked as boolean }))}
                  />
                  <Label htmlFor="allowPreview">Permitir preview</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Associações (Conteúdos Relacionados)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableAssociations.map((association) => (
                  <div key={association} className="flex items-center space-x-2">
                    <Checkbox
                      id={association}
                      checked={formData.associations.includes(association)}
                      onCheckedChange={() => handleAssociationToggle(association)}
                    />
                    <Label htmlFor={association} className="text-sm">
                      {association.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
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
                    {isEdit ? "Atualizar" : "Criar"} Campanha
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