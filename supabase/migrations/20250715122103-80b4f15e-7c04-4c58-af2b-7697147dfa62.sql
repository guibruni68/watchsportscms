-- Create banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  tipo_conteudo TEXT NOT NULL CHECK (tipo_conteudo IN (
    'vod', 'live_agora', 'live_programado', 'campanha', 
    'recomendado', 'institucional'
  )),
  layout_banner TEXT NOT NULL CHECK (layout_banner IN (
    'imagem_botao', 'video_texto', 'hero_cta', 'mini_card'
  )),
  midia_url TEXT,
  midia_tipo TEXT CHECK (midia_tipo IN ('imagem', 'video')),
  texto_botao TEXT,
  exibir_botao BOOLEAN DEFAULT true,
  url_acao TEXT,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  status BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  conteudo_vinculado_id UUID,
  planos_permitidos TEXT[] DEFAULT '{}',
  visualizacoes INTEGER DEFAULT 0,
  cliques INTEGER DEFAULT 0,
  tempo_total_reproducao INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Banners are viewable by everyone" 
ON public.banners 
FOR SELECT 
USING (true);

CREATE POLICY "Banners can be created by authenticated users" 
ON public.banners 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Banners can be updated by authenticated users" 
ON public.banners 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Banners can be deleted by authenticated users" 
ON public.banners 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_banners_status ON public.banners(status);
CREATE INDEX idx_banners_periodo ON public.banners(data_inicio, data_fim);
CREATE INDEX idx_banners_ordem ON public.banners(ordem);
CREATE INDEX idx_banners_tipo ON public.banners(tipo_conteudo);