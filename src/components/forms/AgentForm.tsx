import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenreMultiSelect } from "@/components/ui/genre-multi-select"
import { mockGenres } from "@/data/mockData"
import { cn } from "@/lib/utils"

const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.enum(["player", "coach", "writer"]),
  genres: z.array(z.string()).optional(),  // Array of genre IDs
  nationality: z.string().min(1, "Nationality is required"),
  originDate: z.date().optional(),
  imagePrimaryUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imageSecondaryUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  enabled: z.boolean(),
})

type AgentFormData = z.infer<typeof agentSchema>

interface AgentFormProps {
  initialData?: Partial<AgentFormData>
  isEdit?: boolean
  onClose: () => void
}

export function AgentForm({ initialData, isEdit = false, onClose }: AgentFormProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: initialData?.name || "",
      label: initialData?.label || "player",
      genres: initialData?.genres || [],
      nationality: initialData?.nationality || "",
      originDate: initialData?.originDate,
      imagePrimaryUrl: initialData?.imagePrimaryUrl || "",
      imageSecondaryUrl: initialData?.imageSecondaryUrl || "",
      enabled: initialData?.enabled ?? true,
    },
  })

  const watchOriginDate = watch("originDate")
  const watchLabel = watch("label")
  const watchGenres = watch("genres")
  const watchEnabled = watch("enabled")
  const watchImagePrimary = watch("imagePrimaryUrl")
  const watchImageSecondary = watch("imageSecondaryUrl")

  // Update available positions when label changes
  // Later this will be replaced with an API call
  const handleLabelChange = (value: "player" | "coach" | "writer") => {
    setValue("label", value)
    // Clear the genres when changing label
    setValue("genres", [])
  }

  const onSubmit = (data: AgentFormData) => {
    console.log("Form data:", data)
    // Here you would typically save the data
    onClose()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Agent" : "New Agent"}
        </h1>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="information" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* Tab 1: Information */}
          <TabsContent value="information">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Enter agent name"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="label">Label *</Label>
                    <Select
                      value={watchLabel}
                      onValueChange={handleLabelChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select label" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="player">Player</SelectItem>
                        <SelectItem value="coach">Coach</SelectItem>
                        <SelectItem value="writer">Writer</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.label && (
                      <p className="text-sm text-destructive">{errors.label.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genres">Positions / Roles</Label>
                  <GenreMultiSelect
                    selectedGenres={watchGenres || []}
                    onGenresChange={(genreIds) => setValue("genres", genreIds)}
                    genreType="agent"
                    availableGenres={mockGenres}
                    placeholder={`Select ${watchLabel === 'player' ? 'positions' : 'roles'}...`}
                  />
                  <p className="text-sm text-muted-foreground">
                    Select or create {watchLabel === 'player' ? 'positions' : 'roles'} for this {watchLabel}
                  </p>
                  {errors.genres && (
                    <p className="text-sm text-destructive">{errors.genres.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      {...register("nationality")}
                      placeholder="Enter nationality"
                    />
                    {errors.nationality && (
                      <p className="text-sm text-destructive">{errors.nationality.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Origin Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !watchOriginDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watchOriginDate ? (
                            format(watchOriginDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={watchOriginDate}
                          onSelect={(date) => setValue("originDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enabled">Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable this agent
                    </p>
                  </div>
                  <Switch
                    id="enabled"
                    checked={watchEnabled}
                    onCheckedChange={(checked) => setValue("enabled", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Media */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imagePrimaryUrl">Primary Image URL (Square)</Label>
                  <Input
                    id="imagePrimaryUrl"
                    {...register("imagePrimaryUrl")}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.imagePrimaryUrl && (
                    <p className="text-sm text-destructive">{errors.imagePrimaryUrl.message}</p>
                  )}
                  {watchImagePrimary && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <img
                        src={watchImagePrimary}
                        alt="Primary preview"
                        className="h-32 w-32 object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => setLightboxImage(watchImagePrimary)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageSecondaryUrl">Secondary Image URL (Banner)</Label>
                  <Input
                    id="imageSecondaryUrl"
                    {...register("imageSecondaryUrl")}
                    placeholder="https://example.com/banner.jpg"
                  />
                  {errors.imageSecondaryUrl && (
                    <p className="text-sm text-destructive">{errors.imageSecondaryUrl.message}</p>
                  )}
                  {watchImageSecondary && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <img
                        src={watchImageSecondary}
                        alt="Secondary preview"
                        className="h-32 w-full object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => setLightboxImage(watchImageSecondary)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {isEdit ? "Update Agent" : "Create Agent"}
          </Button>
        </div>
      </form>

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
    </div>
  )
}
