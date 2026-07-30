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

# [1.10.1] - 2026-07-29

## Added

- Resolvedores de ID em `discipline-service.ts`: `getDisciplineIdByName()` e `getChapterIdByTitle()` com match normalizado (case/acentos) + aliases para nomes abreviados do roadmap ("Legislação de Dados" → `disc_leg_seg_dados`, "Legislação Previdenciária" → `disc_leg_prev_trab`).
- `durationMinutes` ao `CompletedTaskRecord` (schema v2.2): gravado no toggle do checklist quando `estimatedTime` disponível; registros sem duração contam 0h em `calculateDisciplineProgress()`.
- Teste de integração obrigatório: concluir atividade real do Planner de Língua Portuguesa reflete `percentCompleted > 0` e `status === 'in_progress'` em `getDisciplineWithProgress('disc_portugues')`.
- Aliases de disciplina em `DISCIPLINE_ALIASES`: mapa estático para resolver nomes abreviados usados no `roadmap-s01-s11.json` sem alterar a fonte da verdade (`content/index.json`).

## Changed

- `planner-service.ts` (`generateActivitiesForDay`): usa `getDisciplineIdByName()` e `getChapterIdByTitle()` para resolver IDs oficiais; fallback para `slugify()` apenas quando não houver correspondência.
- `dashboard-service.ts` (`getOfficialDisciplines`): substituído `mapDisciplineToProgress` (zeros fixos) por consumo de `getDisciplinesWithProgress()`; Dashboard e listagem exibem progresso idêntico.
- `disciplina-detalhe-page.tsx`: `toISODate(new Date())` em vez de `new Date().toISOString().split('T')[0]`; `taskId` do checklist estável (`checklist_${chapterId}` sem `Date.now()`); passa `durationMinutes` condicionalmente via spread (compatível com `exactOptionalPropertyTypes`).

## Fixed

- Unificação de IDs de disciplina: planner-service grava `disciplineId` oficial (ex.: `disc_portugues`) em vez de slug (`lingua-portuguesa`); tarefas concluídas no Planner agora contam progresso de disciplina corretamente.
- `exactOptionalPropertyTypes`: atribuição condicional de `durationMinutes` via spread evita `undefined` explícito em propriedade opcional.

---

# [1.10.0] - 2026-07-29

## Documentation

- Gate Review da Task 008 concluído nesta conversa: veredicto **B — estabilizar primeiro** (arquitetura 7,5/10, escalabilidade 7,0/10, qualidade 7,0/10). Bloqueante: A1 (dois namespaces de ID — planner grava slugs `lingua-portuguesa`, índice oficial usa `disc_portugues`/`chap_*`; progresso do Planner nunca conta para a disciplina). Médios: M1 (Dashboard diverge com zeros fixos), M2 (`toISOString` fora do utilitário de datas), M3 (taskId instável no checklist), M5 (heurística plana de 1,5h/tarefa).
- Task 008b criada (`tasks/008b-unificacao-ids-disciplina.md`): unificação de IDs de disciplina + correções médias, prioridade P0 bloqueante para as Tasks 009 e 010, estimativa 2–3h. Decisão registrada: `content/index.json` é a fonte da verdade para IDs; o planner resolve nome → ID oficial via discipline-service; registros legados com slugs são descartáveis (desenvolvimento).
- Task 009 atualizada: critério herdado do Gate 008 (M4) — substituir roadmap inline da página de detalhe por carregamento real de `content/<disciplina>/00-roadmap.md` via content-service.

## Added

