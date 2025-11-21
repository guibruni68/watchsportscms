// Dados mocados centralizados para a plataforma
import { Genre } from "@/types/genre"

export interface Team {
  id: string;
  name: string;
  logo?: string;
  category: string;
  division: string;
  coach: string;
  founded: string;
  players: number;
  position: number;
  points: number;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age: number;
  team: string;
  nationality: string;
  goals: number;
  assists: number;
  matches: number;
  status: 'active' | 'injured' | 'suspended';
  marketValue: string;
}

export interface Coach {
  id: string;
  name: string;
  team: string;
  experience: string;
  nationality: string;
  age: number;
  achievements: string[];
}

export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  type: 'video' | 'image' | 'news';
  relatedAgents: string[];
  tags: string[];
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  cover_image?: string;
  duration?: string;
  genre?: string[];
  views: number;
  createdAt: string;
}

export interface Live {
  id: string;
  nome_evento: string;
  descricao?: string;
  imagem_capa?: string;
  data_inicio: string;
  status: 'scheduled' | 'live' | 'ended';
}

export interface News {
  id: string;
  title: string; // Internal CMS title
  header: string; // Public-facing news title/headline
  firstText: string; // First paragraph/content block
  lastText: string; // Last paragraph/content block
  firstImageUrl?: string; // Main image
  secondImageUrl?: string; // Secondary/mid-banner image
  highlighted: boolean; // Featured/highlight flag
  date: string; // Publication date
  scheduleDate?: string; // Scheduled publication date
  published: boolean; // Publication status
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  genres?: string[]; // Array of genre IDs for news types
  agentId?: string; // Optional linked agent
  groupId?: string; // Optional linked group
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // Event date/time
  cardImageUrl?: string; // Event card/thumbnail image
  redirectionUrl?: string; // External link for event details
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
}

// Times atualizados com novos nomes
export const mockTeams: Team[] = [
  {
    id: "team1",
    name: "Nova City Sparks",
    logo: "/placeholder.svg",
    category: "Profissional",
    division: "Primeira Divisão",
    coach: "Roberto Silva",
    founded: "1995",
    players: 28,
    position: 1,
    points: 65,
    matches: 25,
    wins: 20,
    draws: 3,
    losses: 2
  },
  {
    id: "team2",
    name: "Northbridge Thunder",
    logo: "/placeholder.svg",
    category: "Profissional",
    division: "Primeira Divisão",
    coach: "Ana Costa",
    founded: "1987",
    players: 26,
    position: 2,
    points: 58,
    matches: 25,
    wins: 18,
    draws: 4,
    losses: 3
  },
  {
    id: "team3",
    name: "Brookdale Saints",
    logo: "/placeholder.svg",
    category: "Profissional",
    division: "Primeira Divisão",
    coach: "Carlos Mendes",
    founded: "2001",
    players: 24,
    position: 3,
    points: 52,
    matches: 25,
    wins: 16,
    draws: 4,
    losses: 5
  },
  {
    id: "team4",
    name: "Red Valley Outlaws",
    logo: "/placeholder.svg",
    category: "Profissional",
    division: "Segunda Divisão",
    coach: "Maria Santos",
    founded: "1999",
    players: 22,
    position: 1,
    points: 48,
    matches: 22,
    wins: 15,
    draws: 3,
    losses: 4
  },
  {
    id: "team5",
    name: "Luna Sparks",
    logo: "/placeholder.svg",
    category: "Sub-20",
    division: "Juvenil A",
    coach: "Pedro Oliveira",
    founded: "2010",
    players: 20,
    position: 1,
    points: 42,
    matches: 18,
    wins: 14,
    draws: 0,
    losses: 4
  },
  {
    id: "team6",
    name: "Southbay Queens",
    logo: "/placeholder.svg",
    category: "Feminino",
    division: "Liga Feminina",
    coach: "Sofia Lima",
    founded: "2015",
    players: 18,
    position: 2,
    points: 38,
    matches: 16,
    wins: 12,
    draws: 2,
    losses: 2
  },
  {
    id: "team7",
    name: "Santiago Peaks",
    logo: "/placeholder.svg",
    category: "Sub-17",
    division: "Juvenil B",
    coach: "Fernando Rocha",
    founded: "2012",
    players: 19,
    position: 3,
    points: 35,
    matches: 15,
    wins: 11,
    draws: 2,
    losses: 2
  }
];

