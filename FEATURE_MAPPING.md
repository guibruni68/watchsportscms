# Mapeamento de Funcionalidades - CMS WatchSports

## 📋 Visão Geral

Este documento mapeia todas as principais funcionalidades do CMS WatchSports, um sistema de gerenciamento de conteúdo para plataformas de streaming esportivo. O mapeamento está organizado por categorias e inclui informações sobre prioridade, status de implementação e dependências.

---

## 🔐 1. Autenticação e Autorização

### 1.1 Autenticação de Usuário
- **Rota**: `/auth`
- **Componente**: `AuthPage.tsx`
- **Funcionalidades**:
  - Login com email/senha via Supabase Auth
  - Recuperação de senha (`/forgot-password`)
  - Controle de sessão
  - Modo visitante (Guest Mode)
- **Status**: ✅ Implementado
- **Prioridade**: 🔴 Crítica
- **Dependências**: Supabase Auth

### 1.2 Proteção de Rotas
- **Componente**: `ProtectedRoute.tsx`
- **Funcionalidades**:
  - Proteção de rotas privadas
  - Redirecionamento automático para login
- **Status**: ✅ Implementado
- **Prioridade**: 🔴 Crítica

---

## 📊 2. Dashboard e Home

### 2.1 Dashboard Principal
- **Rota**: `/`
- **Componente**: `pages/dashboard/Index.tsx`
- **Funcionalidades**:
  - Visão geral com estatísticas (VOD, Lives, Visualizações, Engajamento)
  - Ações rápidas (Upload Vídeo, Nova Live, Criar Notícia, Gerir Times)
  - Lista de vídeos recentes
  - Próximos eventos agendados
- **Status**: ✅ Implementado (dados mockados)
- **Prioridade**: 🔴 Crítica
- **Melhorias Necessárias**:
  - Integração com dados reais do Supabase
  - Atualização em tempo real
  - Filtros e período customizável

---

## 🎥 3. Gestão de Conteúdo

### 3.1 Vídeos VOD (Video On Demand)
- **Rota**: `/videos`
- **Componente**: `pages/videos/VideosPage.tsx`
- **Formulário**: `components/forms/VideoForm.tsx`
- **Funcionalidades**:
  - Listagem de vídeos VOD
  - Upload/edição de vídeos
  - Gerenciamento de metadados (título, descrição, duração, thumbnail)
  - Status de publicação
  - Categorização e tags
- **Status**: ⚠️ Parcial (estrutura criada, necessita integração)
- **Prioridade**: 🔴 Crítica
- **Notas**: Feature core do sistema

### 3.2 Lives (Transmissões Ao Vivo)
- **Rota**: `/lives`
- **Componente**: `pages/lives/LivesPage.tsx`
- **Formulário**: `components/forms/LiveForm.tsx`
- **Funcionalidades**:
  - Criação e edição de eventos ao vivo
  - Agendamento de transmissões (data, hora)
  - Embed de player de vídeo
  - Status (Em Breve, Ao Vivo, Encerrado)
  - Gêneros/Categorias
  - Relacionamento com jogadores e times
  - Upload de imagem de capa
- **Status**: ✅ Implementado (formulário completo)
- **Prioridade**: 🔴 Crítica
- **Dependências**: Integração com player de streaming

### 3.3 Catálogos
- **Rota**: `/catalogues`
- **Componentes**: 
  - `pages/catalogues/CataloguesPage.tsx`
  - `pages/catalogues/NewCataloguePage.tsx`
  - `pages/catalogues/EditCataloguePage.tsx`
  - `pages/catalogues/CatalogueDetailsPage.tsx`
- **Formulário**: `components/forms/CatalogueForm.tsx`
- **Funcionalidades**:
  - CRUD completo de catálogos
  - Tipos: série, coleção, playlist, outro
  - Ordem de exibição
  - Status ativo/inativo
  - Contagem de conteúdos relacionados
- **Status**: ✅ Implementado
- **Prioridade**: 🟡 Média-Alta
- **Tabela DB**: `catalogues`

### 3.4 Notícias
- **Rota**: `/news`
- **Componente**: `pages/news/NewsPage.tsx`
- **Formulário**: `components/forms/NewsForm.tsx`
- **Funcionalidades**:
  - Criação e edição de notícias
  - Gerenciamento de conteúdo editorial
  - Categorização
- **Status**: ⚠️ Parcial
- **Prioridade**: 🟡 Média
- **Notas**: Estrutura básica criada

---

## 🎨 4. Elementos Visuais e Layout

### 4.1 Banners
- **Rota**: `/banners`
- **Componentes**:
  - `pages/banners/BannersPage.tsx`
  - `pages/banners/NewBannerPage.tsx`
  - `pages/banners/EditBannerPage.tsx`
  - `pages/banners/BannerDetailsPage.tsx`
- **Formulário**: `components/forms/BannerForm.tsx`
- **Funcionalidades**:
  - CRUD completo de banners
  - Período de exibição (data início/fim)
  - Ordem de exibição
  - Tipos de conteúdo
  - Status ativo/inativo
  - Associação a catálogos
