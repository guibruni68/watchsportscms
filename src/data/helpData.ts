import {
  LucideIcon,
  PlayCircle, Radio, BookOpen, Settings, Trophy, KeyRound,
  Upload, Eye, CalendarDays, Globe, Users, ShieldCheck
} from "lucide-react"

export interface HelpFaq {
  question: string
  answer: string
}

export interface HelpTopic {
  id: string
  title: string
  description: string
  icon: LucideIcon
  faqs: HelpFaq[]
  featured?: boolean
}

export interface HelpCategory {
  id: string
  label: string
  icon: LucideIcon
  topics: HelpTopic[]
}

export const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    label: "Primeiros Passos",
    icon: BookOpen,
    topics: [
      {
        id: "gs-overview",
        title: "Visão geral do CMS",
        description: "Entenda o que é possível fazer nesta plataforma.",
        icon: Eye,
        featured: true,
        faqs: [
          {
            question: "O que é o Watch Sports CMS?",
            answer: "É a plataforma de gerenciamento de conteúdo para transmitir e organizar eventos esportivos, vídeos, times e competições para os seus usuários."
          },
          {
            question: "Quais são as principais seções do CMS?",
            answer: "O CMS está dividido em: Sports (times, jogadores, competições), Content (vídeos, lives, notícias), Pages & Shelves (banners, prateleiras, páginas) e Analytics."
          },
          {
            question: "Como acesso o CMS?",
            answer: "Acesse a URL da plataforma, insira seu e-mail e senha cadastrados. Caso não tenha acesso, fale com o administrador da conta."
          }
        ]
      },
      {
        id: "gs-navigation",
        title: "Navegando pelo sistema",
        description: "Como usar o menu lateral e encontrar o que precisa.",
        icon: Settings,
        faqs: [
          {
            question: "Como expando um grupo do menu?",
            answer: "Clique no nome do grupo (ex: Sports, Content) para expandir e ver os sub-itens. O grupo colapsa ao clicar novamente."
          },
          {
            question: "Como volto para a tela anterior?",
            answer: "Use o botão 'Voltar' no topo de cada página de detalhe ou formulário, ou use o histórico do navegador."
          }
        ]
      },
      {
        id: "gs-account",
        title: "Conta e perfil",
        description: "Configurações da sua conta de acesso.",
        icon: KeyRound,
        faqs: [
          {
            question: "Como altero minha senha?",
            answer: "Na tela de login, clique em 'Esqueci minha senha' e siga as instruções enviadas para o seu e-mail."
          },
          {
            question: "Como faço logout?",
            answer: "Clique no seu avatar no canto inferior esquerdo do menu e selecione 'Sair'."
          }
        ]
      }
    ]
  },
  {
    id: "videos",
    label: "Vídeos (VOD)",
    icon: PlayCircle,
    topics: [
      {
        id: "vod-upload",
        title: "Publicando um vídeo",
        description: "Passo a passo para criar e publicar um VOD.",
        icon: Upload,
        featured: true,
        faqs: [
          {
            question: "Como crio um novo vídeo?",
            answer: "Acesse Videos (VOD) no menu, clique em 'Novo Vídeo', preencha as informações na aba Information e a URL do stream na aba Details, faça upload das imagens na aba Media e salve."
          },
          {
            question: "O vídeo fica disponível imediatamente após salvar?",
            answer: "Só se a opção 'Published' estiver ativa e a data de agendamento for no passado. Caso contrário ele ficará como Draft ou Scheduled."
          },
          {
            question: "Posso agendar a publicação de um vídeo?",
            answer: "Sim. Defina a 'Schedule Date' para uma data futura e ative a opção 'Published'. O vídeo será exibido automaticamente a partir dessa data."
          }
        ]
      },
      {
        id: "vod-genres",
        title: "Gêneros e tags",
        description: "Como categorizar seu conteúdo de vídeo.",
        icon: Eye,
        faqs: [
          {
            question: "Para que servem os gêneros?",
            answer: "Os gêneros categorizam o vídeo (ex: Melhores Momentos, Entrevistas) e ajudam o usuário final a filtrar o conteúdo no app."
          },
          {
            question: "Para que servem as tags?",
            answer: "Tags são palavras-chave livres que facilitam a busca e a associação do vídeo com outros conteúdos relacionados."
          }
        ]
      },
      {
        id: "vod-status",
        title: "Status e visibilidade",
        description: "Entenda os diferentes estados de um vídeo.",
        icon: Settings,
        faqs: [
          {
            question: "Qual a diferença entre Draft, Scheduled e Published?",
            answer: "Draft: salvo mas não visível. Scheduled: publicação ativa mas a data ainda não chegou. Published: visível para os usuários."
          },
          {
            question: "O que significa o campo 'Enabled'?",
            answer: "Quando desabilitado, o vídeo fica completamente invisível para os usuários, independente do status de publicação."
          }
        ]
      }
    ]
  },
  {
    id: "lives",
    label: "Lives",
    icon: Radio,
    topics: [
      {
        id: "lives-create",
        title: "Criando uma live",
        description: "Configure e publique transmissões ao vivo.",
        icon: Radio,
        featured: true,
        faqs: [
          {
            question: "Como crio uma live?",
            answer: "Acesse Lives no menu, clique em 'Nova Live', preencha título, descrição, data de início e a URL do stream. Ative 'Published' quando estiver pronto para transmitir."
          },
          {
            question: "Posso agendar uma live?",
            answer: "Sim. Defina a data de início no futuro. A live aparecerá como 'Em Breve' para os usuários até o horário definido."
          }
        ]
      },
      {
        id: "lives-stream",
        title: "Configurando o stream",
        description: "URLs, agentes e configurações técnicas.",
        icon: Settings,
        faqs: [
          {
            question: "Qual formato de URL de stream é aceito?",
            answer: "Aceitamos URLs HLS (.m3u8) e RTMP. Informe a URL completa no campo Stream URL."
          },
          {
            question: "O que são 'Agentes' em uma live?",
            answer: "Agentes são os responsáveis ou distribuidores da transmissão. Podem ser adicionados na aba Agents do formulário."
          }
        ]
      }
    ]
  },
  {
    id: "content",
    label: "Conteúdo & Publicação",
    icon: Globe,
    topics: [
      {
        id: "content-shelves",
        title: "Prateleiras e Pages",
        description: "Organize como o conteúdo aparece no app.",
        icon: Globe,
        featured: true,
        faqs: [
          {
            question: "O que é uma prateleira (Shelf)?",
            answer: "Uma prateleira é uma coleção horizontal de conteúdos (vídeos, lives, etc.) que aparece em uma página do app."
          },
          {
            question: "Como adiciono uma prateleira a uma página?",
            answer: "Acesse Pages & Shelves > Pages, edite a página desejada e adicione prateleiras na ordem em que devem aparecer."
          }
        ]
      },
      {
        id: "content-banners",
        title: "Banners",
        description: "Gerencie banners promocionais e destaques.",
        icon: Eye,
        faqs: [
          {
            question: "Qual o tamanho recomendado para banners?",
            answer: "Recomendamos imagens na proporção 16:9 com resolução mínima de 1920×1080px para melhor qualidade."
          },
          {
            question: "Posso agendar um banner?",
            answer: "Sim. Defina as datas de início e fim do banner para que ele apareça automaticamente no período definido."
          }
        ]
      }
    ]
  },
  {
    id: "sports",
    label: "Competições & Times",
    icon: Trophy,
    topics: [
      {
        id: "sports-competition",
        title: "Criando uma competição",
        description: "Configure campeonatos e torneios.",
        icon: Trophy,
        featured: true,
        faqs: [
          {
            question: "Como crio uma competição?",
            answer: "Acesse Sports > Competitions, clique em 'Nova Competição', preencha as informações e salve. Em seguida, crie temporadas dentro da competição."
          },
          {
            question: "Qual a diferença entre Competição e Temporada?",
            answer: "A Competição é o torneio em si (ex: Campeonato Brasileiro). A Temporada é a edição anual (ex: 2024). Cada temporada pode ter times e jogos próprios."
          }
        ]
      },
      {
        id: "sports-teams",
        title: "Times e jogadores",
        description: "Gerencie elencos e informações dos times.",
        icon: Users,
        faqs: [
          {
            question: "Como adiciono jogadores a um time?",
            answer: "Acesse o detalhe do time (Sports > Teams > clique no time) e use a aba Members para adicionar jogadores."
          },
          {
            question: "Posso associar um treinador a um time?",
            answer: "Sim. Na página do time, na aba de detalhes, é possível associar um ou mais treinadores cadastrados."
          }
        ]
      }
    ]
  },
  {
    id: "account",
    label: "Conta & Acesso",
    icon: ShieldCheck,
    topics: [
      {
        id: "account-access",
        title: "Permissões e acesso",
        description: "Entenda níveis de acesso e segurança.",
        icon: ShieldCheck,
        featured: true,
        faqs: [
          {
            question: "Como solicito acesso para um novo usuário?",
            answer: "Entre em contato com o administrador da plataforma para criar novas contas de acesso ao CMS."
          },
          {
            question: "Minha sessão expirou, o que faço?",
            answer: "Faça login novamente na tela de autenticação. Se o problema persistir, tente limpar o cache do navegador."
          }
        ]
      },
      {
        id: "account-security",
        title: "Segurança da conta",
        description: "Boas práticas para proteger seu acesso.",
        icon: KeyRound,
        faqs: [
          {
            question: "Como recupero minha senha?",
            answer: "Na tela de login clique em 'Esqueci minha senha', informe seu e-mail e siga as instruções recebidas."
          },
          {
            question: "Devo compartilhar meu acesso com outros usuários?",
            answer: "Não. Cada usuário deve ter seu próprio acesso. Compartilhar credenciais dificulta a auditoria e cria riscos de segurança."
          }
        ]
      }
    ]
  }
]

export const featuredTopics = helpCategories
  .flatMap(c => c.topics)
  .filter(t => t.featured)
