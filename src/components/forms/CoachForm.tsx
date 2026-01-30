import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { FileUpload } from "@/components/ui/file-upload"
import { ArrowLeft, CalendarIcon, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const coachSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required"),
  birthDate: z.date().optional(),
  imagePrimaryUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imageSecondaryUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  enabled: z.boolean(),
})

type CoachFormData = z.infer<typeof coachSchema>

interface CoachFormProps {
  initialData?: Partial<CoachFormData>
  isEdit?: boolean
  onClose?: () => void
}

export function CoachForm({ initialData, isEdit = false, onClose }: CoachFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)

  const form = useForm<CoachFormData>({
    resolver: zodResolver(coachSchema),
    defaultValues: {
      name: initialData?.name || "",
      role: initialData?.role || "",
      nationality: initialData?.nationality || "",
      birthDate: initialData?.birthDate,
      imagePrimaryUrl: initialData?.imagePrimaryUrl || "",
      imageSecondaryUrl: initialData?.imageSecondaryUrl || "",
      enabled: initialData?.enabled ?? true,
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

  const onSubmit = (data: CoachFormData) => {
    console.log("Saving coach:", data)

    toast({
      title: isEdit ? "Coach updated!" : "Coach created!",
      description: `${data.name} was ${isEdit ? "updated" : "created"} successfully.`,
    })

    if (onClose) {
      onClose()
    } else {
      navigate("/coaches")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/coaches"))}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Coach" : "New Coach"}</h1>
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
                  <CardTitle>Coach Information</CardTitle>
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
                            <Input placeholder="Ex: Pep Guardiola" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Head Coach" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Spain" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Birth Date</FormLabel>
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
                                  date > new Date() || date < new Date("1900-01-01")
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
                  </div>

                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enabled</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Make this coach visible and active
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
                  <CardTitle>Coach Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primary Image */}
                  <FormField
                    control={form.control}
                    name="imagePrimaryUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Image (Square)</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value || ""}
                            onChange={field.onChange}
                            label="Choose a file or drag & drop it here"
                            description="JPEG, PNG, and WEBP formats, up to 50MB"
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Square image for profile display (1:1 aspect ratio recommended)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Secondary/Banner Image */}
                  <FormField
                    control={form.control}
                    name="imageSecondaryUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Image (Banner)</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value || ""}
                            onChange={field.onChange}
                            label="Choose a file or drag & drop it here"
                            description="JPEG, PNG, and WEBP formats, up to 50MB"
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Banner image for detail pages (16:9 aspect ratio recommended)
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
              onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/coaches"))}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isEdit ? "Update Coach" : "Create Coach"}
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