- **Status**: ✅ Implementado
- **Prioridade**: 🟡 Média-Alta
- **Tabela DB**: `banners`

### 4.2 Carrosséis
- **Rota**: `/carousels`
- **Componentes**:
  - `pages/carousels/CarouselsPage.tsx`
  - `pages/carousels/NewCarouselPage.tsx`
  - `pages/carousels/EditCarouselPage.tsx`
- **Formulário**: `components/forms/CarouselForm.tsx`
- **Funcionalidades**:
  - Criação e edição de carrosséis
  - Configuração de exibição
  - Ordem e organização de elementos
  - Configuração de domínio (dev/prod)
- **Status**: ✅ Implementado
- **Prioridade**: 🟡 Média-Alta
- **Notas**: Possui função Supabase Edge para geração de config

### 4.3 Personalização Visual
- **Rota**: `/customization`
- **Componente**: `pages/customization/CustomizationPage.tsx`
- **Hook**: `hooks/useCustomization.ts`
- **Funcionalidades**:
  - Customização de cores (primária e secundária)
  - Upload de logo do clube
  - Configuração de nome e descrição do clube
  - Pré-visualização desktop e mobile
  - Paletas de cores pré-definidas
  - Aplicação de temas em tempo real
- **Status**: ✅ Implementado (armazenamento em localStorage)
- **Prioridade**: 🟢 Baixa-Média
- **Melhorias Sugeridas**:
  - Persistência no banco de dados
  - Múltiplos temas
  - Exportação/importação de configurações

---

## 👥 5. Gestão de Times e Jogadores

### 5.1 Times
- **Rota**: `/teams`
- **Componentes**:
  - `pages/teams/TeamsPage.tsx`
  - `pages/teams/TeamDetailsPage.tsx`
- **Formulário**: `components/forms/TeamForm.tsx`
- **Funcionalidades**:
  - CRUD de times
  - Informações do time (nome, categoria, técnico, fundação)
  - Estatísticas (pontos, partidas, vitórias, empates, derrotas)
  - Upload de logo
  - Associação com ligas (leagues)
  - Listagem de jogadores do time
- **Status**: ✅ Implementado
- **Prioridade**: 🔴 Crítica
- **Tabela DB**: `teams`, `leagues`

### 5.2 Jogadores
- **Formulário**: `components/forms/PlayerForm.tsx`
- **Funcionalidades**:
  - CRUD de jogadores
  - Dados pessoais (nome, posição, número, idade, nacionalidade)
  - Estatísticas (gols, assistências, partidas)
  - Status (ativo, lesionado, suspenso, inativo)
  - Valor de mercado
  - Upload de avatar
  - Vinculação a times
- **Status**: ⚠️ Parcial (formulário existe, necessidade de integração)
- **Prioridade**: 🔴 Crítica
- **Tabela DB**: `players`

### 5.3 Campeonatos
- **Rota**: `/championships/:id`
- **Componente**: `pages/championships/ChampionshipDetailsPage.tsx`
- **Funcionalidades**:
  - Detalhes de campeonatos
  - Estatísticas e informações
  - Associação com ligas
- **Status**: ⚠️ Parcial
- **Prioridade**: 🟡 Média
- **Tabela DB**: `championships`

---

## 📅 6. Agenda e Eventos

### 6.1 Agenda
- **Rota**: `/schedule`
- **Componente**: `pages/schedule/SchedulePage.tsx`
- **Funcionalidades**:
  - Visualização de eventos agendados
  - Calendário de transmissões
  - Gerenciamento de eventos
- **Status**: ⚠️ Parcial
- **Prioridade**: 🟡 Média
- **Notas**: Integrado com sistema de Lives

### 6.2 Eventos
- **Formulário**: `components/forms/EventForm.tsx`
- **Funcionalidades**:
  - Criação de eventos
  - Agendamento
  - Tipo de evento
- **Status**: ⚠️ Parcial
- **Prioridade**: 🟡 Média

---

## 📈 7. Analytics e Métricas

### 7.1 Analytics
- **Rota**: `/analytics`
- **Componente**: `pages/analytics/AnalyticsPage.tsx`
- **Funcionalidades**:
  - Visão geral de métricas:
    - Total de visualizações
    - Horas assistidas
    - Completion rate
    - Usuários únicos
  - Top conteúdo (por visualizações)
  - Métricas de engajamento (curtidas, comentários, compartilhamentos)
  - Demografia (faixa etária, dispositivos, localização)
  - Filtros por período e tipo de conteúdo
  - Exportação de dados
- **Status**: ⚠️ Parcial (dados mockados, UI completa)
- **Prioridade**: 🟡 Média-Alta
- **Melhorias Necessárias**:
  - Integração com dados reais
  - Gráficos interativos
  - Relatórios personalizados
  - Dashboard customizável

---

## 💰 8. Publicidade e Campanhas

### 8.1 Anúncios
- **Rota**: `/ads`
- **Componente**: `pages/ads/AdsPage.tsx`
- **Funcionalidades**:
  - Gerenciamento de anúncios
