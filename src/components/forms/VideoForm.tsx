import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Upload, CalendarIcon, X, User, Users, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { mockPlayers, mockTeams } from "@/data/mockData";
import { CollectionSelector } from "@/components/ui/collection-selector";
import { AgentMultiSelect } from "@/components/ui/agent-multi-select";
const videoSchema = z.object({
  titulo: z.string().min(1, "Title is required"),
  descricao: z.string().min(1, "Description is required"),
  label: z.enum(["VOD", "LIVE"]),
  anoLancamento: z.number().min(1900, "Invalid year").max(new Date().getFullYear() + 10, "Year cannot be too far in the future").optional(),
  scheduleDate: z.date().optional(),
  badge: z.enum(["NEW", "NEW EPISODES", "SOON"]).optional(),
  visibility: z.enum(["FREE", "BASIC", "PREMIUM"]),
  cardImageUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  streamUrl: z.string().optional(),
  ageRating: z.string().optional(),
  enabled: z.boolean(),
  
  // Legacy fields for backward compatibility
  tags: z.string().optional(),
  generos: z.array(z.string()).optional(),
  tag: z.string().optional(),
  videoFile: z.string().optional(),
  imagemCapa: z.string().optional(),
  collectionId: z.string().optional(),
  agentesRelacionados: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["agent", "group"])
  })).optional()
});
type VideoFormData = z.infer<typeof videoSchema>;
interface VideoFormProps {
  initialData?: Partial<VideoFormData>;
  isEdit?: boolean;
  onClose?: () => void;
}
export function VideoForm({
  initialData,
  isEdit = false,
  onClose
}: VideoFormProps) {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [videoUploadMode, setVideoUploadMode] = useState<"file" | "url">("file");
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">("file");
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      titulo: initialData?.titulo || "",
      descricao: initialData?.descricao || "",
      label: initialData?.label || "VOD",
      anoLancamento: initialData?.anoLancamento || new Date().getFullYear(),
      scheduleDate: initialData?.scheduleDate,
      badge: initialData?.badge,
      visibility: initialData?.visibility || "FREE",
      cardImageUrl: initialData?.cardImageUrl,
      bannerImageUrl: initialData?.bannerImageUrl,
      streamUrl: initialData?.streamUrl,
      ageRating: initialData?.ageRating,
      enabled: initialData?.enabled ?? true,
      
      // Legacy fields
      tags: initialData?.tags || "",
      generos: initialData?.generos || [],
      tag: initialData?.tag || "",
      videoFile: initialData?.videoFile,
      imagemCapa: initialData?.imagemCapa,
      collectionId: initialData?.collectionId,
      agentesRelacionados: initialData?.agentesRelacionados || [],
    }
  });
  const onSubmit = (data: VideoFormData) => {
    // Mock save - here would be backend integration
    console.log("Saving video:", data);
    toast({
      title: isEdit ? "Video updated!" : "Video created!",
      description: `${data.titulo} was ${isEdit ? "updated" : "created"} successfully.`
    });
    if (onClose) {
      onClose();
    } else {
      navigate("/videos");
    }
  };
  const generos = ["Goals and Highlights", "Interviews", "Behind the Scenes", "Training", "Club History", "Tactical Analysis", "Documentaries", "Live Streams"];
  const tagsPreConfiguradas = ["New", "New Episode", "Featured", "Live", "Exclusive"];
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => onClose ? onClose() : navigate("/videos")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Videos
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Content Info */}
          <Card>
            <CardHeader>
              <CardTitle>Content Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="titulo" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Victory goals against rival" {...field} />
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
                              <SelectValue placeholder="VOD" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="VOD">VOD</SelectItem>
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
                        <Textarea placeholder="Describe the video content..." className="min-h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="cardImageUrl" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Card Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/card.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                <FormField control={form.control} name="bannerImageUrl" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Banner Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/banner.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="streamUrl" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Stream URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/stream.m3u8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                <FormField control={form.control} name="ageRating" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Age Rating</FormLabel>
                        <FormControl>
                          <Input placeholder="G, PG, PG-13, R, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
              </div>

              <FormField control={form.control} name="anoLancamento" render={({
                field
              }) => <FormItem>
                      <FormLabel>Release Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 2024" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
            </CardContent>
          </Card>

          {/* Section 2: Publishing & Visibility */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="visibility" render={({
                  field
                }) => <FormItem>
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
                      </FormItem>} />

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
              </div>

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

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {isEdit ? "Update Video" : "Create Video"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onClose ? onClose() : navigate("/videos")} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>;
}