- Página de listagem de disciplinas (`/disciplinas`): grid responsivo com 12 cards oficiais do Perfil 10, ordenados conforme ROADMAP_DISCIPLINAS.md.
- Página de detalhe de disciplina (`/disciplinas/:id`): descrição, progresso, roadmap (MarkdownViewer), capítulos agrupados por módulo (LearningPath), questões, flashcards, resumo, podcast (placeholders com Empty State), checklist interativo.
- Índice oficial das disciplinas em `content/index.json`: fonte única de verdade com IDs, nomes, pesos, prioridades, horas estimadas, descrições, módulos e capítulos.
- Serviço `discipline-service.ts`: carregamento do índice, consulta por ID, verificação de existência, cálculo de progresso a partir do `ProgressSnapshot`, contagem de capítulos.
- Tipos de disciplina (`src/types/discipline.ts`): `Discipline`, `Module`, `Chapter`, `DisciplineWithProgress`, `DisciplineStatus`.
- Componente `DisciplineCard`: card interativo com nome, descrição, barra de progresso, badge de status, horas estudadas/estimadas, peso e prioridade. Navegável por teclado.
- Componente `TopicCard`: card compacto de capítulo com ícone de status, tempo estimado, badge de dificuldade. Navegável por teclado.
- Componente `LearningPath`: visualização hierárquica de módulos e capítulos com conectores verticais, ícones de status semânticos e cores do Design System.
- Componente `SubjectChecklist`: checklist interativo de capítulos com persistência via `saveProgress`, marcadores visuais, suporte a marca/desmarca.
- Testes unitários: `discipline-service` (10 testes), `DisciplineCard` (5 testes), `SubjectChecklist` (4 testes), `LearningPath` (2 testes).

## Changed

- `dashboard-service.ts`: `OFFICIAL_DISCIPLINES` hardcoded removido; agora consome `getAllDisciplines()` do `discipline-service`, eliminando duplicação entre Dashboard e índice de disciplinas.
- `src/pages/disciplinas-page.tsx`: reescrita de placeholder para listagem funcional com estados loading, erro e vazio.
- `src/pages/disciplina-detalhe-page.tsx`: reescrita de placeholder para página de detalhe completa com breadcrumbs implícitos (botão de retorno), seções modulares e integração com MarkdownViewer.

## Fixed

- Duplicação de dados de disciplinas eliminada: `content/index.json` é a fonte única; Dashboard e páginas de disciplina consomem do mesmo índice.

---

# [1.12.0] - 2026-07-30

## Added

- Progress Tracker completo: página `/progresso` com métricas de estudo, cronômetro de sessão, meta semanal, streak, evolução e histórico.
- Tipos de progresso (`src/types/progress.ts`): `StudySession`, `WeeklyGoal`, `SessionHistoryItem`, `ProgressData`.
- Serviço `session-service.ts`: persistência de sessões de estudo em localStorage (schema v1, key `cap.study.sessions`).
- Serviço `progress-service.ts`: cálculo de streak (dias consecutivos), metas semanais (810min = 13,5h), pontos de evolução, histórico agregado.
- Hook `use-study-timer.ts`: cronômetro de sessão com estados `idle`/`running`/`paused`, integrado ao `session-service`.
- Componente `ProgressCard`: card reutilizável de métrica com ícone, valor, label e variação.
- Componente `StudyMetrics`: grid de 4 métricas principais (sessões, tempo total, média, taxa de acerto).
- Componente `GoalTracker`: barra de progresso da meta semanal com percentual e tempo restante.
- Componente `StudySession`: cronômetro com controles (iniciar, pausar, retomar, finalizar, interromper) e tempo formatado.
- Testes unitários: `session-service.test.ts` (11 testes), `progress-service.test.ts` (19 testes), `use-study-timer.test.ts` (6 testes).

## Changed

- `progresso-page.tsx`: reescrita de placeholder para página completa com métricas, cronômetro, meta semanal, gráfico de evolução, streak e histórico de sessões.

---

# [1.13.0] - 2026-07-30

## Added

- Busca global instantânea (Task 011): modal de busca ativado pelo atalho `S` e fechado com `Esc`.
- Motor de busca local com Fuse.js (`src/services/search-service.ts`): busca fuzzy em disciplinas, módulos e capítulos com resposta < 300 ms.
- Índice de busca (`src/services/search-index-builder.ts`): gerado em build time a partir de `content/index.json`, com keywords enriquecidas por área.
- Hook `use-search.ts`: orquestra estado da busca com debounce (150 ms), navegação por teclado (↑/↓/Enter) e integração com React Router.
- Componentes de busca: `SearchModal` (overlay com foco trap e ARIA), `SearchInput` (com forwardRef), `SearchResults` (agrupados por tipo com sticky headers), `SearchResultItem` (highlight do termo encontrado).
- Script `scripts/generate-index.ts`: gera `public/search-index.json` em build time para uso futuro (PWA/offline).
- Integração com atalho `S`: `useKeyboardShortcuts` dispara evento `open-search-modal`; `SearchModal` escuta e abre.
- Tipos de busca (`src/types/search.ts`): `SearchResult`, `SearchIndexEntry`, `SearchState`, `SearchConfig`.
- Testes unitários: `search-service.test.ts` (7 testes: vazio, curto, exato, capítulo, keyword, fuzzy, limite, performance < 300 ms).

