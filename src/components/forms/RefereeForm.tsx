import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/ui/file-upload"
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog"
import { ArrowLeft, X, Info, ImageIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { TutorialButton } from "@/components/ui/tutorial-button"
import { useNavigationGuard } from "@/hooks/useNavigationGuard"

const sportTypes = [
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "volleyball", label: "Volleyball" },
  { value: "handball", label: "Handball" },
  { value: "futsal", label: "Futsal" },
  { value: "tennis", label: "Tennis" },
  { value: "swimming", label: "Swimming" },
  { value: "athletics", label: "Athletics" },
]

const refereeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fullName: z.string().min(1, "Full name is required"),
  sportType: z.string().min(1, "Sport type is required"),
  imagePrimaryUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imageSecondaryUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  enabled: z.boolean(),
})

type RefereeFormData = z.infer<typeof refereeSchema>

interface RefereeFormProps {
  initialData?: Partial<RefereeFormData>
  isEdit?: boolean
  onClose?: () => void
}

export function RefereeForm({ initialData, isEdit = false, onClose }: RefereeFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const form = useForm<RefereeFormData>({
    resolver: zodResolver(refereeSchema),
    defaultValues: {
      name: initialData?.name || "",
      fullName: initialData?.fullName || "",
      sportType: initialData?.sportType || "",
      imagePrimaryUrl: initialData?.imagePrimaryUrl || "",
      imageSecondaryUrl: initialData?.imageSecondaryUrl || "",
      enabled: initialData?.enabled ?? true,
    },
  })

  const { formState: { isDirty } } = form
  const { isBlocked, proceed, reset: resetGuard, guardNavigation } = useNavigationGuard(isDirty)

  const onSubmit = (data: RefereeFormData) => {
    console.log("Saving referee:", data)

    toast({
      title: isEdit ? "Referee updated!" : "Referee created!",
      description: `${data.name} was ${isEdit ? "updated" : "created"} successfully.`,
    })

    if (onClose) {
      onClose()
    } else {
      navigate("/referees")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => guardNavigation(() => onClose ? onClose() : navigate("/referees"))}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Referee" : "New Referee"}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="information" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="information" className="flex items-center gap-1.5"><Info className="h-3.5 w-3.5" />Information</TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" />Media</TabsTrigger>
            </TabsList>

            {/* Tab 1: Information */}
            <TabsContent value="information">
              <Card>
                <CardHeader>
                  <CardTitle>Referee Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Carlos Alberto da Silva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Carlos Silva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="sportType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type (Sport) *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a sport type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sportTypes.map((sport) => (
                                <SelectItem key={sport.value} value={sport.value}>
                                  {sport.label}
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
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enabled</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Make this referee visible and active
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
                  <CardTitle>Referee Media</CardTitle>
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
              onClick={() => guardNavigation(() => onClose ? onClose() : navigate("/referees"))}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isEdit ? "Update Referee" : "Create Referee"}
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

      <UnsavedChangesDialog open={isBlocked} onConfirm={proceed} onCancel={resetGuard} />
      <TutorialButton />
    </div>
  )
}