// Jogadores atualizados com times correspondentes
export const mockPlayers: Player[] = [
  {
    id: "player1",
    name: "Marcus Johnson",
    position: "Armador",
    number: 10,
    age: 28,
    team: "Nova City Sparks",
    nationality: "Americano",
    goals: 245,
    assists: 189,
    matches: 25,
    status: "active",
    marketValue: "R$ 2.8M"
  },
  {
    id: "player2",
    name: "André Silva",
    position: "Ala-Pivô",
    number: 15,
    age: 26,
    team: "Nova City Sparks",
    nationality: "Brasileiro",
    goals: 198,
    assists: 87,
    matches: 24,
    status: "active",
    marketValue: "R$ 2.2M"
  },
  {
    id: "player3",
    name: "James Wilson",
    position: "Pivô",
    number: 23,
    age: 30,
    team: "Northbridge Thunder",
    nationality: "Americano",
    goals: 167,
    assists: 45,
    matches: 23,
    status: "active",
    marketValue: "R$ 1.9M"
  },
  {
    id: "player4",
    name: "Rafael Costa",
    position: "Ala",
    number: 7,
    age: 24,
    team: "Northbridge Thunder",
    nationality: "Brasileiro",
    goals: 156,
    assists: 112,
    matches: 25,
    status: "active",
    marketValue: "R$ 1.5M"
  },
  {
    id: "player5",
    name: "Diego Santos",
    position: "Armador",
    number: 11,
    age: 22,
    team: "Brookdale Saints",
    nationality: "Brasileiro",
    goals: 134,
    assists: 145,
    matches: 24,
    status: "active",
    marketValue: "R$ 1.3M"
  },
  {
    id: "player6",
    name: "Michael Brown",
    position: "Ala-Pivô",
    number: 33,
    age: 27,
    team: "Red Valley Outlaws",
    nationality: "Americano",
    goals: 178,
    assists: 67,
    matches: 22,
    status: "active",
    marketValue: "R$ 1.7M"
  },
  {
    id: "player7",
    name: "Lucas Mendes",
    position: "Ala",
    number: 8,
    age: 19,
    team: "Luna Sparks",
    nationality: "Brasileiro",
    goals: 89,
    assists: 56,
    matches: 18,
    status: "active",
    marketValue: "R$ 800K"
  },
  {
    id: "player8",
    name: "Carla Rodrigues",
    position: "Armadora",
    number: 9,
    age: 25,
    team: "Southbay Queens",
    nationality: "Brasileira",
    goals: 123,
    assists: 98,
    matches: 16,
    status: "active",
    marketValue: "R$ 900K"
  }
];

// Técnicos atualizados
export const mockCoaches: Coach[] = [
  {
    id: "coach1",
    name: "Roberto Silva",
    team: "Nova City Sparks",
    experience: "12 anos",
    nationality: "Brasileiro",
    age: 45,
    achievements: ["Campeão Estadual 2023", "Vice-campeão Nacional 2022"]
  },
  {
    id: "coach2",
    name: "Ana Costa",
    team: "Northbridge Thunder",
    experience: "8 anos",
    nationality: "Brasileira",
    age: 38,
    achievements: ["Campeão Regional 2023", "Melhor Técnico 2022"]
  },
  {
    id: "coach3",
    name: "Carlos Mendes",
    team: "Brookdale Saints",
    experience: "6 anos",
    nationality: "Brasileiro",
    age: 42,
    achievements: ["Revelação Técnico 2021"]
  },
  {
    id: "coach4",
    name: "Maria Santos",
    team: "Red Valley Outlaws",
    experience: "10 anos",
    nationality: "Brasileira",
    age: 40,
    achievements: ["Campeão Segunda Divisão 2023"]
  },
  {
    id: "coach5",
    name: "Pedro Oliveira",
    team: "Luna Sparks",
    experience: "5 anos",
    nationality: "Brasileiro",
    age: 35,
    achievements: ["Campeão Juvenil 2023"]
  },
  {
    id: "coach6",
    name: "Sofia Lima",
    team: "Southbay Queens",
    experience: "7 anos",
    nationality: "Brasileira",
    age: 36,
    achievements: ["Campeão Liga Feminina 2022"]
  },
  {
    id: "coach7",
    name: "Fernando Rocha",
    team: "Santiago Peaks",
    experience: "4 anos",
    nationality: "Brasileiro",
    age: 33,
    achievements: ["Revelação Sub-17 2023"]
  }
];

