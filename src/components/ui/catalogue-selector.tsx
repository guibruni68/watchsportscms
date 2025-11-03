import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getActiveCatalogues } from "@/data/mockCatalogues";
import CatalogueForm from "@/components/forms/CatalogueForm";

interface Catalogue {
  id: string;
  titulo: string;
  tipo_catalogo: string;
  status: boolean;
}

interface CatalogueSelectorProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

const tipoLabels = {
  serie: "Série",
  colecao: "Coleção", 
  playlist: "Playlist",
  outro: "Outro"
};

export function CatalogueSelector({ value, onValueChange, placeholder = "Selecionar catálogo...", disabled }: CatalogueSelectorProps) {
  const [open, setOpen] = useState(false);
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  const selectedCatalogue = catalogues.find(catalogue => catalogue.id === value);

  const fetchCatalogues = async () => {
    setLoading(true);
    try {
      const data = getActiveCatalogues();
      setCatalogues(data);
    } catch (error) {
      console.error('Erro ao buscar catálogos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const handleNewCatalogueSuccess = () => {
    setShowNewForm(false);
    fetchCatalogues(); // Recarregar lista
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedCatalogue ? (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="truncate">{selectedCatalogue.titulo}</span>
                <Badge variant="secondary" className="text-xs">
                  {tipoLabels[selectedCatalogue.tipo_catalogo as keyof typeof tipoLabels]}
                </Badge>
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar catálogo..." />
            <CommandList>
              <CommandEmpty>
                {loading ? "Carregando..." : "Nenhum catálogo encontrado."}
              </CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value=""
                  onSelect={() => {
                    onValueChange(undefined);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Nenhum catálogo
                </CommandItem>
                {catalogues.map((catalogue) => (
                  <CommandItem
                    key={catalogue.id}
                    value={catalogue.titulo}
                    onSelect={() => {
                      onValueChange(catalogue.id === value ? undefined : catalogue.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === catalogue.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Tag className="h-4 w-4" />
                      <span className="truncate">{catalogue.titulo}</span>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {tipoLabels[catalogue.tipo_catalogo as keyof typeof tipoLabels]}
                      </Badge>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
                  <DialogTrigger asChild>
                    <CommandItem
                      value="__create_new__"
                      onSelect={() => setShowNewForm(true)}
                      className="text-primary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar novo catálogo
                    </CommandItem>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Catálogo</DialogTitle>
                    </DialogHeader>
                    <CatalogueForm 
                      isInline={true}
                      onSuccess={handleNewCatalogueSuccess}
                    />
                  </DialogContent>
                </Dialog>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Mostrar catálogo selecionado */}
      {selectedCatalogue && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span>Catálogo: {selectedCatalogue.titulo}</span>
          <Badge variant="outline" className="text-xs">
            {tipoLabels[selectedCatalogue.tipo_catalogo as keyof typeof tipoLabels]}
          </Badge>
        </div>
      )}
    </div>
  );
}