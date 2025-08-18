-- Criar enum para tipos de catálogo
CREATE TYPE public.catalogue_type AS ENUM ('serie', 'colecao', 'playlist', 'outro');

-- Criar tabela de catálogos
CREATE TABLE public.catalogues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo_catalogo catalogue_type NOT NULL DEFAULT 'colecao',
  status BOOLEAN NOT NULL DEFAULT true,
  ordem_exibicao INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar trigger para updated_at
CREATE TRIGGER update_catalogues_updated_at
  BEFORE UPDATE ON public.catalogues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.catalogues ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para catálogos
CREATE POLICY "Catalogues are viewable by everyone" 
  ON public.catalogues 
  FOR SELECT 
  USING (true);

CREATE POLICY "Catalogues can be created by authenticated users" 
  ON public.catalogues 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Catalogues can be updated by authenticated users" 
  ON public.catalogues 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Catalogues can be deleted by authenticated users" 
  ON public.catalogues 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Adicionar coluna de catálogo na tabela banners (como exemplo)
ALTER TABLE public.banners 
ADD COLUMN catalogue_id UUID REFERENCES public.catalogues(id) ON DELETE SET NULL;

-- Criar função para contar conteúdos por catálogo
CREATE OR REPLACE FUNCTION public.get_catalogue_content_count(catalogue_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM public.banners 
    WHERE catalogue_id = catalogue_uuid
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;