## Changed

- `AppLayout`: integra `<SearchModal />` como componente global.
- `tsconfig.app.json`: inclui `scripts/` no array `include` para compatibilidade com build time.

---

# [1.11.0] - 2026-07-29

## Changed

- `progresso-page.tsx`: reescrita de placeholder para página completa com métricas, cronômetro, meta semanal, gráfico de evolução, streak e histórico de sessões.

---

# [1.11.0] - 2026-07-29

---

# [1.11.0] - 2026-07-29

## Added

- Content Renderer (Capítulos): página de capítulo (`/disciplinas/:disciplineId/capitulos/:chapterId`) com renderização Markdown, TOC lateral, checklist de leitura e navegação entre capítulos.
- Tipos de capítulo (`src/types/chapter.ts`): `ChapterContent`, `ChapterNavigation`, `ChapterFrontmatter`.
- Serviço `content-service.ts` refatorado para `fetch`: carrega markdown de `/content/<disciplina>/<modulo>/<arquivo>.md` com compatibilidade total para GitHub Pages e testabilidade via `fetch` mockado.
- Componente `ChapterHeader`: exibe título, metadados do frontmatter (disciplina, módulo, dificuldade, tempo estimado) e navegação de retorno.
- Componente `ChecklistPanel`: checklist de leitura do capítulo com persistência em `localStorage` (`cap.chapter.checklist.<chapterId>`).
- Componente `NextChapterLink`: link de navegação para o próximo capítulo com preview de título e módulo.
- Componente `MermaidDiagram`: placeholder arquitetural para futuro suporte a diagramas Mermaid (não renderiza ainda, exibe fallback informativo).
- Página `ChapterPage` (`src/pages/chapter-page.tsx`): estados loading (skeleton), erro (mensagem amigável) e vazio (Empty State); TOC flutuante com scroll spy via IntersectionObserver; integração com `MarkdownViewer`.
- Rota dinâmica `/disciplinas/:disciplineId/capitulos/:chapterId` em `src/routes/index.tsx`.
- Herança M4 (Gate 008): `disciplina-detalhe-page.tsx` carrega `00-roadmap.md` via `loadDisciplineRoadmap()` do content-service; fallback informativo quando o arquivo não existe.
- Conteúdo de exemplo criado: `content/disc_portugues/00-roadmap.md` e `content/disc_portugues/01-fundamentos/morfologia.md`, copiados para `public/content/` para servir em runtime.
- Testes unitários: `content-service.test.ts` (12 testes com fetch mockado), cobrindo carregamento de capítulo, roadmap, erro 404, parsing de frontmatter e navegação.

## Changed

- `disciplina-detalhe-page.tsx`: correção de template string mal escapado no fallback do roadmap; uso de cópia local `const d = discipline` para satisfazer TypeScript strict dentro de função async.

---

# [1.10.0] - 2026-07-29

---

# [1.8.1] - 2026-07-29

## Documentation

- Gate Review da Task 007 concluído nesta conversa: veredicto **B — estabilizar primeiro** (arquitetura 6,5/10, escalabilidade 5,5/10, qualidade 6,0/10). Achados: C1 (cronograma deslocado 1 dia), C2 (mocks falsos no Dashboard com disciplinas fora do Perfil 10), C3 (modelo de persistência sem data de conclusão), A1–A4 (JSONs duplicados, derivações divergentes, simulados ignorados, timezone inconsistente).
- Task 007b criada (`tasks/007b-estabilizacao-planner-dashboard.md`): estabilização do Planner & Dashboard, prioridade P0 bloqueante para as Tasks 008 e 010, estimativa 10–14h. Inclui decisão de padronização do campo `hasSimulated` → `hasSimulation` no JSON do roadmap.
- Gate Review da Task 007b concluído nesta conversa: veredicto **B — estabilizar primeiro** (arquitetura 7,5/10, escalabilidade 7,0/10, qualidade 6,5/10). Bloqueantes: C1 (evento `planner-progress-updated` sem listener — toggle não re-renderiza), A1 (`mockEvolution`/`mockStreak` ainda exibidos), A2 (testes de persistência/migração ausentes), A3 (taxa de acerto sintética de 55%).
- Task 007c criada (`tasks/007c-correcoes-gate-007b.md`): micro-task de estabilização com os 4 bloqueantes + 4 médios do Gate Review 007b, prioridade P0 bloqueante para a Task 008, estimativa 3–5h.