// Vídeos (VOD) mocados
export const mockVideos: Video[] = [
  {
    id: "video1",
    title: "Melhores momentos: Final do Campeonato 2024",
    description: "Reveja os melhores lances da emocionante final do campeonato estadual",
    cover_image: "/placeholder.svg",
    duration: "12:34",
    genre: ["Highlights", "Championship"],
    views: 25400,
    createdAt: "2024-01-18T20:00:00"
  },
  {
    id: "video2",
    title: "Top 10 Cestas da Semana",
    description: "As jogadas mais incríveis da rodada",
    cover_image: "/placeholder.svg",
    duration: "5:42",
    genre: ["Highlights", "Weekly"],
    views: 18900,
    createdAt: "2024-01-17T18:30:00"
  },
  {
    id: "video3",
    title: "Análise Tática: Como vencer defesas por zona",
    description: "Nosso especialista explica as melhores estratégias",
    cover_image: "/placeholder.svg",
    duration: "8:15",
    genre: ["Analysis", "Tactics"],
    views: 12300,
    createdAt: "2024-01-16T15:00:00"
  },
  {
    id: "video4",
    title: "Entrevista: Marcus Johnson fala sobre título",
    description: "O armador conta sobre a conquista e os bastidores",
    cover_image: "/placeholder.svg",
    duration: "6:28",
    genre: ["Interview", "Behind the Scenes"],
    views: 14500,
    createdAt: "2024-01-15T14:00:00"
  },
  {
    id: "video5",
    title: "Treino Aberto: Preparação para os Playoffs",
    description: "Veja como o time se prepara para a fase decisiva",
    cover_image: "/placeholder.svg",
    duration: "10:03",
    genre: ["Training", "Playoffs"],
    views: 9800,
    createdAt: "2024-01-14T10:00:00"
  }
];

// Lives mocadas
export const mockLives: Live[] = [
  {
    id: "live1",
    nome_evento: "Nova City Sparks vs Northbridge Thunder - Semifinal",
    descricao: "Jogo decisivo da semifinal do campeonato estadual",
    imagem_capa: "/placeholder.svg",
    data_inicio: "2024-01-20T19:00:00",
    status: "scheduled"
  },
  {
    id: "live2",
    nome_evento: "Coletiva de Imprensa: Apresentação do Novo Técnico",
    descricao: "Acompanhe ao vivo a apresentação oficial",
    imagem_capa: "/placeholder.svg",
    data_inicio: "2024-01-19T15:00:00",
    status: "scheduled"
  },
  {
    id: "live3",
    nome_evento: "Brookdale Saints vs Red Valley Outlaws",
    descricao: "Confronto direto pela liderança da segunda divisão",
    imagem_capa: "/placeholder.svg",
    data_inicio: "2024-01-21T16:00:00",
    status: "scheduled"
  }
];

