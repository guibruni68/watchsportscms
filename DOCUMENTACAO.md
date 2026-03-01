# Watch Sports CMS — Documentação das Páginas

## O que é

O **Watch Sports CMS** é um sistema de gerenciamento de conteúdo voltado para organizações esportivas. Ele centraliza o controle de conteúdo de mídia (vídeos, lives, notícias), dados esportivos (times, jogadores, técnicos, competições) e materiais de marketing (banners, campanhas, anúncios), tudo em uma única plataforma com autenticação e painel administrativo.

O sistema é composto por dois projetos:
- **OTT** — aplicação voltada para o usuário final (consumidor de conteúdo)
- **Backoffice** — painel administrativo para gestão de conteúdo, esportes e marketing

---

## 2.1 Páginas

| Plataforma | Módulo | Página | Descrição | Ações Principais |
|---|---|---|---|---|
| OTT | Home | Home | Página inicial | Navegar para conteúdos, eventos e notícias |
| OTT | Conteúdo | Contents | Página para exibir Contents e Collections | Navegar, filtrar e buscar conteúdos |
| OTT | Conteúdo | Content Details | Página de detalhes dos conteúdos VOD / LIVE. Contém também o redirecionamento para o Player | Assistir, adicionar à lista, compartilhar |
| OTT | Conteúdo | Search | Página de busca | Buscar conteúdos, times, jogadores e notícias |
| OTT | Esportes | Sports Events | Página com carrosséis de conteúdos de partidas / jogos / eventos esportivos | Navegar por eventos e partidas |
| OTT | Esportes | Sports Event Details | Página de detalhes de uma partida / evento esportivo. Contém também o Player e as Estatísticas | Assistir, ver estatísticas, acessar times |
| OTT | Esportes | Sports Competition Details | Página de detalhes de uma competição | Ver classificação, jogos e times da competição |
| OTT | Esportes | Team Details | Página de detalhes de um time | Ver elenco, jogos e informações do time |
| OTT | Esportes | Sports Agents Details | Página de detalhes de algum agente esportivo | Ver atletas representados e informações do agente |
| OTT | Notícias | News | Página de notícias | Navegar e filtrar notícias |
| OTT | Notícias | News Details | Página de detalhes de notícias | Ler notícia, compartilhar |
| OTT | Conta | Login | Página para realizar autenticação | Entrar com e-mail e senha |
| OTT | Conta | Register | Página para registro de usuário | Criar conta |
| OTT | Conta | My List | Página pessoal do perfil | Ver conteúdos salvos |
| OTT | Conta | Account | Página para gestão da conta do usuário | Editar perfil, alterar senha, gerenciar assinatura |
| Backoffice | Home | Dashboard | Painel inicial com métricas rápidas e atalhos para criação de conteúdo | Visualizar métricas, acessar conteúdos recentes, criar conteúdo |
| Backoffice | Esportes | Times | Lista e gerencia os times esportivos cadastrados na plataforma | Listar, criar, editar, desativar times |
| Backoffice | Esportes | Jogadores | Gerencia o elenco de jogadores com perfis, posição e nacionalidade | Listar, criar, editar, desativar jogadores |
| Backoffice | Esportes | Técnicos | Gerencia a comissão técnica dos times com perfis e status | Listar, criar, editar, desativar técnicos |
| Backoffice | Esportes | Árbitros | Lista e gerencia árbitros cadastrados na plataforma | Listar, criar, editar árbitros |
| Backoffice | Esportes | Agentes | Gerencia agentes esportivos e seus atletas representados | Listar, criar, editar, visualizar agentes |
| Backoffice | Esportes | Competições | Gerencia ligas, copas e torneios com seus times participantes | Listar, criar, editar competições e temporadas |
| Backoffice | Esportes | Temporadas | Gerencia temporadas de competições e escalações de elenco por temporada | Listar, criar temporadas, gerenciar escalações |
| Backoffice | Esportes | Estádios | Cadastra e gerencia os estádios e arenas utilizados nas competições | Listar, criar, editar estádios |
| Backoffice | Conteúdo | Vídeos (VOD) | Gerencia o acervo de vídeos sob demanda com filtros por gênero e status | Listar, publicar, editar, excluir vídeos |
| Backoffice | Conteúdo | Lives | Gerencia transmissões ao vivo com programação, status e contagem de espectadores | Listar, criar, editar, encerrar lives |
| Backoffice | Conteúdo | Coleções | Organiza conteúdos em coleções temáticas para exibição agrupada | Listar, criar, editar, excluir coleções |
| Backoffice | Conteúdo | Notícias | Gerencia artigos e notícias com texto, imagem de destaque e status de publicação | Listar, criar, editar, publicar notícias |
| Backoffice | Conteúdo | Agenda | Exibe e gerencia a agenda de eventos e jogos futuros | Listar, criar, visualizar eventos |
| Backoffice | Páginas & Prateleiras | Banners | Gerencia banners promocionais (hero e padrão) exibidos na plataforma | Listar, criar, editar, excluir banners |
| Backoffice | Páginas & Prateleiras | Prateleiras | Gerencia prateleiras (carrosséis) de conteúdo exibidas na home do app | Listar, criar, editar, excluir prateleiras |
| Backoffice | Páginas & Prateleiras | Páginas | Gerencia páginas estáticas de conteúdo institucional ou editorial | Listar, editar páginas |
| Backoffice | Analytics | Analytics | Painel de métricas com visualizações, horas assistidas, retenção e dados demográficos | Visualizar métricas, filtrar por período |
| Backoffice | Publicidade | Anúncios | Gerencia anúncios publicitários e seus posicionamentos na plataforma | Listar, criar, editar anúncios |
| Backoffice | Publicidade | Campanhas | Gerencia campanhas de marketing vinculadas a conteúdos e períodos específicos | Listar, criar, editar campanhas |

