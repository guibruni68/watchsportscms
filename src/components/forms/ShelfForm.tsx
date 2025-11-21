import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarIcon, GripVertical, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ShelfType, ShelfLayout, ShelfDomain, ShelfAlgorithm, FilterRule, FilterDomain } from "@/types/shelf";
import { UnifiedContentSelector, Content } from "@/components/ui/unified-content-selector";
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

const shelfSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["AUTOMATIC", "MANUAL", "PERSONALIZED"]),
  layout: z.enum(["CAROUSEL", "LIST", "HERO_BANNER", "MID_BANNER", "AD_BANNER", "GRID"]),
  domain: z.enum(["CONTENT", "COLLECTION", "NEWS", "AGENT", "GROUP", "AGENDA", "BANNER"]),
  hasSeeMore: z.boolean(),
  seeMoreUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  scheduleDate: z.date().optional(),
  enabled: z.boolean(),
  
  // For Manual type
  selectedItems: z.array(z.string()).optional(),
  
  // For Automatic type - filter fields
  filterRule: z.enum(["RANDOM", "RECENT", "ALPHABETICAL", "TOP"]).optional(),
  filterDomain: z.enum(["CONTENT", "COLLECTION", "NEWS", "AGENT", "GROUP", "AGENDA"]).optional(),
  filterDomainField: z.string().optional(),
  filterValue: z.string().optional(),
  
  // For Personalized type
  algorithm: z.enum(["BECAUSE_YOU_WATCHED", "SUGGESTIONS_FOR_YOU"]).optional(),
  limit: z.number().min(1).max(100).optional(),
});

type ShelfFormData = z.infer<typeof shelfSchema>;

interface ShelfFormProps {
  initialData?: Partial<ShelfFormData>;
  isEdit?: boolean;
  onClose?: () => void;
}

