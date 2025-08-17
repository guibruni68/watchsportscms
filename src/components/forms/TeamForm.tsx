import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, AlertCircle, Upload } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface TeamFormData {
  name: string
  logo: File | null
  city: string
  category: string
}

interface TeamFormProps {
  initialData?: {
    id: string
    name: string
    logo_url?: string
    city: string
    category: string
  } | null
  isEdit?: boolean
  onClose: () => void
}

export function TeamForm({ initialData, isEdit, onClose }: TeamFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<TeamFormData>({
    name: initialData?.name || "",
    logo: null,
    city: initialData?.city || "",
    category: initialData?.category || ""
  })
  
  const [errors, setErrors] = useState<Partial<TeamFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<TeamFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome do time é obrigatório"
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "Cidade é obrigatória"
    }
    
    if (!formData.category) {
      newErrors.category = "Categoria é obrigatória"
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
        title: isEdit ? "Time atualizado" : "Time criado",
        description: isEdit ? "O time foi atualizado com sucesso." : "O novo time foi criado com sucesso.",
      })
      
      onClose()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o time. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Editar Time" : "Novo Time"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Modifique os dados do time" : "Cadastre um novo time"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Time</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Time</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: City Sparks FC"
                />
                {errors.name && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Ex: São Paulo"
                />
                {errors.city && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.city}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profissional">Profissional</SelectItem>
                    <SelectItem value="sub-20">Sub-20</SelectItem>
                    <SelectItem value="sub-17">Sub-17</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="futsal">Futsal</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.category}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Escudo do Time</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                {formData.logo && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo selecionado: {formData.logo.name}
                  </p>
                )}
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
                    {isEdit ? "Atualizar" : "Criar"} Time
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