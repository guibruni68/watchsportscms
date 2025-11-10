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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
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

interface SeasonContent {
  id: string;
  title: string;
  status: boolean;
  published_at: string;
}

interface Season {
  id: string;
  title: string;
  season_number: number;
  description?: string;
  cover_url?: string;
  published_at: Date;
  contents: SeasonContent[];
}

const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cover_url: z.string().optional(),
  status: z.boolean(),
  agendarPublicacao: z.boolean(),
  published_at: z.date().optional(),
  seasons: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, "Season title is required"),
    season_number: z.number().min(1),
    description: z.string().optional(),
    cover_url: z.string().optional(),
    published_at: z.date(),
    contents: z.array(z.object({
      id: z.string(),
      title: z.string(),
      status: z.boolean(),
      published_at: z.string()
    }))
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
  const [seasonCoverUploadModes, setSeasonCoverUploadModes] = useState<Record<string, "file" | "url">>({});

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: "",
      description: "",
      cover_url: "",
      status: true,
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
      description: "",
      cover_url: "",
      published_at: new Date(),
      contents: []
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
            status: true,
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {collectionId ? 'Edit Collection' : 'New Collection'}
            </h1>
            <p className="text-muted-foreground">
              {collectionId ? 'Edit collection information' : 'Create a new content collection'}
            </p>
          </div>
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
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cover Image */}
              <FormField
                control={form.control}
                name="cover_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Cover Image</FormLabel>
                    <div className="flex gap-2 mb-4">
                      <Button
                        type="button"
                        variant={coverUploadMode === "file" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCoverUploadMode("file")}
                      >
                        Upload File
                      </Button>
                      <Button
                        type="button"
                        variant={coverUploadMode === "url" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCoverUploadMode("url")}
                      >
                        Image URL
                      </Button>
                    </div>
                    <FormControl>
                      <div className="space-y-4">
                        {!field.value && coverUploadMode === "file" && (
                          <div 
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('collection-cover-input')?.click()}
                          >
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">
                              Click to upload cover image
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG up to 5MB
                            </p>
                            <Input 
                              id="collection-cover-input"
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  field.onChange(url);
                                }
                              }} 
                            />
                          </div>
                        )}
                        {!field.value && coverUploadMode === "url" && (
                          <div className="space-y-2">
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              value={field.value || ""} 
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Enter the direct URL to your cover image
                            </p>
                          </div>
                        )}
                        {field.value && (
                          <div className="relative">
                            <img 
                              src={field.value} 
                              alt="Collection cover" 
                              className="w-full h-48 object-cover rounded-lg border" 
                            />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm" 
                              className="absolute top-2 right-2" 
                              onClick={() => field.onChange("")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the content of this collection..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description of the collection
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Collection Status
                      </FormLabel>
                      <FormDescription>
                        Active collection will be visible and can be selected in content
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Publish Scheduling */}
              <div className="space-y-4 border rounded-lg p-4">
                <FormField
                  control={form.control}
                  name="agendarPublicacao"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Schedule publication
                        </FormLabel>
                        <FormDescription>
                          If disabled, content will be published immediately
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("agendarPublicacao") && (
                  <FormField
                    control={form.control}
                    name="published_at"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Publication Date</FormLabel>
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
                                  <span>Select a date</span>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Seasons Section */}
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

                            {/* Season Description */}
                            <FormField
                              control={form.control}
                              name={`seasons.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Season Description</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Describe this season..." 
                                      className="min-h-[80px]" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Season Cover Image */}
                            <FormField
                              control={form.control}
                              name={`seasons.${index}.cover_url`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Season Cover Image</FormLabel>
                                  <div className="flex gap-2 mb-4">
                                    <Button
                                      type="button"
                                      variant={(seasonCoverUploadModes[season.id] || "file") === "file" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setSeasonCoverUploadModes(prev => ({ ...prev, [season.id]: "file" }))}
                                    >
                                      Upload File
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={(seasonCoverUploadModes[season.id] || "file") === "url" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setSeasonCoverUploadModes(prev => ({ ...prev, [season.id]: "url" }))}
                                    >
                                      Image URL
                                    </Button>
                                  </div>
                                  <FormControl>
                                    <div className="space-y-4">
                                      {!field.value && (seasonCoverUploadModes[season.id] || "file") === "file" && (
                                        <div 
                                          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                                          onClick={() => document.getElementById(`season-cover-${season.id}`)?.click()}
                                        >
                                          <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                                          <p className="text-sm text-muted-foreground">
                                            Click to upload season cover
                                          </p>
                                          <Input 
                                            id={`season-cover-${season.id}`}
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={e => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                const url = URL.createObjectURL(file);
                                                field.onChange(url);
                                              }
                                            }} 
                                          />
                                        </div>
                                      )}
                                      {!field.value && (seasonCoverUploadModes[season.id] || "file") === "url" && (
                                        <Input 
                                          placeholder="https://example.com/season-cover.jpg" 
                                          value={field.value || ""} 
                                          onChange={(e) => field.onChange(e.target.value)}
                                        />
                                      )}
                                      {field.value && (
                                        <div className="relative">
                                          <img 
                                            src={field.value} 
                                            alt="Season cover" 
                                            className="w-full h-32 object-cover rounded-lg border" 
                                          />
                                          <Button 
                                            type="button" 
                                            variant="destructive" 
                                            size="sm" 
                                            className="absolute top-2 right-2" 
                                            onClick={() => field.onChange("")}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Season Publish Date */}
                            <FormField
                              control={form.control}
                              name={`seasons.${index}.published_at`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Season Publish Date *</FormLabel>
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
                                            <span>Select a date</span>
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
                              {season.contents && season.contents.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {season.contents.map((content) => (
                                    <Badge key={content.id} variant="secondary">
                                      {content.title}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
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
    </div>
  );
}
