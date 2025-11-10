import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getActiveCollections } from "@/data/mockCatalogues";
import CollectionForm from "@/components/forms/CollectionForm";

interface Collection {
  id: string;
  titulo: string;
  tipo_catalogo: string;
  status: boolean;
}

interface CollectionSelectorProps {
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

export function CollectionSelector({ value, onValueChange, placeholder = "Selecionar coleção...", disabled }: CollectionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  const selectedCollection = collections.find(collection => collection.id === value);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = getActiveCollections();
      setCollections(data);
    } catch (error) {
      console.error('Erro ao buscar coleções:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleNewCollectionSuccess = () => {
    setShowNewForm(false);
    fetchCollections(); // Recarregar lista
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
            {selectedCollection ? (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="truncate">{selectedCollection.titulo}</span>
                <Badge variant="secondary" className="text-xs">
                  {tipoLabels[selectedCollection.tipo_catalogo as keyof typeof tipoLabels]}
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
            <CommandInput placeholder="Buscar coleção..." />
            <CommandList>
              <CommandEmpty>
                {loading ? "Carregando..." : "Nenhuma coleção encontrada."}
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
                  Nenhuma coleção
                </CommandItem>
                {collections.map((collection) => (
                  <CommandItem
                    key={collection.id}
                    value={collection.titulo}
                    onSelect={() => {
                      onValueChange(collection.id === value ? undefined : collection.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === collection.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Tag className="h-4 w-4" />
                      <span className="truncate">{collection.titulo}</span>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {tipoLabels[collection.tipo_catalogo as keyof typeof tipoLabels]}
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
                      Criar nova coleção
                    </CommandItem>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Coleção</DialogTitle>
                    </DialogHeader>
                    <CollectionForm 
                      isInline={true}
                      onSuccess={handleNewCollectionSuccess}
                    />
                  </DialogContent>
                </Dialog>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Mostrar coleção selecionada */}
      {selectedCollection && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span>Coleção: {selectedCollection.titulo}</span>
          <Badge variant="outline" className="text-xs">
            {tipoLabels[selectedCollection.tipo_catalogo as keyof typeof tipoLabels]}
          </Badge>
        </div>
      )}
    </div>
  );
}