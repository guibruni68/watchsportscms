import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AICarouselModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigGenerated: (config: any) => void;
  availableTeams?: any[];
  availableCatalogues?: any[];
  availablePlayers?: any[];
  availableChampionships?: any[];
  availableBanners?: any[];
}

const examplePrompts = [
  "Carrossel default com jogadores do Flamengo ordenados por mais recentes",
  "Banner hero com últimas notícias e vídeos",
  "Carrossel highlight com campeonatos ativos",
  "Carrossel vertical com os 5 melhores jogadores",
  "Carrossel manual com banners promocionais"
];

export function AICarouselModal({
  open,
  onOpenChange,
  onConfigGenerated,
  availableTeams = [],
  availableCatalogues = [],
  availablePlayers = [],
  availableChampionships = [],
  availableBanners = []
}: AICarouselModalProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma descrição do carrossel",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-carousel-config", {
        body: {
          prompt,
          availableTeams,
          availableCatalogues,
          availablePlayers,
          availableChampionships,
          availableBanners
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      console.log("AI generated config:", data.config);

      toast({
        title: "Configuração gerada!",
        description: data.config.explanation || "Carrossel configurado com sucesso",
      });

      onConfigGenerated(data.config);
      onOpenChange(false);
      setPrompt("");
    } catch (error) {
      console.error("Error generating carousel config:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível gerar a configuração",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ask AI - Gerar Configuração de Carrossel
          </DialogTitle>
          <DialogDescription>
            Descreva o tipo de carrossel que você quer criar e a AI irá configurar automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Descreva seu carrossel</label>
            <Textarea
              placeholder="Ex: Quero um carrossel default mostrando jogadores do Flamengo ordenados por mais assistidos..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Exemplos:</label>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(example)}
                  disabled={loading}
                  className="text-xs h-auto py-2 px-3"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Configuração
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
