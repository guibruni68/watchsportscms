import { useState, useMemo } from "react";
import { User, Users, Plus, X, Mic, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface Agent {
  id: string;
  name: string;
  type: "agent" | "group";
  role?: "player" | "coach" | "writer";
  number?: number;
}

interface AgentOption {
  id: string;
  name: string;
  type: "agent" | "group";
  role?: "player" | "coach" | "writer";
  number?: number;
}

interface AgentMultiSelectProps {
  agents: AgentOption[];
  value: Agent[];
  onChange: (agents: Agent[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const roleLabels: Record<string, string> = {
  player: "Player",
  coach: "Coach",
  writer: "Writer",
};

const roleIcons: Record<string, React.ReactNode> = {
  player: <User className="h-3.5 w-3.5" />,
  coach: <Mic className="h-3.5 w-3.5" />,
  writer: <Pencil className="h-3.5 w-3.5" />,
};

export function AgentMultiSelect({
  agents,
  value = [],
  onChange,
  placeholder = "Search and select agents...",
  disabled = false,
}: AgentMultiSelectProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const availableAgents = useMemo(() => {
    return agents
      .filter((a) => !value.find((added) => added.id === a.id))
      .map((a) => ({
        ...a,
        searchText: `${a.name} ${a.role ?? ""} ${a.number ? `#${a.number}` : ""}`.toLowerCase(),
      }));
  }, [agents, value]);

  const filteredAgents = useMemo(() => {
    if (!search.trim()) return availableAgents;
    const searchLower = search.toLowerCase();
    return availableAgents.filter((a) => a.searchText.includes(searchLower));
  }, [availableAgents, search]);

  const grouped = useMemo(() => {
    return {
      players: filteredAgents.filter((a) => a.type === "agent" && a.role === "player"),
      coaches: filteredAgents.filter((a) => a.type === "agent" && a.role === "coach"),
      writers: filteredAgents.filter((a) => a.type === "agent" && a.role === "writer"),
      others: filteredAgents.filter((a) => a.type === "agent" && !a.role),
      groups: filteredAgents.filter((a) => a.type === "group"),
    };
  }, [filteredAgents]);

  const handleSelect = (agentId: string) => {
    setSelectedIds((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  };

  const handleAdd = () => {
    if (selectedIds.length === 0) return;
    const toAdd = availableAgents.filter((a) => selectedIds.includes(a.id));
    const newAgents: Agent[] = toAdd.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      role: a.role,
      ...(a.number !== undefined && { number: a.number }),
    }));
    onChange([...value, ...newAgents]);
    setSelectedIds([]);
    setSearch("");
  };

  const handleRemove = (agentId: string) => {
    onChange(value.filter((a) => a.id !== agentId));
  };

  function renderGroup(
    items: typeof filteredAgents,
    heading: string,
    icon: React.ReactNode
  ) {
    if (items.length === 0) return null;
    return (
      <CommandGroup heading={heading}>
        {items.map((agent) => {
          const isSelected = selectedIds.includes(agent.id);
          return (
            <CommandItem
              key={`${agent.type}-${agent.id}`}
              value={`${agent.id}-${heading}`}
              onSelect={() => handleSelect(agent.id)}
              className={cn("cursor-pointer", isSelected && "bg-primary/10")}
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    "w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all shrink-0",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/50"
                  )}
                />
                <span className="text-muted-foreground shrink-0">{icon}</span>
                <p className="text-sm font-medium truncate flex-1">
                  {agent.name}
                  {agent.number !== undefined && (
                    <span className="text-muted-foreground ml-1">#{agent.number}</span>
                  )}
                </p>
              </div>
            </CommandItem>
          );
        })}
      </CommandGroup>
    );
  }

  return (
    <div className="space-y-4">
      <Command shouldFilter={false} className="border rounded-md">
        <CommandInput
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
          disabled={disabled}
        />
        <CommandList className="max-h-[280px] overflow-y-auto">
          <CommandEmpty>No agents found.</CommandEmpty>
          {renderGroup(grouped.players, "Players", <User className="h-3.5 w-3.5" />)}
          {renderGroup(grouped.coaches, "Coaches", <Mic className="h-3.5 w-3.5" />)}
          {renderGroup(grouped.writers, "Writers", <Pencil className="h-3.5 w-3.5" />)}
          {renderGroup(grouped.others, "Agents", <User className="h-3.5 w-3.5" />)}
          {renderGroup(grouped.groups, "Groups", <Users className="h-3.5 w-3.5" />)}
        </CommandList>
        {selectedIds.length > 0 && (
          <div className="border-t p-3 bg-muted/30">
            <Button type="button" onClick={handleAdd} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add {selectedIds.length} {selectedIds.length === 1 ? "Item" : "Items"}
            </Button>
          </div>
        )}
      </Command>

      {value.length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Selected ({value.length})</p>
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
          <div className="max-h-[280px] overflow-y-auto space-y-2">
            {value.map((agent, index) => (
              <div
                key={`${agent.id}-${index}`}
                className="flex items-center justify-between p-3 bg-background border rounded-md hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {agent.name}
                      {agent.number !== undefined && (
                        <span className="text-muted-foreground ml-1">#{agent.number}</span>
                      )}
                    </p>
                  </div>
                  {(agent.role || agent.type === "group") && (
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                      {agent.type === "group" ? "Team" : roleLabels[agent.role!] ?? "Agent"}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(agent.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0 ml-2"
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