---

## Versão CSV

```
Plataforma,Módulo,Página,Descrição,Ações Principais
OTT,Home,Home,Página inicial,Navegar para conteúdos | eventos e notícias
OTT,Conteúdo,Contents,Página para exibir Contents e Collections,Navegar | filtrar e buscar conteúdos
OTT,Conteúdo,Content Details,Página de detalhes dos conteúdos VOD / LIVE. Contém também o redirecionamento para o Player,Assistir | adicionar à lista | compartilhar
OTT,Conteúdo,Search,Página de busca,Buscar conteúdos | times | jogadores e notícias
OTT,Esportes,Sports Events,Página com carrosséis de conteúdos de partidas / jogos / eventos esportivos,Navegar por eventos e partidas
OTT,Esportes,Sports Event Details,Página de detalhes de uma partida / evento esportivo. Contém também o Player e as Estatísticas,Assistir | ver estatísticas | acessar times
OTT,Esportes,Sports Competition Details,Página de detalhes de uma competição,Ver classificação | jogos e times da competição
OTT,Esportes,Team Details,Página de detalhes de um time,Ver elenco | jogos e informações do time
OTT,Esportes,Sports Agents Details,Página de detalhes de algum agente esportivo,Ver atletas representados e informações do agente
OTT,Notícias,News,Página de notícias,Navegar e filtrar notícias
OTT,Notícias,News Details,Página de detalhes de notícias,Ler notícia | compartilhar
OTT,Conta,Login,Página para realizar autenticação,Entrar com e-mail e senha
OTT,Conta,Register,Página para registro de usuário,Criar conta
OTT,Conta,My List,Página pessoal do perfil,Ver conteúdos salvos
OTT,Conta,Account,Página para gestão da conta do usuário,Editar perfil | alterar senha | gerenciar assinatura
Backoffice,Home,Dashboard,Painel inicial com métricas rápidas e atalhos para criação de conteúdo,Visualizar métricas | acessar conteúdos recentes | criar conteúdo
Backoffice,Esportes,Times,Lista e gerencia os times esportivos cadastrados na plataforma,Listar | criar | editar | desativar times
Backoffice,Esportes,Jogadores,Gerencia o elenco de jogadores com perfis posição e nacionalidade,Listar | criar | editar | desativar jogadores
Backoffice,Esportes,Técnicos,Gerencia a comissão técnica dos times com perfis e status,Listar | criar | editar | desativar técnicos
Backoffice,Esportes,Árbitros,Lista e gerencia árbitros cadastrados na plataforma,Listar | criar | editar árbitros
Backoffice,Esportes,Agentes,Gerencia agentes esportivos e seus atletas representados,Listar | criar | editar | visualizar agentes
Backoffice,Esportes,Competições,Gerencia ligas copas e torneios com seus times participantes,Listar | criar | editar competições e temporadas
Backoffice,Esportes,Temporadas,Gerencia temporadas de competições e escalações de elenco por temporada,Listar | criar temporadas | gerenciar escalações
Backoffice,Esportes,Estádios,Cadastra e gerencia os estádios e arenas utilizados nas competições,Listar | criar | editar estádios
Backoffice,Conteúdo,Vídeos (VOD),Gerencia o acervo de vídeos sob demanda com filtros por gênero e status,Listar | publicar | editar | excluir vídeos
Backoffice,Conteúdo,Lives,Gerencia transmissões ao vivo com programação status e contagem de espectadores,Listar | criar | editar | encerrar lives
Backoffice,Conteúdo,Coleções,Organiza conteúdos em coleções temáticas para exibição agrupada,Listar | criar | editar | excluir coleções
Backoffice,Conteúdo,Notícias,Gerencia artigos e notícias com texto imagem de destaque e status de publicação,Listar | criar | editar | publicar notícias
Backoffice,Conteúdo,Agenda,Exibe e gerencia a agenda de eventos e jogos futuros,Listar | criar | visualizar eventos
Backoffice,Páginas & Prateleiras,Banners,Gerencia banners promocionais (hero e padrão) exibidos na plataforma,Listar | criar | editar | excluir banners
Backoffice,Páginas & Prateleiras,Prateleiras,Gerencia prateleiras (carrosséis) de conteúdo exibidas na home do app,Listar | criar | editar | excluir prateleiras
Backoffice,Páginas & Prateleiras,Páginas,Gerencia páginas estáticas de conteúdo institucional ou editorial,Listar | editar páginas
Backoffice,Analytics,Analytics,Painel de métricas com visualizações horas assistidas retenção e dados demográficos,Visualizar métricas | filtrar por período
Backoffice,Publicidade,Anúncios,Gerencia anúncios publicitários e seus posicionamentos na plataforma,Listar | criar | editar anúncios
Backoffice,Publicidade,Campanhas,Gerencia campanhas de marketing vinculadas a conteúdos e períodos específicos,Listar | criar | editar campanhas
```
