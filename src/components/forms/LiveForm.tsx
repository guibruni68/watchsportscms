import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { GenreMultiSelect } from "@/components/ui/genre-multi-select";
import { FileUpload } from "@/components/ui/file-upload";
import { mockGenres } from "@/data/mockData";
import { ArrowLeft, CalendarIcon, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { mockPlayers, mockTeams } from "@/data/mockData";
import { AgentMultiSelect } from "@/components/ui/agent-multi-select";


const liveSchema = z.object({
  titulo: z.string().min(1, "Title is required"),
  descricao: z.string().min(1, "Description is required"),
  label: z.enum(["VOD", "LIVE"]),
  anoLancamento: z.number().min(1900, "Invalid year").max(new Date().getFullYear() + 10, "Year cannot be too far in the future").optional(),
  scheduleDate: z.date().optional(),
  badge: z.enum(["NEW", "NEW EPISODES", "SOON"]).optional(),
  cardImageUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  streamUrl: z.string().optional(),
  ageRating: z.string().optional(),
  enabled: z.boolean(),

  // Live scheduling fields
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  liveToVod: z.boolean(),

  // Streaming configuration
  rtmpServerUrl: z.string().optional(),
  streamKey: z.string().optional(),
  
  // Legacy fields for backward compatibility
  nomeEvento: z.string().optional(),
  generos: z.array(z.string()).optional(),
  dataHora: z.date().optional(),
  playerEmbed: z.string().optional(),
  imagemCapa: z.string().optional(),
  agentesRelacionados: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["agent", "group"]),
  })).optional(),
});
type LiveFormData = z.infer<typeof liveSchema>;
interface LiveFormProps {
  initialData?: {
    nomeEvento?: string;
    descricao?: string;
    generos?: string[];
    dataHora?: string;
    agendarPublicacao?: boolean;
    dataPublicacao?: Date;
    available?: boolean;
    playerEmbed?: string;
    imagemCapa?: string;
    
    agentesRelacionados?: Array<{
      id: string;
      name: string;
      type: "agent" | "group";
    }>;
  };
  isEdit?: boolean;
  onClose?: () => void;
}
export function LiveForm({
  initialData,
  isEdit = false,
  onClose
}: LiveFormProps) {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">("file");
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // Parse initial datetime if provided
  const initialDateTime = initialData?.dataHora ? new Date(initialData.dataHora) : new Date();
  
  const form = useForm<LiveFormData>({
    resolver: zodResolver(liveSchema),
    defaultValues: {
      titulo: initialData?.nomeEvento || "",
      descricao: initialData?.descricao || "",
      label: "LIVE",
      anoLancamento: new Date().getFullYear(),
      scheduleDate: initialDateTime,
      badge: undefined,
      cardImageUrl: initialData?.imagemCapa || "",
      bannerImageUrl: "",
      streamUrl: initialData?.playerEmbed || "",
      ageRating: "",
      enabled: true,
      
      // Live scheduling fields
      startDate: undefined,
      endDate: undefined,
      liveToVod: false,

      // Streaming configuration
      rtmpServerUrl: "",
      streamKey: "",

      // Legacy fields
      nomeEvento: initialData?.nomeEvento || "",
      generos: initialData?.generos || [],
      dataHora: initialDateTime,
      playerEmbed: initialData?.playerEmbed || "",
      imagemCapa: initialData?.imagemCapa || "",
      agentesRelacionados: initialData?.agentesRelacionados || [],
    }
  });
  const {
    formState: {
      isDirty
    }
  } = form;
  const handleNavigation = (navigateFn: () => void) => {
    if (isDirty) {
      setPendingNavigation(() => navigateFn);
      setShowExitConfirmation(true);
    } else {
      navigateFn();
    }
  };
  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    pendingNavigation?.();
  };
  const onSubmit = (data: LiveFormData) => {
    console.log("Saving live:", data);
    toast({
      title: isEdit ? "Live updated!" : "Live created!",
      description: `${data.titulo} was ${isEdit ? "updated" : "created"} successfully.`
    });
    if (onClose) {
      onClose();
    } else {
    navigate("/lives");
    }
  };

  const generos = [
    "Goals and Highlights",
    "Interviews", 
    "Behind the Scenes",
    "Training",
    "Club History",
    "Tactical Analysis",
    "Documentaries",
    "Live Streams"
  ];
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/lives"))} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="information" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="information">Information</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="stream">Stream</TabsTrigger>
              <TabsTrigger value="publishing">Publishing</TabsTrigger>
              {isEdit && <TabsTrigger value="stats">Stats</TabsTrigger>}
            </TabsList>

            {/* Tab 1: Information */}
            <TabsContent value="information">
      <Card>
        <CardHeader>
                  <CardTitle>Information</CardTitle>
        </CardHeader>
                <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="titulo" render={({
                  field
                }) => <FormItem>
                            <FormLabel>Title *</FormLabel>
                        <FormControl>
                              <Input placeholder="Ex: State Championship Final" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                    <FormField control={form.control} name="label" render={({
                  field
                }) => <FormItem>
                            <FormLabel>Label *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                              <FormControl>
                            <SelectTrigger>
                                  <SelectValue placeholder="LIVE" />
                            </SelectTrigger>
                              </FormControl>
                            <SelectContent>
                                <SelectItem value="LIVE">LIVE</SelectItem>
                            </SelectContent>
                          </Select>
                            <FormMessage />
                          </FormItem>} />
                            </div>

                  <FormField control={form.control} name="descricao" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe the event..." className="min-h-24" {...field} />
                          </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="anoLancamento" render={({
                  field
                }) => <FormItem>
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
                      </FormItem>} />

                  <FormField control={form.control} name="generos" render={({
                field
              }) => <FormItem>
                          <FormLabel>Genres</FormLabel>
                      <FormControl>
                            <GenreMultiSelect
                              selectedGenres={field.value || []}
                              onGenresChange={field.onChange}
                              genreType="live"
                              availableGenres={mockGenres}
                              placeholder="Select or create genres..."
                            />
                          </FormControl>
                          <p className="text-sm text-muted-foreground">
                            Add genres to categorize this live event
                          </p>
                      <FormMessage />
                    </FormItem>} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Media */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="cardImageUrl" render={({
              field
            }) => <FormItem>
                          <FormLabel>Card Image</FormLabel>
                    <FormControl>
                            <FileUpload
                              value={field.value || ""}
                              onChange={field.onChange}
                              label="Choose a file or drag & drop it here"
                              description="JPEG, PNG, and WEBP formats, up to 50MB"
                            />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Image displayed on content cards and thumbnails (3:4 aspect ratio recommended)
                    </p>
                    <FormMessage />
                  </FormItem>} />

                  <FormField control={form.control} name="bannerImageUrl" render={({
                field
              }) => <FormItem>
                          <FormLabel>Banner Image</FormLabel>
                          <FormControl>
                            <FileUpload
                              value={field.value || ""}
                              onChange={field.onChange}
                              label="Choose a file or drag & drop it here"
                              description="JPEG, PNG, and WEBP formats, up to 50MB"
                            />
                          </FormControl>
                          <p className="text-sm text-muted-foreground">
                            Image displayed on detail pages and featured sections (16:9 aspect ratio recommended)
                          </p>
                      <FormMessage />
                    </FormItem>} />

                  <FormField control={form.control} name="streamUrl" render={({
                field
              }) => <FormItem>
                          <FormLabel>Stream URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/stream.m3u8" {...field} />
                          </FormControl>
                      <FormMessage />
                    </FormItem>} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Stream */}
            <TabsContent value="stream">
              <Card>
                <CardHeader>
                  <CardTitle>Streaming Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="rtmpServerUrl" render={({
                    field
                  }) => <FormItem>
                        <FormLabel>RTMP Server URL</FormLabel>
                        <FormControl>
                          <Input placeholder="rtmp://live.example.com/app" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="streamKey" render={({
                    field
                  }) => <FormItem>
                        <FormLabel>Stream Key</FormLabel>
                        <FormControl>
                          <Input placeholder="your-stream-key-here" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="liveToVod" render={({
                    field
                  }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Live to VOD</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Automatically convert live stream to VOD after it ends
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Publishing */}
            <TabsContent value="publishing">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Live Scheduling Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">Live Scheduling</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="startDate" render={({
                        field
                      }) => <FormItem className="flex flex-col">
                              <FormLabel>Start Date & Time</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                      {field.value ? format(field.value, "dd/MM/yyyy HH:mm", { locale: ptBR }) : <span>Select start date</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={field.value} onSelect={(date) => {
                                    if (date) {
                                      const currentTime = field.value || new Date();
                                      date.setHours(currentTime.getHours(), currentTime.getMinutes());
                                    }
                                    field.onChange(date);
                                  }} initialFocus className={cn("p-3 pointer-events-auto")} />
                                  <div className="border-t p-3">
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="time"
                                        value={field.value ? format(field.value, "HH:mm") : ""}
                                        onChange={(e) => {
                                          const [hours, minutes] = e.target.value.split(':').map(Number);
                                          const newDate = field.value ? new Date(field.value) : new Date();
                                          newDate.setHours(hours, minutes);
                                          field.onChange(newDate);
                                        }}
                                        className="flex-1"
                                      />
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>} />

                      <FormField control={form.control} name="endDate" render={({
                        field
                      }) => <FormItem className="flex flex-col">
                              <FormLabel>End Date & Time</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                      {field.value ? format(field.value, "dd/MM/yyyy HH:mm", { locale: ptBR }) : <span>Select end date</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={field.value} onSelect={(date) => {
                                    if (date) {
                                      const currentTime = field.value || new Date();
                                      date.setHours(currentTime.getHours(), currentTime.getMinutes());
                                    }
                                    field.onChange(date);
                                  }} initialFocus className={cn("p-3 pointer-events-auto")} />
                                  <div className="border-t p-3">
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="time"
                                        value={field.value ? format(field.value, "HH:mm") : ""}
                                        onChange={(e) => {
                                          const [hours, minutes] = e.target.value.split(':').map(Number);
                                          const newDate = field.value ? new Date(field.value) : new Date();
                                          newDate.setHours(hours, minutes);
                                          field.onChange(newDate);
                                        }}
                                        className="flex-1"
                                      />
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>} />
                    </div>
                  </div>

                  <FormField control={form.control} name="badge" render={({
                      field
                    }) => <FormItem>
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
                          </FormItem>} />

                  <FormField control={form.control} name="scheduleDate" render={({
                    field
                  }) => <FormItem className="flex flex-col">
                          <FormLabel>Schedule Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(field.value, "PPP") : <span>No schedule date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
                            </PopoverContent>
                          </Popover>
                          <p className="text-sm text-muted-foreground">
                            If set, content will be automatically disabled until this date
                          </p>
                    <FormMessage />
                  </FormItem>} />

                  <FormField control={form.control} name="enabled" render={({
              field
                  }) => {
                    const hasScheduledDate = !!form.watch("scheduleDate");
                    const scheduleDatePassed = hasScheduledDate && form.watch("scheduleDate") && new Date(form.watch("scheduleDate")!) < new Date();
                    
                    return <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enabled</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              {hasScheduledDate 
                                ? scheduleDatePassed 
                                  ? "Schedule date has passed - you can enable manually"
                                  : "Content with future schedule date is automatically disabled"
                                : "Enable or disable this content manually"}
                            </div>
                          </div>
                    <FormControl>
                            <Switch 
                              checked={hasScheduledDate && !scheduleDatePassed ? false : field.value} 
                              onCheckedChange={field.onChange}
                              disabled={hasScheduledDate && !scheduleDatePassed}
                            />
                    </FormControl>
                        </FormItem>
                  }} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 5: Stats (only in edit mode) */}
            {isEdit && (
              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle>Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">0</p>
                        <p className="text-sm text-muted-foreground">Total Views</p>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">0</p>
                        <p className="text-sm text-muted-foreground">Peak Viewers</p>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">0h 0m</p>
                        <p className="text-sm text-muted-foreground">Avg. Watch Time</p>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground text-center">
                        Detailed statistics will be available after the live stream ends.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/lives"))} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isEdit ? "Update Live Stream" : "Create Live Stream"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Unsaved Changes Confirmation Dialog */}
      <AlertDialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowExitConfirmation(false)}>
              Continue Editing
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
}
