import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, AlertCircle, Upload } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PlayerFormData {
  name: string
  position: string
  number: string
  photo: File | null
  bio: string
  status: "active" | "inactive"
  teamId: string
}

interface PlayerFormProps {
  initialData?: {
    id: string
    name: string
    position: string
    number: number
    avatar_url?: string
    bio?: string
    status: "active" | "inactive"
    team_id: string
  } | null
  isEdit?: boolean
  onClose: () => void
}

export function PlayerForm({ initialData, isEdit, onClose }: PlayerFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<PlayerFormData>({
    name: initialData?.name || "",
    position: initialData?.position || "",
    number: initialData?.number?.toString() || "",
    photo: null,
    bio: initialData?.bio || "",
    status: initialData?.status || "active",
    teamId: initialData?.team_id || ""
  })
  
  const [errors, setErrors] = useState<Partial<PlayerFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<PlayerFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome do jogador é obrigatório"
    }
    
    if (!formData.position) {
      newErrors.position = "Posição é obrigatória"
    }
    
    if (!formData.number.trim()) {
      newErrors.number = "Número da camisa é obrigatório"
    } else if (isNaN(Number(formData.number)) || Number(formData.number) < 1 || Number(formData.number) > 99) {
      newErrors.number = "Número deve ser entre 1 e 99"
    }
    
    if (!formData.teamId) {
      newErrors.teamId = "Time é obrigatório"
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
        title: isEdit ? "Jogador atualizado" : "Jogador criado",
        description: isEdit ? "O jogador foi atualizado com sucesso." : "O novo jogador foi criado com sucesso.",
      })
      
      onClose()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o jogador. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }))
    }
  }

  // Mock teams data
  const mockTeams = [
    { id: "1", name: "City Sparks FC - Profissional" },
    { id: "2", name: "City Sparks FC - Sub-20" },
    { id: "3", name: "City Sparks FC - Feminino" }
  ]

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
            {isEdit ? "Editar Jogador" : "Novo Jogador"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Modifique os dados do jogador" : "Cadastre um novo jogador"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Jogador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Jogador</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Marcus Johnson"
                />
                {errors.name && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Posição</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goleiro">Goleiro</SelectItem>
                    <SelectItem value="zagueiro">Zagueiro</SelectItem>
                    <SelectItem value="lateral-direito">Lateral Direito</SelectItem>
                    <SelectItem value="lateral-esquerdo">Lateral Esquerdo</SelectItem>
                    <SelectItem value="volante">Volante</SelectItem>
                    <SelectItem value="meia">Meia</SelectItem>
                    <SelectItem value="atacante">Atacante</SelectItem>
                  </SelectContent>
                </Select>
                {errors.position && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.position}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número da Camisa</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="Ex: 10"
                  type="number"
                  min="1"
                  max="99"
                />
                {errors.number && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.number}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamId">Time</Label>
                <Select value={formData.teamId} onValueChange={(value) => setFormData(prev => ({ ...prev, teamId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o time" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.teamId && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.teamId}
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
                <Label htmlFor="photo">Foto do Jogador</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="photo"
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
                {formData.photo && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo selecionado: {formData.photo.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio/Resumo</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Breve descrição sobre o jogador, suas características e experiência..."
                rows={4}
              />
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
                    {isEdit ? "Atualizar" : "Criar"} Jogador
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