- **Status**: ⚠️ Parcial (estrutura básica)
- **Prioridade**: 🟢 Baixa
- **Notas**: Feature em desenvolvimento inicial

### 8.2 Campanhas
- **Rota**: `/campaigns` (não implementada na sidebar, mas existe componente)
- **Componente**: `pages/campaigns/CampaignsPage.tsx`
- **Formulário**: `components/forms/CampaignForm.tsx`
- **Funcionalidades**:
  - Criação e gestão de campanhas
- **Status**: ⚠️ Parcial
- **Prioridade**: 🟢 Baixa

---

## 🔧 9. Infraestrutura e Ferramentas

### 9.1 Integração Supabase
- **Arquivos**:
  - `integrations/supabase/client.ts`
  - `integrations/supabase/types.ts`
- **Funcionalidades**:
  - Cliente Supabase configurado
  - Tipos TypeScript gerados
  - Autenticação
  - Banco de dados PostgreSQL
- **Status**: ✅ Implementado
- **Prioridade**: 🔴 Crítica

### 9.2 Hooks Customizados
- **Arquivos**:
  - `hooks/useAuth.ts` - Autenticação
  - `hooks/useCustomization.ts` - Personalização
  - `hooks/useGuestMode.ts` - Modo visitante
  - `hooks/use-mobile.tsx` - Detecção mobile
  - `hooks/use-toast.ts` - Notificações
- **Status**: ✅ Implementado
- **Prioridade**: 🟡 Média

### 9.3 Componentes UI (shadcn/ui)
- **Localização**: `components/ui/`
- **Funcionalidades**:
  - Biblioteca completa de componentes (86 arquivos)
  - Design system consistente
  - Acessibilidade
  - Responsividade
- **Status**: ✅ Implementado
- **Prioridade**: 🟡 Média

### 9.4 Edge Functions (Supabase)
- **Arquivo**: `supabase/functions/generate-carousel-config/index.ts`
- **Funcionalidades**:
  - Geração de configuração de carrosséis
- **Status**: ✅ Implementado
- **Prioridade**: 🟢 Baixa

---

## 🗄️ 10. Estrutura de Banco de Dados

### Tabelas Principais:
1. **teams** - Times
2. **players** - Jogadores
3. **leagues** - Ligas
4. **championships** - Campeonatos
5. **banners** - Banners publicitários
6. **catalogues** - Catálogos de conteúdo
7. **profiles** - Perfis de usuário

### Migrações:
- Sistema de migrações configurado
- RLS (Row Level Security) implementado
- Políticas de segurança configuradas

---

## 📊 Matriz de Priorização

### 🔴 Críticas (Must Have)
1. Autenticação e Autorização
2. Vídeos VOD
3. Lives (Transmissões)
4. Gestão de Times e Jogadores
5. Dashboard Principal

### 🟡 Médias-Alta (Should Have)
1. Catálogos
2. Banners
3. Carrosséis
4. Analytics (com dados reais)
5. Notícias

### 🟡 Médias (Could Have)
1. Agenda/Eventos
2. Campeonatos (completo)
3. Personalização Visual (melhorias)

### 🟢 Baixas (Nice to Have)
1. Campanhas
2. Anúncios
3. Edge Functions avançadas

---

## 🚧 Funcionalidades Pendentes / Melhorias

### Alta Prioridade
- [ ] Integração completa de dados reais (substituir mocks)
- [ ] Upload de vídeos real (integração com storage)
- [ ] Sistema de permissões e roles de usuário
- [ ] Integração com player de streaming
- [ ] Analytics com dados reais do banco

### Média Prioridade
- [ ] Sistema de busca e filtros avançados
- [ ] Notificações em tempo real
- [ ] Editor WYSIWYG para notícias
- [ ] Sistema de tags e categorias unificado
- [ ] Exportação de dados e relatórios

### Baixa Prioridade
- [ ] API pública para consumo de dados
- [ ] Sistema de comentários
- [ ] Integração com redes sociais
- [ ] Sistema de playlists inteligentes
- [ ] Testes automatizados (E2E, unitários)

---

## 📝 Notas Técnicas

### Stack Tecnológico
- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query (React Query)

### Padrões de Código
- Componentes funcionais com hooks
- TypeScript strict mode
- Validação de formulários com Zod
- Estrutura de pastas organizada por feature
- Separação de concerns (pages, components, hooks, forms)

---

## 📅 Roadmap Sugerido

### Fase 1 - Core Features (1-2 meses)
- Completar integração de VOD
- Finalizar sistema de Lives
- Implementar analytics real
- Melhorar gestão de jogadores

### Fase 2 - Content Management (1 mês)
- Sistema de notícias completo
- Editor de conteúdo rico
- Gestão de tags e categorias
- Sistema de busca

### Fase 3 - UX e Performance (1 mês)
- Otimização de performance
- Melhorias de UX
- Sistema de notificações
- Dashboard customizável

### Fase 4 - Features Avançadas (Ongoing)
- Sistema de campanhas
- Integrações externas
- API pública
- Analytics avançados

---

**Última atualização**: Janeiro 2025
**Versão do documento**: 1.0