## Added

- Utilitário centralizado de datas (`src/utils/date.ts`): `toISODate`, `addDays`, `diffDays`, `weekdayLabel`, `weekdayKey`, `fromISODate`. Elimina duplicação e bugs de timezone.
- Schema v2 de persistência do Planner (`ProgressSnapshot`): `completedTasks: CompletedTaskRecord[]` com `taskId`, `completedDate`, `disciplineId`, `topicId`. Substitui `completedTaskIds: string[]`.
- Migração automática de schema v1 → v2 em `loadProgress()`.
- Campos `disciplineId` e `topicId` em `PlannerActivity`: metadados completos para cada atividade gerada.
- Atividades genéricas para disciplinas fixas do template sem tópicos explícitos (ex: Língua Portuguesa, Língua Inglesa).
- IDs estáveis de atividades: formato `task_s{week}_{dayIndex}_{slot}`.
- Tarefas de simulado (`simulation`) geradas automaticamente no sábado das semanas S06, S08, S09, S10.
- Evento customizado `planner-progress-updated` para sincronização entre abas (Dashboard ↔ Planner).
- Testes unitários atualizados: 16 testes no planner-service (inclui disciplineId/topicId, simulados, weekday mapping); 5 testes no dashboard-service com fake timers determinísticos.

## Changed

- `planner-service.ts`: weekday mapping corrigido — usa `date.getDay()` em vez do índice do loop `i`.
- `planner-service.ts`: geração de atividades usa `slugify()` para `disciplineId` e `topicId`.
- `dashboard-service.ts`: disciplinas oficiais do Perfil 10 (12 disciplinas com IDs corretos: `disc_portugues`, `disc_ingles`, etc.).
- `dashboard-service.ts`: `generateReviewQueueFromPlanner()` consome `loadProgress()` diretamente (sem mocks).
- `dashboard-service.ts`: `generateDailyPlanFromPlanner()` retorna `createEmptyDailyPlan()` quando não há atividades.
- `use-task-progress.ts`: `toggleTask(taskId, disciplineId, topicId)` persiste metadados completos.
- `use-planner-data.ts`: consome `loadProgress()` internamente; não recebe `completedTasks` como parâmetro.
- `planner-page.tsx`: eliminado parsing manual de ID (`split('_')`); `toggleTask` passado diretamente para `StudyPlanner`.
- Prop chain dos componentes Planner: `onTaskToggle` agora recebe `(taskId, disciplineId, topicId)`.

## Fixed

- C1: Weekday mapping deslocado corrigido no `planner-service.ts`.
- C2: Mocks falsos removidos do Dashboard; disciplinas oficiais do Perfil 10 adotadas.
- C3: Modelo de persistência v1 (`completedTaskIds`) migrado para v2 (`completedTasks[]` com metadados).
- A1: Duplicação de JSONs eliminada (`planner/roadmap-s01-s11.json` removido; fonte única em `src/data/planner/`).
- A2: Fonte de dados Dashboard↔Planner unificada via `loadProgress()` compartilhado.
- A3: Simulados gerados nas semanas corretas (S06, S08, S09, S10).
- A4: Timezone inconsistente eliminado via `src/utils/date.ts`.

## Removed

- `planner/roadmap-s01-s11.json`: arquivo duplicado removido.
- `mockDailyPlan`, `mockReviewQueue` e disciplinas fictícias do `dashboard-service.ts`.
- Parsing manual de `taskId` em `planner-page.tsx`.

---

# [1.9.0] - 2026-07-29

## Added

