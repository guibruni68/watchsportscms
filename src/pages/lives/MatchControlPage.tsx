import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Flag, Clock, Target, ArrowLeftRight, UserPlus, Plus, X, Calendar, MapPin, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

// ─── Types ───────────────────────────────────────────────────────────────────

interface MatchPlayer {
  id: string
  name: string
  number: number
  position: string
  isStarter: boolean
}

interface MatchTeam {
  id: string
  abbreviation: string
  name: string
  logo?: string
  players: MatchPlayer[]
}

interface MatchEvent {
  id: string
  type: "goal" | "yellow_card" | "red_card" | "penalty" | "substitution"
  team: "home" | "away"
  playerName: string
  playerInName?: string
  minute: number
  period?: "1st" | "2nd" | "extra_time"
}

type MatchPhase = "pre_game" | "live" | "ended"
type EventType = "goal" | "yellow_card" | "red_card" | "penalty" | "substitution"

// ─── Mock data ────────────────────────────────────────────────────────────────

const defaultHomePlayers: MatchPlayer[] = [
  { id: "h1",  name: "Carlos Silva",     number: 1,  position: "Goalkeeper",   isStarter: true },
  { id: "h2",  name: "André Santos",     number: 2,  position: "Right Back",   isStarter: true },
  { id: "h3",  name: "Bruno Costa",      number: 3,  position: "Centre Back",  isStarter: true },
  { id: "h4",  name: "Daniel Souza",     number: 4,  position: "Centre Back",  isStarter: true },
  { id: "h5",  name: "Eduardo Lima",     number: 5,  position: "Left Back",    isStarter: true },
  { id: "h6",  name: "Felipe Rocha",     number: 6,  position: "Midfielder",   isStarter: true },
  { id: "h7",  name: "Gabriel Neves",    number: 7,  position: "Midfielder",   isStarter: true },
  { id: "h8",  name: "Henrique Alves",   number: 8,  position: "Midfielder",   isStarter: true },
  { id: "h9",  name: "Igor Martins",     number: 9,  position: "Forward",      isStarter: true },
  { id: "h10", name: "João Pedro",       number: 10, position: "Forward",      isStarter: true },
  { id: "h11", name: "Kaio Ferreira",    number: 11, position: "Forward",      isStarter: true },
  { id: "h12", name: "Marcos Vieira",    number: 12, position: "Goalkeeper",   isStarter: false },
  { id: "h13", name: "Nicolas Ferreira", number: 13, position: "Centre Back",  isStarter: false },
  { id: "h14", name: "Otávio Ribeiro",   number: 14, position: "Midfielder",   isStarter: false },
  { id: "h15", name: "Paulo Mendes",     number: 15, position: "Forward",      isStarter: false },
  { id: "h16", name: "Rafael Cunha",     number: 16, position: "Right Back",   isStarter: false },
  { id: "h17", name: "Samuel Torres",    number: 17, position: "Midfielder",   isStarter: false },
  { id: "h18", name: "Thiago Cardoso",   number: 18, position: "Forward",      isStarter: false },
]

const defaultAwayPlayers: MatchPlayer[] = [
  { id: "a1",  name: "Alex Moura",       number: 1,  position: "Goalkeeper",   isStarter: true },
  { id: "a2",  name: "Bernardo Torres",  number: 2,  position: "Right Back",   isStarter: true },
  { id: "a3",  name: "Caio Santana",     number: 3,  position: "Centre Back",  isStarter: true },
  { id: "a4",  name: "Diego Ramos",      number: 4,  position: "Centre Back",  isStarter: true },
  { id: "a5",  name: "Enzo Barbosa",     number: 5,  position: "Left Back",    isStarter: true },
  { id: "a6",  name: "Fernando Dias",    number: 6,  position: "Midfielder",   isStarter: true },
  { id: "a7",  name: "Gustavo Lima",     number: 7,  position: "Midfielder",   isStarter: true },
  { id: "a8",  name: "Hugo Nascimento",  number: 8,  position: "Midfielder",   isStarter: true },
  { id: "a9",  name: "Ivan Castro",      number: 9,  position: "Forward",      isStarter: true },
  { id: "a10", name: "Jorge Pereira",    number: 10, position: "Forward",      isStarter: true },
  { id: "a11", name: "Klaus Oliveira",   number: 11, position: "Forward",      isStarter: true },
  { id: "a12", name: "Leonardo Dias",    number: 12, position: "Goalkeeper",   isStarter: false },
  { id: "a13", name: "Murilo Freitas",   number: 13, position: "Centre Back",  isStarter: false },
  { id: "a14", name: "Natan Carvalho",   number: 14, position: "Midfielder",   isStarter: false },
  { id: "a15", name: "Oscar Ribeiro",    number: 15, position: "Forward",      isStarter: false },
  { id: "a16", name: "Pedro Azevedo",    number: 16, position: "Right Back",   isStarter: false },
  { id: "a17", name: "Quirino Silva",    number: 17, position: "Midfielder",   isStarter: false },
  { id: "a18", name: "Roberto Faria",    number: 18, position: "Forward",      isStarter: false },
]