// Notícias mocadas
export const mockNews: News[] = [
  {
    id: "1",
    title: "Nova contratação 2024",
    header: "Nova City Sparks anuncia contratação de novo armador para 2024",
    firstText: "O clube confirmou hoje a contratação do armador Marcus Johnson, de 28 anos, que vem da liga americana. O jogador assinou contrato por três temporadas e já está liberado para jogar.",
    lastText: "Com essa contratação, o clube reforça seu elenco visando a disputa do campeonato nacional. Marcus Johnson chega com experiência internacional e promete agregar muito ao time.",
    firstImageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    secondImageUrl: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800",
    highlighted: true,
    date: "2024-01-18T14:30:00",
    published: true,
    createdAt: "2024-01-18T10:00:00",
    updatedAt: "2024-01-18T14:30:00",
    enabled: true,
    genres: ["genre-news-1", "genre-news-2"]
  },
  {
    id: "2",
    title: "Ingressos final",
    header: "Ingressos para a final já estão à venda",
    firstText: "A partir de hoje, os torcedores já podem adquirir seus ingressos para a grande final do campeonado estadual. Os preços variam de R$ 50 a R$ 200.",
    lastText: "A venda está sendo realizada online e nos pontos físicos autorizados. Garanta já o seu ingresso e não perca essa grande decisão!",
    firstImageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
    highlighted: false,
    date: "2024-01-17T10:15:00",
    published: true,
    createdAt: "2024-01-17T08:00:00",
    updatedAt: "2024-01-17T10:15:00",
    enabled: true,
    genres: ["genre-news-3"]
  },
  {
    id: "3",
    title: "Time feminino acesso",
    header: "Time feminino conquista acesso à primeira divisão",
    firstText: "Com uma campanha brilhante, o time feminino garantiu o acesso à primeira divisão do campeonato estadual. A equipe não perdeu nenhum jogo na fase final.",
    lastText: "Esta conquista marca um momento histórico para o clube e reafirma o compromisso com o desenvolvimento do futebol feminino.",
    firstImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    secondImageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
    highlighted: true,
    date: "2024-01-16T16:45:00",
    published: true,
    createdAt: "2024-01-16T14:00:00",
    updatedAt: "2024-01-16T16:45:00",
    enabled: true,
    genres: ["genre-news-1", "genre-news-4"]
  },
  {
    id: "4",
    title: "Novo técnico 2024",
    header: "Novo técnico é apresentado para a temporada 2024",
    firstText: "Roberto Silva, de 45 anos, foi oficialmente apresentado como novo técnico da equipe principal. O profissional chega com vasta experiência em competições nacionais.",
    lastText: "Em sua apresentação, Roberto destacou seus objetivos e a importância de um trabalho coletivo para alcançar os resultados esperados.",
    firstImageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
    highlighted: false,
    date: "2024-01-15T09:00:00",
    published: true,
    createdAt: "2024-01-15T07:00:00",
    updatedAt: "2024-01-15T09:00:00",
    enabled: true,
    genres: ["genre-news-2"]
  },
  {
    id: "5",
    title: "Centro de treinamento",
    header: "Inauguração do novo centro de treinamento",
    firstText: "O clube inaugurou suas novas instalações de treinamento, com academia, piscina e campos de última geração para melhor preparação dos atletas.",
    lastText: "O investimento reflete o compromisso do clube com a excelência e o desenvolvimento profissional dos atletas. As novas instalações são consideradas referência no país.",
    firstImageUrl: "https://images.unsplash.com/photo-1577223625816-7546f36aba40?w=800",
    secondImageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    highlighted: true,
    date: "2024-01-14T11:30:00",
    published: true,
    createdAt: "2024-01-14T09:00:00",
    updatedAt: "2024-01-14T11:30:00",
    enabled: true,
    genres: ["genre-news-5"]
  }
];

