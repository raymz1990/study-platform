# Task 007c — Correções do Gate Review 007b (Micro-task de Estabilização)

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0 — bloqueante (Gate Review 007b: veredicto B)

---

## Objetivo

Corrigir os 4 bloqueantes e 4 médios identificados no Gate Review de fechamento da Task 007b. Nenhuma funcionalidade nova. Ao final, a base estará liberada para a Task 008.

## Contexto

O Gate Review da 007b (29/07/2026) validou build, lint, 98/98 testes e a maioria dos critérios (weekday corrigido, schema v2, revisões por `completedDate`, JSON único, `date.ts`, IDs estáveis, simulados, disciplinas oficiais). Porém encontrou 1 crítico de runtime e 3 violações de critérios de aceite:

- **C1** — `use-task-progress.ts:56` dispara o evento `planner-progress-updated`, mas **nenhum código escuta**; `useTaskProgress` não usa estado React. Marcar uma tarefa persiste no localStorage, mas a UI não re-renderiza (checkbox, barra de progresso e fila de revisões ficam velhados até recarregar a página).
- **A1** — `dashboard-service.ts:177-191` ainda exibe `mockEvolution` (7 pontos inventados) e `mockStreak` (streak "5 / recorde 12") no `ProgressChart` e `StudyStreakComponent`. Viola "nenhum mock exibido ao usuário".
- **A2** — Testes obrigatórios da spec 007b ausentes: **persistência** (`loadProgress`/`saveProgress`) e **migração v1→v2** (`migrateFromV1`). Nenhum teste cobre o código de migração, que manipula dados do usuário.
- **A3** — `dashboard-service.ts:290`: `correctRate = min(85, 55 + 0.4×syllabus)` exibe "Taxa de Acerto 55%" inventada quando não há dados reais.

## Documentos Obrigatórios

- Gate Review da Task 007b (relatório desta conversa, 29/07/2026 — fonte dos achados)
- tasks/007b-estabilizacao-planner-dashboard.md (critérios de aceite originais)
- SYSTEM_ARCHITECTURE.md (§6, §12)
- DATA_MODEL.md (Progresso, Revisão)
- CODING_STANDARDS.md

## Arquivos Envolvidos

```
src/hooks/use-task-progress.ts        (C1 — re-render reativo)
src/hooks/use-planner-data.ts         (C1 — reagir ao evento; M1 — usar função compartilhada)
src/services/planner-service.ts       (M1 — extrair getCompletedTasksForReview; M3 — edge case array vazio)
src/services/dashboard-service.ts     (A1 — mocks evolution/streak; A3 — taxa sintética; M1/M2 — transformação e nomes)
src/services/review-queue-service.ts  (M2 — nomes legíveis, se a solução for no serviço)
src/components/dashboard/progress-chart.tsx   (A1 — Empty State)
src/components/dashboard/study-streak.tsx     (A1 — Empty State)
src/pages/dashboard-page.tsx          (A1 — repasse dos Empty States)
src/components/planner/study-planner.tsx      (B1 — onTaskToggle na visão Semana)
docs/roadmap/CHANGELOG.md             (M4 — entrada [1.9.0] correta)
src/services/planner-service.test.ts  (A2 — testes de persistência e migração)
```

## Dependências

- Task 007b — concluída (em Gate Review de fechamento).
- **Bloqueia:** Task 008 (Discipline Page) e Task 010 (Progress Tracker).

---

## Escopo

### P0 — Bloqueantes

**1. C1 — Toggle de tarefa deve atualizar a UI imediatamente.**

Problema: evento `planner-progress-updated` sem listener; nenhum estado React envolvido.

Correção (escolher uma e aplicar de forma consistente nos dois hooks):

- Opção preferida: `useSyncExternalStore` subscrevendo `planner-progress-updated` (+ `storage` para sincronização entre abas), com snapshot lido de `loadProgress()`;
- Alternativa: `useState` + `useEffect` com `addEventListener('planner-progress-updated', ...)` e cleanup.

Critério: ao clicar em "concluir" na visão Hoje, o checkbox, a barra de progresso do dia e a fila de revisões atualizam **sem reload**; ao voltar ao Dashboard, os dados refletem a conclusão.

**2. A1 — Eliminar `mockEvolution` e `mockStreak`.**

- Remover as constantes mockadas de `dashboard-service.ts`.
- `ProgressChart` e `StudyStreakComponent`: exibir Empty State quando não houver dados reais (seguir o padrão dos Empty States já existentes em `DailyPlanCard`/`ReviewQueueCard`).
- Permitido (opcional): derivar evolução de `hoursLogged` real, se simples; caso contrário, Empty State.

**3. A2 — Testes de persistência e migração (obrigatórios da spec 007b).**

Adicionar em `planner-service.test.ts` (ou arquivo novo `planner-persistence.test.ts`):

