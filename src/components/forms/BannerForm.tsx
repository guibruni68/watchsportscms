import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Upload, CalendarIcon, X, Image as ImageIcon, Monitor, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  layout: z.enum(["hero", "mid"]),
  text: z.string().min(1, "Body text is required"),
  tag: z.enum(["LINE", "NEW", "NEW EPISODES"]).optional(),
  buttonText: z.string().optional(),
  buttonRedirectionUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  scheduleDate: z.date().optional(),
  bgImageUrl: z.string().optional(),
  bgMobileUrl: z.string().optional(),
  enabled: z.boolean()
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  initialData?: Partial<BannerFormData>;
  isEdit?: boolean;
  onClose?: () => void;
}

export function BannerForm({ initialData, isEdit = false, onClose }: BannerFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [uploadingBgImage, setUploadingBgImage] = useState(false);
  const [uploadingMobileImage, setUploadingMobileImage] = useState(false);
  const [bgImagePreview, setBgImagePreview] = useState<string | undefined>(initialData?.bgImageUrl);
  const [mobileImagePreview, setMobileImagePreview] = useState<string | undefined>(initialData?.bgMobileUrl);

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: initialData?.title || "",
      layout: initialData?.layout || "mid",
      text: initialData?.text || "",
      tag: initialData?.tag,
      buttonText: initialData?.buttonText || "",
      buttonRedirectionUrl: initialData?.buttonRedirectionUrl || "",
      scheduleDate: initialData?.scheduleDate,
      bgImageUrl: initialData?.bgImageUrl,
      bgMobileUrl: initialData?.bgMobileUrl,
      enabled: initialData?.enabled ?? true
    }
  });

  const {
    formState: { isDirty }
  } = form;

  const handleNavigation = (navigateFn: () => void) => {
    if (isDirty) {
      setPendingNavigation(() => navigateFn);
      setShowExitConfirmation(true);
    } else {
      navigateFn();
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    pendingNavigation?.();
  };

  const handleBgImageUpload = async (file: File) => {
    setUploadingBgImage(true);
    try {
      // Mock upload - would integrate with actual storage
      const url = URL.createObjectURL(file);
      setBgImagePreview(url);
      form.setValue("bgImageUrl", url);
      toast({
        title: "Image uploaded",
        description: "Background image was uploaded successfully."
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingBgImage(false);
    }
  };

  const handleMobileImageUpload = async (file: File) => {
    setUploadingMobileImage(true);
    try {
      // Mock upload - would integrate with actual storage
      const url = URL.createObjectURL(file);
      setMobileImagePreview(url);
      form.setValue("bgMobileUrl", url);
      toast({
        title: "Image uploaded",
        description: "Mobile image was uploaded successfully."
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingMobileImage(false);
    }
  };

  const onSubmit = (data: BannerFormData) => {
    console.log("Saving banner:", data);
    toast({
      title: isEdit ? "Banner updated!" : "Banner created!",
      description: `${data.title} was ${isEdit ? "updated" : "created"} successfully.`
    });
    if (onClose) {
      onClose();
    } else {
      navigate("/banners");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/banners"))}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Banners
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Banner Info */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Banner title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="layout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select layout..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hero">Hero Banner</SelectItem>
                          <SelectItem value="mid">Mid Banner</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Text *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter banner description..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This text will be displayed on the banner
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="No tag" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No tag</SelectItem>
                        <SelectItem value="LINE">LINE</SelectItem>
                        <SelectItem value="NEW">NEW</SelectItem>
                        <SelectItem value="NEW EPISODES">NEW EPISODES</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Watch Now, Learn More..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonRedirectionUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Banner Images */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Banner Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Desktop Image */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span className="font-medium">Desktop Background</span>
                    </div>
                    <FormDescription>
                      Recommended: {form.watch("layout") === "hero" ? "1920x810px (21:9)" : "1920x1080px (16:9)"}
                    </FormDescription>
                    
                    {bgImagePreview ? (
                      <div className="space-y-3">
                        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                          <img
                            src={bgImagePreview}
                            alt="Desktop preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setBgImagePreview(undefined);
                              form.setValue("bgImageUrl", "");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleBgImageUpload(file);
                          }}
                          className="hidden"
                          id="bg-image-upload"
                        />
                        <label htmlFor="bg-image-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <div className="text-sm text-center">
                              <p className="font-medium">Upload desktop image</p>
                              <p className="text-muted-foreground">Click to select</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    )}
                    {uploadingBgImage && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                        Uploading...
                      </div>
                    )}
                  </div>

                  {/* Mobile Image */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="font-medium">Mobile Background</span>
                    </div>
                    <FormDescription>
                      Recommended: 1080x1920px (9:16)
                    </FormDescription>
                    
                    {mobileImagePreview ? (
                      <div className="space-y-3">
                        <div className="relative w-full aspect-[9/16] max-w-[200px] mx-auto rounded-lg overflow-hidden bg-muted">
                          <img
                            src={mobileImagePreview}
                            alt="Mobile preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setMobileImagePreview(undefined);
                              form.setValue("bgMobileUrl", "");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMobileImageUpload(file);
                          }}
                          className="hidden"
                          id="mobile-image-upload"
                        />
                        <label htmlFor="mobile-image-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <div className="text-sm text-center">
                              <p className="font-medium">Upload mobile image</p>
                              <p className="text-muted-foreground">Click to select</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    )}
                    {uploadingMobileImage && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                        Uploading...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Visibility and Status */}
          <Card>
            <CardHeader>
              <CardTitle>Visibility and Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                              <span>No schedule date</span>
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
                      If set, banner will be automatically disabled until this date
                    </FormDescription>
                    <FormMessage />
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
                        <FormLabel className="text-base">Enabled</FormLabel>
                        <FormDescription>
                          {hasScheduledDate 
                            ? scheduleDatePassed 
                              ? "Schedule date has passed - you can enable manually"
                              : "Banner with future schedule date is automatically disabled"
                            : "Enable or disable this banner manually"}
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
                  );
                }}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNavigation(() => onClose ? onClose() : navigate("/banners"))}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isEdit ? "Update Banner" : "Create Banner"}
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
  );
}