// Conteúdos mocados relacionados aos agentes
export const mockContents: Content[] = [
  {
    id: "content1",
    title: "Melhores momentos: Marcus Johnson vs Northbridge",
    description: "Compilação dos melhores lances do armador na partida decisiva",
    thumbnail: "/placeholder.svg",
    duration: "3:45",
    views: 12500,
    type: "video",
    relatedAgents: ["player1", "team1"],
    tags: ["highlights", "armador", "playoffs"],
    createdAt: "2024-01-15"
  },
  {
    id: "content2",
    title: "Entrevista exclusiva: Roberto Silva fala sobre estratégias",
    description: "Técnico do Nova City Sparks revela táticas para os playoffs",
    thumbnail: "/placeholder.svg",
    duration: "8:20",
    views: 8900,
    type: "video",
    relatedAgents: ["coach1", "team1"],
    tags: ["entrevista", "estratégia", "técnico"],
    createdAt: "2024-01-14"
  },
  {
    id: "content3",
    title: "Treino aberto: Nova City Sparks se prepara para final",
    description: "Bastidores do treino preparatório para a grande final",
    thumbnail: "/placeholder.svg",
    duration: "5:30",
    views: 15600,
    type: "video",
    relatedAgents: ["team1", "coach1"],
    tags: ["treino", "bastidores", "final"],
    createdAt: "2024-01-13"
  },
  {
    id: "content4",
    title: "Análise tática: Como o Northbridge Thunder chegou à final",
    description: "Breakdown das jogadas que levaram o time ao topo",
    thumbnail: "/placeholder.svg",
    duration: "6:15",
    views: 9800,
    type: "video",
    relatedAgents: ["team2", "coach2"],
    tags: ["análise", "tática", "playoffs"],
    createdAt: "2024-01-12"
  },
  {
    id: "content5",
    title: "Cestinha da temporada: André Silva em números",
    description: "Estatísticas completas do maior pontuador da liga",
    thumbnail: "/placeholder.svg",
    duration: "4:20",
    views: 11200,
    type: "video",
    relatedAgents: ["player2", "team1"],
    tags: ["estatísticas", "pontuação", "temporada"],
    createdAt: "2024-01-11"
  }
];

// Funções helper para buscar dados
export const getAgentsByType = (type: string) => {
  switch (type) {
    case "player":
      return mockPlayers.map(player => ({
        id: player.id,
        name: `${player.name} (${player.position})`,
        team: player.team
      }));
    case "coach":
      return mockCoaches.map(coach => ({
        id: coach.id,
        name: `${coach.name} (Técnico)`,
        team: coach.team
      }));
    case "team":
      return mockTeams.map(team => ({
        id: team.id,
        name: team.name,
        category: team.category
      }));
    case "staff":
      return [
        { id: "staff1", name: "Dr. Carlos Medina (Médico)", team: "Nova City Sparks" },
        { id: "staff2", name: "Ana Física (Preparadora)", team: "Northbridge Thunder" },
        { id: "staff3", name: "João Nutri (Nutricionista)", team: "Brookdale Saints" }
      ];
    default:
      return [];
  }
};

export const getContentsByAgent = (agentId: string) => {
  return mockContents.filter(content => 
    content.relatedAgents.includes(agentId)
  );
};

export const getContentsByGenre = (genre: string) => {
  const genreTagMap: Record<string, string[]> = {
    "goals": ["gols", "pontuação", "cestas"],
    "highlights": ["highlights", "melhores momentos"],
    "interviews": ["entrevista", "declaração"],
    "training": ["treino", "preparação"],
    "behind-scenes": ["bastidores", "nos bastidores"]
  };
  
  const tags = genreTagMap[genre] || [];
  return mockContents.filter(content => 
    content.tags.some(tag => tags.includes(tag))
  );
};

export const getContentsByAlgorithm = (algorithm: string) => {
  switch (algorithm) {
    case "trending":
      return mockContents.sort((a, b) => b.views - a.views).slice(0, 10);
    case "recent":
      return mockContents.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 10);
    case "personalized":
    case "similar":
      // Mock de algoritmo personalizado
      return mockContents.slice(0, 8);
    default:
      return mockContents.slice(0, 5);
  }
};

// Dados mockados para banners
export interface Banner {
  id: string;
  title: string;
  layout: "hero" | "standard"; // Two layout types
  text: string; // Body text
  tag?: "LINE" | "NEW" | "NEW EPISODES"; // Optional tag enum
  buttonText?: string;
  buttonRedirectionUrl?: string;
  scheduleDate?: string;
  isPublished: boolean;
  bgImageUrl?: string; // Desktop background image
  bgMobileUrl?: string; // Mobile background image
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
}