- Reatividade do toggle de tarefas via `useSyncExternalStore` em `use-task-progress.ts` e `use-planner-data.ts`: subscrição a `planner-progress-updated` + `storage` (sincronização entre abas). Marcar/desmarcar atualiza checkbox, barra de progresso e revisões sem reload.
- Campos `disciplineName` e `topicName` ao `CompletedTaskRecord` (schema v2.1): nomes legíveis persistidos no momento do toggle, eliminando slugs na fila de revisões.
- Função compartilhada `getCompletedTasksForReview()` em `planner-service.ts`: transformação única de `ProgressSnapshot → CompletedTask[]`, consumida por `dashboard-service.ts` e `use-planner-data.ts` (elimina duplicação M1).
- Testes de persistência e migração (5 testes): round-trip v2, migração v1→v2, storage corrompido, array vazio preserva `hoursLogged`, `hoursLogged: null` tratado como `{}`.

## Changed

- `use-task-progress.ts`: `toggleTask` agora recebe 5 parâmetros (`taskId, disciplineId, disciplineName, topicId, topicName`) e usa `useSyncExternalStore`.
- `use-planner-data.ts`: reescrito com `useSyncExternalStore`; consome `getCompletedTasksForReview()` do planner-service.
- `dashboard-service.ts`: `evolution` retorna `[]` (sem `mockEvolution`); `streak` retorna `null` (sem `mockStreak`). `ProgressChart` e `StudyStreakComponent` exibem Empty State.
- `dashboard-service.ts`: `calculateStatistics` retorna taxa de acerto `0` quando não há dados reais de questões (remove fórmula sintética `55 + 0.4×syllabus`).
- `loadProgress()`: aceita `completedTasks: []` como schema v2 válido (checa tipo do campo, não tamanho); protege contra `hoursLogged: null`.
- `DashboardData.streak`: tipo alterado para `StudyStreak | null`.

## Fixed

- C1: Toggle de tarefa agora re-renderiza a UI imediatamente (useSyncExternalStore + evento customizado).
- A1: `mockEvolution` e `mockStreak` removidos do Dashboard; Empty States exibidos quando não há dados reais.
- A3: Taxa de acerto sem dados reais agora exibe `0%` em vez de `55%` sintético.
- M2: Fila de revisões exibe nomes legíveis (`disciplineName`/`topicName`), nunca slugs.
- M3: `hoursLogged` preservado quando `completedTasks` é esvaziado.

## Removed

- `mockEvolution` e `mockStreak` de `dashboard-service.ts`.
- Duplicação de transformação `ProgressSnapshot → CompletedTask[]` entre `dashboard-service.ts` e `use-planner-data.ts`.
- Seção `Documentation` duplicada na entrada `[1.8.1]`.

## Documentation

- Re-verificação dos bloqueantes da 007c concluída nesta conversa (gate simplificado): C1, A1, A2, A3, M1–M4 todos verificados em código. **Task 008 liberada** para implementação.

---


# [1.8.0] - 2026-07-29

## Added

- Study Planner (Camada 2): cronograma de estudos de 11 semanas com geração automática de plano diário.
- Serviço `planner-service.ts`: carrega roadmap JSON, calcula semana atual, gera atividades por dia, aplica progresso do localStorage.
- Serviço `review-queue-service.ts`: algoritmo de revisões espaçadas 24h → 7d → 30d com ordenação por urgência (urgent → attention → normal).
- Hook `useTaskProgress`: CRUD de tarefas concluídas com persistência em localStorage (`cap.planner.progress`).
- Hook `usePlannerData`: orquestra planner-service + review-queue-service com estados de loading/erro.
- Componentes do Planner: `TaskItem`, `DailyMission`, `WeeklyPlan`, `PlannerCalendar`, `StudyPlanner` (container com tabs).
- Página `PlannerPage` (/cronograma): integra StudyPlanner com hooks de dados e progresso.
- JSONs de dados: `roadmap-s01-s11.json` (cronograma oficial) e `weekly-template.json` (template semanal fixo).
- Tipos do Planner (`src/types/planner.ts`): `StudyPlan`, `WeekPlan`, `DayPlan`, `PlannerActivity`, `ProgressSnapshot`, `CompletedTask`.
- Integração Dashboard ↔ Planner: `dashboard-service.ts` consome `planner-service` para gerar `DailyPlan` e `ReviewItem[]` dinamicamente, com fallback para mocks quando o planner não retorna dados.
- Declaração de módulo JSON (`src/types/json-modules.d.ts`): compatibilidade com TypeScript strict para imports JSON.
- Função utilitária `toISODate` robusta: evita problemas de fuso horário em cálculos de data.

## Changed

