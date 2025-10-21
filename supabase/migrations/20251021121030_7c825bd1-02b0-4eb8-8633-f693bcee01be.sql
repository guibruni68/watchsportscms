-- Create leagues table
CREATE TABLE public.leagues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on leagues
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;

-- RLS policies for leagues (public read)
CREATE POLICY "Anyone can view leagues" 
ON public.leagues 
FOR SELECT 
USING (true);

-- Create teams table (with league_id instead of division)
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  category TEXT NOT NULL,
  coach TEXT,
  founded TEXT,
  league_id UUID REFERENCES public.leagues(id) ON DELETE SET NULL,
  players_count INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  matches INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- RLS policies for teams (public read)
CREATE POLICY "Anyone can view teams" 
ON public.teams 
FOR SELECT 
USING (true);

-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  number INTEGER,
  age INTEGER,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  nationality TEXT,
  goals INTEGER NOT NULL DEFAULT 0,
  assists INTEGER NOT NULL DEFAULT 0,
  matches INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  market_value TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on players
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- RLS policies for players (public read)
CREATE POLICY "Anyone can view players" 
ON public.players 
FOR SELECT 
USING (true);

-- Create championships table (with league_id, logo_url, without dates)
CREATE TABLE public.championships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  league_id UUID REFERENCES public.leagues(id) ON DELETE SET NULL,
  logo_url TEXT,
  teams_count INTEGER NOT NULL DEFAULT 0,
  matches_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled',
  phase TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on championships
ALTER TABLE public.championships ENABLE ROW LEVEL SECURITY;

-- RLS policies for championships (public read)
CREATE POLICY "Anyone can view championships" 
ON public.championships 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_leagues_updated_at
BEFORE UPDATE ON public.leagues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_championships_updated_at
BEFORE UPDATE ON public.championships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert leagues
INSERT INTO public.leagues (name, description) VALUES
('Super League', 'Elite professional basketball league'),
('WBL', 'Women''s Basketball League'),
('B-League', 'Secondary division basketball'),
('A-League', 'Premier amateur basketball'),
('International League', 'Cross-border basketball competition');

-- Insert teams (distributed across leagues)
INSERT INTO public.teams (name, category, coach, founded, league_id, players_count, points, matches, wins, draws, losses) 
SELECT 
  t.name,
  t.category,
  t.coach,
  t.founded,
  l.id as league_id,
  t.players_count,
  t.points,
  t.matches,
  t.wins,
  t.draws,
  t.losses
