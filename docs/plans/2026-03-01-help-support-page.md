# Help & Support Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Help & Support page at `/help` with a left sidebar of categories, topic cards, accordion Q&A, and a search bar — plus a dedicated button in the main app sidebar.

**Architecture:** Single route `/help` using `?category=<id>` URL query params for navigation. Content is fully hardcoded in `src/data/helpData.ts`. The page has a two-column layout: a thin category sidebar on the left and the main content area on the right. No backend, no API calls.

**Tech Stack:** React 18, TypeScript, React Router v6 (`useSearchParams`), Tailwind CSS, shadcn/ui (`Accordion`, `Card`), lucide-react icons.

---

### Task 1: Create the help data file

**Files:**
- Create: `src/data/helpData.ts`

**Step 1: Create the file with types and full content**

```ts
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
```

**Step 2: Verify the file compiles (no test needed — TypeScript will catch errors on build)**

No test file needed for static data. Move to next task.

**Step 3: Commit**

```bash
git add src/data/helpData.ts
git commit -m "feat: add help page data (categories, topics, FAQs)"
```

---

### Task 2: Create the HelpPage component

**Files:**
- Create: `src/pages/help/HelpPage.tsx`

**Step 1: Create the file**

```tsx
import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { helpCategories, featuredTopics, HelpTopic } from "@/data/helpData"

export default function HelpPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState("")
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  const activeCategoryId = searchParams.get("category")
  const activeCategory = helpCategories.find(c => c.id === activeCategoryId)

  const filteredCategories = useMemo(() => {
    if (!search) return helpCategories
    const q = search.toLowerCase()
    return helpCategories.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.topics.some(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      )
    )
  }, [search])

  const visibleTopics: HelpTopic[] = useMemo(() => {
    if (!activeCategory) return []
    if (!search) return activeCategory.topics
    const q = search.toLowerCase()
    return activeCategory.topics.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
  }, [activeCategory, search])

  const handleCategoryClick = (id: string) => {
    setSearchParams(id === activeCategoryId ? {} : { category: id })
    setExpandedTopic(null)
  }

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border border-[#1f1f1f] p-10 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Como podemos ajudar?</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Busque artigos, guias e respostas para as suas dúvidas.
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artigos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-12 bg-[#0d0d0d] border-[#262626] text-white placeholder:text-muted-foreground rounded-xl"
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* Left sidebar */}
        <aside className="w-56 flex-shrink-0">
          <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
            <CardContent className="p-2">
              <nav className="space-y-0.5">
                {filteredCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                      activeCategoryId === cat.id
                        ? "bg-primary text-white font-medium"
                        : "text-muted-foreground hover:text-white hover:bg-muted/60"
                    )}
                  >
                    <cat.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{cat.label}</span>
                    {activeCategoryId === cat.id && (
                      <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {!activeCategoryId ? (
            /* Home: Popular Topics */
            <div>
              <h2 className="text-base font-semibold text-white mb-4">Tópicos Populares</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredTopics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      const cat = helpCategories.find(c => c.topics.some(t => t.id === topic.id))
                      if (cat) {
                        setSearchParams({ category: cat.id })
                        setExpandedTopic(topic.id)
                      }
                    }}
                    className="text-left"
                  >
                    <Card className="border-[#1f1f1f] bg-[#0d0d0d] hover:bg-[#141414] transition-colors rounded-xl h-full">
                      <CardContent className="p-5">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                          <topic.icon className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-white mb-1">{topic.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{topic.description}</p>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Category view: topic cards + accordion */
            <div>
              <h2 className="text-base font-semibold text-white mb-4">
                {activeCategory?.label}
              </h2>

              {visibleTopics.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">
                  Nenhum tópico encontrado para "{search}".
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleTopics.map(topic => (
                    <Card
                      key={topic.id}
                      className={cn(
                        "border-[#1f1f1f] bg-[#0d0d0d] rounded-xl overflow-hidden transition-colors",
                        expandedTopic === topic.id && "border-primary/30"
                      )}
                    >
                      {/* Topic header */}
                      <button
                        className="w-full flex items-center gap-4 p-5 hover:bg-[#141414] transition-colors text-left"
                        onClick={() =>
                          setExpandedTopic(expandedTopic === topic.id ? null : topic.id)
                        }
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <topic.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{topic.title}</p>
                          <p className="text-xs text-muted-foreground">{topic.description}</p>
                        </div>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform",
                            expandedTopic === topic.id && "rotate-90"
                          )}
                        />
                      </button>

                      {/* Accordion Q&A */}
                      {expandedTopic === topic.id && (
                        <div className="border-t border-[#1f1f1f] px-5 pb-2">
                          <Accordion type="single" collapsible className="w-full">
                            {topic.faqs.map((faq, i) => (
                              <AccordionItem
                                key={i}
                                value={`faq-${i}`}
                                className="border-[#262626]"
                              >
                                <AccordionTrigger className="text-sm text-white/80 hover:text-white py-4 text-left">
                                  {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                                  {faq.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/pages/help/HelpPage.tsx
git commit -m "feat: add HelpPage component with sidebar, topic cards and accordion Q&A"
```

---

### Task 3: Register the route in App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Add the import after the existing imports (before the `const queryClient` line)**

```tsx
import HelpPage from "./pages/help/HelpPage"
```

**Step 2: Add the route inside the `<Routes>` block, before the catch-all `*` route**

```tsx
<Route path="/help" element={
  <ProtectedRoute>
    <HelpPage />
  </ProtectedRoute>
} />
```

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: register /help route"
```

---

### Task 4: Add the Help button to app-sidebar.tsx

**Files:**
- Modify: `src/components/app-sidebar.tsx`

**Step 1: Add `LifeBuoy` to the lucide-react import**

Current import line starts with:
```tsx
import { Home, Video, Radio, Users, Calendar, ...
```

Add `LifeBuoy` to the same import list.

**Step 2: Add the Help button between the main nav group and the SidebarFooter**

Find the closing `</SidebarGroup>` that ends the main navigation and add this block immediately after it, before `{/* User Profile Footer */}`:

```tsx
{/* Help & Support Button */}
<div className="px-3 pb-3">
  <div className="border-t border-border/50 pt-3">
    <SidebarMenuButton
      asChild
      className={`h-12 px-4 w-full ${getNavClassName("/help")}`}
    >
      <NavLink to="/help">
        <LifeBuoy className="h-4 w-4 text-muted-foreground mr-3" />
        <span>Ajuda & Suporte</span>
      </NavLink>
    </SidebarMenuButton>
  </div>
</div>
```

**Step 3: Commit**

```bash
git add src/components/app-sidebar.tsx
git commit -m "feat: add Help & Support button to sidebar"
```

---

### Task 5: Smoke test in browser

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Verify checklist**

- [ ] "Ajuda & Suporte" button appears in sidebar above the user footer
- [ ] Clicking it navigates to `/help`
- [ ] 6 Popular Topics cards are visible in a 3×2 grid
- [ ] Clicking a category in the left sidebar updates the URL to `?category=<id>`
- [ ] Topic cards appear for the selected category
- [ ] Clicking a topic card expands it and shows the Q&A accordion
- [ ] Clicking an accordion item expands the answer
- [ ] Typing in the search bar filters the left sidebar categories
- [ ] Clearing search restores all categories
- [ ] Clicking a Popular Topic card on the home screen navigates to the correct category and expands that topic

**Step 3: Commit if any small fixes were needed**

```bash
git add -p
git commit -m "fix: help page smoke test adjustments"
```
