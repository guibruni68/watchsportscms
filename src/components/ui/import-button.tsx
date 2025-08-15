import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, X, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImportButtonProps {
  entityName: string; // Nome da entidade (ex: "banners", "times", "jogadores")
  onImport?: (file: File) => void;
  templateUrl?: string; // URL para download do template
}

export function ImportButton({ entityName, onImport, templateUrl }: ImportButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é um arquivo Excel/CSV
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    try {
      // Simular processamento da importação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onImport) {
        onImport(selectedFile);
      }
      
      toast({
        title: "Importação realizada",
        description: `Dados de ${entityName} importados com sucesso.`,
      });
      
      setOpen(false);
      setSelectedFile(null);
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao processar o arquivo. Verifique o formato e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    if (templateUrl) {
      window.open(templateUrl, '_blank');
    } else {
      toast({
        title: "Template disponível em breve",
        description: "O template de importação estará disponível em breve.",
      });
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Importar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar {entityName}</DialogTitle>
          <DialogDescription>
            Faça upload de uma planilha Excel ou CSV para importar múltiplos registros de {entityName} de uma vez.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Botão para baixar template */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Template de importação</p>
                <p className="text-xs text-muted-foreground">
                  Baixe o modelo para preencher os dados
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-3 w-3" />
              Baixar
            </Button>
          </div>

          {/* Upload de arquivo */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Selecionar arquivo</Label>
            {selectedFile ? (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                <span className="flex-1 text-sm font-medium truncate">
                  {selectedFile.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeSelectedFile}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        Clique para selecionar arquivo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Excel (.xlsx, .xls) ou CSV
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}