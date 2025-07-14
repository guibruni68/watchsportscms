import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock,
  MapPin,
  Users,
  Trophy,
  Radio,
  Video,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const events = [
    {
      id: 1,
      title: "Jogo vs Rival FC",
      type: "match",
      date: "2024-01-20",
      time: "20:00",
      location: "Estádio Municipal",
      team: "Time Principal",
      opponent: "Rival FC",
      championship: "Campeonato Estadual",
      hasLive: true,
      status: "scheduled"
    },
    {
      id: 2,
      title: "Treino Aberto",
      type: "training",
      date: "2024-01-18",
      time: "16:00",
      location: "CT do Clube",
      team: "Time Principal",
      hasLive: true,
      status: "scheduled"
    },
    {
      id: 3,
      title: "Coletiva de Imprensa",
      type: "press",
      date: "2024-01-17",
      time: "14:00",
      location: "Sala de Imprensa",
      team: "Time Principal",
      hasLive: true,
      status: "scheduled"
    },
    {
      id: 4,
      title: "Final Sub-20",
      type: "match",
      date: "2024-01-22",
      time: "15:00",
      location: "Arena Central",
      team: "Time Sub-20",
      opponent: "Juventude FC",
      championship: "Copa Regional Sub-20",
      hasLive: true,
      status: "scheduled"
    },
    {
      id: 5,
      title: "Apresentação Novo Reforço",
      type: "event",
      date: "2024-01-19",
      time: "11:00",
      location: "Estádio Municipal",
      team: "Time Principal",
      hasLive: false,
      status: "scheduled"
    },
    {
      id: 6,
      title: "Treino Feminino",
      type: "training",
      date: "2024-01-21",
      time: "09:00",
      location: "CT do Clube",
      team: "Time Feminino",
      hasLive: false,
      status: "scheduled"
    }
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "match":
        return Trophy
      case "training":
        return Users
      case "press":
        return Radio
      case "event":
        return CalendarIcon
      default:
        return CalendarIcon
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "match":
        return "Jogo"
      case "training":
        return "Treino"
      case "press":
        return "Coletiva"
      case "event":  
        return "Evento"
      default:
        return "Evento"
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "match":
        return "text-primary"
      case "training":
        return "text-secondary"
      case "press":
        return "text-warning"
      case "event":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  const todayEvents = events.filter(event => {
    if (!selectedDate) return false
    const eventDate = new Date(event.date)
    return eventDate.toDateString() === selectedDate.toDateString()
  })

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const eventDates = events.map(event => new Date(event.date))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda Esportiva</h1>
          <p className="text-muted-foreground">Gerencie jogos, treinos e eventos do clube</p>
        </div>
        <Button className="bg-gradient-primary transition-all">
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximos Jogos</p>
                <p className="text-2xl font-bold text-foreground">
                  {events.filter(e => e.type === 'match' && new Date(e.date) >= new Date()).length}
                </p>
              </div>
              <Trophy className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Com Transmissão</p>
                <p className="text-2xl font-bold text-foreground">
                  {events.filter(e => e.hasLive && new Date(e.date) >= new Date()).length}
                </p>
              </div>
              <Radio className="h-6 w-6 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold text-foreground">
                  {events.filter(e => {
                    const eventDate = new Date(e.date)
                    const today = new Date()
                    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                    return eventDate >= today && eventDate <= weekFromNow
                  }).length}
                </p>
              </div>
              <CalendarIcon className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Eventos</p>
                <p className="text-2xl font-bold text-foreground">{events.length}</p>
              </div>
              <Video className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Calendário</CardTitle>
            <CardDescription>Visualize todos os eventos do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border-0 p-0"
              modifiers={{
                eventDay: eventDates
              }}
              modifiersStyles={{
                eventDay: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  borderRadius: '50%'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Day Events */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Selecione uma data'}
            </CardTitle>
            <CardDescription>
              {todayEvents.length > 0 ? `${todayEvents.length} evento(s)` : 'Nenhum evento'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayEvents.length > 0 ? (
              todayEvents.map((event) => {
                const Icon = getEventIcon(event.type)
                return (
                  <div key={event.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-muted/50 ${getEventColor(event.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground">{event.title}</h4>
                        <div className="space-y-1 mt-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </p>
                          {event.opponent && (
                            <p className="text-xs text-muted-foreground">
                              vs {event.opponent}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {getEventTypeLabel(event.type)}
                          </Badge>
                          {event.hasLive && (
                            <Badge className="text-xs bg-warning text-warning-foreground">
                              AO VIVO
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum evento nesta data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Próximos Eventos</CardTitle>
            <CardDescription>Eventos agendados para os próximos dias</CardDescription>
          </div>
          <Button variant="outline" size="sm">Ver Todos</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => {
              const Icon = getEventIcon(event.type)
              return (
                <div key={event.id} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-muted/50 ${getEventColor(event.type)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {getEventTypeLabel(event.type)}
                          </Badge>
                        </div>
                      </div>
                      {event.hasLive && (
                        <Badge className="text-xs bg-warning text-warning-foreground">
                          LIVE
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{event.title}</h4>
                      {event.opponent && (
                        <p className="text-sm text-muted-foreground mb-2">vs {event.opponent}</p>
                      )}
                      {event.championship && (
                        <Badge variant="outline" className="text-xs mb-2">
                          {event.championship}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.team}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}