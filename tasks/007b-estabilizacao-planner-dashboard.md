# Task 007b — Estabilização do Planner & Dashboard

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0 — bloqueante (Gate Review da Task 007: veredicto B)

---

## Objetivo

Implementar **somente** as correções arquiteturais e funcionais identificadas no Gate Review da Task 007. Nenhuma funcionalidade nova. O objetivo é deixar a base preparada para a Task 008 (Discipline Page) e desbloquear a Task 010 (Progress Tracker).

## Contexto

O Gate Review da Task 007 (realizado em 29/07/2026) aprovou build, lint e 97/97 testes, mas identificou 3 problemas críticos de runtime e 4 problemas altos de arquitetura que inviabilizam o merge sem estabilização:

**Críticos (originam o escopo P0 desta task):**

- **C1 — Cronograma deslocado 1 dia.** `planner-service.ts` usa o offset do loop `i` (0 = segunda 27/07) como se fosse o weekday JS (0 = domingo): a segunda-feira é rotulada "Domingo" e todo o roadmap corre um dia. O teste existente codifica o bug (espera 'Domingo' para 27/07/2026).
- **C2 — Mocks falsos no Dashboard.** `dashboard-service.ts` contém disciplinas mockadas que **não são as 12 do Perfil 10** (Direito Constitucional, Auditoria, Estatística), IDs fora do padrão oficial (`disc_001` em vez de `disc_*`), revisões mockadas com datas passadas exibidas como "Urgente" e fallbacks silenciosos com dados inventados.
- **C3 — Modelo de persistência insuficiente.** `ProgressSnapshot.completedTaskIds: string[]` não registra data de conclusão; `planner-page.tsx` reconstrói `completedDate = hoje` e parseia disciplina/tópico do texto do ID (`split('_')`). Consequência: a fila de revisões 24h/7d/30d nunca vence corretamente.

**Altos (originam o escopo P1 desta task):**

- **A1** — JSONs do planner duplicados (`planner/*.json` × `src/data/planner/*.json`).
- **A2** — Dashboard e Planner derivam `CompletedTask` por caminhos divergentes; Dashboard lê uma vez no mount e fica desatualizado.
- **A3** — `hasSimulated` e `milestones` do roadmap JSON são ignorados; nenhuma tarefa de simulado é gerada (simulados oficiais: S06, S08, S09, S10 — ROADMAP_DISCIPLINAS.md).
- **A4** — Timezone inconsistente: `toISOString()` (UTC) em alguns serviços × getters locais em outros; funções de data duplicadas.

Notas de arquitetura do Gate Review: arquitetura 6,5/10, escalabilidade 5,5/10, qualidade 6,0/10. Escalabilidade: Task 008 parcialmente bloqueada, **Task 010 totalmente bloqueada** pelo modelo de persistência.

## Documentos Obrigatórios

- Gate Review da Task 007 (relatório desta conversa, 29/07/2026 — fonte dos achados)
- SYSTEM_ARCHITECTURE.md (§6 camadas, §9 fluxo diário, §12 revisão espaçada)
- DATA_MODEL.md (Plano Diário, Tarefa, Revisão, Progresso)
- ROADMAP_DISCIPLINAS.md (cronograma oficial S01–S11, simulados e milestones)
- FGV_EDITAL_ANALISE.md (12 disciplinas oficiais e IDs `disc_*`)
- CODING_STANDARDS.md
- TECH_STACK.md
- ADR-008 (política de revisão espaçada 24h/7d/30d)

## Arquivos Envolvidos

```
src/services/planner-service.ts         (C1 — cálculo de dia; IDs estáveis; simulados)
src/services/review-queue-service.ts    (C3 — usar completedDate persistida)
src/services/dashboard-service.ts       (C2 — remover mocks; consumir serviço do planner)
src/pages/planner-page.tsx              (C3 — eliminar parsing de ID e data fictícia)
src/pages/dashboard-page.tsx            (C2 — Empty State; mesma fonte do Planner)
src/hooks/use-planner-data.ts           (A2 — fonte única de dados)
src/hooks/use-task-progress.ts          (C3 — novo modelo de persistência + migração)
src/types/planner.ts                    (C3 — novo schema ProgressSnapshot)
src/utils/date.ts                       (NOVO — A4 — utilitário único de datas)
planner/roadmap-s01-s11.json            (A1 — manter UMA origem; renomear campo)
planner/weekly-template.json            (A1 — manter UMA origem)
src/data/planner/                       (A1 — eliminar duplicação)
content/index.json                      (C2 — 12 disciplinas oficiais do Perfil 10)
tests/                                  (atualizar teste que codifica o bug C1; novos testes)
```

## Dependências

- Task 007 — Study Planner (concluída, em Gate Review).
- **Bloqueia:** Task 008 (Discipline Page — depende de IDs oficiais e fonte de dados limpa) e Task 010 (Progress Tracker — depende do novo modelo de persistência).
- Tasks 009 e 011 podem seguir em paralelo após o merge desta.

---

## Escopo P0 — Obrigatório

### 1. Corrigir cálculo do dia da semana

Problema: segunda-feira tratada como domingo; roadmap deslocado um dia.

Correções:

- usar `Date.getDay()` corretamente;
- alinhar roadmap semanal;
- corrigir labels;
- corrigir geração das atividades.

Atualizar todos os testes. Adicionar testes específicos para:

- 27/07/2026 = segunda-feira;
- template semanal correto (seg/qua Português, ter Inglês, qui rotativa, sex revisão, sáb/dom Módulo II);
- geração correta da missão diária.

### 2. Corrigir modelo de persistência

