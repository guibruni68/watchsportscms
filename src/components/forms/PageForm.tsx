import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, GripVertical, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageShelf } from "@/types/page";
import { Shelf } from "@/types/shelf";

const pageFormSchema = z.object({
  name: z.string().min(1, "Page name is required"),
  shelves: z.array(z.object({
    id: z.string(),
    shelfId: z.string(),
    shelfTitle: z.string(),
    order: z.number(),
  })),
});

type PageFormData = z.infer<typeof pageFormSchema>;

interface PageFormProps {
  initialData?: Partial<PageFormData>;
  isEdit?: boolean;
  onClose?: () => void;
}

// Shelf Selector Component
function ShelfSelector({
  availableShelves,
  onSelect,
}: {
  availableShelves: Shelf[];
  onSelect: (shelf: Shelf) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.shelf-selector-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredShelves = availableShelves.filter(shelf =>
    shelf.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative shelf-selector-container">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search shelves to add..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
      </div>

      {isOpen && filteredShelves.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
          {filteredShelves.map((shelf) => (
            <div
              key={shelf.id}
              className="px-3 py-2 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => {
                onSelect(shelf);
                setSearchTerm("");
                setIsOpen(false);
              }}
            >
              <div className="font-medium">{shelf.title}</div>
              <div className="text-xs text-muted-foreground">
                {shelf.type} • {shelf.layout}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && searchTerm && filteredShelves.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md p-3">
          <p className="text-sm text-muted-foreground">No shelves found</p>
        </div>
      )}
    </div>
  );
}

// Mock shelves data - in real app this would come from the database
const mockAvailableShelves: Shelf[] = [
  {
    id: "1",
    title: "Trending Now",
    type: "PERSONALIZED",
    layout: "CAROUSEL",
    domain: "CONTENT",
    hasSeeMore: true,
    seeMoreUrl: "/content/trending",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    enabled: true,
    algorithm: "SUGGESTIONS_FOR_YOU",
    limit: 20,
  },
  {
    id: "2",
    title: "Featured Collections",
    type: "MANUAL",
    layout: "GRID",
    domain: "COLLECTION",
    hasSeeMore: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    enabled: true,
    selectedItems: ["col-1", "col-2", "col-3"],
  },
  {
    id: "3",
    title: "Latest News",
    type: "AUTOMATIC",
    layout: "LIST",
    domain: "NEWS",
    hasSeeMore: true,
    seeMoreUrl: "/news",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    enabled: true,
    filter: {
      id: "f1",
      rule: "RECENT",
      domain: "NEWS",
      domainField: "publishDate",
    },
  },
];

// Sortable shelf item component
function SortableShelfItem({ 
  shelf, 
  onRemove 
}: { 
  shelf: PageShelf;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: shelf.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-muted rounded-md"
    >
      <div
        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="font-medium">{shelf.shelfTitle}</div>
        <div className="text-sm text-muted-foreground">Order: {shelf.order + 1}</div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(shelf.id)}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function PageForm({ initialData, isEdit = false, onClose }: PageFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<PageFormData>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      shelves: initialData?.shelves || [],
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const shelves = form.watch("shelves");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = shelves.findIndex((s) => s.id === active.id);
      const newIndex = shelves.findIndex((s) => s.id === over.id);

      const reorderedShelves = arrayMove(shelves, oldIndex, newIndex).map((shelf, index) => ({
        ...shelf,
        order: index,
      }));

      form.setValue("shelves", reorderedShelves);
    }
  };

  const handleAddShelf = (shelf: Shelf) => {
    // Check if shelf is already added
    if (shelves.some(s => s.shelfId === shelf.id)) {
      toast({
        title: "Shelf already added",
        description: "This shelf is already in the page.",
        variant: "destructive",
      });
      return;
    }

    const newShelf: PageShelf = {
      id: `page-shelf-${Date.now()}`,
      shelfId: shelf.id,
      shelfTitle: shelf.title,
      order: shelves.length,
    };

    form.setValue("shelves", [...shelves, newShelf]);
  };

  const handleRemoveShelf = (id: string) => {
    const updatedShelves = shelves
      .filter((s) => s.id !== id)
      .map((shelf, index) => ({
        ...shelf,
        order: index,
      }));
    form.setValue("shelves", updatedShelves);
  };

  const onSubmit = (data: PageFormData) => {
    console.log("Saving page:", data);
    toast({
      title: isEdit ? "Page updated" : "Page created",
      description: `The page "${data.name}" was ${isEdit ? "updated" : "created"} successfully.`,
    });
    
    if (onClose) {
      onClose();
    } else {
      navigate("/pages");
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/pages");
    }
  };

  // Filter available shelves (exclude already added ones)
  const availableShelves = mockAvailableShelves.filter(
    shelf => !shelves.some(s => s.shelfId === shelf.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Page" : "New Page"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Update page configuration" : "Configure a new page"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Name</FormLabel>
                    <FormControl>
                      <div className="p-3 bg-muted rounded-md">
                        <Badge variant="outline">{field.value || "Not selected"}</Badge>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Page Shelves</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add and reorder shelves that will appear on this page. Drag to reorder.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Shelf Section */}
              <ShelfSelector
                availableShelves={availableShelves}
                onSelect={handleAddShelf}
              />

              {/* Shelves List */}
              {shelves.length > 0 ? (
                <div className="space-y-2">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={shelves.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {shelves.map((shelf) => (
                        <SortableShelfItem
                          key={shelf.id}
                          shelf={shelf}
                          onRemove={handleRemoveShelf}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No shelves added yet. Add shelves from the dropdown above.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Page"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
