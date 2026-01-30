import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { Country, City, ICountry, ICity } from "country-state-city"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/ui/file-upload"
import { Input } from "@/components/ui/input"

const stadiumSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  enabled: z.boolean(),
})

type StadiumFormData = z.infer<typeof stadiumSchema>

interface StadiumFormProps {
  initialData?: Partial<StadiumFormData>
  isEdit?: boolean
  onClose: () => void
}

export function StadiumForm({ initialData, isEdit = false, onClose }: StadiumFormProps) {
  const { toast } = useToast()
  const [countries] = useState<ICountry[]>(Country.getAllCountries())
  const [cities, setCities] = useState<ICity[]>([])
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("")

  const form = useForm<StadiumFormData>({
    resolver: zodResolver(stadiumSchema),
    defaultValues: {
      name: initialData?.name || "",
      country: initialData?.country || "",
      city: initialData?.city || "",
      address: initialData?.address || "",
      imageUrl: initialData?.imageUrl || "",
      enabled: initialData?.enabled ?? true,
    },
  })

  // Initialize country code when editing
  useEffect(() => {
    if (initialData?.country) {
      const country = countries.find(c => c.name === initialData.country)
      if (country) {
        setSelectedCountryCode(country.isoCode)
        const countryCities = City.getCitiesOfCountry(country.isoCode) || []
        setCities(countryCities)
      }
    }
  }, [initialData?.country, countries])

  // Update cities when country changes
  const handleCountryChange = (countryName: string) => {
    const country = countries.find(c => c.name === countryName)
    if (country) {
      setSelectedCountryCode(country.isoCode)
      const countryCities = City.getCitiesOfCountry(country.isoCode) || []
      setCities(countryCities)
      form.setValue("country", countryName)
      form.setValue("city", "") // Reset city when country changes
    }
  }

  const onSubmit = async (data: StadiumFormData) => {
    try {
      console.log("Form data:", data)
      toast({
        title: isEdit ? "Stadium updated" : "Stadium created",
        description: `Stadium "${data.name}" has been ${isEdit ? "updated" : "created"} successfully.`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stadiums
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{isEdit ? "Edit Stadium" : "New Stadium"}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="information" className="space-y-6">
            <TabsList>
              <TabsTrigger value="information">Information</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="information" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter stadium name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={handleCountryChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
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

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!selectedCountryCode || cities.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={
                                  !selectedCountryCode
                                    ? "Select a country first"
                                    : cities.length === 0
                                      ? "No cities available"
                                      : "Select a city"
                                } />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {cities.map((city, index) => (
                                <SelectItem key={`${city.name}-${index}`} value={city.name}>
                                  {city.name}
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter stadium address" {...field} />
                        </FormControl>
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
                          <p className="text-sm text-muted-foreground">
                            Enable or disable this stadium
                          </p>
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

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stadium Image</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            accept="image/*"
                            maxSize={5}
                            placeholder="Upload stadium image or enter URL"
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

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Save Changes" : "Create Stadium"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