Substituir:

```ts
completedTaskIds: string[]
```

por:

```ts
completedTasks: {
  taskId: string
  completedDate: string
  disciplineId: string
  topicId: string
}[]
```

Eliminar completamente o parsing de IDs. Nenhuma informação pode ser inferida do texto do ID.

### 3. Corrigir algoritmo de revisões

A fila deve utilizar `completedDate` persistida. Nunca utilizar `new Date()` como data fictícia.

Adicionar testes:

- revisão 24h;
- revisão 7 dias;
- revisão 30 dias;
- múltiplas conclusões;
- ordenação.

### 4. Remover fallbacks falsos do Dashboard

Eliminar completamente:

- `mockDailyPlan`;
- `mockReviewQueue`;
- disciplinas fictícias.

Caso não existam dados: mostrar **Empty State**. Nunca apresentar dados inventados.

## Escopo P1

### 5. Fonte única dos JSON

Eliminar duplicação entre `planner/` e `src/data/planner/`. Manter apenas uma origem.

**Decisão registrada:** o JSON atual usa o campo `hasSimulated`; a especificação desta task usa `hasSimulation`. Padronizar como **`hasSimulation`** na origem única (renomear o campo no JSON sobrevivente e atualizar o type correspondente).

### 6. Utilitário único de datas

Criar `src/utils/date.ts` centralizando:

- `toISODate`
- `addDays`
- `diffDays`
- `weekdayLabel`
- `weekdayKey`

Todos os serviços devem utilizá-lo. Eliminar as implementações duplicadas.

### 7. IDs estáveis

Nunca utilizar texto. Formato:

```
task_s{week}_{day}_{slot}
```

### 8. Simulados

Respeitar `hasSimulation` e `milestones` do roadmap. Gerar tarefas de simulado automaticamente (conforme ROADMAP_DISCIPLINAS.md: simulados em S06, S08, S09 e S10; S11 é revisão final).

### 9. Dashboard

Consumir exatamente o mesmo serviço utilizado pelo Planner. Eliminar duplicação de transformação de dados.

## Não implementar

- Progress Tracker (Task 010)
- Disciplinas (Task 008)
- Busca (Task 011)
- Flashcards
- Markdown
- Estatísticas novas
- Analytics

---

## Critérios de Aceite

- [ ] `pnpm build` OK.
- [ ] `pnpm lint` OK (sem warnings).
- [ ] TypeScript strict sem erros.
- [ ] 100% dos testes existentes (97) passando — incluindo o teste corrigido que hoje codifica o bug do weekday.
- [ ] Novos testes passando.
- [ ] 27/07/2026 reconhecido como segunda-feira com Língua Portuguesa (1h30) na missão diária.
- [ ] Nenhum mock exibido ao usuário (sem `mockDailyPlan`, `mockReviewQueue`, disciplinas fictícias ou dados fora das 12 do Perfil 10).
- [ ] Empty State no Dashboard quando não houver dados.
- [ ] Planner e Dashboard compartilhando exatamente a mesma fonte de dados e a mesma transformação.
- [ ] Persistência no novo schema `completedTasks[]` com migração do modelo antigo (`cap.planner.progress` com `completedTaskIds`).
- [ ] Fila de revisões calculada a partir de `completedDate` persistida (24h/7d/30d — ADR-008).
- [ ] Tarefas de simulado geradas nas semanas com `hasSimulation: true` e milestones respeitados.
- [ ] Uma única origem para os JSONs do planner.
- [ ] `src/utils/date.ts` como único utilitário de datas; nenhum `toISOString()`/getter local solto nos serviços.
- [ ] IDs de tarefa no formato `task_s{week}_{day}_{slot}`; nenhuma informação inferida do texto do ID.
- [ ] Nenhuma regressão.

## Checklist de Testes

- [ ] Weekday mapping (27/07/2026 = segunda-feira; template semanal; missão diária).
- [ ] Timezone UTC-3 (datas não viram de dia entre UTC e horário local).
- [ ] Início do cronograma (S01 em 27/07/2026).
- [ ] Final do cronograma (S11 / prova 11/10/2026).
- [ ] Simulado (geração automática nas semanas corretas).
- [ ] Revisão (24h, 7 dias, 30 dias, múltiplas conclusões, ordenação).
- [ ] Persistência (novo schema, leitura/escrita).
- [ ] Migração do modelo antigo (`completedTaskIds` → `completedTasks`, sem perda de dados).
- [ ] Regressão: todos os 97 testes existentes.

## Entregáveis

Relatório de entrega contendo:

1. Arquivos criados.
2. Arquivos alterados.
3. Decisões arquiteturais.
4. Testes adicionados.
5. Impacto arquitetural.
6. Pendências remanescentes.

**Pendências já conhecidas (registrar no relatório, fora do escopo desta task — P2):** `hoursLogged` conta tarefas em vez de horas (`use-task-progress.ts`); memo quebrado e `isLoading` sempre false (`use-planner-data.ts`); `setTimeout` de 600ms simulando loading (`dashboard-page.tsx`); catch silencioso sem log; cores hardcoded fora dos tokens do Design System. Esses itens devem ser reavaliados — alguns serão absorvidos naturalmente pelas correções P0/P1 (persistência e Dashboard) sem expandir escopo.

## Estimativa de Esforço

**10–14 horas** (correção de weekday + testes, migração do modelo de persistência, remoção de mocks + Empty State, unificação de datas e JSONs, geração de simulados, unificação Planner↔Dashboard, migração de dados e testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md; submeter a Gate Review de fechamento nesta conversa antes de liberar a Task 008.
