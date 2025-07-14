// Dados mocados centralizados para a plataforma

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