import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { GenreMultiSelect } from "@/components/ui/genre-multi-select";
import { mockGenres } from "@/data/mockData";
import { ArrowLeft, Plus, X, Upload, CalendarIcon, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContentMultiSelect, ContentItem } from "@/components/ui/content-multi-select";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SeasonContent {
  id: string;
  title: string;
  available: boolean;
  published_at: string;
}

interface Season {
  id: string;
  title: string;
  season_number: number;
  scheduleDate?: Date;
  enabled: boolean;
  contents: SeasonContent[];
  // Legacy fields for backward compatibility
  description?: string;
  cover_url?: string;
  published_at: Date;
  agendarPublicacao?: boolean;
  dataPublicacao?: Date;
  available: boolean;
}

const AVAILABLE_GENRES = [
  "Goals and Highlights",
  "Interviews",
  "Behind the Scenes",
  "Training",
  "Club History",
  "Tactical Analysis",
  "Documentaries",
  "Live Streams",
  "Best Moments",
  "Match Highlights"
];

const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  label: z.enum(["COLLECTION"]).optional(),
  releaseYear: z.number().min(1900, "Invalid year").max(new Date().getFullYear() + 10, "Year cannot be too far in the future").optional(),
  scheduleDate: z.date().optional(),
  badge: z.enum(["NEW", "NEW EPISODES", "SOON"]).optional(),
  visibility: z.enum(["FREE", "BASIC", "PREMIUM"]),
  cardImageUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  ageRating: z.string().optional(),
  enabled: z.boolean(),
  genres: z.array(z.string()).optional(),
  
  // Legacy fields for backward compatibility
  cover_url: z.string().optional(),
  available: z.boolean().optional(),
  agendarPublicacao: z.boolean().optional(),
  published_at: z.date().optional(),
  
  seasons: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, "Season title is required"),
    season_number: z.number().min(1),
    scheduleDate: z.date().optional(),
    enabled: z.boolean(),
    contents: z.array(z.object({
      id: z.string(),
      title: z.string(),
      available: z.boolean(),
      published_at: z.string()
    })),
    // Legacy fields for backward compatibility
    description: z.string().optional(),
    cover_url: z.string().optional(),
    published_at: z.date(),
    agendarPublicacao: z.boolean().optional(),
    dataPublicacao: z.date().optional(),
    available: z.boolean()
  })).optional()
});

type CollectionFormData = z.infer<typeof collectionSchema>;

interface CollectionFormProps {
  collectionId?: string;
  initialData?: Partial<CollectionFormData>;
  onSuccess?: () => void;
  isInline?: boolean;
}

