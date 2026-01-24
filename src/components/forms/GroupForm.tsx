import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { GenreMultiSelect } from "@/components/ui/genre-multi-select"
import { AgentMultiSelect } from "@/components/ui/agent-multi-select"
import { mockGenres, mockPlayers, mockTeams } from "@/data/mockData"
import { ArrowLeft, CalendarIcon, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const groupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  acronym: z.string().min(1, "Acronym is required").max(10, "Acronym must be 10 characters or less"),
  genre: z.enum(["league", "team"]),
  genres: z.array(z.string()).optional(),
  description: z.string().min(1, "Description is required"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  cardImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bannerImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  originDate: z.date().optional(),
  enabled: z.boolean(),
  agentesRelacionados: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["agent", "group"]),
  })).optional(),
})

type GroupFormData = z.infer<typeof groupSchema>

interface GroupFormProps {
  initialData?: Partial<GroupFormData>
  isEdit?: boolean
  onClose?: () => void
}

export function GroupForm({ initialData, isEdit = false, onClose }: GroupFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: initialData?.name || "",
      acronym: initialData?.acronym || "",
      genre: initialData?.genre || "team",
      genres: initialData?.genres || [],
      description: initialData?.description || "",
      logoUrl: initialData?.logoUrl || "",
      cardImageUrl: initialData?.cardImageUrl || "",
      bannerImageUrl: initialData?.bannerImageUrl || "",
      originDate: initialData?.originDate,
      enabled: initialData?.enabled ?? true,
      agentesRelacionados: initialData?.agentesRelacionados || [],
    },
  })

  const { formState: { isDirty } } = form

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

  const onSubmit = (data: GroupFormData) => {
    console.log("Saving group:", data)
    
    toast({
      title: isEdit ? "Group updated!" : "Group created!",
      description: `${data.name} was ${isEdit ? "updated" : "created"} successfully.`,
    })
    
    if (onClose) {
      onClose()
    } else {
      navigate("/groups")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/groups"))}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
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
                  value="agents" 
                  className="relative flex items-center justify-center whitespace-nowrap rounded-t-lg px-6 py-3 text-base font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  Agents
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Information */}
            <TabsContent value="information">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: FC Barcelona" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="acronym"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Acronym *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: FCB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="league">League</SelectItem>
                            <SelectItem value="team">Team</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <GenreMultiSelect
                            selectedGenres={field.value || []}
                            onGenresChange={field.onChange}
                            genreType="group"
                            availableGenres={mockGenres}
                            placeholder="Select or create categories..."
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Add categories to classify this group (e.g., Professional League, Youth Team, etc.)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a description for the group..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="originDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Origin Date</FormLabel>
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
                              disabled={(date) =>
                                date > new Date() || date < new Date("1800-01-01")
                              }
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
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
                          <div className="text-sm text-muted-foreground">
                            Make this group visible and active
                          </div>
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

            {/* Tab 2: Media */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo */}
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/logo.png"
                            {...field}
                          />
                        </FormControl>
                        {field.value && (
                          <div className="mt-2 relative group">
                            <img
                              src={field.value}
                              alt="Logo preview"
                              className="h-32 w-32 object-contain border rounded cursor-pointer hover:opacity-75 transition-opacity"
                              onClick={() => setLightboxImage(field.value)}
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Card Image */}
                  <FormField
                    control={form.control}
                    name="cardImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/card-image.png"
                            {...field}
                          />
                        </FormControl>
                        {field.value && (
                          <div className="mt-2 relative group">
                            <img
                              src={field.value}
                              alt="Card preview"
                              className="h-48 w-auto object-contain border rounded cursor-pointer hover:opacity-75 transition-opacity"
                              onClick={() => setLightboxImage(field.value)}
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Banner Image */}
                  <FormField
                    control={form.control}
                    name="bannerImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/banner.png"
                            {...field}
                          />
                        </FormControl>
                        {field.value && (
                          <div className="mt-2 relative group">
                            <img
                              src={field.value}
                              alt="Banner preview"
                              className="h-32 w-full object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity"
                              onClick={() => setLightboxImage(field.value)}
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Agents */}
            <TabsContent value="agents">
              <Card>
                <CardHeader>
                  <CardTitle>Related Agents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="agentesRelacionados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agents</FormLabel>
                        <FormControl>
                          <AgentMultiSelect
                            value={field.value || []}
                            onChange={field.onChange}
                            players={mockPlayers}
                            teams={mockTeams}
                            placeholder="Search and select agents..."
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Add agents (players, coaches, writers) that belong to this group
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/groups"))}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isEdit ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Image Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setLightboxImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            {lightboxImage && (
              <img
                src={lightboxImage}
                alt="Full size preview"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

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
