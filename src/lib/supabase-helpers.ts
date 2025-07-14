import { supabase } from '@/integrations/supabase/client'

export interface Team {
  id: string
  name: string
  category: string
  coach?: string
  founded?: string
  division: string
  logo_url?: string
  players_count: number
  points: number
  matches: number
  wins: number
  draws: number
  losses: number
  created_at: string
  updated_at: string
}

export interface Player {
  id: string
  name: string
  position: string
  number?: number
  age?: number
  team_id?: string
  nationality?: string
  goals: number
  assists: number
  matches: number
  status: 'active' | 'injured' | 'suspended' | 'inactive'
  market_value?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Championship {
  id: string
  name: string
  type: string
  start_date: string
  end_date: string
  teams_count: number
  matches_count: number
  status: 'scheduled' | 'ongoing' | 'finished'
  phase?: string
  created_at: string
  updated_at: string
}

// Teams functions
export const getTeams = async (): Promise<Team[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const getTeamById = async (id: string): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching team:', error)
    return null
  }
  return data
}

export const createTeam = async (team: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<Team> => {
  const { data, error } = await supabase
    .from('teams')
    .insert([team])
    .select()
    .single()

  if (error) throw error
  return data
}

// Players functions
export const getPlayers = async (): Promise<Player[]> => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(player => ({
    ...player,
    status: player.status as Player['status']
  }))
}

export const getPlayersByTeam = async (teamId: string): Promise<Player[]> => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', teamId)
    .order('number', { ascending: true })

  if (error) throw error
  return (data || []).map(player => ({
    ...player,
    status: player.status as Player['status']
  }))
}

export const createPlayer = async (player: Omit<Player, 'id' | 'created_at' | 'updated_at'>): Promise<Player> => {
  const { data, error } = await supabase
    .from('players')
    .insert([player])
    .select()
    .single()

  if (error) throw error
  return {
    ...data,
    status: data.status as Player['status']
  }
}

// Championships functions
export const getChampionships = async (): Promise<Championship[]> => {
  const { data, error } = await supabase
    .from('championships')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) throw error
  return (data || []).map(championship => ({
    ...championship,
    status: championship.status as Championship['status']
  }))
}

export const createChampionship = async (championship: Omit<Championship, 'id' | 'created_at' | 'updated_at'>): Promise<Championship> => {
  const { data, error } = await supabase
    .from('championships')
    .insert([championship])
    .select()
    .single()

  if (error) throw error
  return {
    ...data,
    status: data.status as Championship['status']
  }
}

// Initialize sample data
export const initializeSampleData = async () => {
  try {
    // Check if data already exists
    const { data: existingTeams } = await supabase
      .from('teams')
      .select('id')
      .limit(1)

    if (existingTeams && existingTeams.length > 0) {
      console.log('Sample data already exists')
      return
    }

    // Create sample teams
    const sampleTeams = [
      {
        name: "Nova City Sparks",
        category: "Profissional",
        coach: "Roberto Silva",
        founded: "1995",
        division: "Primeira Divisão",
        players_count: 28,
        points: 65,
        matches: 25,
        wins: 20,
        draws: 3,
        losses: 2
      },
      {
        name: "Northbridge Thunder",
        category: "Profissional",
        coach: "Ana Costa",
        founded: "1987",
        division: "Primeira Divisão",
        players_count: 26,
        points: 58,
        matches: 25,
        wins: 18,
        draws: 4,
        losses: 3
      },
      {
        name: "Brookdale Saints",
        category: "Profissional",
        coach: "Carlos Mendes",
        founded: "2001",
        division: "Primeira Divisão",
        players_count: 24,
        points: 52,
        matches: 25,
        wins: 16,
        draws: 4,
        losses: 5
      },
      {
        name: "Thunderbhowl",
        category: "Profissional",
        coach: "Miguel Santos",
        founded: "2008",
        division: "Segunda Divisão",
        players_count: 25,
        points: 48,
        matches: 24,
        wins: 15,
        draws: 3,
        losses: 6
      },
      {
        name: "Basement Bridge",
        category: "Profissional",
        coach: "João Silva",
        founded: "2012",
        division: "Segunda Divisão",
        players_count: 23,
        points: 32,
        matches: 24,
        wins: 9,
        draws: 5,
        losses: 10
      },
      {
        name: "Red Rock Comets",
        category: "Profissional",
        coach: "Maria Oliveira",
        founded: "1998",
        division: "Primeira Divisão",
        players_count: 27,
        points: 44,
        matches: 25,
        wins: 13,
        draws: 5,
        losses: 7
      },
      {
        name: "IronHill Cyclones",
        category: "Profissional",
        coach: "Ricardo Costa",
        founded: "2003",
        division: "Segunda Divisão",
        players_count: 24,
        points: 51,
        matches: 24,
        wins: 16,
        draws: 3,
        losses: 5
      },
      {
        name: "Pinevale",
        category: "Sub-20",
        coach: "Paulo Mendes",
        founded: "2018",
        division: "Juvenil B",
        players_count: 19,
        points: 28,
        matches: 18,
        wins: 8,
        draws: 4,
        losses: 6
      }
    ]

    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .insert(sampleTeams)
      .select()

    if (teamsError) throw teamsError

    // Create sample championships
    const sampleChampionships = [
      {
        name: "Campeonato Estadual 2024",
        type: "Estadual",
        start_date: "2024-02-01",
        end_date: "2024-06-30",
        teams_count: 16,
        matches_count: 120,
        status: "ongoing" as const,
        phase: "Quartas de Final"
      },
      {
        name: "Copa Regional Sub-20",
        type: "Regional",
        start_date: "2024-03-15",
        end_date: "2024-05-20",
        teams_count: 8,
        matches_count: 28,
        status: "ongoing" as const,
        phase: "Final"
      },
      {
        name: "Torneio de Verão 2024",
        type: "Amistoso",
        start_date: "2024-01-10",
        end_date: "2024-01-25",
        teams_count: 4,
        matches_count: 6,
        status: "finished" as const,
        phase: "Finalizado"
      }
    ]

    await supabase
      .from('championships')
      .insert(sampleChampionships)

    // Create sample players for the first team
    if (teams && teams.length > 0) {
      const firstTeam = teams[0]
      const samplePlayers = [
        {
          name: "Marcus Johnson",
          position: "Armador",
          number: 10,
          age: 28,
          team_id: firstTeam.id,
          nationality: "Americano",
          goals: 245,
          assists: 189,
          matches: 25,
          status: "active" as const,
          market_value: "R$ 2.8M"
        },
        {
          name: "André Silva",
          position: "Ala-Pivô",
          number: 15,
          age: 26,
          team_id: firstTeam.id,
          nationality: "Brasileiro",
          goals: 198,
          assists: 87,
          matches: 24,
          status: "active" as const,
          market_value: "R$ 2.2M"
        }
      ]

      await supabase
        .from('players')
        .insert(samplePlayers)
    }

    console.log('Sample data initialized successfully')
  } catch (error) {
    console.error('Error initializing sample data:', error)
  }
}