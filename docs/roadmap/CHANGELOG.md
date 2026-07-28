# CHANGELOG.md

# Concurso AI Platform
## Changelog

Este documento registra todas as alterações relevantes do projeto.

O formato segue o padrão:

Versão

↓

Data

↓

Tipo

↓

Descrição

---

# Versionamento

MAJOR.MINOR.PATCH

Exemplos

1.0.0

1.1.0

1.1.1

---

# Tipos

Added

Changed

Fixed

Removed

Deprecated

Security

Documentation

---

# [1.4.0] - 2026-07-28

## Added

- Layout Shell: `AppLayout` com Header, Sidebar, MainContent e Footer.
- Sidebar recolhível com estado persistido em localStorage (`SidebarProvider` + `useSidebar`).
- Sidebar responsiva: fixa em desktop (256px/64px), drawer overlay em mobile/tablet.
- Navegação completa na sidebar: Dashboard, Cronograma, Disciplinas, Questões, Flashcards, Revisões, Simulados, Podcasts, Progresso, Configurações.
- Header com logo, título e botão de tema; botão hamburger para mobile.
- Skip link de acessibilidade ("Pular para o conteúdo principal").
- Landmarks semânticos: `<header>`, `<nav>`, `<main>`, `<footer>`.
- Testes unitários do `useSidebar`: 4 testes passando (toggle, persistência, restauração, mobile drawer).
- Tipos de layout em `src/types/layout.ts`.
- Componentes de layout reutilizáveis: `Header`, `Sidebar`, `Footer`, `MainContent`, `PageContainer`.

## Changed

- `App.tsx` envolvido por `AppLayout`; conteúdo renderizado dentro da área principal.
- `main.tsx` atualizado para incluir `SidebarProvider`.

---

# [1.3.0] - 2026-07-28

## Added

- Design System implementado: tokens visuais tipados em `src/styles/tokens.ts` (cores, tipografia, espaçamento, bordas, sombras, transições, z-index).
- Paleta semântica de estudo: concluído (verde), em andamento (azul), atenção (amarelo), urgente (vermelho).
- Fontes Inter e JetBrains Mono carregadas via Google Fonts CDN.
- Tema dark mode funcional com `ThemeProvider` e hook `useTheme`, persistência em localStorage.
- Componentes foundation: `Button`, `Badge`, `Card` (com subcomponentes Header/Title/Description/Content/Footer) via class-variance-authority.
- Estados implementados: default, hover, focus, active, disabled, loading, success, warning, danger, info.
- Testes unitários do hook `useTheme`: 6 testes passando (alternância, persistência, restauração, exceção fora do provider).
- Scripts `pnpm test` e `pnpm test:watch` configurados com Vitest + jsdom.
- App.tsx demonstra o Design System com todos os componentes foundation nos dois temas.

## Removed

- Placeholders `index.ts` vazios removidos de diretórios sem conteúdo.

---

# [1.2.0] - 2026-07-28

## Added

- Bootstrap do projeto: Vite + React 19 + TypeScript 6 strict mode configurado.
- Tailwind CSS v4 com dark mode por classe (`dark` no `<html>`).
- shadcn/ui inicializado (`components.json`) com Lucide React.
- ESLint + Prettier configurados: regra `no-explicit-any` ativa, strict TypeScript.
- Estrutura de diretórios oficial (`src/`, `content/`, `scripts/`, `config/`).
- Path alias `@/` configurado no Vite e TypeScript.
- App mínimo renderizando com alternância de tema claro/escuro.

## Changed

- Milestone 2 (MVP navegável): status atualizado para "Em andamento".

---

# [1.1.0] - 2026-07-28

## Added

- FGV_EDITAL_ANALISE.md v2.0: análise técnica completa do edital DATAPREV 2026 (Perfil 10), consolidada a partir do documento oficial.
- ROADMAP_DISCIPLINAS.md v2.0: ordem oficial das disciplinas, cronograma semanal de 11 semanas, revisões espaçadas adaptadas, simulados e marcos de aprendizagem.
- BIBLIOGRAFIA.md v2.0: referências oficiais por disciplina do Perfil 10.
- LINKS_IMPORTANTES.md v2.0: links oficiais preenchidos.
- DECISIONS.md: ADR-006 a ADR-010.

## Changed

- Hierarquia de conteúdo reconciliada: CONTENT_STRUCTURE.md passa a seguir DATA_MODEL.md (ADR-007).
- Estratégia de branches unificada entre TECH_STACK.md e DEPLOYMENT.md (ADR-009).
- Estrutura de pastas de disciplina unificada (SYSTEM_ARCHITECTURE.md §11 × TECH_STACK.md §34).
- Cadeia de resolução de conflitos de CODING_STANDARDS.md alinhada à hierarquia de AI_ENGINE.md (ADR-006).
- README.md: árvore da pasta references/ corrigida.

## Removed

- Referências obsoletas: CLAUDE.md (inexistente) e Next.js (tecnologia proibida) removidas da documentação (ADR-010).
- Menções a ferramenta específica de IA substituídas por "agentes de IA" (neutralidade de ferramenta).

## Documentation

- Sprint de Consolidação concluída: documentação consistente para início do MVP.

---

# [1.0.0] - 2026-07-25

## Added

- Estrutura inicial do projeto.
- Documentação de arquitetura.
- Modelo de dados.
- Stack tecnológica.
- Padrões de desenvolvimento.
- Sistema de prompts.
- Estratégia FGV.
- Guias NotebookLM e Podcast.
- Design System.
- Biblioteca de Componentes.

## Documentation

- Documentação inicial consolidada.

---

# Modelo para Novas Entradas

## [X.Y.Z] - YYYY-MM-DD

### Added

-

### Changed

-

### Fixed

-

### Removed

-

### Deprecated

-

### Security

-

### Documentation

-

---

# Regras

Registrar apenas alterações relevantes.

Agrupar alterações por versão.

Não remover entradas antigas.

Utilizar linguagem objetiva.

---

# Objetivo Final

Manter um histórico confiável da evolução da plataforma, facilitando auditoria, manutenção e rastreabilidade.