export default function CollectionForm({
  collectionId,
  initialData,
  onSuccess,
  isInline = false
}: CollectionFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coverUploadMode, setCoverUploadMode] = useState<"file" | "url">("file");
  const [showPublishAlert, setShowPublishAlert] = useState(false);

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: "",
      description: "",
      label: "COLLECTION",
      releaseYear: new Date().getFullYear(),
      scheduleDate: undefined,
      badge: undefined,
      visibility: "FREE",
      cardImageUrl: "",
      bannerImageUrl: "",
      ageRating: "",
      enabled: true,
      genres: [],
      // Legacy fields
      cover_url: "",
      available: true,
      agendarPublicacao: false,
      published_at: undefined,
      seasons: [],
      ...initialData
    }
  });

  const seasons = form.watch("seasons") || [];

  const addSeason = () => {
    const currentSeasons = form.getValues("seasons") || [];
    const newSeasonNumber = currentSeasons.length + 1;
    const newSeason: Season = {
      id: `season-${Date.now()}`,
      title: `Season ${newSeasonNumber}`,
      season_number: newSeasonNumber,
      scheduleDate: undefined,
      enabled: true,
      contents: [],
      // Legacy fields
      description: "",
      cover_url: "",
      published_at: new Date(),
      agendarPublicacao: false,
      dataPublicacao: undefined,
      available: true
    };
    form.setValue("seasons", [...currentSeasons, newSeason]);
  };

  const removeSeason = (seasonId: string) => {
    const currentSeasons = form.getValues("seasons") || [];
    const updatedSeasons = currentSeasons
      .filter(s => s.id !== seasonId)
      .map((s, index) => ({ ...s, season_number: index + 1 }));
    form.setValue("seasons", updatedSeasons);
  };

  const updateSeasonContents = (seasonId: string, contents: ContentItem[]) => {
    const currentSeasons = form.getValues("seasons") || [];
    const updatedSeasons = currentSeasons.map(season => {
      if (season.id === seasonId) {
        return {
          ...season,
          contents: contents.map(c => ({
            id: c.id,
            title: c.titulo,
            available: true,
            published_at: new Date().toISOString()
          }))
        };
      }
      return season;
    });
    form.setValue("seasons", updatedSeasons);
  };

  const onSubmit = async (data: CollectionFormData) => {
    setLoading(true);
    
    console.log("Saving collection:", data);
    
    toast({
      title: "Success",
      description: collectionId 
        ? "Collection updated successfully! (Mock data)"
        : "Collection created successfully! (Mock data)",
    });

    if (onSuccess) {
      onSuccess();
    } else if (!isInline) {
      navigate('/collections');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-6">
      {!isInline && (
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      )}

      <Card>
        {isInline && (
          <CardHeader>
            <CardTitle>
              {collectionId ? 'Edit Collection' : 'New Collection'}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={isInline ? "pt-0" : ""}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Section 1: Content Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{collectionId ? 'Edit Collection' : 'New Collection'} - Content Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title and Label */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Best Moments 2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || "COLLECTION"} disabled>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="COLLECTION" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="COLLECTION">COLLECTION</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the collection..." 
                            className="min-h-24" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Card Image and Banner Image */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="cover_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Image URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/card.jpg" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                form.setValue("cardImageUrl", e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bannerImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banner Image URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/banner.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Age Rating and Release Year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="ageRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age Rating</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="G, PG, PG-13, R, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="releaseYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Release Year</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="Ex: 2025"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Genres */}
                  <FormField
                    control={form.control}
                    name="genres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genres</FormLabel>
                        <FormControl>
                          <GenreMultiSelect
                            selectedGenres={field.value || []}
                            onGenresChange={field.onChange}
                            genreType="collection"
                            availableGenres={mockGenres}
                            placeholder="Select or create genres..."
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Add genres to categorize this collection
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Section 2: Publishing & Visibility */}
              <Card>
                <CardHeader>
                  <CardTitle>Publishing & Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visibility *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select visibility tier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="FREE">FREE</SelectItem>
                              <SelectItem value="BASIC">BASIC</SelectItem>
                              <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="badge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Badge</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select badge (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NEW">NEW</SelectItem>
                              <SelectItem value="NEW EPISODES">NEW EPISODES</SelectItem>
                              <SelectItem value="SOON">SOON</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                                variant={"outline"}
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
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          If set, content will be automatically disabled until this date
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
                                  : "Content with future schedule date is automatically disabled"
                                : "Enable or disable this content manually"}
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

              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Seasons</h3>
                  <Button 
                    type="button" 
                    onClick={addSeason}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Season
                  </Button>
                </div>

                {seasons.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No seasons added yet. Click "Add Season" to create the first season.
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {seasons.map((season, index) => (
                      <AccordionItem key={season.id} value={season.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">Season {season.season_number}</Badge>
                              <span className="font-medium">{season.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {season.contents?.length || 0} {season.contents?.length === 1 ? 'episode' : 'episodes'}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSeason(season.id);
                                }}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-4">
                            {/* Season Title */}
                            <FormField
                              control={form.control}
                              name={`seasons.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Season Title *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter season title..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Season Contents */}
                            <div className="space-y-2">
                              <FormLabel>Season Content (Episodes)</FormLabel>
                              <ContentMultiSelect 
                                value={season.contents.map(c => ({
                                  id: c.id,
                                  titulo: c.title,
                                  tipo: "video" as const,
                                  thumbnail: ""
                                }))} 
                                onChange={(items) => updateSeasonContents(season.id, items)} 
                                placeholder="Search and add content to this season..." 
                              />
                            </div>

                            {/* Schedule Date */}
                            <FormField
                              control={form.control}
                              name={`seasons.${index}.scheduleDate`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Schedule Date (Optional)</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
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
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                        className={cn("p-3 pointer-events-auto")}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <p className="text-sm text-muted-foreground">
                                    If set, the season will automatically become enabled when this date is reached
                                  </p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Enabled Toggle */}
                            <FormField
                              control={form.control}
                              name={`seasons.${index}.enabled`}
                              render={({ field }) => {
                                const scheduleDate = form.watch(`seasons.${index}.scheduleDate`);
                                const hasScheduledDate = !!scheduleDate;
                                const scheduleDatePassed = hasScheduledDate && new Date(scheduleDate) < new Date();
                                const isDisabled = hasScheduledDate && !scheduleDatePassed;

                                return (
                                  <FormItem className="flex flex-row items-center justify-between border rounded-lg p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Enabled</FormLabel>
                                      <p className="text-sm text-muted-foreground">
                                        {isDisabled
                                          ? "Season with future schedule date cannot be enabled manually"
                                          : "Make this season available to users"}
                                      </p>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={isDisabled ? false : field.value}
                                        onCheckedChange={(checked) => {
                                          if (!isDisabled) {
                                            field.onChange(checked);
                                          }
                                        }}
                                        disabled={isDisabled}
                                      />
                                    </FormControl>
                                  </FormItem>
                                );
                              }}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : collectionId ? "Update" : "Create"} Collection
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Alert Dialog for Publishing */}
      <AlertDialog open={showPublishAlert} onOpenChange={setShowPublishAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Collection Now?</AlertDialogTitle>
            <AlertDialogDescription>
              This will automatically publish the collection and remove the scheduled publication date. 
              The collection will become available immediately to users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                form.setValue("available", true);
                form.setValue("agendarPublicacao", false);
                form.setValue("published_at", undefined);
                setShowPublishAlert(false);
              }}
            >
              Publish Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