export const mockBanners: Banner[] = [
  {
    id: "banner1",
    title: "Championship Final - Watch Live Now",
    layout: "hero",
    text: "Don't miss the most important match of the season! Watch live and exclusive coverage of the championship final.",
    tag: "LINE",
    buttonText: "Watch Now",
    buttonRedirectionUrl: "/live/final-championship",
    scheduleDate: new Date(Date.now() - 3600000).toISOString(),
    isPublished: true,
    bgImageUrl: "/lovable-uploads/178882be-43bc-492f-ab1c-036716604bc1.png",
    bgMobileUrl: "/lovable-uploads/178882be-43bc-492f-ab1c-036716604bc1.png",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    enabled: true
  },
  {
    id: "banner2",
    title: "Semifinal - Tonight at 8 PM",
    layout: "standard",
    text: "Get ready for an intense match! The semifinal starts tonight at 8 PM.",
    tag: "NEW",
    buttonText: "Set Reminder",
    buttonRedirectionUrl: "/schedule/semifinal",
    scheduleDate: new Date(Date.now() + 21600000).toISOString(),
    isPublished: false,
    bgImageUrl: "/lovable-uploads/3e4f7302-40a3-4b04-95b2-f925cfb43250.png",
    bgMobileUrl: "/lovable-uploads/3e4f7302-40a3-4b04-95b2-f925cfb43250.png",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    enabled: false
  },
  {
    id: "banner3",
    title: "Best Moments of the Round",
    layout: "standard",
    text: "Relive all the best moments, goals, and highlights from this weekend's matches.",
    tag: "NEW EPISODES",
    buttonText: "Watch Video",
    buttonRedirectionUrl: "/videos/best-moments-round-15",
    scheduleDate: new Date(Date.now() - 172800000).toISOString(),
    isPublished: true,
    bgImageUrl: "/lovable-uploads/56b1b2ee-687f-4828-8038-c0902cb9f932.png",
    bgMobileUrl: "/lovable-uploads/56b1b2ee-687f-4828-8038-c0902cb9f932.png",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString(),
    enabled: true
  },
  {
    id: "banner4",
    title: "Black Friday - 50% OFF Premium",
    layout: "hero",
    text: "Limited time offer! Get 50% off on all premium subscriptions. Don't miss this exclusive deal!",
    buttonText: "Claim Offer",
    buttonRedirectionUrl: "/campaigns/black-friday-2024",
    scheduleDate: new Date(Date.now() - 86400000).toISOString(),
    isPublished: true,
    bgImageUrl: "/lovable-uploads/68bd6b68-c5e2-4cdc-81bb-941708e88ddb.png",
    bgMobileUrl: "/lovable-uploads/68bd6b68-c5e2-4cdc-81bb-941708e88ddb.png",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date().toISOString(),
    enabled: true
  },
  {
    id: "banner5",
    title: "New Documentary: Club History",
    layout: "hero",
    text: "Discover the incredible journey of our club through exclusive interviews and never-before-seen footage.",
    tag: "NEW",
    buttonText: "Watch Trailer",
    buttonRedirectionUrl: "/videos/documentary-club-history",
    scheduleDate: new Date(Date.now() - 259200000).toISOString(),
    isPublished: true,
    bgImageUrl: "/lovable-uploads/736ea3c4-4ba8-4dd3-84ef-adbda2ce6750.png",
    bgMobileUrl: "/lovable-uploads/736ea3c4-4ba8-4dd3-84ef-adbda2ce6750.png",
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date().toISOString(),
    enabled: true
  },
  {
    id: "banner6",
    title: "Exclusive Coach Interview",
    layout: "standard",
    text: "Hear directly from our coach about strategy, team dynamics, and what's next for the season.",
    tag: "NEW EPISODES",
    buttonText: "Watch Interview",
    buttonRedirectionUrl: "/videos/coach-interview-december",
    scheduleDate: new Date(Date.now() - 432000000).toISOString(),
    isPublished: true,
    bgImageUrl: "/lovable-uploads/a945b2ac-8b16-4c57-a844-122cc1e8170c.png",
    bgMobileUrl: "/lovable-uploads/a945b2ac-8b16-4c57-a844-122cc1e8170c.png",
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    updatedAt: new Date().toISOString(),
    enabled: true
  },
  {
    id: "banner7",
    title: "Special: Ticket + Jersey Combo",
    layout: "hero",
    text: "Perfect for true fans! Buy your game ticket and get an official jersey in this exclusive combo deal.",
    buttonText: "Buy Combo",
    buttonRedirectionUrl: "/campaigns/ticket-jersey-combo",
    scheduleDate: new Date(Date.now() + 86400000).toISOString(),
    isPublished: false,
    bgImageUrl: "/lovable-uploads/b178263a-95eb-4d88-ad87-aa9de585a258.png",
    bgMobileUrl: "/lovable-uploads/b178263a-95eb-4d88-ad87-aa9de585a258.png",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    enabled: false
  },
  {
    id: "banner8",
    title: "Live Post-Match Analysis",
    layout: "standard",
    text: "Join our experts for in-depth analysis right after the final whistle. Interactive Q&A session included!",
    tag: "LINE",
    buttonText: "Join Live",
    buttonRedirectionUrl: "/live/post-match-analysis",
    scheduleDate: new Date(Date.now() + 10800000).toISOString(),
    isPublished: false,
    bgImageUrl: "/lovable-uploads/c77a6a4a-5568-4a9c-bdcc-34a53dca4782.png",
    bgMobileUrl: "/lovable-uploads/c77a6a4a-5568-4a9c-bdcc-34a53dca4782.png",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date().toISOString(),
    enabled: false
  },
  {
    id: "banner9",
    title: "Top 10 Goals of the Season",
    layout: "standard",
    text: "Vote for your favorite goal! Watch the most spectacular moments from this unforgettable season.",
    tag: "NEW",
    buttonText: "View Ranking",
    buttonRedirectionUrl: "/videos/top-10-goals-season",
    scheduleDate: new Date(Date.now() - 604800000).toISOString(),
    isPublished: true,
    bgImageUrl: "/lovable-uploads/d5035e4b-b98c-4f58-a0b5-6c9da2398ab0.png",
    bgMobileUrl: "/lovable-uploads/d5035e4b-b98c-4f58-a0b5-6c9da2398ab0.png",
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
    updatedAt: new Date().toISOString(),
    enabled: true
  }
];

