import { useState, useMemo, useRef, useEffect } from "react";
import { User, Users, Search, Plus, X, Mic, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function AgentMultiSelect({
  agents,
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

  useEffect(() => {
    if (open && triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

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

  function renderGroup(items: typeof filteredAgents, heading: string) {
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
              <span className="text-muted-foreground">{placeholder}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 flex flex-col"
          align="start"
          sideOffset={4}
          style={{
            width: popoverWidth ? `${popoverWidth}px` : undefined,
            maxHeight: "70vh",
          }}
        >
          <Command shouldFilter={false} className="flex flex-col">
            <CommandInput
              placeholder="Search by name, role..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-[280px] overflow-y-auto flex-1">
              <CommandEmpty>No agents found.</CommandEmpty>
              {renderGroup(grouped.players, "Players")}
              {renderGroup(grouped.coaches, "Coaches")}
              {renderGroup(grouped.writers, "Writers")}
              {renderGroup(grouped.others, "Agents")}
              {renderGroup(grouped.groups, "Groups")}
            </CommandList>
          </Command>

          {selectedIds.length > 0 && (
            <div className="border-t p-3 bg-muted/30 shrink-0">
              <Button type="button" onClick={handleAdd} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add {selectedIds.length} {selectedIds.length === 1 ? "Item" : "Items"}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

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
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <p className="text-sm font-medium truncate flex-1">
                    {agent.name}
                    {agent.number !== undefined && (
                      <span className="text-muted-foreground ml-1">#{agent.number}</span>
                    )}
                  </p>
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
