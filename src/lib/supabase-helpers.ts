import { supabase } from '@/integrations/supabase/client'

export interface League {
  id: string
  name: string
  logo_url?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  category: string
  coach?: string
  founded?: string
  league_id?: string
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
  league_id?: string
  logo_url?: string
  teams_count: number
  matches_count: number
  status: 'scheduled' | 'ongoing' | 'finished'
  phase?: string
  created_at: string
  updated_at: string
}

// League Functions
export const getLeagues = async (): Promise<League[]> => {
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

export const getLeagueById = async (id: string): Promise<League | null> => {
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching league:', error)
    return null
  }
  return data
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
    .order('created_at', { ascending: false })

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
