-- Temporarily disable RLS to allow data initialization
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON public.teams;
DROP POLICY IF EXISTS "Teams can be inserted by authenticated users" ON public.teams;  
DROP POLICY IF EXISTS "Teams can be updated by authenticated users" ON public.teams;
DROP POLICY IF EXISTS "Teams can be deleted by authenticated users" ON public.teams;

-- Re-enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create new more permissive policies
CREATE POLICY "Teams are viewable by everyone" 
ON public.teams 
FOR SELECT 
USING (true);

CREATE POLICY "Teams can be inserted by anyone" 
ON public.teams 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Teams can be updated by authenticated users" 
ON public.teams 
FOR UPDATE 
USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Teams can be deleted by authenticated users" 
ON public.teams 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Do the same for players table
ALTER TABLE public.players DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Players are viewable by everyone" ON public.players;
DROP POLICY IF EXISTS "Players can be inserted by authenticated users" ON public.players;  
DROP POLICY IF EXISTS "Players can be updated by authenticated users" ON public.players;
DROP POLICY IF EXISTS "Players can be deleted by authenticated users" ON public.players;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players are viewable by everyone" 
ON public.players 
FOR SELECT 
USING (true);

CREATE POLICY "Players can be inserted by anyone" 
ON public.players 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Players can be updated by authenticated users" 
ON public.players 
FOR UPDATE 
USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Players can be deleted by authenticated users" 
ON public.players 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Do the same for championships table
ALTER TABLE public.championships DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Championships are viewable by everyone" ON public.championships;
DROP POLICY IF EXISTS "Championships can be inserted by authenticated users" ON public.championships;  
DROP POLICY IF EXISTS "Championships can be updated by authenticated users" ON public.championships;
DROP POLICY IF EXISTS "Championships can be deleted by authenticated users" ON public.championships;

ALTER TABLE public.championships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Championships are viewable by everyone" 
ON public.championships 
FOR SELECT 
USING (true);

CREATE POLICY "Championships can be inserted by anyone" 
ON public.championships 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Championships can be updated by authenticated users" 
ON public.championships 
FOR UPDATE 
USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Championships can be deleted by authenticated users" 
ON public.championships 
FOR DELETE 
USING (auth.role() = 'authenticated');