- Rota `/cronograma` agora renderiza `PlannerPage` em vez de `CronogramaPage` (placeholder removido).
- DashboardService `calculateStatistics` agora recebe `reviewQueue` dinâmico em vez de mock fixo.

## Fixed

- Fuso horário em cálculos de data: `toISODate` usa `getFullYear/getMonth/getDate` locais em vez de `toISOString().split('T')[0]`.
- Testes de planner e review-queue atualizados para usar construtores de Date locais (`new Date(ano, mes, dia)`).

## Removed

- `src/pages/cronograma-page.tsx`: página placeholder substituída por `PlannerPage`.

---

# [1.7.1] - 2026-07-29

## Fixed

- `NotFoundPage` (`route-fallbacks.tsx`): substituído `window.location.href = '/'` por `useNavigate()` do React Router, eliminando reload completo da página em SPA.
- `Footer` (`footer.tsx`): dados do concurso agora consumidos dinamicamente de `config/exam.json`, garantindo reusabilidade da plataforma para outros concursos.
- `types/navigation.ts`: removida declaração duplicada de `BreadcrumbItem`.

## Removed

- `src/types/layout.ts`: removido arquivo com tipos mortos (`NavItem` duplicado, `LayoutProps` e `SidebarState` nunca importados).
- Dependências `rehype-slug` e `rehype-autolink-headings`: removidas do `package.json` (nunca utilizadas em nenhum arquivo).

## Changed

- `dashboard-service.ts`: import de `exam.json` padronizado via path relativo consistente (`../../config/exam.json`).

---

# [1.7.0] - 2026-07-29

## Added

- Markdown Viewer extensível: renderizador oficial de conteúdo Markdown com arquitetura desacoplada (parser + renderer).
- Parser de conteúdo (`content-parser.ts`): extração de frontmatter YAML, headings para TOC, pipeline remark/rehype configurável.
- Plugin remark-callout (`remark-callout.ts`): transforma blockquotes `> [!TYPE]` em callouts semânticos via className.
- Componente `MarkdownViewer`: renderização com react-markdown, suporte a TOC lateral com IntersectionObserver, metadados de frontmatter.
- Componente `Callout`: 5 tipos (attention, trap, memorization, important, legislation) com ícones Lucide, cores semânticas e suporte a dark mode.
- Componente `CodeBlock`: blocos de código com botão copiar, fonte JetBrains Mono, compatível com dark mode.
- Componente `TableRenderer`: tabelas responsivas com rolagem horizontal e fade indicator em mobile.
- Componente `HeadingAnchor`: headings com IDs slugificados (acentos normalizados) e link de âncora no hover.
- Tipos de conteúdo (`src/types/content.ts`): `ContentMetadata`, `ContentParserConfig`, `HeadingItem`, `ParsedContent`, `ContentPlugin`.
- Documento de exemplo (`content/demo-apostila.md`): demonstração de todas as features do Markdown Viewer.
- Testes unitários: `content-parser` (8 testes), `callout` (5 testes), `markdown-viewer` (9 testes); total: 63/63 passando.
- Dependências: react-markdown, remark-gfm, remark-frontmatter, rehype-sanitize, unified.

## Changed

- `HeadingAnchor` gera IDs próprios via `slugify()` compartilhado com o parser, garantindo consistência entre DOM e TOC.
- `content-parser.ts` remove rehype-slug e rehype-autolink-headings do pipeline padrão; sanitização simplificada.

## Security

- Revisão técnica (golden implementation):
  - `slugify.ts` centralizado: única fonte de verdade para geração de IDs (parser TOC + DOM headings).
  - `callout-registry.ts`: registry tipado eliminando switch/case; 5 variantes semânticas com ícone, título, cores e classes.
  - Validação de frontmatter com Zod (`FrontmatterSchema`): validação rigorosa de campos obrigatórios, aliases (`module` → `chapter`, `difficulty` → `level`, `estimated_time` → `estimatedTime`), e erro customizado `FrontmatterValidationError` com issues detalhadas.
  - Testes de segurança do MarkdownViewer (5 testes): remoção de `<script>`, sanitização de `javascript:` em links, remoção de `onerror` em imagens, bloqueio de HTML malicioso.
  - `MarkdownViewer` confirmado como componente puro de renderização: sem fetch, sem acesso a arquivos, sem leitura de diretório.
  - Testes do content-parser expandidos para 14 testes: cobertura de aliases modernos, validação Zod, arrays YAML.
  - Total de testes após revisão: 74/74 passando.
