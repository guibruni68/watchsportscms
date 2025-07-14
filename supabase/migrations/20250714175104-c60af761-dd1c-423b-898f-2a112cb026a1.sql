-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  coach TEXT,
  founded TEXT,
  division TEXT NOT NULL,
  logo_url TEXT,
  players_count INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  matches INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  number INTEGER,
  age INTEGER,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  nationality TEXT,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  matches INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'injured', 'suspended', 'inactive')),
  market_value TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create championships table
CREATE TABLE public.championships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  teams_count INTEGER DEFAULT 0,
  matches_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'finished')),
  phase TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for teams (public read, authenticated write)
CREATE POLICY "Teams are viewable by everyone" 
ON public.teams FOR SELECT USING (true);

CREATE POLICY "Teams can be inserted by authenticated users" 
ON public.teams FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Teams can be updated by authenticated users" 
ON public.teams FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Teams can be deleted by authenticated users" 
ON public.teams FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create policies for players (public read, authenticated write)
CREATE POLICY "Players are viewable by everyone" 
ON public.players FOR SELECT USING (true);

CREATE POLICY "Players can be inserted by authenticated users" 
ON public.players FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Players can be updated by authenticated users" 
ON public.players FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Players can be deleted by authenticated users" 
ON public.players FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create policies for championships (public read, authenticated write)
CREATE POLICY "Championships are viewable by everyone" 
ON public.championships FOR SELECT USING (true);

CREATE POLICY "Championships can be inserted by authenticated users" 
ON public.championships FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Championships can be updated by authenticated users" 
ON public.championships FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Championships can be deleted by authenticated users" 
ON public.championships FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
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

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();