FROM (VALUES
  ('Santiago Peaks', 'Profissional', 'Carlos Silva', '2015', 'Super League', 15, 42, 20, 14, 0, 6),
  ('Trivana Lynx', 'Profissional', 'Maria Santos', '2018', 'Super League', 14, 38, 20, 12, 2, 6),
  ('Big City Thunder', 'Profissional', 'John Smith', '2012', 'Super League', 16, 45, 20, 15, 0, 5),
  ('State Champs', 'Profissional', 'Robert Johnson', '2010', 'Super League', 15, 40, 20, 13, 1, 6),
  ('Vellora Wings', 'Feminino', 'Ana Costa', '2019', 'WBL', 14, 36, 18, 12, 0, 6),
  ('Luna Sparks', 'Feminino', 'Patricia Lima', '2020', 'WBL', 13, 34, 18, 11, 1, 6),
  ('South Bay Queens', 'Feminino', 'Jessica Brown', '2017', 'WBL', 15, 38, 18, 13, 0, 5),
  ('Western Indian Lakes', 'Feminino', 'Michelle Davis', '2021', 'WBL', 14, 32, 18, 10, 2, 6),
  ('Northern Turnovers', 'Profissional', 'David Wilson', '2016', 'B-League', 14, 30, 18, 9, 3, 6),
  ('Loriela Warriors', 'Profissional', 'Michael Taylor', '2019', 'B-League', 13, 28, 18, 8, 4, 6),
  ('Thunderhowl BC', 'Profissional', 'James Anderson', '2020', 'B-League', 15, 32, 18, 10, 2, 6),
  ('Nova City Sparks', 'Profissional', 'Thomas Martinez', '2018', 'B-League', 14, 26, 18, 7, 5, 6),
  ('Basement Bridge', 'Amador', 'Christopher Lee', '2022', 'A-League', 12, 24, 16, 7, 3, 6),
  ('Northbridge Thunder', 'Amador', 'Daniel White', '2021', 'A-League', 13, 22, 16, 6, 4, 6),
  ('Brookdale Saints', 'Amador', 'Matthew Harris', '2020', 'A-League', 12, 26, 16, 8, 2, 6),
  ('Redrock Comets', 'Amador', 'Joshua Clark', '2019', 'A-League', 13, 20, 16, 5, 5, 6),
  ('Ironhill Cyclones', 'Profissional', 'Andrew Lewis', '2017', 'International League', 15, 35, 18, 11, 2, 5),
  ('Pinevale', 'Profissional', 'Ryan Walker', '2016', 'International League', 14, 33, 18, 10, 3, 5),
  ('Red Valley Outlaws', 'Profissional', 'Kevin Hall', '2018', 'International League', 15, 31, 18, 9, 4, 5),
  ('Curitiba Watchers', 'Profissional', 'Paulo Roberto', '2014', 'International League', 16, 37, 18, 12, 1, 5)
) AS t(name, category, coach, founded, league_name, players_count, points, matches, wins, draws, losses)
CROSS JOIN public.leagues l
WHERE l.name = t.league_name;

-- Insert players (20 named + 3-4 per team)
INSERT INTO public.players (name, position, number, age, team_id, nationality, goals, assists, matches, status, market_value)
SELECT 
  p.name,
  p.position,
  p.number,
  p.age,
  t.id as team_id,
  p.nationality,
  p.goals,
  p.assists,
  p.matches,
  p.status,
  p.market_value
FROM (VALUES
  -- Curitiba Watchers players
  ('Antonio Fernandez', 'Armador', 10, 28, 'Curitiba Watchers', 'Brasileiro', 185, 142, 18, 'active', 'R$ 2.5M'),
  ('Chris Fehn', 'Ala', 7, 26, 'Curitiba Watchers', 'Americano', 156, 98, 18, 'active', 'R$ 2.1M'),
  ('Paul Gray', 'Pivô', 4, 30, 'Curitiba Watchers', 'Americano', 201, 45, 18, 'active', 'R$ 2.8M'),
  ('Lucas Mendes', 'Ala-armador', 11, 24, 'Curitiba Watchers', 'Brasileiro', 134, 87, 17, 'active', 'R$ 1.8M'),
  -- Santiago Peaks players
  ('Craig Jones', 'Ala-pivô', 5, 27, 'Santiago Peaks', 'Americano', 178, 56, 20, 'active', 'R$ 2.3M'),
  ('James Root', 'Pivô', 8, 31, 'Santiago Peaks', 'Americano', 195, 38, 20, 'active', 'R$ 2.6M'),
  ('Jay Weinberg', 'Armador', 1, 25, 'Santiago Peaks', 'Americano', 142, 165, 20, 'active', 'R$ 2.4M'),
  ('Diego Martinez', 'Ala', 15, 23, 'Santiago Peaks', 'Chileno', 123, 76, 19, 'active', 'R$ 1.7M'),
  -- Trivana Lynx players
  ('Mick Thompson', 'Ala', 9, 29, 'Trivana Lynx', 'Canadense', 167, 89, 20, 'active', 'R$ 2.2M'),
  ('Alessandro Venturella', 'Pivô', 13, 28, 'Trivana Lynx', 'Italiano', 189, 42, 19, 'injured', 'R$ 2.5M'),
  ('Shawn Crahan', 'Ala-armador', 6, 32, 'Trivana Lynx', 'Americano', 154, 112, 20, 'active', 'R$ 2.7M'),
  ('Marcus Thompson', 'Armador', 3, 26, 'Trivana Lynx', 'Americano', 98, 134, 18, 'active', 'R$ 1.9M'),
  -- Big City Thunder players
  ('Michael Pfaff', 'Ala-pivô', 12, 24, 'Big City Thunder', 'Americano', 176, 67, 20, 'active', 'R$ 2.0M'),
  ('Joey Jordison', 'Armador', 2, 27, 'Big City Thunder', 'Americano', 198, 178, 20, 'active', 'R$ 3.1M'),
  ('Dave Murray', 'Ala', 14, 30, 'Big City Thunder', 'Inglês', 187, 94, 20, 'active', 'R$ 2.8M'),
  ('Tyler Jackson', 'Pivô', 25, 29, 'Big City Thunder', 'Americano', 203, 51, 19, 'active', 'R$ 2.6M'),
  -- State Champs players
  ('Jason McClung', 'Pivô', 33, 31, 'State Champs', 'Americano', 192, 47, 20, 'active', 'R$ 2.5M'),
  ('Mark Cornell', 'Ala', 21, 26, 'State Champs', 'Americano', 168, 82, 20, 'active', 'R$ 2.2M'),
  ('Ja Bomani', 'Armador', 0, 23, 'State Champs', 'Americano', 215, 156, 20, 'active', 'R$ 3.5M'),
  ('Kevin Durant', 'Ala-pivô', 35, 28, 'State Champs', 'Americano', 189, 71, 19, 'active', 'R$ 2.7M')
) AS p(name, position, number, age, team_name, nationality, goals, assists, matches, status, market_value)
CROSS JOIN public.teams t
WHERE t.name = p.team_name;

