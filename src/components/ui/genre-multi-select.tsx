import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Genre, GenreType } from "@/types/genre"

interface GenreMultiSelectProps {
  selectedGenres: string[] // Array of genre IDs
  onGenresChange: (genreIds: string[]) => void
  genreType: GenreType
  availableGenres?: Genre[] // Optional: pass available genres, otherwise will fetch from API
  placeholder?: string
  className?: string
}

export function GenreMultiSelect({
  selectedGenres,
  onGenresChange,
  genreType,
  availableGenres = [],
  placeholder = "Select genres...",
  className,
}: GenreMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [genres, setGenres] = useState<Genre[]>(availableGenres)
  const [searchValue, setSearchValue] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    setGenres(availableGenres)
  }, [availableGenres])

  // Filter genres by type
  const filteredGenres = genres.filter(genre => genre.type === genreType)

  // Get selected genre objects
  const selectedGenreObjects = filteredGenres.filter(genre => 
    selectedGenres.includes(genre.id)
  )

  // Handle genre selection
  const handleSelect = (genreId: string) => {
    const newSelection = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId]
    
    onGenresChange(newSelection)
  }

  // Handle removing a genre
  const handleRemove = (genreId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onGenresChange(selectedGenres.filter(id => id !== genreId))
  }

  // Handle creating a new genre
  const handleCreateGenre = () => {
    if (!searchValue.trim()) return

    // Check if genre with this name already exists
    const existingGenre = filteredGenres.find(
      genre => genre.name.toLowerCase() === searchValue.toLowerCase()
    )

    if (existingGenre) {
      handleSelect(existingGenre.id)
      setSearchValue("")
      return
    }

    setIsCreating(true)

    // Create new genre
    // In a real app, this would be an API call
    const newGenre: Genre = {
      id: `temp-${Date.now()}`, // Temporary ID, will be replaced by backend
      name: searchValue.trim(),
      type: genreType,
      createdAt: new Date().toISOString(),
    }

    // Add to genres list
    setGenres([...genres, newGenre])

    // Select the new genre
    onGenresChange([...selectedGenres, newGenre.id])

    // Reset
    setSearchValue("")
    setIsCreating(false)
  }

  // Filter genres based on search
  const searchFilteredGenres = searchValue
    ? filteredGenres.filter(genre =>
        genre.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : filteredGenres

  // Check if we should show "Create" option
  const showCreateOption = searchValue.trim() && 
    !filteredGenres.some(
      genre => genre.name.toLowerCase() === searchValue.toLowerCase()
    )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex gap-1 flex-wrap">
            {selectedGenreObjects.length > 0 ? (
              selectedGenreObjects.map(genre => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="mr-1"
                >
                  {genre.name}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(genre.id, e as any)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => handleRemove(genre.id, e)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={`Search or create genre...`}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {searchValue ? (
                <div className="text-sm text-muted-foreground p-2">
                  No genres found.
                </div>
              ) : (
                <div className="text-sm text-muted-foreground p-2">
                  No genres available.
                </div>
              )}
            </CommandEmpty>
            {searchFilteredGenres.length > 0 && (
              <CommandGroup heading="Available Genres">
                {searchFilteredGenres.map((genre) => (
                  <CommandItem
                    key={genre.id}
                    value={genre.id}
                    onSelect={() => handleSelect(genre.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedGenres.includes(genre.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {genre.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {showCreateOption && (
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreateGenre}
                  className="bg-primary/5"
                  disabled={isCreating}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create "{searchValue}"</span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
