import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Flag, Users, Clock, Target, CircleAlert, ArrowLeftRight, UserPlus, CheckCircle2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  color: "green" | "blue"
  players: MatchPlayer[]
}

interface MatchEvent {
  id: string
  type: "goal" | "own_goal" | "yellow_card" | "red_card" | "penalty" | "substitution"
  team: "home" | "away"
  playerName: string
  playerInName?: string
  minute: number
  period: "1st" | "2nd" | "extra_time"
  description?: string
}

type MatchPhase = "pre_game" | "live" | "ended"
type ActiveTab = "events" | "substitutions"
type StatsTab = "by_team" | "by_player"
type EventType = "goal" | "own_goal" | "yellow_card" | "red_card" | "penalty"

// ─── Mock data ────────────────────────────────────────────────────────────────

const defaultHomePlayers: MatchPlayer[] = [
  { id: "h1", name: "Carlos Silva", number: 1, position: "Goleiro", isStarter: true },
  { id: "h2", name: "André Santos", number: 2, position: "Lateral Direito", isStarter: true },
  { id: "h3", name: "Bruno Costa", number: 3, position: "Zagueiro", isStarter: true },
  { id: "h4", name: "Daniel Souza", number: 4, position: "Zagueiro", isStarter: true },
  { id: "h5", name: "Eduardo Lima", number: 5, position: "Lateral Esquerdo", isStarter: true },
  { id: "h6", name: "Felipe Rocha", number: 6, position: "Volante", isStarter: true },
  { id: "h7", name: "Gabriel Neves", number: 7, position: "Meia", isStarter: true },
  { id: "h8", name: "Henrique Alves", number: 8, position: "Meia", isStarter: true },
  { id: "h9", name: "Igor Martins", number: 9, position: "Atacante", isStarter: true },
  { id: "h10", name: "João Pedro", number: 10, position: "Atacante", isStarter: true },
  { id: "h11", name: "Kaio Ferreira", number: 11, position: "Atacante", isStarter: true },
  { id: "h12", name: "Marcos Vieira", number: 12, position: "Goleiro", isStarter: false },
  { id: "h13", name: "Nicolas Ferreira", number: 13, position: "Zagueiro", isStarter: false },
  { id: "h14", name: "Otávio Ribeiro", number: 14, position: "Meia", isStarter: false },
  { id: "h15", name: "Paulo Mendes", number: 15, position: "Atacante", isStarter: false },
  { id: "h16", name: "Rafael Cunha", number: 16, position: "Lateral Direito", isStarter: false },
  { id: "h17", name: "Samuel Torres", number: 17, position: "Volante", isStarter: false },
  { id: "h18", name: "Thiago Cardoso", number: 18, position: "Atacante", isStarter: false },
]

const defaultAwayPlayers: MatchPlayer[] = [
  { id: "a1", name: "Alex Moura", number: 1, position: "Goleiro", isStarter: true },
  { id: "a2", name: "Bernardo Torres", number: 2, position: "Lateral Direito", isStarter: true },
  { id: "a3", name: "Caio Santana", number: 3, position: "Zagueiro", isStarter: true },
  { id: "a4", name: "Diego Ramos", number: 4, position: "Zagueiro", isStarter: true },
  { id: "a5", name: "Enzo Barbosa", number: 5, position: "Lateral Esquerdo", isStarter: true },
  { id: "a6", name: "Fernando Dias", number: 6, position: "Volante", isStarter: true },
  { id: "a7", name: "Gustavo Lima", number: 7, position: "Meia", isStarter: true },
  { id: "a8", name: "Hugo Nascimento", number: 8, position: "Meia", isStarter: true },
  { id: "a9", name: "Ivan Castro", number: 9, position: "Atacante", isStarter: true },
  { id: "a10", name: "Jorge Pereira", number: 10, position: "Atacante", isStarter: true },
  { id: "a11", name: "Klaus Oliveira", number: 11, position: "Atacante", isStarter: true },
  { id: "a12", name: "Leonardo Dias", number: 12, position: "Goleiro", isStarter: false },
  { id: "a13", name: "Murilo Freitas", number: 13, position: "Zagueiro", isStarter: false },
  { id: "a14", name: "Natan Carvalho", number: 14, position: "Meia", isStarter: false },
  { id: "a15", name: "Oscar Ribeiro", number: 15, position: "Atacante", isStarter: false },
  { id: "a16", name: "Pedro Azevedo", number: 16, position: "Lateral Direito", isStarter: false },
  { id: "a17", name: "Quirino Silva", number: 17, position: "Volante", isStarter: false },
  { id: "a18", name: "Roberto Faria", number: 18, position: "Atacante", isStarter: false },
]

