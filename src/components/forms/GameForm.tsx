import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, Clock, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const gameSchema = z.object({
  homeTeamId: z.string().min(1, "Home team is required"),
  awayTeamId: z.string().min(1, "Away team is required"),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, "Time is required"),
  stadiumId: z.string().min(1, "Stadium is required"),
  refereeId: z.string().optional(),
  round: z.number().min(1, "Round must be at least 1"),
}).refine((data) => data.homeTeamId !== data.awayTeamId, {
  message: "Home and away teams must be different",
  path: ["awayTeamId"],
})

export type GameFormData = z.infer<typeof gameSchema>

interface TeamOption {
  id: string
  name: string
  acronym: string
  logoUrl?: string
}

interface StadiumOption {
  id: string
  name: string
  city: string
}

interface RefereeOption {
  id: string
  name: string
}

interface GameFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teams: TeamOption[]
  stadiums: StadiumOption[]
  referees: RefereeOption[]
  totalRounds: number
  initialData?: {
    homeTeamId?: string
    awayTeamId?: string
    date?: Date
    time?: string
    stadiumId?: string
    refereeId?: string
    round?: number
  }
  isEdit?: boolean
  onSave: (data: GameFormData) => void
}

export function GameForm({
  open,
  onOpenChange,
  teams,
  stadiums,
  referees,
  totalRounds,
  initialData,
  isEdit = false,
  onSave
}: GameFormProps) {
  const { toast } = useToast()

  const form = useForm<GameFormData>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      homeTeamId: initialData?.homeTeamId || "",
      awayTeamId: initialData?.awayTeamId || "",
      date: initialData?.date,
      time: initialData?.time || "",
      stadiumId: initialData?.stadiumId || "",
      refereeId: initialData?.refereeId || "",
      round: initialData?.round || 1,
    },
  })

  const onSubmit = (data: GameFormData) => {
    onSave(data)
    toast({
      title: isEdit ? "Match updated!" : "Match created!",
      description: `The match was ${isEdit ? "updated" : "scheduled"} successfully.`,
    })
    onOpenChange(false)
    form.reset()
  }

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
  }

  // Generate round options
  const roundOptions = Array.from({ length: Math.max(totalRounds + 5, 20) }, (_, i) => i + 1)

  // Time options (every 30 minutes)
  const timeOptions: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0')
      const minute = m.toString().padStart(2, '0')
      timeOptions.push(`${hour}:${minute}`)
    }
  }

  const selectedHomeTeam = form.watch("homeTeamId")
  const selectedAwayTeam = form.watch("awayTeamId")

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-[#0d0d0d] border-[#1f1f1f]">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Edit Match" : "New Match"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6 pb-4">
                {/* Round Selection */}
                <FormField
                  control={form.control}
                  name="round"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Round *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#171717] border-[#1f1f1f]">
                            <SelectValue placeholder="Select round" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roundOptions.map(round => (
                            <SelectItem key={round} value={round.toString()}>
                              Round {round}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Teams Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="homeTeamId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Team *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#171717] border-[#1f1f1f]">
                              <SelectValue placeholder="Select home team" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teams
                              .filter(team => team.id !== selectedAwayTeam)
                              .map(team => (
                                <SelectItem key={team.id} value={team.id}>
                                  <div className="flex items-center gap-2">
                                    {team.logoUrl ? (
                                      <img src={team.logoUrl} alt={team.name} className="w-5 h-5 rounded-full object-cover" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                        <span className="text-[8px] font-bold">{team.acronym.slice(0, 2)}</span>
                                      </div>
                                    )}
                                    <span>{team.name}</span>
                                  </div>
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
                    name="awayTeamId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Away Team *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#171717] border-[#1f1f1f]">
                              <SelectValue placeholder="Select away team" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teams
                              .filter(team => team.id !== selectedHomeTeam)
                              .map(team => (
                                <SelectItem key={team.id} value={team.id}>
                                  <div className="flex items-center gap-2">
                                    {team.logoUrl ? (
                                      <img src={team.logoUrl} alt={team.name} className="w-5 h-5 rounded-full object-cover" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                        <span className="text-[8px] font-bold">{team.acronym.slice(0, 2)}</span>
                                      </div>
                                    )}
                                    <span>{team.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-[#171717] border-[#1f1f1f]",
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
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#171717] border-[#1f1f1f]">
                              <SelectValue placeholder="Select time" />
                              <Clock className="ml-auto h-4 w-4 opacity-50" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeOptions.map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Stadium */}
                <FormField
                  control={form.control}
                  name="stadiumId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stadium *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#171717] border-[#1f1f1f]">
                            <SelectValue placeholder="Select stadium" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {stadiums.map(stadium => (
                            <SelectItem key={stadium.id} value={stadium.id}>
                              {stadium.name} - {stadium.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Referee */}
                <FormField
                  control={form.control}
                  name="refereeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referee</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#171717] border-[#1f1f1f]">
                            <SelectValue placeholder="Select referee (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {referees.map(referee => (
                            <SelectItem key={referee.id} value={referee.id}>
                              {referee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Optionally assign a referee to this match
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-[#1f1f1f]"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/80">
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Save Changes" : "Create Match"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
