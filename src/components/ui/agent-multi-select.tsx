import { useState, useMemo, useRef, useEffect } from "react";
import { User, Users, Search, Plus, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface Agent {
  id: string;
  nome: string;
  tipo: "jogador" | "time";
  number?: number;
}

interface AgentMultiSelectProps {
  players: Array<{
    id: string;
    name: string;
    number?: number;
  }>;
  teams: Array<{
    id: string;
    name: string;
  }>;
  value: Agent[];
  onChange: (agents: Agent[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AgentMultiSelect({
  players,
  teams,
  value = [],
  onChange,
  placeholder = "Buscar e selecionar agentes...",
  disabled = false,
}: AgentMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);

  // Atualizar largura do popover quando abrir
  useEffect(() => {
    if (open && triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  // Combinar jogadores e times em uma lista unificada
  const allAgents = useMemo(() => {
    const agentsList: Array<{
      id: string;
      nome: string;
      tipo: "jogador" | "time";
      number?: number;
      searchText: string;
    }> = [
      ...players.map((player) => ({
        id: player.id,
        nome: player.name,
        tipo: "jogador" as const,
        number: player.number,
        searchText: `${player.name} ${player.number ? `#${player.number}` : ""} jogador`.toLowerCase(),
      })),
      ...teams.map((team) => ({
        id: team.id,
        nome: team.name,
        tipo: "time" as const,
        searchText: `${team.name} time`.toLowerCase(),
      })),
    ];

    // Filtrar agentes já adicionados
    return agentsList.filter(
      (agent) => !value.find((added) => added.id === agent.id)
    );
  }, [players, teams, value]);

  // Filtrar agentes baseado na busca
  const filteredAgents = useMemo(() => {
    if (!search.trim()) return allAgents;

    const searchLower = search.toLowerCase();
    return allAgents.filter((agent) =>
      agent.searchText.includes(searchLower)
    );
  }, [allAgents, search]);

  // Agrupar por tipo
  const groupedAgents = useMemo(() => {
    const jogadores = filteredAgents.filter((a) => a.tipo === "jogador");
    const times = filteredAgents.filter((a) => a.tipo === "time");
    return { jogadores, times };
  }, [filteredAgents]);

  const handleSelect = (agentId: string) => {
    setSelectedId(agentId);
  };

  const handleAdd = () => {
    if (!selectedId) return;

    const agent = allAgents.find((a) => a.id === selectedId);
    if (agent) {
      const newAgent: Agent = {
        id: agent.id,
        nome: agent.nome,
        tipo: agent.tipo,
        ...(agent.number && { number: agent.number }),
      };
      onChange([...value, newAgent]);
      setSelectedId(null);
      setSearch("");
    }
  };

  const handleRemove = (agentId: string) => {
    onChange(value.filter((agent) => agent.id !== agentId));
  };

  const selectedAgent = selectedId
    ? allAgents.find((a) => a.id === selectedId)
    : null;

  return (
    <div className="space-y-4">
      {/* Campo de busca e seleção */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between h-auto min-h-[52px]"
          >
            <div className="flex items-center gap-2 flex-1 text-left">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">
                {placeholder}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 flex flex-col" 
          align="start" 
          sideOffset={4}
          style={{
            width: popoverWidth ? `${popoverWidth}px` : undefined,
            maxHeight: '70vh'
          }}
        >
          <Command className="flex flex-col">
            <CommandInput
              placeholder="Buscar jogadores ou times..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-[250px] overflow-y-auto flex-1">
              <CommandEmpty>Nenhum agente encontrado.</CommandEmpty>

              {/* Grupo de Jogadores */}
              {groupedAgents.jogadores.length > 0 && (
                <CommandGroup heading="Jogadores">
                  {groupedAgents.jogadores.map((agent) => {
                    const isSelected = selectedId === agent.id;
                    return (
                      <CommandItem
                        key={`jogador-${agent.id}`}
                        value={agent.id}
                        onSelect={() => handleSelect(agent.id)}
                        className={cn(
                          "cursor-pointer",
                          isSelected && "bg-primary/10"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/50"
                              )}
                            >
                              {isSelected && (
                                <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <User className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {agent.nome}
                                {agent.number && (
                                  <span className="text-muted-foreground ml-1">
                                    #{agent.number}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {/* Grupo de Times */}
              {groupedAgents.times.length > 0 && (
                <CommandGroup heading="Times">
                  {groupedAgents.times.map((agent) => {
                    const isSelected = selectedId === agent.id;
                    return (
                      <CommandItem
                        key={`time-${agent.id}`}
                        value={agent.id}
                        onSelect={() => handleSelect(agent.id)}
                        className={cn(
                          "cursor-pointer",
                          isSelected && "bg-primary/10"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/50"
                              )}
                            >
                              {isSelected && (
                                <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {agent.nome}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>

          {/* Botão de adicionar - sempre visível quando há seleção */}
          {selectedAgent && (
            <div className="border-t p-3 bg-muted/30 shrink-0">
              <Button
                type="button"
                onClick={handleAdd}
                className="w-full"
                disabled={!selectedId}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar {selectedAgent.tipo === "jogador" ? "Jogador" : "Time"}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Lista de agentes adicionados */}
      {value.length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">
              Agentes Selecionados ({value.length})
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              className="text-destructive hover:text-destructive h-auto py-1 px-2 text-xs"
            >
              Limpar todos
            </Button>
          </div>
          <div className="space-y-2">
            {value.map((agent, index) => (
              <div
                key={`${agent.id}-${index}`}
                className="flex items-center justify-between p-3 bg-background border rounded-md hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {agent.tipo === "jogador" ? (
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {agent.nome}
                      {agent.number && (
                        <span className="text-muted-foreground ml-1">
                          #{agent.number}
                        </span>
                      )}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs mt-1"
                    >
                      {agent.tipo === "jogador" ? "Jogador" : "Time"}
                    </Badge>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(agent.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