-- Additional players for remaining teams
INSERT INTO public.players (name, position, number, age, team_id, nationality, goals, assists, matches, status, market_value)
SELECT 
  p.name,
  p.position,
  p.number,
  p.age,
  t.id as team_id,
  p.nationality,
  p.goals,
  p.assists,
  p.matches,
  'active',
  p.market_value
FROM (VALUES
  ('Jason Lamar', 'Armador', 22, 25, 'Vellora Wings', 'Americana', 145, 123, 18, 'R$ 1.9M'),
  ('Jin Yang', 'Ala', 88, 24, 'Vellora Wings', 'Chinesa', 132, 87, 18, 'R$ 1.7M'),
  ('Kareem O''Connor', 'Pivô', 34, 27, 'Luna Sparks', 'Americana', 178, 45, 18, 'R$ 2.1M'),
  ('Paul DeMarcus', 'Ala-armador', 23, 26, 'Luna Sparks', 'Americano', 156, 98, 17, 'R$ 2.0M'),
  ('Carl Svensson', 'Pivô', 41, 29, 'South Bay Queens', 'Sueco', 189, 52, 18, 'R$ 2.3M')
) AS p(name, position, number, age, team_name, nationality, goals, assists, matches, market_value)
CROSS JOIN public.teams t
WHERE t.name = p.team_name;

-- Insert championships
INSERT INTO public.championships (name, type, league_id, teams_count, matches_count, status, phase)
SELECT 
  c.name,
  c.type,
  l.id as league_id,
  c.teams_count,
  c.matches_count,
  c.status,
  c.phase
FROM (VALUES
  ('Super League Championship 2024', 'Campeonato', 'Super League', 12, 66, 'ongoing', 'Fase de Grupos'),
  ('WBL Finals 2024', 'Final', 'WBL', 8, 28, 'ongoing', 'Quartas de Final'),
  ('B-League Cup', 'Copa', 'B-League', 16, 45, 'scheduled', 'Inscrições'),
  ('A-League Tournament', 'Torneio', 'A-League', 10, 30, 'ongoing', 'Oitavas'),
  ('International Champions', 'Campeonato', 'International League', 8, 56, 'finished', 'Finalizado')
) AS c(name, type, league_name, teams_count, matches_count, status, phase)
CROSS JOIN public.leagues l
WHERE l.name = c.league_name;