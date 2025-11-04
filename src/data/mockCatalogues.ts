export interface Catalogue {
  id: string;
  titulo: string;
  descricao?: string;
  imagem_capa?: string;
  tipo_catalogo: "playlist" | "serie" | "colecao" | "outro";
  status: boolean;
  ordem_exibicao: number;
  conteudos?: string[];
  created_at: string;
  updated_at: string;
  content_count?: number;
}

export const mockCatalogues: Catalogue[] = [
  {
    id: "1",
    titulo: "Melhores Momentos da Temporada 2024",
    descricao: "Compilação dos lances mais emocionantes da temporada atual",
    imagem_capa: "/placeholder.svg",
    tipo_catalogo: "playlist",
    status: true,
    ordem_exibicao: 1,
    conteudos: ["video1", "video2", "video3"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    titulo: "Série: Estrelas do Basquete Nacional",
    descricao: "Documentário sobre os principais jogadores da federação",
    imagem_capa: "/placeholder.svg",
    tipo_catalogo: "serie",
    status: true,
    ordem_exibicao: 2,
    conteudos: ["video4", "video5"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    titulo: "Campeonato Estadual - Finais",
    descricao: "Todas as partidas finais do campeonato estadual",
    imagem_capa: "/placeholder.svg",
    tipo_catalogo: "colecao",
    status: true,
    ordem_exibicao: 3,
    conteudos: ["video6", "video7", "video8"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    titulo: "Treinamentos e Clínicas",
    descricao: "Vídeos educativos para atletas e treinadores",
    imagem_capa: "/placeholder.svg",
    tipo_catalogo: "playlist",
    status: true,
    ordem_exibicao: 4,
    conteudos: ["video9", "video10"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    titulo: "História da Federação",
    descricao: "Retrospectiva histórica do basquete estadual",
    imagem_capa: "/placeholder.svg",
    tipo_catalogo: "serie",
    status: false,
    ordem_exibicao: 5,
    conteudos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockBanners = [
  {
    id: "1",
    titulo: "Final do Campeonato 2024",
    tipo_conteudo: "live",
    layout_banner: "hero_cta",
    midia_url: "/lovable-uploads/Backgroundfnb.png",
    midia_tipo: "image",
    exibir_botao: true,
    texto_botao: "Assistir ao vivo",
    link_botao: "/lives/final-2024",
    url_acao: "/lives/final-2024",
    data_inicio: new Date().toISOString(),
    data_fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: true,
    ordem: 1,
    ordem_exibicao: 1,
    planos_permitidos: ["gratuito", "basico", "premium", "vip"],
    visualizacoes: 15420,
    cliques: 3842,
    tempo_total_reproducao: 245680,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    titulo: "Inscrições Abertas - Escolinha de Basquete",
    tipo_conteudo: "campanha",
    layout_banner: "imagem_botao",
    midia_url: "/lovable-uploads/736ea3c4-4ba8-4dd3-84ef-adbda2ce6750.png",
    midia_tipo: "image",
    exibir_botao: true,
    texto_botao: "Saiba mais",
    link_botao: "/campanhas/escolinha",
    url_acao: "/campanhas/escolinha",
    data_inicio: new Date().toISOString(),
    data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: true,
    ordem: 2,
    ordem_exibicao: 2,
    planos_permitidos: ["gratuito", "basico", "premium"],
    visualizacoes: 8935,
    cliques: 1256,
    tempo_total_reproducao: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getCatalogueById(id: string): Catalogue | null {
  return mockCatalogues.find(c => c.id === id) || null;
}

export function getActiveCatalogues(): Catalogue[] {
  return mockCatalogues.filter(c => c.status);
}