- Dependências: react-markdown, remark-gfm, remark-frontmatter, rehype-sanitize, unified.

## Changed

- `HeadingAnchor` gera IDs próprios via `slugify()` compartilhado com o parser, garantindo consistência entre DOM e TOC.
- `content-parser.ts` remove rehype-slug e rehype-autolink-headings do pipeline padrão; sanitização simplificada.

---

# [1.6.0] - 2026-07-28

## Added

- Dashboard completo (cockpit de estudos): página principal com hierarquia visual definida.
- Componentes de Dashboard: `KpiCard`, `ExamCountdown`, `DailyPlanCard`, `ReviewQueueCard`, `ProgressChart` (Recharts), `DisciplineProgressList`, `StudyStreak`.
- Serviços de leitura: `dashboard-service.ts` (dados mockados genéricos, 12 disciplinas) e `statistics-service.ts` (cálculos de percentual, taxa de acerto, countdown).
- Tipos do Dashboard: `src/types/dashboard.ts` com interfaces baseadas em DATA_MODEL.md (`DailyPlan`, `ReviewItem`, `DisciplineProgress`, `Statistics`, `EvolutionPoint`, `StudyStreak`).
- Configuração do concurso: `config/exam.json` com data da prova (2026-10-11), horas semanais (13.5) e semanas totais (11).
- KPIs principais: horas estudadas, taxa de acerto, percentual do edital, revisões pendentes, dias até a prova, horas restantes, simulados realizados.
- Gráfico de evolução temporal com Recharts: horas estudadas × taxa de acerto ao longo do tempo.
- Plano do dia com lista de tarefas, prioridades e barra de progresso.
- Fila de revisões com ordenação por urgência (urgente → atenção → normal).
- Streak de estudos com recorde e última data de estudo.
- Estados de loading: skeletons em todos os componentes do Dashboard.
- Estado de erro: mensagem amigável com ícone e descrição.
- Testes unitários: `statistics-service` (17 testes), `dashboard-service` (6 testes), `exam-countdown` (3 testes); total: 41/41 passando.
- Componente foundation `Skeleton` para estados de carregamento.

## Changed

- `dashboard-page.tsx` reescrita: layout hierárquico (plano do dia → revisões → progresso → estatísticas → complementar).
- Dependência `recharts` adicionada ao projeto (TECH_STACK.md §9).

---

# [1.5.0] - 2026-07-28

## Added

- Sistema de rotas com React Router DOM v7: 11 rotas definidas com lazy loading e code splitting.
- Rotas implementadas: `/`, `/cronograma`, `/disciplinas`, `/disciplinas/:id`, `/questoes`, `/flashcards`, `/revisoes`, `/simulados`, `/podcasts`, `/progresso`, `/configuracoes`, `*` (404).
- HashRouter para compatibilidade com GitHub Pages (SSG sem backend).
- Suspense com fallback skeleton em todas as rotas de página.
- Sidebar atualizada com `NavLink`: item ativo destacado (`bg-primary text-primary-foreground`), navegação SPA sem reload.
- Breadcrumbs dinâmicos (`useBreadcrumbs`): refletem hierarquia da rota atual, com links navegáveis para níveis superiores.
- Atalhos de teclado oficiais (`useKeyboardShortcuts`): D (Dashboard), Q (Questões), F (Flashcards), R (Revisões); desativados automaticamente em inputs/textarea.
- Página 404 (`NotFoundPage`) com EmptyState e botão de retorno ao Dashboard.
- Componentes de navegação: `Breadcrumb`, `RouteSkeleton`, `EmptyState`, `NotFoundPage`.
- Páginas base para todas as rotas (placeholder com título e ícone).
- Testes unitários: `useBreadcrumbs` (3 testes), `useKeyboardShortcuts` (2 testes); total: 15/15 passando.
- Tipos de navegação em `src/types/navigation.ts`.

## Changed

- `App.tsx` simplificado: apenas `AppLayout` + `AppRoutes`.
- `main.tsx` atualizado com `HashRouter`.
- `Sidebar` migrada de `<a>` para `<NavLink>` do React Router.
- `AppLayout` integra `Breadcrumb` e `useKeyboardShortcuts`.

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