// Sortable item component for drag and drop
function SortableItem({ id, item, onRemove }: { 
  id: string; 
  item: Content;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-muted rounded-md"
    >
      <div
        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      {item.thumbnail && (
        <img 
          src={item.thumbnail} 
          alt={item.title}
          className="h-8 w-8 rounded object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-medium">{item.title}</div>
        <div className="text-xs text-muted-foreground">{item.type}</div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onRemove(id)}
        type="button"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ShelfForm({ initialData, isEdit = false, onClose }: ShelfFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDetails, setSelectedDetails] = useState<Content[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm<ShelfFormData>({
    resolver: zodResolver(shelfSchema),
    defaultValues: {
      title: initialData?.title || "",
      type: initialData?.type || "MANUAL",
      layout: initialData?.layout || "CAROUSEL",
      domain: initialData?.domain || "CONTENT",
      hasSeeMore: initialData?.hasSeeMore ?? false,
      seeMoreUrl: initialData?.seeMoreUrl || "",
      scheduleDate: initialData?.scheduleDate,
      enabled: initialData?.enabled ?? true,
      selectedItems: initialData?.selectedItems || [],
      filterRule: initialData?.filterRule,
      filterDomain: initialData?.filterDomain,
      filterDomainField: initialData?.filterDomainField,
      filterValue: initialData?.filterValue,
      algorithm: initialData?.algorithm,
      limit: initialData?.limit || 12,
    }
  });

  const watchType = form.watch("type");
  const watchDomain = form.watch("domain");

  // Clear type-specific fields when type changes
  const handleTypeChange = (newType: ShelfFormData["type"]) => {
    // Clear fields from other types
    if (newType !== "MANUAL") {
      form.setValue("selectedItems", []);
    }
    if (newType !== "AUTOMATIC") {
      form.setValue("filterRule", undefined);
      form.setValue("filterDomain", undefined);
      form.setValue("filterDomainField", undefined);
      form.setValue("filterValue", undefined);
    }
    if (newType !== "PERSONALIZED") {
      form.setValue("algorithm", undefined);
    }
    // Reset limit only when changing to MANUAL type
    if (newType === "MANUAL") {
      form.setValue("limit", undefined);
    }
    
    // If changing to non-manual type and domain is BANNER, reset domain
    if (newType !== "MANUAL" && watchDomain === "BANNER") {
      form.setValue("domain", "CONTENT");
    }
  };

  // Clear selected items when domain changes (for Manual type)
  const handleDomainChange = (newDomain: ShelfFormData["domain"]) => {
    if (watchType === "MANUAL") {
      form.setValue("selectedItems", []);
      setSelectedDetails([]);
    }
  };

  const onSubmit = (data: ShelfFormData) => {
    // Clean up data based on type before submission
    const cleanedData = { ...data };
    
    if (data.type !== "MANUAL") {
      delete cleanedData.selectedItems;
    }
    if (data.type !== "AUTOMATIC") {
      delete cleanedData.filterRule;
      delete cleanedData.filterDomain;
      delete cleanedData.filterDomainField;
      delete cleanedData.filterValue;
    }
    if (data.type !== "PERSONALIZED") {
      delete cleanedData.algorithm;
      delete cleanedData.limit;
    }
    
    console.log("Saving shelf:", cleanedData);
    toast({
      title: isEdit ? "Shelf updated!" : "Shelf created!",
      description: `${data.title} was ${isEdit ? "updated" : "created"} successfully.`
    });
    if (onClose) {
      onClose();
    } else {
      navigate("/shelves");
    }
  };

  // Get domain field options based on selected domain
  const getDomainFieldOptions = (domain: string) => {
    switch (domain) {
      case "CONTENT":
        return ["title", "genre", "releaseDate", "duration"];
      case "COLLECTION":
        return ["title", "description"];
      case "NEWS":
        return ["title", "category", "publishDate"];
      case "AGENT":
        return ["name", "type"];
      case "GROUP":
        return ["name", "category"];
      case "AGENDA":
        return ["title", "eventDate"];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (onClose ? onClose() : navigate("/shelves"))}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shelves
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Shelf Info */}
          <Card>
            <CardHeader>
              <CardTitle>Shelf Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Shelf title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleTypeChange(value as ShelfFormData["type"]);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MANUAL">Manual</SelectItem>
                          <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                          <SelectItem value="PERSONALIZED">Personalized</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Manual: Select items manually | Automatic: Use filters | Personalized: Use algorithms
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="layout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select layout..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CAROUSEL">Carousel</SelectItem>
                          <SelectItem value="LIST">List</SelectItem>
                          <SelectItem value="HERO_BANNER">Hero Banner</SelectItem>
                          <SelectItem value="MID_BANNER">Mid Banner</SelectItem>
                          <SelectItem value="AD_BANNER">Ad Banner</SelectItem>
                          <SelectItem value="GRID">Grid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleDomainChange(value as ShelfFormData["domain"]);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CONTENT">Content</SelectItem>
                          <SelectItem value="COLLECTION">Collection</SelectItem>
                          <SelectItem value="NEWS">News</SelectItem>
                          <SelectItem value="AGENT">Agent</SelectItem>
                          <SelectItem value="GROUP">Group</SelectItem>
                          <SelectItem value="AGENDA">Agenda</SelectItem>
                          {watchType === "MANUAL" && (
                            <SelectItem value="BANNER">Banner</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of content this shelf will display
                        {watchType !== "MANUAL" && " (Banner only available for Manual type)"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="hasSeeMore"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show "See More" Button</FormLabel>
                        <FormDescription>
                          Display a button to view more items
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("hasSeeMore") && (
                  <FormField
                    control={form.control}
                    name="seeMoreUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>See More URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Conditional sections based on shelf type */}
              {watchType === "MANUAL" && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Manual Selection</h3>
                  <FormField
                    control={form.control}
                    name="selectedItems"
                    render={({ field }) => {
                      const handleDragEnd = (event: DragEndEvent) => {
                        const { active, over } = event;
                        
                        if (active.id !== over?.id && over?.id) {
                          const oldIndex = field.value?.indexOf(active.id as string) ?? -1;
                          const newIndex = field.value?.indexOf(over.id as string) ?? -1;
                          
                          if (oldIndex !== -1 && newIndex !== -1) {
                            const newOrder = arrayMove(field.value || [], oldIndex, newIndex);
                            field.onChange(newOrder);
                            
                            // Also reorder the details
                            const newDetailsOrder = arrayMove(selectedDetails, oldIndex, newIndex);
                            setSelectedDetails(newDetailsOrder);
                          }
                        }
                      };

                      const handleRemoveItem = (itemId: string) => {
                        const newIds = (field.value || []).filter(id => id !== itemId);
                        const newDetails = selectedDetails.filter(item => item.id !== itemId);
                        field.onChange(newIds);
                        setSelectedDetails(newDetails);
                      };

                      return (
                        <FormItem>
                          <FormLabel>Select {watchDomain.toLowerCase()} items</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <UnifiedContentSelector
                                domain={watchDomain.toLowerCase() as any}
                                value={field.value || []}
                                onChange={(ids, details) => {
                                  field.onChange(ids);
                                  setSelectedDetails(details);
                                }}
                                placeholder={`Search ${watchDomain.toLowerCase()} items...`}
                                hideSelectedList={true}
                              />
                              
                              {selectedDetails.length > 0 && (
                                <div className="space-y-3">
                                  <p className="text-sm font-medium">
                                    Selected items ({selectedDetails.length}) - Drag to reorder
                                  </p>
                                  <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                  >
                                    <SortableContext
                                      items={field.value || []}
                                      strategy={verticalListSortingStrategy}
                                    >
                                      <div className="space-y-2">
                                        {selectedDetails.map((item) => (
                                          <SortableItem
                                            key={item.id}
                                            id={item.id}
                                            item={item}
                                            onRemove={handleRemoveItem}
                                          />
                                        ))}
                                      </div>
                                    </SortableContext>
                                  </DndContext>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Manually select items from the {watchDomain.toLowerCase()} domain and drag to reorder
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              )}

              {watchType === "AUTOMATIC" && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Automatic Filter Configuration</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="filterRule"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Filter Rule *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select rule..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="RANDOM">Random</SelectItem>
                                <SelectItem value="RECENT">Recent</SelectItem>
                                <SelectItem value="ALPHABETICAL">Alphabetical</SelectItem>
                                <SelectItem value="TOP">Top</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="filterDomain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Filter Domain *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select domain..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CONTENT">Content</SelectItem>
                                <SelectItem value="COLLECTION">Collection</SelectItem>
                                <SelectItem value="NEWS">News</SelectItem>
                                <SelectItem value="AGENT">Agent</SelectItem>
                                <SelectItem value="GROUP">Group</SelectItem>
                                <SelectItem value="AGENDA">Agenda</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="filterDomainField"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Domain Field</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select field..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getDomainFieldOptions(form.watch("filterDomain") || "CONTENT").map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The field to filter on
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="filterValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Filter Value</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter filter value..." {...field} />
                            </FormControl>
                            <FormDescription>
                              The value to match against the field
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Limit *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              max={100} 
                              placeholder="12" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of filtered items to display (1-100)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {watchType === "PERSONALIZED" && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Personalized Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="algorithm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Algorithm *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select algorithm..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BECAUSE_YOU_WATCHED">Because You Watched</SelectItem>
                              <SelectItem value="SUGGESTIONS_FOR_YOU">Suggestions For You</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The personalization algorithm to use
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Limit *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              max={100} 
                              placeholder="10" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of items to display (1-100)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Visibility and Status */}
          <Card>
            <CardHeader>
              <CardTitle>Visibility and Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="scheduleDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Schedule Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>No schedule date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      If set, shelf will be automatically disabled until this date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => {
                  const hasScheduledDate = !!form.watch("scheduleDate");
                  const scheduleDatePassed = hasScheduledDate && form.watch("scheduleDate") && new Date(form.watch("scheduleDate")!) < new Date();
                  
                  return (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enabled</FormLabel>
                        <FormDescription>
                          {hasScheduledDate 
                            ? scheduleDatePassed 
                              ? "Schedule date has passed - you can enable manually"
                              : "Shelf with future schedule date is automatically disabled"
                            : "Enable or disable this shelf manually"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={hasScheduledDate && !scheduleDatePassed ? false : field.value}
                          onCheckedChange={field.onChange}
                          disabled={hasScheduledDate && !scheduleDatePassed}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {isEdit ? "Update Shelf" : "Create Shelf"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => (onClose ? onClose() : navigate("/shelves"))}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
