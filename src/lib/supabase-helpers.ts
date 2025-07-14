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
        name: "Vellora Wings",
        logo_url: "/lovable-uploads/56b1b2ee-687f-4828-8038-c0902cb9f932.png",
        category: "Profissional",
        coach: "Marcus Thompson",
        founded: "2018",
        division: "Primeira Divisão",
        players_count: 15,
        points: 72,
        matches: 28,
        wins: 22,
        draws: 4,
        losses: 2
      },
      {
        name: "State Champs",
        logo_url: "/lovable-uploads/d5035e4b-b98c-4f58-a0b5-6c9da2398ab0.png",
        category: "Profissional",
        coach: "Sarah Mitchell",
        founded: "2015",
        division: "Primeira Divisão",
        players_count: 14,
        points: 68,
        matches: 28,
        wins: 21,
        draws: 2,
        losses: 5
      },
      {
        name: "BigCity Thunder",
        logo_url: "/lovable-uploads/b178263a-95eb-4d88-ad87-aa9de585a258.png",
        category: "Profissional",
        coach: "David Rodriguez",
        founded: "2010",
        division: "Primeira Divisão",
        players_count: 16,
        points: 65,
        matches: 28,
        wins: 20,
        draws: 5,
        losses: 3
      },
      {
        name: "Trivana Lynx",
        logo_url: "/lovable-uploads/68bd6b68-c5e2-4cdc-81bb-941708e88ddb.png",
        category: "Profissional",
        coach: "James Wilson",
        founded: "2012",
        division: "Primeira Divisão",
        players_count: 15,
        points: 58,
        matches: 28,
        wins: 18,
        draws: 4,
        losses: 6
      },
      {
        name: "Santiago Peaks",
        logo_url: "/lovable-uploads/c77a6a4a-5568-4a9c-bdcc-34a53dca4782.png",
        category: "Profissional",
        coach: "Carlos Mendoza",
        founded: "2016",
        division: "Segunda Divisão",
        players_count: 14,
        points: 55,
        matches: 26,
        wins: 17,
        draws: 4,
        losses: 5
      },
      {
        name: "Oriela Warriors",
        logo_url: "/lovable-uploads/eaf276bb-4b7a-4b35-a5cd-55ea0b73fad7.png",
        category: "Profissional",
        coach: "Michael Chen",
        founded: "2019",
        division: "Segunda Divisão",
        players_count: 15,
        points: 52,
        matches: 26,
        wins: 16,
        draws: 4,
        losses: 6
      },
      {
        name: "Northern Turnovers",
        logo_url: "/lovable-uploads/a945b2ac-8b16-4c57-a844-122cc1e8170c.png",
        category: "Profissional",
        coach: "Robert Taylor",
        founded: "2014",
        division: "Segunda Divisão",
        players_count: 13,
        points: 48,
        matches: 26,
        wins: 15,
        draws: 3,
        losses: 8
      },
      {
        name: "Western Indian Lakes",
        logo_url: "/lovable-uploads/7ec692e9-77df-4673-90f4-ed298d10760f.png",
        category: "Profissional",
        coach: "Lisa Anderson",
        founded: "2017",
        division: "Segunda Divisão",
        players_count: 14,
        points: 44,
        matches: 26,
        wins: 13,
        draws: 5,
        losses: 8
      },
      {
        name: "Southbay Queens",
        logo_url: "/lovable-uploads/fa7deea7-2ce7-4e31-a605-16fdd2c78c4a.png",
        category: "Feminino",
        coach: "Ana Rodriguez",
        founded: "2020",
        division: "Primeira Divisão",
        players_count: 12,
        points: 62,
        matches: 24,
        wins: 19,
        draws: 5,
        losses: 0
      },
      {
        name: "Luna Sparks",
        logo_url: "/lovable-uploads/f4c416f1-8ed8-445d-a6fe-da52e7730e30.png",
        category: "Feminino",
        coach: "Patricia Silva",
        founded: "2021",
        division: "Primeira Divisão",
        players_count: 13,
        points: 56,
        matches: 24,
        wins: 17,
        draws: 5,
        losses: 2
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