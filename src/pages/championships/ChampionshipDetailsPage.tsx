import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  Play,
  Eye,
  MapPin,
  Clock,
  Target,
  TrendingUp,
  Activity,
  Star,
  Info,
  ListOrdered,
  CalendarDays,
  BarChart3,
  Radio
} from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "overview" | "classification" | "matches" | "statistics" | "live"

export default function ChampionshipDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  const championship = {
    id: 1,
    name: "Campeonato Estadual 2024",
    logo: "/placeholder.svg",
    type: "Estadual",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    teams: 16,
    matches: 120,
    status: "ongoing",
    ourPosition: 3,
    phase: "Quartas de Final",
    description: "Principal competição estadual com os melhores times da região.",
    format: "Pontos corridos + Mata-mata",
    prize: "R$ 500.000"
  }

  const standings = [
    { position: 1, team: "Nova City Sparks", points: 65, matches: 25, wins: 20, draws: 5, losses: 0 },
    { position: 2, team: "Northbridge Thunder", points: 58, matches: 25, wins: 18, draws: 4, losses: 3 },
    { position: 3, team: "Brookdale Saints", points: 52, matches: 25, wins: 16, draws: 4, losses: 5 },
    { position: 4, team: "Luna Sparks", points: 48, matches: 25, wins: 15, draws: 3, losses: 7 }
  ]

  const upcomingMatches = [
    {
      id: 1,
      homeTeam: "Nova City Sparks",
      awayTeam: "Thunder FC",
      date: "2024-01-20",
      time: "16:00",
      venue: "Estádio Municipal",
      round: "Quartas de Final"
    },
    {
      id: 2,
      homeTeam: "Brookdale Saints",
      awayTeam: "Luna Sparks",
      date: "2024-01-21",
      time: "18:30",
      venue: "Arena Central",
      round: "Quartas de Final"
    }
  ]

  const statistics = {
    totalGoals: 245,
    averageGoalsPerMatch: 2.04,
    topScorer: "Marcus Johnson (15 gols)",
    topAssists: "André Silva (12 assistências)",
    cleanSheets: 45,
    yellowCards: 128,
    redCards: 8
  }

  const liveStreams = [
    {
      id: 1,
      title: "Nova City vs Thunder - AO VIVO",
      viewers: "2.4k",
      status: "live",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Análise pós-jogo - Saints x Luna",
      viewers: "890",
      status: "scheduled",
      thumbnail: "/placeholder.svg",
      scheduledTime: "20:00"
    }
  ]

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "classification", label: "Classification", icon: ListOrdered },
    { id: "matches", label: "Matches", icon: CalendarDays },
    { id: "statistics", label: "Statistics", icon: BarChart3 },
    { id: "live", label: "Live Streams", icon: Radio },
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="text-muted-foreground hover:text-foreground gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Championships
      </Button>

      {/* Header Card */}
      <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl overflow-hidden">
        <div className="h-28 bg-cover bg-center" style={{ backgroundImage: "url(/assets/BackgroundAFA.png)" }} />

        <div className="px-7 pb-7 -mt-14">
          <div className="flex items-start justify-between">
            {/* Left: Logo + Name */}
            <div className="flex flex-col">
              <div className="w-[100px] h-[100px] rounded-2xl bg-[#1a1a1a] overflow-hidden flex items-center justify-center shadow-lg mb-4">
                <Trophy className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h1 className="text-xl font-bold text-white">{championship.name}</h1>
            </div>

            {/* Edit Button */}
            <Button className="bg-primary hover:bg-primary/80 text-white rounded-lg px-6 h-10 mt-20">
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-[#1f1f1f]">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-xs font-normal uppercase tracking-wider transition-colors relative flex items-center gap-1.5",
                activeTab === tab.id
                  ? "text-white"
                  : "text-muted-foreground hover:text-white/80"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <div className="flex gap-12">
              {/* Left Column */}
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Description</h3>
                  <p className="text-sm text-white/80 leading-relaxed max-w-xl">
                    {championship.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Format</h3>
                  <p className="text-sm text-white/80">{championship.format}</p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Current Phase</h3>
                  <p className="text-sm text-white/80">{championship.phase}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Type</h3>
                  <p className="text-sm text-white/80">{championship.type}</p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Start Date</h3>
                  <p className="text-sm text-white/80">
                    {new Date(championship.startDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-4">End Date</h3>
                  <p className="text-sm text-white/80">
                    {new Date(championship.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Prize</h3>
                  <p className="text-sm text-white/80">{championship.prize}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classification */}
      {activeTab === "classification" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7">
            <h3 className="text-base font-semibold text-white mb-6">Standings</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-[#1f1f1f] hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-12">#</TableHead>
                  <TableHead className="text-muted-foreground">Team</TableHead>
                  <TableHead className="text-center text-muted-foreground">Matches</TableHead>
                  <TableHead className="text-center text-muted-foreground">Wins</TableHead>
                  <TableHead className="text-center text-muted-foreground">Draws</TableHead>
                  <TableHead className="text-center text-muted-foreground">Losses</TableHead>
                  <TableHead className="text-center text-muted-foreground">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.map((team) => (
                  <TableRow
                    key={team.position}
                    className="border-[#1f1f1f] hover:bg-white/5"
                  >
                    <TableCell className="text-muted-foreground font-medium">
                      {team.position}
                    </TableCell>
                    <TableCell className="text-white font-medium">{team.team}</TableCell>
                    <TableCell className="text-center text-white/70">{team.matches}</TableCell>
                    <TableCell className="text-center text-white/70">{team.wins}</TableCell>
                    <TableCell className="text-center text-white/70">{team.draws}</TableCell>
                    <TableCell className="text-center text-white/70">{team.losses}</TableCell>
                    <TableCell className="text-center text-white font-bold">{team.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Matches */}
      {activeTab === "matches" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-4">
            <h3 className="text-base font-semibold text-white mb-6">Upcoming Matches</h3>
            {upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="p-4 rounded-xl bg-[#090909] border border-[#262626]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <span className="text-sm font-semibold text-white">{match.homeTeam}</span>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 border border-[#262626] rounded">vs</span>
                      <span className="text-sm font-semibold text-white">{match.awayTeam}</span>
                    </div>
                    <p className="text-center text-xs text-muted-foreground">{match.round}</p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-white/60">
                      <Calendar className="h-3 w-3" />
                      {new Date(match.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-xs text-white/60">
                      <Clock className="h-3 w-3" />
                      {match.time}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-xs text-white/60">
                      <MapPin className="h-3 w-3" />
                      {match.venue}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {activeTab === "statistics" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-6">
            <h3 className="text-base font-semibold text-white">Statistics</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-[#090909] border border-[#262626]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                    <Target className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Total Goals</p>
                </div>
                <p className="text-3xl font-bold text-white">{statistics.totalGoals}</p>
              </div>

              <div className="p-6 rounded-xl bg-[#090909] border border-[#262626]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Avg / Match</p>
                </div>
                <p className="text-3xl font-bold text-white">{statistics.averageGoalsPerMatch}</p>
              </div>

              <div className="p-6 rounded-xl bg-[#090909] border border-[#262626]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Clean Sheets</p>
                </div>
                <p className="text-3xl font-bold text-white">{statistics.cleanSheets}</p>
              </div>
            </div>

            <div className="flex gap-12 pt-4">
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Top Scorer</h3>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-white/80">{statistics.topScorer}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Top Assists</h3>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-white/80">{statistics.topAssists}</p>
                  </div>
                </div>
              </div>

              <div className="w-64 space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Yellow Cards</h3>
                  <p className="text-sm text-white/80">{statistics.yellowCards}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Red Cards</h3>
                  <p className="text-sm text-white/80">{statistics.redCards}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Streams */}
      {activeTab === "live" && (
        <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
          <CardContent className="p-7 space-y-4">
            <h3 className="text-base font-semibold text-white mb-6">Live Streams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="rounded-xl bg-[#090909] border border-[#262626] overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-primary/80">
                        <Play className="h-4 w-4 mr-2" />
                        {stream.status === "live" ? "Watch" : "Scheduled"}
                      </Button>
                    </div>
                    {stream.status === "live" && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-white mb-2">{stream.title}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {stream.viewers} watching
                      </div>
                      {stream.scheduledTime && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {stream.scheduledTime}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
