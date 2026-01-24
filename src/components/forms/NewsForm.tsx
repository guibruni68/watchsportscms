import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { GenreMultiSelect } from "@/components/ui/genre-multi-select"
import { AgentMultiSelect } from "@/components/ui/agent-multi-select"
import { ArrowLeft, CalendarIcon, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { mockGenres, mockPlayers, mockTeams } from "@/data/mockData"

const newsSchema = z.object({
  title: z.string().min(1, "Internal title is required"),
  header: z.string().min(1, "News headline is required"),
  firstText: z.string().min(1, "First content block is required"),
  lastText: z.string().min(1, "Last content block is required"),
  firstImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  secondImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  highlighted: z.boolean(),
  date: z.date(),
  scheduleDate: z.date().optional(),
  enabled: z.boolean(),
  genres: z.array(z.string()).optional(),
  agentesRelacionados: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["agent", "group"])
  })).optional(),
})

type NewsFormData = z.infer<typeof newsSchema>

interface NewsFormProps {
  initialData?: Partial<NewsFormData>
  isEdit?: boolean
  onClose?: () => void
}

export function NewsForm({ initialData, isEdit = false, onClose }: NewsFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: initialData?.title || "",
      header: initialData?.header || "",
      firstText: initialData?.firstText || "",
      lastText: initialData?.lastText || "",
      firstImageUrl: initialData?.firstImageUrl || "",
      secondImageUrl: initialData?.secondImageUrl || "",
      highlighted: initialData?.highlighted || false,
      date: initialData?.date || new Date(),
      scheduleDate: initialData?.scheduleDate,
      enabled: initialData?.enabled ?? true,
      genres: initialData?.genres || [],
      agentesRelacionados: initialData?.agentesRelacionados || [],
    },
  })

  const {
    formState: { isDirty }
  } = form

  const handleNavigation = (navigateFn: () => void) => {
    if (isDirty) {
      setPendingNavigation(() => navigateFn)
      setShowExitConfirmation(true)
    } else {
      navigateFn()
    }
  }

  const handleConfirmExit = () => {
    setShowExitConfirmation(false)
    pendingNavigation?.()
  }

  const onSubmit = (data: NewsFormData) => {
    // Add published as true internally
    const newsData = { ...data, published: true }
    console.log("Saving news:", newsData)
    
    toast({
      title: isEdit ? "News updated!" : "News created!",
      description: `${data.title} was ${isEdit ? "updated" : "created"} successfully.`,
    })
    
    if (onClose) {
      onClose()
    } else {
      navigate("/news")
    }
  }

  const newsGenres = mockGenres.filter(g => g.type === "news")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/news"))}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="information" className="w-full">
            <div className="rounded-lg bg-transparent p-0 border-0 pb-4">
              <TabsList className="inline-flex h-auto items-center justify-start rounded-t-lg bg-transparent p-0 text-muted-foreground border-0 w-full">
                <TabsTrigger 
                  value="information" 
                  className="relative flex items-center justify-center whitespace-nowrap rounded-t-lg px-6 py-3 text-base font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  Information
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="relative flex items-center justify-center whitespace-nowrap rounded-t-lg px-6 py-3 text-base font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger 
                  value="classification" 
                  className="relative flex items-center justify-center whitespace-nowrap rounded-t-lg px-6 py-3 text-base font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  Classification
                </TabsTrigger>
                <TabsTrigger 
                  value="publishing" 
                  className="relative flex items-center justify-center whitespace-nowrap rounded-t-lg px-6 py-3 text-base font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  Publishing
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Information */}
            <TabsContent value="information">
              <Card>
                <CardHeader>
                  <CardTitle>Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internal Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Nova contratação 2024" {...field} />
                          </FormControl>
                          <FormDescription>
                            Used for CMS organization (not shown publicly)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="header"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>News Headline *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Club announces new signing for 2024" {...field} />
                          </FormControl>
                          <FormDescription>
                            Public-facing news title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="firstText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Content Block *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Opening paragraph of the news article..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Content Block *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Closing paragraph of the news article..." 
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
                    name="firstImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Primary image shown at the top of the article
                        </FormDescription>
                        <FormMessage />
                        {field.value && (
                          <div className="relative mt-2">
                            <img 
                              src={field.value} 
                              alt="Main preview" 
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mid-Banner Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/banner.jpg" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Secondary image shown between content blocks
                        </FormDescription>
                        <FormMessage />
                        {field.value && (
                          <div className="relative mt-2">
                            <img 
                              src={field.value} 
                              alt="Banner preview" 
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
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Classification */}
            <TabsContent value="classification">
              <Card>
                <CardHeader>
                  <CardTitle>Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="genres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>News Types</FormLabel>
                        <FormControl>
                          <GenreMultiSelect
                            selectedGenres={field.value || []}
                            onGenresChange={field.onChange}
                            genreType="news"
                            availableGenres={newsGenres}
                            placeholder="Select news types..."
                          />
                        </FormControl>
                        <FormDescription>
                          Categorize the type of news (Breaking News, Transfers, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agentesRelacionados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Agents/Groups</FormLabel>
                        <FormControl>
                          <AgentMultiSelect
                            players={mockPlayers}
                            teams={mockTeams}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Link agents or groups..."
                          />
                        </FormControl>
                        <FormDescription>
                          Optionally link this news to specific players, coaches, or teams
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Publication Date *</FormLabel>
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
                                    <span>Pick a date</span>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                                    <span>Pick a schedule date</span>
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
                            If set, content will be automatically disabled until this date
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="highlighted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Highlighted
                            </FormLabel>
                            <FormDescription>
                              Feature this news
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

                    <FormField
                      control={form.control}
                      name="enabled"
                      render={({ field }) => {
                        const hasScheduledDate = !!form.watch("scheduleDate");
                        const scheduleDatePassed = hasScheduledDate && form.watch("scheduleDate") && new Date(form.watch("scheduleDate")!) < new Date();
                        
                        return (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Enabled
                              </FormLabel>
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
                        )
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/news"))}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isEdit ? "Update News" : "Create News"}
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
    </div>
  )
}
