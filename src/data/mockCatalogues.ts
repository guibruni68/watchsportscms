export interface Season {
  id: string;
  title: string;
  season_number: number;
  description?: string;
  cover_url?: string;
  published_at: string;
  contents: SeasonContent[];
}

export interface SeasonContent {
  id: string;
  title: string;
  status: boolean;
  published_at: string;
}

export interface Catalogue {
  id: string;
  titulo: string;
  descricao?: string;
  tipo_catalogo: "playlist" | "serie" | "colecao" | "outro";
  genre?: string[];
  cover_url?: string;
  bannerImageUrl?: string;
  status: boolean;
  ordem_exibicao: number;
  conteudos?: string[];
  seasons?: Season[];
  published_at: string;
  updated_at: string;
  releaseYear?: number;
  badge?: "NEW" | "NEW EPISODES" | "SOON";
  visibility?: "FREE" | "BASIC" | "PREMIUM";
  ageRating?: string;
  enabled?: boolean;
  scheduleDate?: string;
}

export const mockCatalogues: Catalogue[] = [
  {
    id: "1",
    titulo: "Melhores Momentos da Temporada 2024",
    descricao: "Compilação dos lances mais emocionantes da temporada atual",
    tipo_catalogo: "playlist",
    genre: ["Goals and Highlights", "Best Moments"],
    cover_url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400",
    bannerImageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200",
    badge: "NEW",
    visibility: "FREE",
    ageRating: "L",
    enabled: true,
    status: true,
    ordem_exibicao: 1,
    conteudos: ["video1", "video2", "video3"],
    releaseYear: 2024,
    seasons: [
      {
        id: "s1-1",
        title: "Season 1",
        season_number: 1,
        description: "First season highlights",
        published_at: new Date().toISOString(),
        contents: [
          {
            id: "v1-1",
            title: "Final do Campeonato 2024",
            status: true,
            published_at: new Date().toISOString()
          },
          {
            id: "v1-2",
            title: "Melhores Momentos - Semifinal",
            status: true,
            published_at: new Date().toISOString()
          }
        ]
      },
      {
        id: "s1-2",
        title: "Season 2",
        season_number: 2,
        description: "Second season best moments and highlights",
        published_at: new Date().toISOString(),
        contents: [
          {
            id: "v1-3",
            title: "Top 10 Goals of the Season",
            status: true,
            published_at: new Date().toISOString()
          },
          {
            id: "v1-4",
            title: "Best Saves and Defenses",
            status: true,
            published_at: new Date().toISOString()
          },
          {
            id: "v1-5",
            title: "Championship Winning Moment",
            status: true,
            published_at: new Date().toISOString()
          }
        ]
      }
    ],
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    titulo: "Série: Estrelas do Basquete Nacional",
    descricao: "Documentário sobre os principais jogadores da federação",
    tipo_catalogo: "serie",
    genre: ["Interviews", "Documentary"],
    cover_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
    bannerImageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200",
    badge: "NEW EPISODES",
    visibility: "PREMIUM",
    ageRating: "12+",
    enabled: true,
    status: true,
    ordem_exibicao: 2,
    conteudos: ["video4", "video5"],
    releaseYear: 2023,
    seasons: [
      {
        id: "s2-1",
        title: "Season 1",
        season_number: 1,
        description: "First season of basketball stars documentary",
        published_at: new Date().toISOString(),
        contents: [
          {
            id: "v2-1",
            title: "Episode 1: Rising Stars",
            status: true,
            published_at: new Date().toISOString()
          },
          {
            id: "v2-2",
            title: "Episode 2: The Veterans",
            status: true,
            published_at: new Date().toISOString()
          }
        ]
      },
      {
        id: "s2-2",
        title: "Season 2",
        season_number: 2,
        description: "Second season featuring new talents",
        published_at: new Date().toISOString(),
        contents: [
          {
            id: "v2-3",
            title: "Episode 1: New Generation",
            status: true,
            published_at: new Date().toISOString()
          }
        ]
      }
    ],
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    titulo: "Campeonato Estadual - Finais",
    descricao: "Todas as partidas finais do campeonato estadual",
    tipo_catalogo: "colecao",
    genre: ["Full Matches", "Championships"],
    cover_url: "/lovable-uploads/Backgroundfnb.png",
    status: true,
    ordem_exibicao: 3,
    conteudos: ["video6", "video7", "video8"],
    releaseYear: 2024,
    seasons: [
      {
        id: "s3-1",
        title: "2024 Finals",
        season_number: 1,
        description: "Championship finals 2024",
        published_at: new Date().toISOString(),
        contents: [
          {
            id: "v3-1",
            title: "Game 1: Semi-Final A",
            status: true,
            published_at: new Date().toISOString()
          },
          {
            id: "v3-2",
            title: "Game 2: Semi-Final B",
            status: true,
            published_at: new Date().toISOString()
          },
          {
            id: "v3-3",
            title: "Game 3: Grand Final",
            status: true,
            published_at: new Date().toISOString()
          }
        ]
      }
    ],
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    titulo: "Treinamentos e Clínicas",
    descricao: "Vídeos educativos para atletas e treinadores",
    tipo_catalogo: "playlist",
    genre: ["Training", "Educational"],
    cover_url: "/lovable-uploads/736ea3c4-4ba8-4dd3-84ef-adbda2ce6750.png",
    status: true,
    ordem_exibicao: 4,
    releaseYear: 2024,
    conteudos: ["video9", "video10"],
    seasons: [
      {
        id: "s4-1",
        title: "Beginner Training",
        season_number: 1,
        description: "Training sessions for beginners",
        published_at: new Date().toISOString(),
        contents: [
          {
            id: "v4-1",
            title: "Basic Dribbling Techniques",
            status: true,
            published_at: new Date().toISOString()
          },
          {
            id: "v4-2",
            title: "Shooting Fundamentals",
            status: true,
            published_at: new Date().toISOString()
          }
        ]
      }
    ],
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    titulo: "História da Federação",
    descricao: "Retrospectiva histórica do basquete estadual",
    tipo_catalogo: "serie",
    genre: ["Documentary", "Institutional"],
    cover_url: "/lovable-uploads/Backgroundfnb.png",
    status: false,
    ordem_exibicao: 5,
    conteudos: [],
    seasons: [],
    published_at: new Date().toISOString(),
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

export function getCollectionById(id: string): Catalogue | null {
  return mockCatalogues.find(c => c.id === id) || null;
}

export function getActiveCollections(): Catalogue[] {
  return mockCatalogues.filter(c => c.status);
}