const POSITIONS = ["Goalkeeper", "Right Back", "Left Back", "Centre Back", "Midfielder", "Attacking Mid", "Forward", "Winger"]

const PERIODS = [
  { value: "1st",        label: "1st Half" },
  { value: "2nd",        label: "2nd Half" },
  { value: "extra_time", label: "Extra Time" },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function eventIcon(type: MatchEvent["type"]) {
  switch (type) {
    case "goal":         return <Target className="h-4 w-4 text-foreground" />
    case "yellow_card":  return <div className="h-4 w-3 rounded-sm bg-yellow-400 shrink-0" />
    case "red_card":     return <div className="h-4 w-3 rounded-sm bg-red-500 shrink-0" />
    case "penalty":      return <Target className="h-4 w-4 text-muted-foreground" />
    case "substitution": return <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
  }
}

function eventLabel(type: MatchEvent["type"]) {
  const map: Record<MatchEvent["type"], string> = {
    goal:         "Goal",
    yellow_card:  "Yellow Card",
    red_card:     "Red Card",
    penalty:      "Penalty",
    substitution: "Substitution",
  }
  return map[type]
}

function computeScore(events: MatchEvent[], team: "home" | "away") {
  return events.filter(e =>
    (e.type === "goal" && e.team === team) ||
    (e.type === "penalty" && e.team === team)
  ).length
}

function TeamLogo({ logo, abbreviation, name }: { logo?: string; abbreviation: string; name: string }) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className="h-10 w-10 rounded-[4px] object-cover shrink-0"
      />
    )
  }
  return (
    <div className="h-10 w-10 rounded-[4px] bg-muted border flex items-center justify-center font-bold text-sm shrink-0">
      {abbreviation}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchControlPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [phase, setPhase]   = useState<MatchPhase>("pre_game")
  const [events, setEvents] = useState<MatchEvent[]>([])

  const [homeTeam, setHomeTeam] = useState<MatchTeam>({
    id: "home",
    abbreviation: "BSM",
    name: "Basement Basketball",
    logo: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-basement.png",
    players: defaultHomePlayers,
  })
  const [awayTeam, setAwayTeam] = useState<MatchTeam>({
    id: "away",
    abbreviation: "BCT",
    name: "Big City Thunder",
    logo: "https://syjavjcfemexcqkemcsi.supabase.co/storage/v1/object/public/group/cardImageUrl/Card-bigcitythunder.png",
    players: defaultAwayPlayers,
  })

  // Dialog states
  const [showStartDialog, setShowStartDialog] = useState(false)
  const [showEndDialog, setShowEndDialog]     = useState(false)
  const [addPlayerTeam, setAddPlayerTeam]     = useState<"home" | "away" | null>(null)
  const [eventDialog, setEventDialog]         = useState<{ open: boolean; type: EventType }>({ open: false, type: "goal" })
  const [showSubDialog, setShowSubDialog]     = useState(false)

  // Form state: add player
  const [newPlayer, setNewPlayer] = useState({ name: "", number: "", position: "Midfielder", isStarter: false })

  // Form state: register event (goal / card / penalty)
  const [eventForm, setEventForm] = useState({ teamSide: "home" as "home" | "away", playerId: "", minute: "" })

  // Form state: substitution
  const [subForm, setSubForm] = useState({
    teamSide: "home" as "home" | "away",
    playerOutId: "", playerInId: "",
    minute: "", period: "1st" as NonNullable<MatchEvent["period"]>,
  })

  // ── Derived ──
  const homeScore    = computeScore(events, "home")
  const awayScore    = computeScore(events, "away")
  const homeStarters = homeTeam.players.filter(p => p.isStarter)
  const awayStarters = awayTeam.players.filter(p => p.isStarter)
  const homeReserves = homeTeam.players.filter(p => !p.isStarter)
  const awayReserves = awayTeam.players.filter(p => !p.isStarter)
  const isReady      = homeStarters.length === 11 && awayStarters.length === 11

  const teamForSide    = (side: "home" | "away") => side === "home" ? homeTeam : awayTeam
  const setTeamForSide = (side: "home" | "away", team: MatchTeam) =>
    side === "home" ? setHomeTeam(team) : setAwayTeam(team)

  // ── Handlers ──
  function promoteToStarter(teamSide: "home" | "away", playerId: string) {
    const team = teamForSide(teamSide)
    setTeamForSide(teamSide, { ...team, players: team.players.map(p => p.id === playerId ? { ...p, isStarter: true } : p) })
  }

  function demoteFromStarter(teamSide: "home" | "away", playerId: string) {
    const team = teamForSide(teamSide)
    setTeamForSide(teamSide, { ...team, players: team.players.map(p => p.id === playerId ? { ...p, isStarter: false } : p) })
  }

  function handleAddPlayer() {
    if (!addPlayerTeam || !newPlayer.name.trim() || !newPlayer.number) return
    const team = teamForSide(addPlayerTeam)
    const player: MatchPlayer = {
      id: `${addPlayerTeam}-${Date.now()}`,
      name: newPlayer.name.trim(),
      number: parseInt(newPlayer.number),
      position: newPlayer.position,
      isStarter: newPlayer.isStarter,
    }
    setTeamForSide(addPlayerTeam, { ...team, players: [...team.players, player] })
    setNewPlayer({ name: "", number: "", position: "Midfielder", isStarter: false })
    setAddPlayerTeam(null)
    toast({ title: "Player added", description: `${player.name} added to lineup.` })
  }

  function handleRegisterEvent() {
    const { teamSide, playerId, minute } = eventForm
    const team   = teamForSide(teamSide)
    const player = team.players.find(p => p.id === playerId)
    if (!player || !minute) return

    const event: MatchEvent = {
      id: `evt-${Date.now()}`,
      type: eventDialog.type,
      team: teamSide,
      playerName: player.name,
      minute: parseInt(minute),
    }
    setEvents(prev => [...prev, event].sort((a, b) => a.minute - b.minute))
    setEventForm({ teamSide: "home", playerId: "", minute: "" })
    setEventDialog({ open: false, type: "goal" })
    toast({ title: eventLabel(event.type), description: `${player.name} — ${event.minute}'` })
  }

  function handleRegisterSub() {
    const { teamSide, playerOutId, playerInId, minute, period } = subForm
    const team      = teamForSide(teamSide)
    const playerOut = team.players.find(p => p.id === playerOutId)
    const playerIn  = team.players.find(p => p.id === playerInId)
    if (!playerOut || !playerIn || !minute) return

    setTeamForSide(teamSide, {
      ...team,
      players: team.players.map(p => {
        if (p.id === playerOutId) return { ...p, isStarter: false }
        if (p.id === playerInId)  return { ...p, isStarter: true }
        return p
      }),
    })

    const event: MatchEvent = {
      id: `sub-${Date.now()}`,
      type: "substitution",
      team: teamSide,
      playerName: playerOut.name,
      playerInName: playerIn.name,
      minute: parseInt(minute),
      period,
    }
    setEvents(prev => [...prev, event].sort((a, b) => a.minute - b.minute))
    setSubForm({ teamSide: "home", playerOutId: "", playerInId: "", minute: "", period: "1st" })
    setShowSubDialog(false)
    toast({ title: "Substitution", description: `↓ ${playerOut.name}  ↑ ${playerIn.name} — ${event.minute}'` })
  }

  function openEventDialog(type: EventType) {
    if (type === "substitution") {
      setSubForm({ teamSide: "home", playerOutId: "", playerInId: "", minute: "", period: "1st" })
      setShowSubDialog(true)
    } else {
      setEventForm({ teamSide: "home", playerId: "", minute: "" })
      setEventDialog({ open: true, type })
    }
  }

  const matchDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
  const matchTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="space-y-6 pb-10">

      {/* ── Top bar: Back + action button ── */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate("/lives")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {phase === "pre_game" && (
          <Button onClick={() => setShowStartDialog(true)} disabled={!isReady} className="gap-1.5">
            Start Match
            {!isReady && <span className="text-xs font-normal opacity-70">({homeStarters.length}/11 · {awayStarters.length}/11)</span>}
          </Button>
        )}
        {phase === "live" && (
          <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setShowEndDialog(true)}>
            <Flag className="h-3.5 w-3.5" />
            End Match
          </Button>
        )}
      </div>

      {/* ── Match Info Card ── */}
      <Card>
        <CardContent className="px-6 pt-7 pb-5">
          {/* League name — top: 27px, h: 16px → mb keeps 40px gap to teams */}
          <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-muted-foreground text-center mb-10">State Championship 2026</p>

          {/* Teams + score row — 40px below league name, mb-16 keeps ~65px gap to separator */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <TeamLogo logo={homeTeam.logo} abbreviation={homeTeam.abbreviation} name={homeTeam.name} />
              <p className="text-2xl font-bold">{homeTeam.name}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              {phase !== "pre_game" ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-[36px] font-bold tabular-nums leading-10">{homeScore}</span>
                    <span className="text-2xl text-muted-foreground">×</span>
                    <span className="text-[36px] font-bold tabular-nums leading-10">{awayScore}</span>
                  </div>
                  {phase === "ended" && <Badge variant="outline" className="text-xs mt-1">ENDED</Badge>}
                </>
              ) : (
                <span className="text-2xl font-light text-muted-foreground">VS</span>
              )}
            </div>
            <div className="flex items-center gap-3 flex-row-reverse">
              <TeamLogo logo={awayTeam.logo} abbreviation={awayTeam.abbreviation} name={awayTeam.name} />
              <p className="text-2xl font-bold">{awayTeam.name}</p>
            </div>
          </div>

          {/* Separator — 16px gap to info row */}
          <Separator className="mb-4" />

          {/* Info row — centered with 186px gap between items (matches Figma) */}
          <div className="flex items-center justify-center gap-[186px]">
            <div className="flex items-center gap-4 shrink-0">
              <div className="h-10 w-10 rounded-[10px] border border-border bg-background flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground leading-4">Date & Time</p>
                <p className="text-sm leading-5">{matchDate} at {matchTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="h-10 w-10 rounded-[10px] border border-border bg-background flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground leading-4">Location</p>
                <p className="text-sm leading-5">Municipal Stadium</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="h-10 w-10 rounded-[10px] border border-border bg-background flex items-center justify-center shrink-0">
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground leading-4">Competition</p>
                <p className="text-sm leading-5">State Championship</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════
          PRE-GAME
      ══════════════════════════════════════════════ */}
      {phase === "pre_game" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(["home", "away"] as const).map(side => {
              const team     = side === "home" ? homeTeam : awayTeam
              const starters = side === "home" ? homeStarters : awayStarters
              const reserves = side === "home" ? homeReserves : awayReserves

              return (
                <Card key={side}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{team.name} Lineup</CardTitle>
                      <Badge variant={starters.length === 11 ? "default" : "outline"} className="text-xs font-normal">
                        {starters.length}/11
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Starters */}
                    <div className="space-y-2">
                      {starters.length === 0 && (
                        <p className="text-xs text-muted-foreground py-4 text-center">No starters added</p>
                      )}
                      {starters.map(p => (
                        <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.position}</p>
                          </div>
                          <button
                            onClick={() => demoteFromStarter(side, p.id)}
                            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-destructive/10"
                            title="Remove from starting lineup"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {reserves.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Reserves ({reserves.length})</p>
                          <div className="space-y-2">
                            {reserves.map(p => (
                              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-dashed">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-muted-foreground">{p.name}</p>
                                  <p className="text-xs text-muted-foreground/60">{p.position}</p>
                                </div>
                                {starters.length < 11 && (
                                  <button
                                    onClick={() => promoteToStarter(side, p.id)}
                                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                                    title="Add to starting lineup"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />
                    <Button
                      variant="ghost" size="sm"
                      className="w-full gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => setAddPlayerTeam(side)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Add Player
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════
          LIVE / ENDED
      ══════════════════════════════════════════════ */}
      {(phase === "live" || phase === "ended") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── Register Events ── */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Plus className="h-4 w-4" />
                  Register Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                {phase === "live" ? (
                  <div className="grid grid-cols-5 gap-2">
                    {([
                      { type: "goal" as EventType,         label: "Goal",         icon: "⚽" },
                      { type: "substitution" as EventType, label: "Substitution", icon: "🔄" },
                      { type: "yellow_card" as EventType,  label: "Yellow Card",  icon: "🟨" },
                      { type: "red_card" as EventType,     label: "Red Card",     icon: "🟥" },
                      { type: "penalty" as EventType,      label: "Penalty",      icon: "🎯" },
                    ] as const).map(({ type, label, icon }) => (
                      <button key={type} onClick={() => openEventDialog(type)}
                        className="flex flex-col items-center justify-center gap-2 h-[81px] rounded-xl border border-border hover:bg-muted/60 hover:border-foreground/20 transition-colors text-center">
                        <span className="text-2xl leading-8">{icon}</span>
                        <span className="text-xs leading-none">{label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Match ended. No more events can be registered.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Timeline ── */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Timeline ({events.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">No events yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {[...events].reverse().map(e => (
                      <div key={e.id} className="flex items-start gap-3 py-1.5">
                        <span className="text-xs font-bold tabular-nums text-muted-foreground w-8 shrink-0 mt-0.5">{e.minute}'</span>
                        <div className="shrink-0 mt-0.5">{eventIcon(e.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-tight truncate">
                            {e.type === "substitution"
                              ? <><span className="line-through text-muted-foreground">{e.playerName}</span> · {e.playerInName}</>
                              : e.playerName
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {eventLabel(e.type)} · {e.team === "home" ? homeTeam.abbreviation : awayTeam.abbreviation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════
          DIALOGS
      ══════════════════════════════════════════════ */}

      {/* Start Match */}
      <AlertDialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Match?</AlertDialogTitle>
            <AlertDialogDescription>
              Lineups will be locked and the match will begin. You can register events and substitutions during play.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-between rounded-lg border p-3 text-sm my-2">
            <span className="font-medium">{homeTeam.name}</span>
            <span className="text-muted-foreground">vs</span>
            <span className="font-medium">{awayTeam.name}</span>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setPhase("live"); setShowStartDialog(false) }}>
              Confirm and Start
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Match */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Match?</AlertDialogTitle>
            <AlertDialogDescription>
              Final score: <strong>{homeTeam.abbreviation} {homeScore} × {awayScore} {awayTeam.abbreviation}</strong>. No more events can be registered after ending.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { setPhase("ended"); setShowEndDialog(false) }}>
              End Match
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Player */}
      <Dialog open={addPlayerTeam !== null} onOpenChange={open => !open && setAddPlayerTeam(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Player — {addPlayerTeam === "home" ? homeTeam.name : awayTeam.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Player Name *</label>
              <Input placeholder="e.g. Roberto Silva" value={newPlayer.name}
                onChange={e => setNewPlayer(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Shirt Number *</label>
              <Input type="number" placeholder="e.g. 10" value={newPlayer.number}
                onChange={e => setNewPlayer(p => ({ ...p, number: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Select value={newPlayer.position} onValueChange={v => setNewPlayer(p => ({ ...p, position: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {POSITIONS.map(pos => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={newPlayer.isStarter ? "starter" : "reserve"}
                onValueChange={v => setNewPlayer(p => ({ ...p, isStarter: v === "starter" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starting</SelectItem>
                  <SelectItem value="reserve">Reserve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPlayerTeam(null)}>Cancel</Button>
            <Button onClick={handleAddPlayer} disabled={!newPlayer.name.trim() || !newPlayer.number}>
              Add Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Event (Goal / Yellow Card / Red Card / Penalty) */}
      <Dialog open={eventDialog.open} onOpenChange={open => setEventDialog(d => ({ ...d, open }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {eventIcon(eventDialog.type)}
              {eventLabel(eventDialog.type)}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Select the team and player involved.</p>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team</label>
              <div className="grid grid-cols-2 gap-2">
                {(["home", "away"] as const).map(side => (
                  <button key={side}
                    onClick={() => setEventForm(f => ({ ...f, teamSide: side, playerId: "" }))}
                    className={`flex items-center justify-center gap-2 h-10 rounded-md border text-sm font-medium transition-colors ${eventForm.teamSide === side ? "border-foreground bg-foreground/5" : "border-border hover:bg-muted/60"}`}>
                    {teamForSide(side).abbreviation}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Player</label>
              <Select value={eventForm.playerId} onValueChange={v => setEventForm(f => ({ ...f, playerId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select player" /></SelectTrigger>
                <SelectContent>
                  {teamForSide(eventForm.teamSide).players
                    .filter(p => p.isStarter)
                    .sort((a, b) => a.number - b.number)
                    .map(p => <SelectItem key={p.id} value={p.id}>{p.number} — {p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Minute</label>
              <Input type="number" min={1} max={120} placeholder="e.g. 45"
                value={eventForm.minute}
                onChange={e => setEventForm(f => ({ ...f, minute: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDialog(d => ({ ...d, open: false }))}>Cancel</Button>
            <Button onClick={handleRegisterEvent} disabled={!eventForm.playerId || !eventForm.minute}>Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Substitution */}
      <Dialog open={showSubDialog} onOpenChange={setShowSubDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Substitution
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Select the team and players involved.</p>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team</label>
              <div className="grid grid-cols-2 gap-2">
                {(["home", "away"] as const).map(side => (
                  <button key={side}
                    onClick={() => setSubForm(f => ({ ...f, teamSide: side, playerOutId: "", playerInId: "" }))}
                    className={`flex items-center justify-center gap-2 h-10 rounded-md border text-sm font-medium transition-colors ${subForm.teamSide === side ? "border-foreground bg-foreground/5" : "border-border hover:bg-muted/60"}`}>
                    {teamForSide(side).abbreviation}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Player Off</label>
              <Select value={subForm.playerOutId} onValueChange={v => setSubForm(f => ({ ...f, playerOutId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select player" /></SelectTrigger>
                <SelectContent>
                  {teamForSide(subForm.teamSide).players
                    .filter(p => p.isStarter && p.id !== subForm.playerInId)
                    .sort((a, b) => a.number - b.number)
                    .map(p => <SelectItem key={p.id} value={p.id}>{p.number} — {p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center">
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Player On</label>
              <Select value={subForm.playerInId} onValueChange={v => setSubForm(f => ({ ...f, playerInId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select player" /></SelectTrigger>
                <SelectContent>
                  {teamForSide(subForm.teamSide).players
                    .filter(p => !p.isStarter && p.id !== subForm.playerOutId)
                    .sort((a, b) => a.number - b.number)
                    .map(p => <SelectItem key={p.id} value={p.id}>{p.number} — {p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Minute</label>
                <Input type="number" min={1} max={120} placeholder="e.g. 23"
                  value={subForm.minute}
                  onChange={e => setSubForm(f => ({ ...f, minute: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Period</label>
                <Select value={subForm.period} onValueChange={v => setSubForm(f => ({ ...f, period: v as NonNullable<MatchEvent["period"]> }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERIODS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubDialog(false)}>Cancel</Button>
            <Button onClick={handleRegisterSub} disabled={!subForm.playerOutId || !subForm.playerInId || !subForm.minute}>
              Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
