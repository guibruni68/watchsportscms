import { useState, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const groupLabels: Record<string, string> = {
  player: "Players",
  coach: "Coaches",
  writer: "Writers",
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
    const byRole: Record<string, typeof filteredAgents> = {};
    const others: typeof filteredAgents = [];
    for (const a of filteredAgents) {
      if (a.type === "agent" && a.role) {
        (byRole[a.role] ??= []).push(a);
      } else {
        others.push(a);
      }
    }
    return { byRole, others };
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
      <div key={heading}>
        <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</p>
        {items.map((agent) => {
          const isSelected = selectedIds.includes(agent.id);
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => handleSelect(agent.id)}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-2 text-sm rounded-sm hover:bg-accent transition-colors text-left",
                isSelected && "bg-primary/10"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0",
                  isSelected ? "border-primary bg-primary" : "border-muted-foreground/50"
                )}
              />
              <span className="truncate flex-1">
                {agent.name}
                {agent.number !== undefined && (
                  <span className="text-muted-foreground ml-1">#{agent.number}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  const hasResults = filteredAgents.length > 0;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
          className="pl-9"
        />
      </div>

      {/* List */}
      <div className="border rounded-md">
        <div className="max-h-[280px] overflow-y-auto p-1">
          {!hasResults && (
            <p className="py-6 text-center text-sm text-muted-foreground">No agents found.</p>
          )}
          {Object.entries(grouped.byRole).map(([role, items]) =>
            renderGroup(items, groupLabels[role] ?? role)
          )}
          {renderGroup(grouped.others, "Groups")}
        </div>
        {selectedIds.length > 0 && (
          <div className="border-t p-3 bg-muted/30">
            <Button type="button" onClick={handleAdd} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add {selectedIds.length} {selectedIds.length === 1 ? "Item" : "Items"}
            </Button>
          </div>
        )}
      </div>

      {/* Selected items */}
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
