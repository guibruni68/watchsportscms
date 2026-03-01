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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { TeamMultiSelect, TeamOption } from "@/components/ui/team-multi-select"
import { ArrowLeft, CalendarIcon, Save, Info, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const seasonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  competitionId: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  status: z.enum(["upcoming", "active", "completed"]),
})

type SeasonFormData = z.infer<typeof seasonSchema>

interface SeasonFormProps {
  competitionId?: string
  competitionName?: string
  initialData?: Partial<SeasonFormData>
  initialTeams?: TeamOption[]
  isEdit?: boolean
  onClose?: () => void
}

// Mock available competitions
const mockCompetitions = [
  { id: "1", name: "Liga Nacional de Basquete", acronym: "LNB" },
  { id: "2", name: "Copa do Brasil de Basquete", acronym: "CBB" },
  { id: "3", name: "Champions League", acronym: "UCL" },
  { id: "4", name: "Campeonato Brasileiro", acronym: "CBLOL" },
]

// Mock available teams
const mockAvailableTeams: TeamOption[] = [
  {
    id: "1",
    name: "Basement Basketball",
    acronym: "BSM",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
    city: "Curitiba",
    country: "Brazil"
  },
  {
    id: "2",
    name: "Big City Thunder",
    acronym: "BCT",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
    city: "São Paulo",
    country: "Brazil"
  },
  {
    id: "3",
    name: "Watch Thunders",
    acronym: "WTH",
    logoUrl: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-watchthunders.png",
    city: "Rio de Janeiro",
    country: "Brazil"
  },
  {
    id: "4",
    name: "Nova Thunder",
    acronym: "NTH",
    city: "Belo Horizonte",
    country: "Brazil"
  },
  {
    id: "5",
    name: "Red Rock Stars",
    acronym: "RRS",
    city: "Porto Alegre",
    country: "Brazil"
  },
]

export function SeasonForm({ competitionId, competitionName, initialData, initialTeams = [], isEdit = false, onClose }: SeasonFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)

  // Team selection state
  const [selectedTeams, setSelectedTeams] = useState<TeamOption[]>(initialTeams)

  // Determine the back navigation path
  const getBackPath = () => {
    if (onClose) return null // Will use onClose callback
    if (competitionId) return `/competitions/${competitionId}`
    return "/seasons"
  }

  const form = useForm<SeasonFormData>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      name: initialData?.name || "",
      competitionId: initialData?.competitionId || competitionId || "",
      startDate: initialData?.startDate,
      endDate: initialData?.endDate,
      status: initialData?.status || "upcoming",
    },
  })

  const { formState: { isDirty } } = form

  // Check if teams have been modified
  const initialTeamIds = initialTeams.map(t => t.id).sort().join(',')
  const currentTeamIds = selectedTeams.map(t => t.id).sort().join(',')
  const teamsModified = initialTeamIds !== currentTeamIds
  const hasChanges = isDirty || teamsModified

  const handleNavigation = (navigateFn: () => void) => {
    if (hasChanges) {
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

  const onSubmit = (data: SeasonFormData) => {
    console.log("Saving season:", data)
    console.log("Selected teams:", selectedTeams.map(t => t.id))

    toast({
      title: isEdit ? "Season updated!" : "Season created!",
      description: `${data.name} was ${isEdit ? "updated" : "created"} successfully with ${selectedTeams.length} team(s).`,
    })

    if (onClose) {
      onClose()
    } else {
      const backPath = getBackPath()
      if (backPath) navigate(backPath)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigation(() => {
            if (onClose) {
              onClose()
            } else {
              const backPath = getBackPath()
              if (backPath) navigate(backPath)
            }
          })}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? "Edit Season" : "New Season"}</h1>
          {competitionName && <p className="text-sm text-muted-foreground">{competitionName}</p>}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="information" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="information" className="flex items-center gap-1.5"><Info className="h-3.5 w-3.5" />Information</TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />Teams</TabsTrigger>
            </TabsList>

            {/* Tab 1: Information */}
            <TabsContent value="information">
              <Card>
                <CardHeader>
                  <CardTitle>Season Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="competitionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Competition</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!!competitionId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a competition (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockCompetitions.map(comp => (
                              <SelectItem key={comp.id} value={comp.id}>
                                {comp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Associate this season with a competition
                        </p>
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
                          <Input placeholder="Ex: Temporada 2024/2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date *</FormLabel>
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
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date *</FormLabel>
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Teams */}
            <TabsContent value="teams">
              <Card>
                <CardHeader>
                  <CardTitle>Participating Teams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TeamMultiSelect
                    teams={mockAvailableTeams}
                    value={selectedTeams}
                    onChange={setSelectedTeams}
                    placeholder="Search and select teams..."
                  />
                  <p className="text-sm text-muted-foreground">
                    Select the teams that will participate in this season
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNavigation(() => {
                if (onClose) {
                  onClose()
                } else {
                  const backPath = getBackPath()
                  if (backPath) navigate(backPath)
                }
              })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Save Changes" : "Create Season"}
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