- round-trip v2: `saveProgress` → `loadProgress` preserva `completedTasks`, `hoursLogged`, `lastUpdated`;
- migração v1: localStorage com `{ completedTaskIds: ['task_s01_1_0'] }` → `loadProgress` retorna `completedTasks` com `taskId` preservado;
- storage corrompido (JSON inválido) → retorna snapshot vazio sem lançar exceção;
- **edge case do array vazio (ver M3)**: snapshot v2 com `completedTasks: []` e `hoursLogged` preenchido → `loadProgress` preserva `hoursLogged`;
- `toggleTask`: marcar adiciona registro com `completedDate` = hoje; desmarcar remove.

**4. A3 — Taxa de acerto sem dados inventados.**

- Quando `totalQuestions === 0`: `correctRate`/`averageScore` devem ser `0` (e o KPI exibe "—" ou 0% com descrição neutra), nunca 55% sintético.
- Remover a fórmula `55 + 0.4×syllabus` ou condicioná-la a dados reais.

### P1 — Médios (corrigir na mesma rodada)

**5. M1 — Eliminar duplicação de transformação.**

- Extrair `getCompletedTasksForReview(progress)` (record → `CompletedTask`) para `planner-service.ts` (ou `review-queue-service.ts`) e usar em `dashboard-service.ts` e `use-planner-data.ts`.
- `generateDailyPlanFromPlanner` e o hook devem compartilhar a mesma derivação de dados.

**6. M2 — Nomes legíveis na fila de revisões.**

Hoje a fila exibe slugs (`topic: record.topicId` → "juros-compostos — Revisão 24h · matematica-financeira"). Resolver nomes legíveis (`discipline` e `topic` de exibição) a partir do `loadStudyPlan()` no momento da geração da fila, ou armazenar os nomes no `CompletedTaskRecord` no momento do toggle (decisão do implementador — registrar no relatório).

**7. M3 — Edge case do array vazio em `loadProgress`.**

`planner-service.ts:307-322`: o check de v2 exige `completedTasks.length > 0`; snapshot v2 com array vazio cai em `migrateFromV1` e **zera `hoursLogged`**. Aceitar array vazio como v2 válido (checar tipo do campo, não o tamanho) e proteger contra `hoursLogged: null` (`typeof null === 'object'`).

**8. M4 — CHANGELOG.**

- Criar entrada `[1.9.0] - 2026-07-29` com as mudanças da 007b + 007c.
- Remover a seção `Documentation` duplicada na entrada `[1.8.1]` (linhas duplicadas: o bloco Documentation aparece duas vezes).

### P2 — Baixos (se couber, sem expandir escopo)

- **B1:** passar `onTaskToggle` para `WeeklyPlan` (visão Semana sem toggle hoje).

## Não implementar

- Progress Tracker (Task 010), Disciplinas (008), Busca (011), Flashcards, Markdown, Analytics.
- Remover o `setTimeout` de 600ms do Dashboard e o `useMemo` quebrado (P2 já registrados para task futura).
- Qualquer refatoração além dos arquivos listados.

---

## Critérios de Aceite

- [ ] `pnpm build` OK, `pnpm lint` OK, TypeScript strict sem erros.
- [ ] Todos os testes existentes passando + novos testes de persistência/migração passando.
- [ ] Marcar/desmarcar tarefa atualiza checkbox, barra de progresso e revisões **sem reload**.
- [ ] Nenhum dado inventado na tela: sem `mockEvolution`, sem `mockStreak`, sem taxa de acerto sintética (Empty States quando vazio).
- [ ] Nenhuma transformação Planner→Dashboard duplicada (função compartilhada única).
- [ ] Fila de revisões exibe nomes legíveis (disciplina e tópico), não slugs.
- [ ] `hoursLogged` preservado quando `completedTasks` fica vazio.
- [ ] CHANGELOG com `[1.9.0]` e sem seção duplicada.
- [ ] Nenhuma regressão nos 98 testes atuais.

## Checklist de Testes

- [ ] Round-trip de persistência v2.
- [ ] Migração v1 (`completedTaskIds`) → v2.
- [ ] Storage corrompido.
- [ ] Array vazio preserva `hoursLogged`.
- [ ] Toggle marca/desmarca com `completedDate` correto.
- [ ] Re-render reativo do toggle (teste de hook com evento, se viável; caso contrário, validação manual documentada no relatório).
- [ ] Estatísticas zeradas/Empty State sem dados.
- [ ] Regressão: suíte completa.

## Entregáveis

Relatório de entrega contendo: arquivos criados/alterados, decisões arquiteturais (incl. solução do M2 e do re-render), testes adicionados, impacto arquitetural, pendências remanescentes.

## Estimativa de Esforço

**3–5 horas.**

---

## Documentação

Ao concluir: atualizar CHANGELOG.md (entrada `[1.9.0]`); submeter à re-verificação dos bloqueantes nesta conversa (gate simplificado) para liberação da Task 008.