// Mock de campanhas
export const mockCampaigns = [
  { id: "camp1", name: "Black Friday 2024" },
  { id: "camp2", name: "Volta às Aulas" },
  { id: "camp3", name: "Dia dos Pais" },
  { id: "camp4", name: "Playoffs Premium" }
];

// Mock genres for different entity types
export const mockGenres: Genre[] = [
  // Content genres
  { id: "genre-content-1", name: "Highlights", type: "content", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-content-2", name: "Full Match", type: "content", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-content-3", name: "Interview", type: "content", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-content-4", name: "Training", type: "content", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-content-5", name: "Documentary", type: "content", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-content-6", name: "Analysis", type: "content", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-content-7", name: "Behind the Scenes", type: "content", createdAt: "2024-01-01T00:00:00Z" },
  
  // Live genres
  { id: "genre-live-1", name: "Live Match", type: "live", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-live-2", name: "Pre-Match Show", type: "live", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-live-3", name: "Post-Match Analysis", type: "live", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-live-4", name: "Press Conference", type: "live", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-live-5", name: "Special Event", type: "live", createdAt: "2024-01-01T00:00:00Z" },
  
  // Collection genres
  { id: "genre-collection-1", name: "Season Highlights", type: "collection", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-collection-2", name: "Player Spotlight", type: "collection", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-collection-3", name: "Classic Matches", type: "collection", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-collection-4", name: "Championship Series", type: "collection", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-collection-5", name: "Top Goals", type: "collection", createdAt: "2024-01-01T00:00:00Z" },
  
  // Agent genres (positions/roles)
  { id: "genre-agent-1", name: "Goalkeeper", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-2", name: "Defender", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-3", name: "Center Back", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-4", name: "Left Back", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-5", name: "Right Back", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-6", name: "Defensive Midfielder", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-7", name: "Midfielder", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-8", name: "Attacking Midfielder", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-9", name: "Winger", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-10", name: "Forward", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-11", name: "Striker", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-12", name: "Head Coach", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-13", name: "Assistant Coach", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-14", name: "Sports Journalist", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-agent-15", name: "Commentator", type: "agent", createdAt: "2024-01-01T00:00:00Z" },
  
  // Group genres (team/league categories)
  { id: "genre-group-1", name: "Professional League", type: "group", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-group-2", name: "Amateur League", type: "group", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-group-3", name: "Youth Team", type: "group", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-group-4", name: "National Team", type: "group", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-group-5", name: "Club Team", type: "group", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-group-6", name: "Regional League", type: "group", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-group-7", name: "International Competition", type: "group", createdAt: "2024-01-01T00:00:00Z" },
  
  // News genres (news types/categories)
  { id: "genre-news-1", name: "Breaking News", type: "news", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-news-2", name: "Transfers", type: "news", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-news-3", name: "Match Updates", type: "news", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-news-4", name: "Team News", type: "news", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-news-5", name: "Club Announcements", type: "news", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-news-6", name: "Interviews", type: "news", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-news-7", name: "Analysis", type: "news", createdAt: "2024-01-01T00:00:00Z" },
  { id: "genre-news-8", name: "Opinion", type: "news", createdAt: "2024-01-01T00:00:00Z" },
]

