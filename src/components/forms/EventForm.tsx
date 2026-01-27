import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CalendarIcon, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().min(1, "Event description is required"),
  date: z.date(),
  cardImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  redirectionUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  enabled: z.boolean(),
})

type EventFormData = z.infer<typeof eventSchema>

interface EventFormProps {
  initialData?: Partial<EventFormData>
  isEdit?: boolean
  onClose?: () => void
}

export function EventForm({ initialData, isEdit = false, onClose }: EventFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date || new Date(),
      cardImageUrl: initialData?.cardImageUrl || "",
      redirectionUrl: initialData?.redirectionUrl || "",
      enabled: initialData?.enabled ?? true,
    },
  })

  const onSubmit = (data: EventFormData) => {
    console.log("Saving event:", data)
    
    toast({
      title: isEdit ? "Event updated!" : "Event created!",
      description: `${data.title} was ${isEdit ? "updated" : "created"} successfully.`,
    })
    
    if (onClose) {
      onClose()
    } else {
      navigate("/schedule")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onClose ? onClose() : navigate("/schedule")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="information" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="information">Information</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="publishing">Publishing</TabsTrigger>
            </TabsList>

            {/* Tab 1: Information */}
            <TabsContent value="information">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Regional Classic - Main Team vs Rival FC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of the event..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="cardImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/event-card.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Image displayed on the event card
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("cardImageUrl") && (
                    <div className="space-y-2">
                      <div className="relative rounded-lg overflow-hidden border">
                        <img
                          src={form.watch("cardImageUrl")}
                          alt="Event card preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => form.setValue("cardImageUrl", "")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="redirectionUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Redirection URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/event-details"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          External link for more event details or ticket purchase
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Publishing */}
            <TabsContent value="publishing">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Event Date *</FormLabel>
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
                                  format(field.value, "PPP 'at' p")
                                ) : (
                                  <span>Pick event date and time</span>
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
                            <div className="p-3 border-t">
                              <Input
                                type="time"
                                value={field.value ? format(field.value, "HH:mm") : ""}
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':')
                                  const newDate = field.value || new Date()
                                  newDate.setHours(parseInt(hours), parseInt(minutes))
                                  field.onChange(newDate)
                                }}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When the event will take place
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enabled</FormLabel>
                          <FormDescription>
                            Event will be visible to users when enabled
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose ? onClose() : navigate("/schedule")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
