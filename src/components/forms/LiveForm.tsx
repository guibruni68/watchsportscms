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
import { ArrowLeft, CalendarIcon, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { mockPlayers, mockTeams } from "@/data/mockData";
import { AgentMultiSelect } from "@/components/ui/agent-multi-select";


const liveSchema = z.object({
  nomeEvento: z.string().min(1, "Event name is required"),
  descricao: z.string().min(1, "Description is required"),
  generos: z.array(z.string()).min(1, "At least one genre is required"),
  dataHora: z.date(),
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

  // Parse initial datetime if provided
  const initialDateTime = initialData?.dataHora ? new Date(initialData.dataHora) : new Date();
  
  const form = useForm<LiveFormData>({
    resolver: zodResolver(liveSchema),
    defaultValues: {
      nomeEvento: initialData?.nomeEvento || "",
      descricao: initialData?.descricao || "",
      generos: initialData?.generos || [],
      dataHora: initialDateTime,
      playerEmbed: initialData?.playerEmbed || "",
      imagemCapa: initialData?.imagemCapa || "",
      
      agentesRelacionados: initialData?.agentesRelacionados || [],
    }
  });
  const onSubmit = (data: LiveFormData) => {
    console.log("Saving live:", data);
    toast({
      title: isEdit ? "Live updated!" : "Live created!",
      description: `${data.nomeEvento} was ${isEdit ? "updated" : "created"} successfully.`
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
        <Button variant="ghost" size="sm" onClick={() => onClose ? onClose() : navigate("/lives")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Live Streams
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Live Stream" : "New Live Stream"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField control={form.control} name="nomeEvento" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Event Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: State Championship Final" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="generos" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Genres *</FormLabel>
                        <div className="space-y-4">
                          <Select onValueChange={(value) => {
                            if (!field.value?.includes(value)) {
                              field.onChange([...(field.value || []), value]);
                            }
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select genres" />
                            </SelectTrigger>
                            <SelectContent>
                              {generos
                                .filter(genero => !field.value?.includes(genero))
                                .map((genero) => (
                                <SelectItem key={genero} value={genero}>
                                  {genero}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.value && field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((genero) => (
                                <Badge key={genero} variant="secondary" className="flex items-center gap-1">
                                  {genero}
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => {
                                      field.onChange(field.value?.filter(g => g !== genero) || []);
                                    }}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>} />
                </div>

                <div className="space-y-6">
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
                                onClick={() => document.getElementById('live-cover-image-input')?.click()}
                              >
                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground mb-1">
                                  Click to upload cover image
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG up to 5MB
                                </p>
                                <Input 
                                  id="live-cover-image-input"
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
                                <img src={field.value} alt="Live cover" className="w-full h-32 object-cover rounded-lg border" />
                                <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => field.onChange("")}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>
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

              <FormField control={form.control} name="dataHora" render={({
                field
              }) => (
                <FormItem>
                  <FormLabel>Date and Time *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "justify-start text-left font-normal w-full", 
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP 'at' p", { locale: ptBR })
                          ) : (
                            <span>Select date and time</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="flex">
                        <Calendar 
                          mode="single" 
                          selected={field.value} 
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = field.value || new Date();
                              date.setHours(currentTime.getHours());
                              date.setMinutes(currentTime.getMinutes());
                              field.onChange(date);
                            }
                          }}
                          initialFocus 
                          className="pointer-events-auto rounded-r-none border-r" 
                        />
                        <div className="p-4 border-l w-[200px]">
                          <label className="text-sm font-medium mb-3 block">Time</label>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Hour</label>
                              <Input
                                type="number"
                                min="0"
                                max="23"
                                placeholder="HH"
                                value={field.value ? field.value.getHours().toString().padStart(2, '0') : ''}
                                onChange={(e) => {
                                  const hour = parseInt(e.target.value);
                                  if (!isNaN(hour) && hour >= 0 && hour <= 23) {
                                    const newDate = new Date(field.value || new Date());
                                    newDate.setHours(hour);
                                    field.onChange(newDate);
                                  }
                                }}
                                className="text-center"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Minutes</label>
                              <Input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="MM"
                                value={field.value ? field.value.getMinutes().toString().padStart(2, '0') : ''}
                                onChange={(e) => {
                                  const minutes = parseInt(e.target.value);
                                  if (!isNaN(minutes) && minutes >= 0 && minutes <= 59) {
                                    const newDate = new Date(field.value || new Date());
                                    newDate.setMinutes(minutes);
                                    field.onChange(newDate);
                                  }
                                }}
                                className="text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

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

              <FormField control={form.control} name="playerEmbed" render={({
              field
            }) => <FormItem>
                    <FormLabel>Stream Link
              </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the embed code from YouTube, Twitch or other player..." className="min-h-24 font-mono text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  {isEdit ? "Update Live Stream" : "Create Live Stream"}
                </Button>
                <Button type="button" variant="outline" onClick={() => onClose ? onClose() : navigate("/lives")} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>;
}