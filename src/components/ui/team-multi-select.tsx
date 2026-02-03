import { useState, useMemo, useRef, useEffect } from "react";
import { Users, Search, Plus, X } from "lucide-react";
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

export interface TeamOption {
  id: string;
  name: string;
  acronym: string;
  logoUrl?: string;
  city?: string;
  country?: string;
}

interface TeamMultiSelectProps {
  teams: TeamOption[];
  value: TeamOption[];
  onChange: (teams: TeamOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TeamMultiSelect({
  teams,
  value = [],
  onChange,
  placeholder = "Search and select teams...",
  disabled = false,
}: TeamMultiSelectProps) {
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

  // Available teams (not already added)
  const availableTeams = useMemo(() => {
    return teams.filter(
      (team) => !value.find((added) => added.id === team.id)
    );
  }, [teams, value]);

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!search.trim()) return availableTeams;

    const searchLower = search.toLowerCase();
    return availableTeams.filter((team) =>
      team.name.toLowerCase().includes(searchLower) ||
      team.acronym.toLowerCase().includes(searchLower) ||
      (team.city && team.city.toLowerCase().includes(searchLower))
    );
  }, [availableTeams, search]);

  const handleSelect = (teamId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };

  const handleAdd = () => {
    if (selectedIds.length === 0) return;

    const teamsToAdd = availableTeams.filter((t) => selectedIds.includes(t.id));
    onChange([...value, ...teamsToAdd]);
    setSelectedIds([]);
    setSearch("");
  };

  const handleRemove = (teamId: string) => {
    onChange(value.filter((team) => team.id !== teamId));
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
              placeholder="Search teams..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-[250px] overflow-y-auto flex-1">
              <CommandEmpty>No teams found.</CommandEmpty>

              <CommandGroup heading="Teams">
                {filteredTeams.map((team) => {
                  const isSelected = selectedIds.includes(team.id);
                  return (
                    <CommandItem
                      key={team.id}
                      value={team.id}
                      onSelect={() => handleSelect(team.id)}
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
                          />
                          <div className="w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
                            {team.logoUrl ? (
                              <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-bold text-gray-400">{team.acronym}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {team.name}
                            </p>
                            {team.city && (
                              <p className="text-xs text-muted-foreground truncate">
                                {team.city}{team.country ? `, ${team.country}` : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
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
                Add {selectedIds.length} {selectedIds.length === 1 ? "Team" : "Teams"}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* List of added teams */}
      {value.length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">
              Selected Teams ({value.length})
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
          <div className="max-h-[280px] overflow-y-auto space-y-2">
            {value.map((team, index) => (
              <div
                key={`${team.id}-${index}`}
                className="flex items-center justify-between p-3 bg-background border rounded-md hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
                    {team.logoUrl ? (
                      <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400">{team.acronym}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {team.name}
                    </p>
                    {team.city && (
                      <p className="text-xs text-muted-foreground truncate">
                        {team.city}{team.country ? `, ${team.country}` : ''}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(team.id)}
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