const POSITIONS = ["Goleiro", "Lateral Direito", "Lateral Esquerdo", "Zagueiro", "Volante", "Meia", "Meia-Atacante", "Atacante"]
const PERIODS = [
  { value: "1st", label: "1º Tempo" },
  { value: "2nd", label: "2º Tempo" },
  { value: "extra_time", label: "Prorrogação" },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function eventIcon(type: MatchEvent["type"]) {
  switch (type) {
    case "goal": return <Target className="h-4 w-4 text-green-500" />
    case "own_goal": return <Target className="h-4 w-4 text-red-400" />
    case "yellow_card": return <div className="h-4 w-3 rounded-sm bg-yellow-400" />
    case "red_card": return <div className="h-4 w-3 rounded-sm bg-red-500" />
    case "penalty": return <Target className="h-4 w-4 text-blue-400" />
    case "substitution": return <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
  }
}

function eventLabel(type: MatchEvent["type"]) {
  const map: Record<MatchEvent["type"], string> = {
    goal: "Gol",
    own_goal: "Gol Contra",
    yellow_card: "Cartão Amarelo",
    red_card: "Cartão Vermelho",
    penalty: "Pênalti",
    substitution: "Substituição",
  }
  return map[type]
}

function periodLabel(period: MatchEvent["period"]) {
  const map: Record<MatchEvent["period"], string> = {
    "1st": "1T",
    "2nd": "2T",
    extra_time: "Prorr.",
  }
  return map[period]
}

function computeScore(events: MatchEvent[], team: "home" | "away") {
  return events.filter(e =>
    (e.type === "goal" && e.team === team) ||
    (e.type === "own_goal" && e.team !== team) ||
    (e.type === "penalty" && e.team === team)
  ).length
}

function computeStat(events: MatchEvent[], type: MatchEvent["type"], team: "home" | "away") {
  return events.filter(e => e.type === type && e.team === team).length
}

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1
  const homeW = Math.round((home / total) * 100)
  const awayW = 100 - homeW
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium tabular-nums">{home}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{away}</span>
      </div>
      <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
        <div className="bg-green-500 rounded-full transition-all" style={{ width: `${homeW}%` }} />
        <div className="bg-blue-500 rounded-full transition-all" style={{ width: `${awayW}%` }} />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchControlPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [phase, setPhase] = useState<MatchPhase>("pre_game")
  const [period, setPeriod] = useState<MatchEvent["period"]>("1st")
  const [activeTab, setActiveTab] = useState<ActiveTab>("events")
  const [statsTab, setStatsTab] = useState<StatsTab>("by_team")
  const [events, setEvents] = useState<MatchEvent[]>([])

  const [homeTeam, setHomeTeam] = useState<MatchTeam>({
    id: "home",
    abbreviation: "CAS",
    name: "Time Casa",
    color: "green",
    players: defaultHomePlayers,
  })
  const [awayTeam, setAwayTeam] = useState<MatchTeam>({
    id: "away",
    abbreviation: "VIS",
    name: "Time Visitante",
    color: "blue",
    players: defaultAwayPlayers,
  })

  // Dialog states
  const [showStartDialog, setShowStartDialog] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [addPlayerTeam, setAddPlayerTeam] = useState<"home" | "away" | null>(null)
  const [eventDialog, setEventDialog] = useState<{ open: boolean; type: EventType }>({ open: false, type: "goal" })
  const [showSubDialog, setShowSubDialog] = useState(false)

  // AddPlayer form state
  const [newPlayer, setNewPlayer] = useState({ name: "", number: "", position: "Meia", status: "substitute" as "starter" | "substitute" })

  // RegisterEvent form state
  const [eventForm, setEventForm] = useState({ teamSide: "home" as "home" | "away", playerId: "", minute: "", description: "" })

  // RegisterSubstitution form state
  const [subForm, setSubForm] = useState({ teamSide: "home" as "home" | "away", playerOutId: "", playerInId: "", minute: "", period: "1st" as MatchEvent["period"], description: "" })

  // ── Derived ──
  const homeScore = computeScore(events, "home")
  const awayScore = computeScore(events, "away")
  const homeStarters = homeTeam.players.filter(p => p.isStarter)
  const awayStarters = awayTeam.players.filter(p => p.isStarter)
  const homeReserves = homeTeam.players.filter(p => !p.isStarter)
  const awayReserves = awayTeam.players.filter(p => !p.isStarter)
  const isReady = homeStarters.length === 11 && awayStarters.length === 11
  const substitutions = events.filter(e => e.type === "substitution")

  const teamForSide = (side: "home" | "away") => side === "home" ? homeTeam : awayTeam
  const setTeamForSide = (side: "home" | "away", team: MatchTeam) =>
    side === "home" ? setHomeTeam(team) : setAwayTeam(team)

  // ── Handlers ──
  function promoteToStarter(teamSide: "home" | "away", playerId: string) {
    const team = teamForSide(teamSide)
    setTeamForSide(teamSide, { ...team, players: team.players.map(p => p.id === playerId ? { ...p, isStarter: true } : p) })
  }

  function handleAddPlayer() {
    if (!addPlayerTeam || !newPlayer.name.trim() || !newPlayer.number) return
    const team = teamForSide(addPlayerTeam)
    const player: MatchPlayer = {
      id: `${addPlayerTeam}-${Date.now()}`,
      name: newPlayer.name.trim(),
      number: parseInt(newPlayer.number),
      position: newPlayer.position,
      isStarter: newPlayer.status === "starter",
    }
    setTeamForSide(addPlayerTeam, { ...team, players: [...team.players, player] })
    setNewPlayer({ name: "", number: "", position: "Meia", status: "substitute" })
    setAddPlayerTeam(null)
    toast({ title: "Jogador adicionado", description: `${player.name} adicionado à escalação.` })
  }

  function handleRegisterEvent() {
    const { teamSide, playerId, minute, description } = eventForm
    const team = teamForSide(teamSide)
    const player = team.players.find(p => p.id === playerId)
    if (!player || !minute) return

    const event: MatchEvent = {
      id: `evt-${Date.now()}`,
      type: eventDialog.type,
      team: teamSide,
      playerName: player.name,
      minute: parseInt(minute),
      period,
      description: description || undefined,
    }
    setEvents(prev => [...prev, event].sort((a, b) => a.minute - b.minute))
    setEventForm({ teamSide: "home", playerId: "", minute: "", description: "" })
    setEventDialog({ open: false, type: "goal" })
    toast({ title: `${eventLabel(event.type)} registrado`, description: `${player.name} — ${event.minute}'` })
  }

  function handleRegisterSub() {
    const { teamSide, playerOutId, playerInId, minute, period: subPeriod, description } = subForm
    const team = teamForSide(teamSide)
    const playerOut = team.players.find(p => p.id === playerOutId)
    const playerIn = team.players.find(p => p.id === playerInId)
    if (!playerOut || !playerIn || !minute) return

    // Update starter status
    setTeamForSide(teamSide, {
      ...team,
      players: team.players.map(p => {
        if (p.id === playerOutId) return { ...p, isStarter: false }
        if (p.id === playerInId) return { ...p, isStarter: true }
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
      period: subPeriod,
      description: description || undefined,
    }
    setEvents(prev => [...prev, event].sort((a, b) => a.minute - b.minute))
    setSubForm({ teamSide: "home", playerOutId: "", playerInId: "", minute: "", period: "1st", description: "" })
    setShowSubDialog(false)
    toast({ title: "Substituição registrada", description: `↓ ${playerOut.name}  ↑ ${playerIn.name} — ${event.minute}'` })
  }

  function openEventDialog(type: EventType) {
    setEventForm({ teamSide: "home", playerId: "", minute: "", description: "" })
    setEventDialog({ open: true, type })
  }

  // ── Renders ──
  const matchDate = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  const matchTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="space-y-6 pb-10">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/lives")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Controle de Partida</h1>
            <p className="text-xs text-muted-foreground">Live #{id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {phase === "pre_game" && (
            <Badge variant="outline" className="gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Pré-Jogo
            </Badge>
          )}
          {phase === "live" && (
            <>
              <Badge className="gap-1.5 bg-green-600 hover:bg-green-600 text-white">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Ao Vivo
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {period === "1st" ? "1º Tempo" : period === "2nd" ? "2º Tempo" : "Prorrogação"}
              </Badge>
            </>
          )}
          {phase === "ended" && (
            <Badge variant="outline" className="gap-1.5 text-muted-foreground">
              Encerrada
            </Badge>
          )}
        </div>
      </div>

      {/* ── Match Header Card ── */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {/* Home team */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-green-600 text-white font-bold text-lg shrink-0">
                {homeTeam.abbreviation}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{phase === "pre_game" ? "Mandante" : "Time Casa"}</p>
                <p className="font-semibold">{homeTeam.name}</p>
              </div>
            </div>

            {/* Center */}
            <div className="flex flex-col items-center gap-2 px-6">
              {phase === "live" && (
                <Badge className="bg-foreground text-background text-xs px-2 py-0.5">AO VIVO</Badge>
              )}
              {phase === "ended" && (
                <Badge variant="outline" className="text-xs">ENCERRADA</Badge>
              )}
              {phase !== "pre_game" ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold tabular-nums">{homeScore}</span>
                  <span className="text-2xl text-muted-foreground font-light">×</span>
                  <span className="text-4xl font-bold tabular-nums">{awayScore}</span>
                </div>
              ) : (
                <span className="text-2xl font-light text-muted-foreground">VS</span>
              )}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{matchDate}</p>
                <p className="text-xs text-muted-foreground">{matchTime} · Estádio Municipal</p>
              </div>
              {phase === "live" && (
                <Button variant="destructive" size="sm" className="gap-1.5 mt-1" onClick={() => setShowEndDialog(true)}>
                  <Flag className="h-3.5 w-3.5" />
                  Encerrar Partida
                </Button>
              )}
            </div>

            {/* Away team */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{phase === "pre_game" ? "Visitante" : "Time Visitante"}</p>
                <p className="font-semibold">{awayTeam.name}</p>
              </div>
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-blue-600 text-white font-bold text-lg shrink-0">
                {awayTeam.abbreviation}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════
          PRÉ-JOGO
      ══════════════════════════════════════════════ */}
      {phase === "pre_game" && (
        <>
          {/* Status banner */}
          <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${isReady ? "border-green-600/30 bg-green-600/5" : "border-border bg-muted/30"}`}>
            <div className="flex items-center gap-2">
              {isReady
                ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                : <CircleAlert className="h-4 w-4 text-muted-foreground" />
              }
              <p className="text-sm">
                {isReady
                  ? "Escalações completas. Pronto para iniciar!"
                  : `Escalações incompletas: ${homeStarters.length}/11 titulares (casa) · ${awayStarters.length}/11 titulares (visitante)`
                }
              </p>
            </div>
            <Button
              size="sm"
              disabled={!isReady}
              className="gap-1.5"
              onClick={() => setShowStartDialog(true)}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Confirmar e Iniciar Jogo
            </Button>
          </div>

          {/* Lineup cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(["home", "away"] as const).map(side => {
              const team = side === "home" ? homeTeam : awayTeam
              const starters = side === "home" ? homeStarters : awayStarters
              const reserves = side === "home" ? homeReserves : awayReserves
              const color = side === "home" ? "text-green-500" : "text-blue-500"
              const dotColor = side === "home" ? "bg-green-500" : "bg-blue-500"

              return (
                <Card key={side}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                        {team.name}
                      </CardTitle>
                      <Badge variant={starters.length === 11 ? "default" : "outline"} className="text-xs">
                        {starters.length}/11 titulares
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Starters */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Users className={`h-3.5 w-3.5 ${color}`} />
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Titulares</p>
                      </div>
                      <div className="space-y-1">
                        {starters.length === 0 && (
                          <p className="text-xs text-muted-foreground py-2 text-center">Nenhum titular adicionado</p>
                        )}
                        {starters.map(p => (
                          <div key={p.id} className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted/50 group">
                            <span className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold text-white ${side === "home" ? "bg-green-600" : "bg-blue-600"}`}>
                              {p.number}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.position}</p>
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">Em campo</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {reserves.length > 0 && (
                      <>
                        <Separator />
                        {/* Reserves */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reservas ({reserves.length})</p>
                          </div>
                          <div className="space-y-1">
                            {reserves.map(p => (
                              <div key={p.id} className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted/50">
                                <span className="flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold text-muted-foreground bg-muted">
                                  {p.number}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-muted-foreground truncate">{p.name}</p>
                                  <p className="text-xs text-muted-foreground">{p.position}</p>
                                </div>
                                {phase === "pre_game" && starters.length < 11 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7 px-2"
                                    onClick={() => promoteToStarter(side, p.id)}
                                  >
                                    Titular
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => setAddPlayerTeam(side)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Adicionar Jogador
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════
          AO VIVO / ENCERRADA
      ══════════════════════════════════════════════ */}
      {(phase === "live" || phase === "ended") && (
        <>
          {/* Period selector (only live) */}
          {phase === "live" && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Período:</p>
              {PERIODS.map(p => (
                <Button
                  key={p.value}
                  variant={period === p.value ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setPeriod(p.value as MatchEvent["period"])}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Left column: tabs + stats ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Tab bar */}
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "events" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("events")}
                >
                  Eventos
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "substitutions" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("substitutions")}
                >
                  Substituições{substitutions.length > 0 && ` (${substitutions.length})`}
                </button>
              </div>

              {/* ── Events tab ── */}
              {activeTab === "events" && (
                <div className="space-y-4">
                  {/* Register event */}
                  {phase === "live" && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-1.5">
                          <Plus className="h-4 w-4" />
                          Registrar Evento
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                          {([
                            { type: "goal" as EventType, label: "Gol", icon: "⚽" },
                            { type: "own_goal" as EventType, label: "Gol Contra", icon: "↩️" },
                            { type: "yellow_card" as EventType, label: "Cartão Amarelo", icon: "🟨" },
                            { type: "red_card" as EventType, label: "Cartão Vermelho", icon: "🟥" },
                            { type: "penalty" as EventType, label: "Pênalti", icon: "🎯" },
                          ] as const).map(({ type, label, icon }) => (
                            <button
                              key={type}
                              onClick={() => openEventDialog(type)}
                              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/60 hover:border-foreground/20 transition-colors text-center"
                            >
                              <span className="text-2xl">{icon}</span>
                              <span className="text-xs font-medium leading-tight">{label}</span>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Statistics */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Estatísticas</CardTitle>
                        <div className="flex border rounded-md overflow-hidden">
                          <button
                            className={`px-3 py-1 text-xs transition-colors ${statsTab === "by_team" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                            onClick={() => setStatsTab("by_team")}
                          >
                            Por Equipe
                          </button>
                          <button
                            className={`px-3 py-1 text-xs border-l transition-colors ${statsTab === "by_player" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                            onClick={() => setStatsTab("by_player")}
                          >
                            Por Jogador
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {statsTab === "by_team" && (
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs font-medium mb-1">
                            <span className="text-green-500">{homeTeam.abbreviation}</span>
                            <span className="text-blue-500">{awayTeam.abbreviation}</span>
                          </div>
                          <StatBar label="Gols" home={computeStat(events, "goal", "home")} away={computeStat(events, "goal", "away")} />
                          <StatBar label="Gols Contra" home={computeStat(events, "own_goal", "home")} away={computeStat(events, "own_goal", "away")} />
                          <StatBar label="Pênaltis" home={computeStat(events, "penalty", "home")} away={computeStat(events, "penalty", "away")} />
                          <StatBar label="Cartões Amarelos" home={computeStat(events, "yellow_card", "home")} away={computeStat(events, "yellow_card", "away")} />
                          <StatBar label="Cartões Vermelhos" home={computeStat(events, "red_card", "home")} away={computeStat(events, "red_card", "away")} />
                          <StatBar label="Substituições" home={substitutions.filter(e => e.team === "home").length} away={substitutions.filter(e => e.team === "away").length} />
                        </div>
                      )}
                      {statsTab === "by_player" && (
                        <div className="space-y-1">
                          {events.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento registrado ainda</p>
                          )}
                          {Array.from(new Set(events.map(e => e.playerName))).map(name => {
                            const playerEvents = events.filter(e => e.playerName === name)
                            const side = playerEvents[0].team
                            const team = side === "home" ? homeTeam : awayTeam
                            return (
                              <div key={name} className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted/40">
                                <span className={`h-2 w-2 rounded-full ${side === "home" ? "bg-green-500" : "bg-blue-500"}`} />
                                <span className="text-sm flex-1">{name}</span>
                                <span className="text-xs text-muted-foreground">{team.abbreviation}</span>
                                <div className="flex gap-1">
                                  {playerEvents.map((e, i) => (
                                    <span key={i} title={eventLabel(e.type)}>{eventIcon(e.type)}</span>
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ── Substitutions tab ── */}
              {activeTab === "substitutions" && (
                <div className="space-y-4">
                  {phase === "live" && (
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowSubDialog(true)}>
                      <ArrowLeftRight className="h-4 w-4" />
                      Registrar Substituição
                    </Button>
                  )}
                  {substitutions.length === 0 ? (
                    <Card>
                      <CardContent className="py-10 text-center">
                        <ArrowLeftRight className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Nenhuma substituição registrada</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-0">
                        {substitutions.map((e, i) => (
                          <div key={e.id} className={`flex items-center gap-3 px-4 py-3 ${i < substitutions.length - 1 ? "border-b" : ""}`}>
                            <span className={`h-2 w-2 rounded-full shrink-0 ${e.team === "home" ? "bg-green-500" : "bg-blue-500"}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 text-sm">
                                <span className="text-red-400 font-medium">↓ {e.playerName}</span>
                                <ArrowLeftRight className="h-3 w-3 text-muted-foreground shrink-0" />
                                <span className="text-green-400 font-medium">↑ {e.playerInName}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{e.team === "home" ? homeTeam.name : awayTeam.name}</p>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">{e.minute}' {periodLabel(e.period)}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* ── Right column: Timeline ── */}
            <div>
              <Card className="sticky top-4">
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
                      <p className="text-sm text-muted-foreground">Nenhum evento registrado</p>
                      <p className="text-xs text-muted-foreground">Os eventos aparecerão aqui em tempo real</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                      {[...events].reverse().map(e => (
                        <div key={e.id} className="flex items-start gap-3 py-2">
                          <div className="flex flex-col items-center gap-1 shrink-0 w-10">
                            <span className="text-xs font-bold tabular-nums">{e.minute}'</span>
                            <span className="text-xs text-muted-foreground">{periodLabel(e.period)}</span>
                          </div>
                          <div className="shrink-0 mt-0.5">{eventIcon(e.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-tight truncate">
                              {e.type === "substitution" ? (
                                <><span className="text-red-400">{e.playerName}</span> → <span className="text-green-400">{e.playerInName}</span></>
                              ) : e.playerName}
                            </p>
                            <p className="text-xs text-muted-foreground">{eventLabel(e.type)} · {e.team === "home" ? homeTeam.abbreviation : awayTeam.abbreviation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════
          ENCERRADA — Summary
      ══════════════════════════════════════════════ */}
      {phase === "ended" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resumo da Partida</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-bold">{events.filter(e => e.type === "goal" || e.type === "penalty").length}</p>
              <p className="text-xs text-muted-foreground">Gols Totais</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-bold">{events.filter(e => e.type === "yellow_card").length}</p>
              <p className="text-xs text-muted-foreground">Cartões Amarelos</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-bold">{events.filter(e => e.type === "substitution").length}</p>
              <p className="text-xs text-muted-foreground">Substituições</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
          DIALOGS
      ══════════════════════════════════════════════ */}

      {/* Start Game */}
      <AlertDialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Iniciar Partida?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao confirmar, as escalações serão bloqueadas e o jogo será iniciado. Você poderá registrar eventos e fazer substituições durante o jogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-between rounded-lg border p-3 text-sm my-2">
            <span className="font-medium">{homeTeam.name}</span>
            <span className="text-muted-foreground">vs</span>
            <span className="font-medium">{awayTeam.name}</span>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setPhase("live"); setShowStartDialog(false) }}>
              Confirmar e Iniciar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Game */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar Partida?</AlertDialogTitle>
            <AlertDialogDescription>
              Resultado final: <strong>{homeTeam.abbreviation} {homeScore} × {awayScore} {awayTeam.abbreviation}</strong>. Após encerrar, não será possível registrar novos eventos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { setPhase("ended"); setShowEndDialog(false) }}>
              Encerrar Partida
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
              Adicionar Jogador — {addPlayerTeam === "home" ? homeTeam.name : awayTeam.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Jogador *</label>
              <Input
                placeholder="Ex: Roberto Silva"
                value={newPlayer.name}
                onChange={e => setNewPlayer(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Número da Camisa *</label>
              <Input
                type="number"
                placeholder="Ex: 10"
                value={newPlayer.number}
                onChange={e => setNewPlayer(p => ({ ...p, number: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Posição *</label>
              <Select value={newPlayer.position} onValueChange={v => setNewPlayer(p => ({ ...p, position: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {POSITIONS.map(pos => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status Inicial</label>
              <Select value={newPlayer.status} onValueChange={v => setNewPlayer(p => ({ ...p, status: v as "starter" | "substitute" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Titular</SelectItem>
                  <SelectItem value="substitute">Reserva</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Você pode alterar isso clicando nos botões "Titular" ou "Reserva"</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPlayerTeam(null)}>Cancelar</Button>
            <Button onClick={handleAddPlayer} disabled={!newPlayer.name.trim() || !newPlayer.number}>
              Adicionar Jogador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Event */}
      <Dialog open={eventDialog.open} onOpenChange={open => setEventDialog(d => ({ ...d, open }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {eventIcon(eventDialog.type)}
              {eventLabel(eventDialog.type)}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Selecione o time e jogador envolvido no evento.</p>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Team toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <div className="grid grid-cols-2 gap-2">
                {(["home", "away"] as const).map(side => {
                  const team = teamForSide(side)
                  const isSelected = eventForm.teamSide === side
                  return (
                    <button
                      key={side}
                      onClick={() => setEventForm(f => ({ ...f, teamSide: side, playerId: "" }))}
                      className={`flex items-center justify-center gap-2 h-10 rounded-md border text-sm font-medium transition-colors ${isSelected
                        ? side === "home" ? "border-green-600 bg-green-600/10 text-green-500" : "border-blue-600 bg-blue-600/10 text-blue-500"
                        : "border-border hover:bg-muted/60"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${side === "home" ? "bg-green-500" : "bg-blue-500"}`} />
                      {team.abbreviation}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Player */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Jogador</label>
              <Select value={eventForm.playerId} onValueChange={v => setEventForm(f => ({ ...f, playerId: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o jogador" /></SelectTrigger>
                <SelectContent>
                  {teamForSide(eventForm.teamSide).players
                    .filter(p => p.isStarter)
                    .sort((a, b) => a.number - b.number)
                    .map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.number} — {p.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minute */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Minuto do Jogo</label>
              <Input
                type="number"
                min={1}
                max={120}
                placeholder="Ex: 45"
                value={eventForm.minute}
                onChange={e => setEventForm(f => ({ ...f, minute: e.target.value }))}
              />
            </div>

            {/* Observation */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Observação (opcional)</label>
              <Textarea
                placeholder="Ex: Gol de cabeça, cobrança de falta..."
                className="min-h-16 resize-none"
                value={eventForm.description}
                onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDialog(d => ({ ...d, open: false }))}>Cancelar</Button>
            <Button onClick={handleRegisterEvent} disabled={!eventForm.playerId || !eventForm.minute}>
              Registrar Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Substitution */}
      <Dialog open={showSubDialog} onOpenChange={setShowSubDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Registrar Substituição
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Registre um novo evento.</p>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Team */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Select value={subForm.teamSide} onValueChange={v => setSubForm(f => ({ ...f, teamSide: v as "home" | "away", playerOutId: "", playerInId: "" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">{homeTeam.name}</SelectItem>
                  <SelectItem value="away">{awayTeam.name}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Player Out */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-400">Jogador que Sai (Titular)</label>
              <Select value={subForm.playerOutId} onValueChange={v => setSubForm(f => ({ ...f, playerOutId: v }))}>
                <SelectTrigger className="border-red-400/40"><SelectValue placeholder="Selecione o jogador" /></SelectTrigger>
                <SelectContent>
                  {teamForSide(subForm.teamSide).players
                    .filter(p => p.isStarter && p.id !== subForm.playerInId)
                    .sort((a, b) => a.number - b.number)
                    .map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.number} — {p.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Player In */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-400">Jogador que Entra (Reserva)</label>
              <Select value={subForm.playerInId} onValueChange={v => setSubForm(f => ({ ...f, playerInId: v }))}>
                <SelectTrigger className="border-green-400/40"><SelectValue placeholder="Selecione o jogador" /></SelectTrigger>
                <SelectContent>
                  {teamForSide(subForm.teamSide).players
                    .filter(p => !p.isStarter && p.id !== subForm.playerOutId)
                    .sort((a, b) => a.number - b.number)
                    .map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.number} — {p.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minute + Period */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Minuto</label>
                <Input
                  type="number"
                  min={1}
                  max={120}
                  placeholder="Ex: 23"
                  value={subForm.minute}
                  onChange={e => setSubForm(f => ({ ...f, minute: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tempo</label>
                <Select value={subForm.period} onValueChange={v => setSubForm(f => ({ ...f, period: v as MatchEvent["period"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERIODS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Observation */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Observações (opcional)</label>
              <Textarea
                placeholder="Detalhes adicionais..."
                className="min-h-16 resize-none"
                value={subForm.description}
                onChange={e => setSubForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubDialog(false)}>Cancelar</Button>
            <Button onClick={handleRegisterSub} disabled={!subForm.playerOutId || !subForm.playerInId || !subForm.minute}>
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
