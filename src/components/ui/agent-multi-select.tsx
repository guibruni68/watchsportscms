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
  name: string;
  type: "agent" | "group";
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
  placeholder = "Search and select agents...",
  disabled = false,
}: AgentMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);

  // Update popover width when opened
  useEffect(() => {
    if (open && triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  // Combine players and teams into a unified list
  const allAgents = useMemo(() => {
    const agentsList: Array<{
      id: string;
      name: string;
      type: "agent" | "group";
      number?: number;
      searchText: string;
    }> = [
      ...players.map((player) => ({
        id: player.id,
        name: player.name,
        type: "agent" as const,
        number: player.number,
        searchText: `${player.name} ${player.number ? `#${player.number}` : ""} agent`.toLowerCase(),
      })),
      ...teams.map((team) => ({
        id: team.id,
        name: team.name,
        type: "group" as const,
        searchText: `${team.name} group`.toLowerCase(),
      })),
    ];

    // Filter already added agents
    return agentsList.filter(
      (agent) => !value.find((added) => added.id === agent.id)
    );
  }, [players, teams, value]);

  // Filter agents based on search
  const filteredAgents = useMemo(() => {
    if (!search.trim()) return allAgents;

    const searchLower = search.toLowerCase();
    return allAgents.filter((agent) =>
      agent.searchText.includes(searchLower)
    );
  }, [allAgents, search]);

  // Group by type
  const groupedAgents = useMemo(() => {
    const agents = filteredAgents.filter((a) => a.type === "agent");
    const groups = filteredAgents.filter((a) => a.type === "group");
    return { agents, groups };
  }, [filteredAgents]);

  const handleSelect = (agentId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });
  };

  const handleAdd = () => {
    if (selectedIds.length === 0) return;

    const agentsToAdd = allAgents.filter((a) => selectedIds.includes(a.id));
    const newAgents: Agent[] = agentsToAdd.map(agent => ({
      id: agent.id,
      name: agent.name,
      type: agent.type,
      ...(agent.number && { number: agent.number }),
    }));
    
    onChange([...value, ...newAgents]);
    setSelectedIds([]);
    setSearch("");
  };

  const handleRemove = (agentId: string) => {
    onChange(value.filter((agent) => agent.id !== agentId));
  };

  return (
    <div className="space-y-4">
      {/* Search and selection field */}
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
              placeholder="Search agents or groups..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-[250px] overflow-y-auto flex-1">
              <CommandEmpty>No agents found.</CommandEmpty>

              {/* Agents Group */}
              {groupedAgents.agents.length > 0 && (
                <CommandGroup heading="Agents">
                  {groupedAgents.agents.map((agent) => {
                    const isSelected = selectedIds.includes(agent.id);
                    return (
                      <CommandItem
                        key={`agent-${agent.id}`}
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
                                "w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all shrink-0",
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
                                {agent.name}
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

              {/* Groups Group */}
              {groupedAgents.groups.length > 0 && (
                <CommandGroup heading="Groups">
                  {groupedAgents.groups.map((agent) => {
                    const isSelected = selectedIds.includes(agent.id);
                    return (
                      <CommandItem
                        key={`group-${agent.id}`}
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
                                "w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all shrink-0",
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
                                {agent.name}
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

          {/* Add button - always visible when there's a selection */}
          {selectedIds.length > 0 && (
            <div className="border-t p-3 bg-muted/30 shrink-0">
              <Button
                type="button"
                onClick={handleAdd}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {selectedIds.length} {selectedIds.length === 1 ? "Item" : "Items"}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* List of added agents */}
      {value.length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">
              Selected Agents ({value.length})
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              className="text-destructive hover:text-destructive h-auto py-1 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
          <div className="space-y-2">
            {value.map((agent, index) => (
              <div
                key={`${agent.id}-${index}`}
                className="flex items-center justify-between p-3 bg-background border rounded-md hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {agent.type === "agent" ? (
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {agent.name}
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
                      {agent.type === "agent" ? "Agent" : "Group"}
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

