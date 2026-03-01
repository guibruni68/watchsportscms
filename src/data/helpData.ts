import {
  LucideIcon,
  PlayCircle, Radio, BookOpen, Settings, Trophy, KeyRound,
  Upload, Eye, CalendarDays, Globe, Users, ShieldCheck
} from "lucide-react"

export interface HelpStep {
  step: number
  title: string
  description: string
  imageUrl?: string
  tip?: string
}

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
  steps?: HelpStep[]
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
    label: "Getting Started",
    icon: BookOpen,
    topics: [
      {
        id: "gs-overview",
        title: "CMS Overview",
        description: "Understand what you can do on this platform.",
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
        title: "Navigating the system",
        description: "How to use the sidebar and find what you need.",
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
        title: "Account & Profile",
        description: "Your account settings and profile.",
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
    label: "Videos (VOD)",
    icon: PlayCircle,
    topics: [
      {
        id: "vod-upload",
        title: "Publishing a video",
        description: "Step-by-step guide to create and publish a VOD.",
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
        ],
        steps: [
          {
            step: 1,
            title: "Acesse a seção de Vídeos",
            description: "No menu lateral esquerdo, localize e clique em \"Content\" para expandir o grupo. Em seguida, clique em \"Videos (VOD)\". Você verá a listagem de todos os vídeos cadastrados na plataforma.",
            imageUrl: "/tutorial-placeholder.png",
            tip: "Se o grupo Content não estiver visível, role o menu para baixo. Todos os grupos são colapsáveis — clique no nome do grupo para expandir."
          },
          {
            step: 2,
            title: "Clique em \"Novo Vídeo\"",
            description: "No canto superior direito da página de vídeos, clique no botão \"Novo Vídeo\" (ou \"+ New Video\"). Isso abrirá o formulário de criação dividido em abas.",
            imageUrl: "/tutorial-placeholder.png"
          },
          {
            step: 3,
            title: "Preencha as informações básicas — aba Information",
            description: "Na aba \"Information\" (ativa por padrão), preencha os campos obrigatórios: Título (o nome que aparecerá no app), Descrição (um resumo do conteúdo do vídeo), Ano de lançamento e Classificação etária. Esses campos são exibidos diretamente para o usuário final.",
            imageUrl: "/tutorial-placeholder.png",
            tip: "Escreva o título de forma clara e direta. Evite usar maiúsculas em excesso ou caracteres especiais que possam causar problemas de exibição."
          },
          {
            step: 4,
            title: "Configure o stream — aba Details",
            description: "Clique na aba \"Details\". No campo \"Stream URL\", cole a URL completa do arquivo de vídeo (formato HLS .m3u8 ou link direto de CDN). Sem este campo preenchido, o vídeo não poderá ser reproduzido pelos usuários. Você também pode definir um badge (ex: NEW, SOON) nesta aba.",
            imageUrl: "/tutorial-placeholder.png",
            tip: "Certifique-se de que a URL do stream seja acessível publicamente ou esteja na CDN configurada pela equipe técnica. URLs inválidas não causam erro ao salvar, mas o vídeo não reproduzirá no app."
          },
          {
            step: 5,
            title: "Faça upload das imagens — aba Media",
            description: "Clique na aba \"Media\". Você verá dois slots de imagem: Card Image (imagem exibida nas prateleiras e listagens, proporção 2:3) e Banner Image (imagem de destaque na página do vídeo, proporção 16:9). Clique em cada slot e selecione o arquivo de imagem do seu computador.",
            imageUrl: "/tutorial-placeholder.png",
            tip: "Use imagens de alta resolução: mínimo 600×900px para o Card e 1920×1080px para o Banner. Formatos aceitos: JPG e PNG."
          },
          {
            step: 6,
            title: "Associe gêneros e agentes",
            description: "Na aba \"Genres\", selecione um ou mais gêneros que categorizam o conteúdo (ex: Melhores Momentos, Entrevistas, Jogos Completos). Na aba \"Agents\", você pode associar os distribuidores ou parceiros responsáveis por este vídeo. Ambas as abas são opcionais, mas ajudam na organização e busca.",
            imageUrl: "/tutorial-placeholder.png"
          },
          {
            step: 7,
            title: "Defina o status de publicação",
            description: "Localize o toggle \"Published\" e o campo \"Schedule Date\". Para disponibilizar o vídeo imediatamente, ative o toggle Published e deixe a Schedule Date em branco. Para agendar, defina a Schedule Date com uma data futura e ative o Published — o vídeo entrará automaticamente no ar na data e hora definidas.",
            imageUrl: "/tutorial-placeholder.png",
            tip: "Um vídeo com Published ativado e Schedule Date no futuro ficará no estado \"Scheduled\" — visível na listagem do CMS, mas ainda não exibido para os usuários finais."
          },
          {
            step: 8,
            title: "Verifique se o vídeo está habilitado",
            description: "Certifique-se de que o toggle \"Enabled\" está ativo. Um vídeo desabilitado não aparece para os usuários independentemente do status de publicação. Use este campo para pausar temporariamente um vídeo sem precisar despublicá-lo.",
            imageUrl: "/tutorial-placeholder.png"
          },
          {
            step: 9,
            title: "Salve o vídeo",
            description: "Clique no botão \"Salvar\" no rodapé do formulário. Uma notificação de confirmação aparecerá indicando que o vídeo foi salvo com sucesso. Você será redirecionado para a listagem de vídeos, onde o novo vídeo aparecerá com seu status atualizado.",
            imageUrl: "/tutorial-placeholder.png",
            tip: "Após salvar, clique no vídeo na listagem para abrir sua página de detalhes e verificar todas as informações, editar ou acompanhar visualizações."
          }
        ]
      },
      {
        id: "vod-genres",
        title: "Genres and tags",
        description: "How to categorize your video content.",
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
        title: "Status and visibility",
        description: "Understand the different states of a video.",
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
        title: "Creating a live stream",
        description: "Set up and publish live streams.",
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
        title: "Stream configuration",
        description: "Stream URLs, agents and technical settings.",
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
    label: "Content & Publishing",
    icon: Globe,
    topics: [
      {
        id: "content-shelves",
        title: "Shelves and Pages",
        description: "Organize how content appears in the app.",
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
        description: "Manage promotional banners and highlights.",
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
    label: "Competitions & Teams",
    icon: Trophy,
    topics: [
      {
        id: "sports-competition",
        title: "Creating a competition",
        description: "Set up championships and tournaments.",
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
        title: "Teams and players",
        description: "Manage rosters and team information.",
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
    label: "Account & Access",
    icon: ShieldCheck,
    topics: [
      {
        id: "account-access",
        title: "Permissions and access",
        description: "Understand access levels and security.",
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
        title: "Account security",
        description: "Best practices to protect your account.",
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
