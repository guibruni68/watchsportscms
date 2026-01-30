import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { useState, useEffect } from "react"
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
import { FileUpload } from "@/components/ui/file-upload"
import { ArrowLeft, CalendarIcon, X, Save } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Country } from 'country-state-city'

const competitionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  acronym: z.string().min(1, "Acronym is required").max(10, "Acronym must be 10 characters or less"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["league", "cup", "tournament"]),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  cardImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bannerImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  originDate: z.date().optional(),
  country: z.string().optional(),
  enabled: z.boolean(),
  teamsRelacionados: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).optional(),
})

type CompetitionFormData = z.infer<typeof competitionSchema>

interface CompetitionFormProps {
  initialData?: Partial<CompetitionFormData>
  isEdit?: boolean
  onClose?: () => void
}

export function CompetitionForm({ initialData, isEdit = false, onClose }: CompetitionFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)

  const form = useForm<CompetitionFormData>({
    resolver: zodResolver(competitionSchema),
    defaultValues: {
      name: initialData?.name || "",
      acronym: initialData?.acronym || "",
      description: initialData?.description || "",
      type: initialData?.type || "league",
      logoUrl: initialData?.logoUrl || "",
      cardImageUrl: initialData?.cardImageUrl || "",
      bannerImageUrl: initialData?.bannerImageUrl || "",
      originDate: initialData?.originDate,
      country: initialData?.country || "",
      enabled: initialData?.enabled ?? true,
      teamsRelacionados: initialData?.teamsRelacionados || [],
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

  const onSubmit = (data: CompetitionFormData) => {
    console.log("Saving competition:", data)

    toast({
      title: isEdit ? "Competition updated!" : "Competition created!",
      description: `${data.name} was ${isEdit ? "updated" : "created"} successfully.`,
    })

    if (onClose) {
      onClose()
    } else {
      navigate("/competitions")
    }
  }

  // Get countries
  const countries = Country.getAllCountries()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/competitions"))}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Competition" : "New Competition"}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="information" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="information">Information</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            {/* Tab 1: Information */}
            <TabsContent value="information">
              <Card>
                <CardHeader>
                  <CardTitle>Competition Information</CardTitle>
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
                            <Input placeholder="Ex: La Liga" {...field} />
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
                            <Input placeholder="Ex: LaLiga" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="type"
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
                              <SelectItem value="cup">Cup</SelectItem>
                              <SelectItem value="tournament">Tournament</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country/Region</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              <SelectItem value="Europe">Europe (Continental)</SelectItem>
                              <SelectItem value="World">World (International)</SelectItem>
                              {countries.map((country) => (
                                <SelectItem key={country.isoCode} value={country.name}>
                                  {country.flag} {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a description for the competition..."
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
                        <FormLabel>First Edition Date</FormLabel>
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
                            Make this competition visible and active
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
                  <CardTitle>Competition Media</CardTitle>
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
                        <p className="text-sm text-muted-foreground">
                          Competition logo image (1:1 aspect ratio recommended)
                        </p>
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
                      </FormItem>
                    )}
                  />

                  {/* Banner Image */}
                  <FormField
                    control={form.control}
                    name="bannerImageUrl"
                    render={({ field }) => (
                      <FormItem>
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
              onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/competitions"))}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Save Changes" : "Create Competition"}
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
