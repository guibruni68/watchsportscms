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
  tags: z.string(),
  generos: z.array(z.string()).min(1, "At least one genre is required"),
  tag: z.string().min(1, "Tag is required"),
  dataProducao: z.date(),
  agendarPublicacao: z.boolean(),
  dataPublicacao: z.date().optional(),
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
  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      titulo: initialData?.titulo || "",
      descricao: initialData?.descricao || "",
      tags: initialData?.tags || "",
      generos: initialData?.generos || [],
      tag: initialData?.tag || "",
      dataProducao: initialData?.dataProducao || new Date(),
      agendarPublicacao: false,
      dataPublicacao: undefined,
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

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Video" : "New Video"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField control={form.control} name="titulo" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Victory goals against rival" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="generos" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Genres *</FormLabel>
                        <div className="space-y-4">
                          <Select onValueChange={value => {
                      if (!field.value?.includes(value)) {
                        field.onChange([...(field.value || []), value]);
                      }
                    }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select genres" />
                            </SelectTrigger>
                            <SelectContent>
                              {generos.filter(genero => !field.value?.includes(genero)).map(genero => <SelectItem key={genero} value={genero}>
                                  {genero}
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                          {field.value && field.value.length > 0 && <div className="flex flex-wrap gap-2">
                              {field.value.map(genero => <Badge key={genero} variant="secondary" className="flex items-center gap-1">
                                  {genero}
                                  <X className="h-3 w-3 cursor-pointer" onClick={() => {
                          field.onChange(field.value?.filter(g => g !== genero) || []);
                        }} />
                                </Badge>)}
                            </div>}
                        </div>
                        <FormMessage />
                      </FormItem>} />

                <FormField control={form.control} name="tag" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Tag *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tagsPreConfiguradas.map(tag => <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />
                </div>

                <FormField control={form.control} name="imagemCapa" render={({
                field
              }) => <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <div className="flex gap-2 mb-4">
                        <Button
                          type="button"
                          variant={imageUploadMode === "file" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setImageUploadMode("file")}
                        >
                          Upload File
                        </Button>
                        <Button
                          type="button"
                          variant={imageUploadMode === "url" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setImageUploadMode("url")}
                        >
                          Image URL
                        </Button>
                      </div>
                      <FormControl>
                        <div className="space-y-4">
                          {!field.value && imageUploadMode === "file" && (
                            <div 
                              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                              onClick={() => document.getElementById('cover-image-input')?.click()}
                            >
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">
                                Click to upload cover image
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG up to 5MB
                              </p>
                              <Input 
                                id="cover-image-input"
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
                          {!field.value && imageUploadMode === "url" && (
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
                          {field.value && <div className="relative">
                              <img src={field.value} alt="Video cover" className="w-full h-32 object-cover rounded-lg border" />
                              <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => field.onChange("")}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>}
                        </div>
                      </FormControl>
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
                <FormField control={form.control} name="tags" render={({
                field
              }) => <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: goals, victory, championship (comma separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="dataProducao" render={({
                field
              }) => <FormItem className="flex flex-col">
                      <FormLabel>Production Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>} />
              </div>

              {/* Publish Scheduling */}
              <div className="space-y-4 border rounded-lg p-4">
                <FormField control={form.control} name="agendarPublicacao" render={({
                field
              }) => <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Schedule publication
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          If disabled, content will be published immediately
                        </p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>} />

                {form.watch("agendarPublicacao") && <FormField control={form.control} name="dataPublicacao" render={({
                field
              }) => <FormItem className="flex flex-col">
                        <FormLabel>Publication Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date < new Date()} initialFocus className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>} />}
              </div>

              <FormField control={form.control} name="agentesRelacionados" render={({
              field
            }) => <FormItem>
                    <FormLabel>Related Agents & Groups</FormLabel>
                    <FormControl>
                      <AgentMultiSelect
                        players={mockPlayers.map(p => ({
                          id: p.id,
                          name: p.name,
                          number: p.number
                        }))}
                        teams={mockTeams.map(t => ({
                          id: t.id,
                          name: t.name
                        }))}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Search and select agents or groups..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="videoFile" render={({
              field
            }) => <FormItem>
                    <FormLabel>Video File</FormLabel>
                    <div className="flex gap-2 mb-4">
                      <Button
                        type="button"
                        variant={videoUploadMode === "file" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setVideoUploadMode("file")}
                      >
                        Upload File
                      </Button>
                      <Button
                        type="button"
                        variant={videoUploadMode === "url" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setVideoUploadMode("url")}
                      >
                        Video URL
                      </Button>
                    </div>
                    <FormControl>
                      {videoUploadMode === "file" ? (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                          onClick={() => document.getElementById('video-file-input')?.click()}
                        >
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Click to upload or drag file here
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Accepted formats: MP4, AVI, MOV (max. 500MB)
                          </p>
                          {field.value && !field.value.startsWith('http') && (
                            <p className="text-xs text-primary mt-2">
                              Selected: {field.value}
                            </p>
                          )}
                          <Input 
                            id="video-file-input"
                            type="file" 
                            accept="video/*" 
                            className="hidden" 
                            onChange={e => field.onChange(e.target.files?.[0]?.name || "")} 
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Input 
                            placeholder="https://example.com/video.mp4" 
                            value={field.value || ""} 
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter the direct URL to your video file
                          </p>
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  {isEdit ? "Update Video" : "Create Video"}
                </Button>
                <Button type="button" variant="outline" onClick={() => onClose ? onClose() : navigate("/videos")} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>;
}