// Mock Events/Schedule
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Regional Classic - Main Team vs Rival FC",
    description: "Don't miss the biggest match of the season! Main Team faces Rival FC in a decisive regional championship match. The game promises great emotions and could define the competition's leadership.",
    date: "2025-11-25T20:00:00",
    cardImageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
    redirectionUrl: "https://example.com/tickets/regional-classic",
    createdAt: "2025-11-15T10:00:00",
    updatedAt: "2025-11-15T10:00:00",
    enabled: true
  },
  {
    id: "2",
    title: "Open Training Session with Fans",
    description: "Come watch our team's training session! There will be autograph sessions, photos with players, and exclusive giveaways. Free entry for all fans.",
    date: "2025-11-22T16:00:00",
    cardImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    redirectionUrl: "https://example.com/events/open-training",
    createdAt: "2025-11-10T14:00:00",
    updatedAt: "2025-11-10T14:00:00",
    enabled: true
  },
  {
    id: "3",
    title: "Press Conference - New Coach Announcement",
    description: "Join us for the official presentation of our new coach. The event will be broadcast live and will feature Q&A with sports journalists.",
    date: "2025-11-23T14:00:00",
    cardImageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
    createdAt: "2025-11-08T09:00:00",
    updatedAt: "2025-11-08T09:00:00",
    enabled: true
  },
  {
    id: "4",
    title: "U-20 Final - Youth Team vs Juventude FC",
    description: "The final everyone was waiting for! Our U-20 team seeks the regional cup title against Juventude FC. Come support our young talents!",
    date: "2025-12-05T15:00:00",
    cardImageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
    redirectionUrl: "https://example.com/tickets/u20-final",
    createdAt: "2025-11-01T11:00:00",
    updatedAt: "2025-11-01T11:00:00",
    enabled: true
  },
  {
    id: "5",
    title: "New Signing Presentation - Marcus Silva",
    description: "Official presentation of our new striker Marcus Silva, who arrives with great expectations for the season. The event will take place at the main stadium.",
    date: "2025-11-20T11:00:00",
    cardImageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    createdAt: "2025-11-05T08:00:00",
    updatedAt: "2025-11-05T08:00:00",
    enabled: false
  },
  {
    id: "6",
    title: "Women's Team Derby Preparation",
    description: "Special training session for the women's team as they prepare for the city derby. The session will be open to the public.",
    date: "2025-12-10T09:00:00",
    cardImageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
    createdAt: "2025-10-28T16:00:00",
    updatedAt: "2025-10-28T16:00:00",
    enabled: true
  }
]
;