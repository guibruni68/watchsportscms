import { useState } from "react"
import { useCustomization } from "@/hooks/useCustomization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StreamingPreview } from "@/components/customization/StreamingPreview"
import { 
  Palette, 
  Upload, 
  Save,
  Eye,
  RefreshCw,
  Image,
  Type,
  Monitor,
  Smartphone
} from "lucide-react"

export default function CustomizationPage() {
  const { settings, updateSettings, saveSettings } = useCustomization()
  const { primaryColor, secondaryColor, clubName, clubDescription, logoUrl } = settings

  const colorPresets = [
    { name: "Azul Clássico", primary: "#3b82f6", secondary: "#10b981" },
    { name: "Verde Floresta", primary: "#059669", secondary: "#0891b2" },
    { name: "Vermelho Paixão", primary: "#dc2626", secondary: "#ea580c" },
    { name: "Roxo Moderno", primary: "#7c3aed", secondary: "#c026d3" },
    { name: "Laranja Vibrante", primary: "#ea580c", secondary: "#eab308" },
    { name: "Azul Marinho", primary: "#1e40af", secondary: "#0f766e" }
  ]

  const handleColorPreset = (preset: { primary: string; secondary: string }) => {
    updateSettings({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    })
  }

  const handleSave = async () => {
    try {
      await saveSettings()
      // Aqui você pode adicionar uma notificação de sucesso
      console.log("Configurações salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Personalização Visual</h1>
          <p className="text-muted-foreground">Customize a identidade visual do seu clube</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button className="bg-gradient-primary transition-all" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Upload */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="h-5 w-5" />
                Logo do Clube
              </CardTitle>
              <CardDescription>
                Faça upload do logo oficial do seu clube
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-28 h-28 object-contain" />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Clique para enviar</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Logo
                </Button>
                {logoUrl && (
                  <Button variant="outline" onClick={() => updateSettings({ logoUrl: "" })}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: PNG, JPG, SVG. Tamanho máximo: 2MB. 
                Recomendado: 512x512px ou formato quadrado.
              </p>
            </CardContent>
          </Card>

          {/* Club Information */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Type className="h-5 w-5" />
                Informações do Clube
              </CardTitle>
              <CardDescription>
                Configure o nome e descrição do clube
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clubName">Nome do Clube</Label>
                <Input
                  id="clubName"
                  value={clubName}
                  onChange={(e) => updateSettings({ clubName: e.target.value })}
                  placeholder="Digite o nome do clube"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clubDescription">Descrição</Label>
                <Textarea
                  id="clubDescription"
                  value={clubDescription}
                  onChange={(e) => updateSettings({ clubDescription: e.target.value })}
                  placeholder="Descreva seu clube em poucas palavras"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Esta descrição aparecerá na página inicial e em materiais promocionais.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Cores do Tema
              </CardTitle>
              <CardDescription>
                Personalize as cores principais da identidade visual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Presets */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Paletas Prontas</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {colorPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex flex-col gap-2"
                      onClick={() => handleColorPreset(preset)}
                    >
                      <div className="flex gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border border-border"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-6 h-6 rounded-full border border-border"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cor principal para botões, links e destaques
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                      placeholder="#10b981"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cor para elementos de apoio e badges
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Pré-visualização Desktop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StreamingPreview type="desktop" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Pré-visualização Mobile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StreamingPreview type="mobile" />
            </CardContent>
          </Card>

          {/* Save Reminder */}
          <Card className="bg-gradient-card border-border/50 border-warning/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                  <Save className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-sm">Lembre-se de salvar</p>
                  <p className="text-xs text-muted-foreground">
                    As alterações só serão aplicadas após salvar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}