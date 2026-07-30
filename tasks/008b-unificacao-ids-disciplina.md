# Task 008b — Unificação de IDs de Disciplina + Correções do Gate 008

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0 — bloqueante (Gate Review 008: veredicto B)

---

## Objetivo

Unificar o namespace de IDs de disciplina/tópico entre Planner, persistência e índice oficial, e corrigir os médios do Gate Review da Task 008. Nenhuma funcionalidade nova. Ao final, a base estará liberada para as Tasks 009 e 010.

## Contexto

O Gate Review da Task 008 (29/07/2026) validou build, lint, 125/125 testes, a fonte única `content/index.json` e as páginas de disciplina. Porém identificou:

- **A1 — Dois namespaces de ID na mesma coleção persistida.** O planner grava `disciplineId = slugify(nome)` (ex.: `lingua-portuguesa`); o índice oficial e o checklist usam `disc_portugues` / `chap_morfologia`. Consequência: `calculateDisciplineProgress` (`discipline-service.ts:71-73`) filtra por ID oficial, então **tarefas concluídas no Planner nunca contam progresso** de disciplina (listagem e detalhe ficam em 0%/não iniciada). O mesmo vale para `topicId` (slug de tópico × `chap_*`). Não há teste cobrindo o caminho real (toggle no Planner → progresso da disciplina).
- **M1 — Dashboard diverge:** `mapDisciplineToProgress` (`dashboard-service.ts:38-50`) fixa zeros em vez de consumir `getDisciplinesWithProgress()`.
- **M2 — Violação da regra de datas:** `disciplina-detalhe-page.tsx:138` usa `new Date().toISOString().split('T')[0]` (UTC) em vez de `toISODate()`.
- **M3 — taskId instável no checklist:** `checklist_${chapterId}_${Date.now()}` viola o princípio de IDs estáveis.
- **M5 — `studiedHours` com heurística plana de 1,5h/tarefa** (`discipline-service.ts:76`).

**Decisão arquitetural registrada (Gate 008):** a fonte da verdade para IDs é `content/index.json`. O planner deve **resolver** nome → ID oficial via discipline-service, nunca o inverso, e nunca gravar slugs como IDs de disciplina/tópico quando houver correspondência oficial. Registros legados com slugs em `cap.planner.progress` são descartáveis (fase de desenvolvimento, sem dados reais de usuário) — documentar no relatório; não é necessária migração v2.1 → v2.2.

## Documentos Obrigatórios

- Gate Review da Task 008 (relatório desta conversa, 29/07/2026)
- DATA_MODEL.md (Disciplina, Tarefa, Progresso)
- SYSTEM_ARCHITECTURE.md (§6 — camadas)
- CODING_STANDARDS.md
- FGV_EDITAL_ANALISE.md (IDs oficiais)

## Arquivos Envolvidos

```
src/services/discipline-service.ts        (A1 — resolver nome → ID oficial; M5 — horas reais)
src/services/planner-service.ts           (A1 — gravar IDs oficiais nas atividades)
src/services/dashboard-service.ts         (M1 — consumir getDisciplinesWithProgress)
src/pages/disciplina-detalhe-page.tsx     (M2 — toISODate; M3 — taskId estável)
src/services/discipline-service.test.ts   (A1 — teste de integração Planner → progresso)
src/services/planner-service.test.ts      (A1 — IDs oficiais nas atividades geradas)
docs/roadmap/CHANGELOG.md                 (entrada da correção)
```

## Dependências

- Task 008 — concluída (em Gate Review de fechamento).
- **Bloqueia:** Task 009 (páginas de capítulo gravarão progresso) e Task 010 (Progress Tracker).

---

## Escopo

### P0 — Bloqueante

**1. A1 — Unificar IDs de disciplina e tópico.**

a. Em `discipline-service.ts`, exportar resolvedor único:

```ts
export function getDisciplineIdByName(name: string): string | undefined
export function getChapterIdByTitle(disciplineId: string, topicTitle: string): string | undefined
```

- `getDisciplineIdByName`: busca por nome exato normalizado (case/acentos) em `content/index.json`; retorna o `disc_*` oficial ou `undefined`.
- `getChapterIdByTitle`: dado o ID oficial da disciplina e o título do tópico, retorna o `chap_*` correspondente ou `undefined`.

b. Em `planner-service.ts` (`generateActivitiesForDay`):

- `disciplineId`: usar `getDisciplineIdByName(discipline)`; fallback para slug **apenas** para disciplinas fora do índice (ex.: "Revisão", "Simulado" — que já usam IDs fixos `review`/`simulation`).
- `topicId`: usar `getChapterIdByTitle(disciplineId, topic)` quando houver correspondência; fallback para slug.
- `disciplineName`/`topicName`: continuar gravando nomes legíveis (schema v2.1).

c. Teste de integração obrigatório (o cenário ausente):

- gerar plano (`loadStudyPlan`), pegar uma atividade real de Língua Portuguesa, simular conclusão via `toggleTask`/registro equivalente, e verificar que `getDisciplineWithProgress('disc_portugues')` reflete percentCompleted > 0 e status `in_progress`.

d. Verificar que a fila de revisões continua exibindo nomes legíveis após a mudança (regressão de M2 da 007c).

### P1 — Médios (mesma rodada)

**2. M1 — Dashboard sem divergência.**

`dashboard-service.ts`: substituir `mapDisciplineToProgress` (zeros fixos) por consumo de `getDisciplinesWithProgress()`, mapeando para `DisciplineProgress` sem recalcular. A lista de disciplinas do Dashboard deve refletir o mesmo progresso da página de listagem.

**3. M2 — Regra de datas.**

`disciplina-detalhe-page.tsx:138`: trocar `new Date().toISOString().split('T')[0]` por `toISODate(new Date())` de `@/utils/date`.

**4. M3 — taskId estável no checklist.**

`checklist_${chapterId}_${Date.now()}` → `checklist_${chapterId}`. O dedupe via `alreadyCompleted` já existe; garantir que desmarcar remove exatamente esse ID.

**5. M5 — Horas estudadas reais.**

`calculateDisciplineProgress`: usar a duração real da atividade quando disponível. Como o registro persistido não tem duração, opções (escolher e registrar no relatório):

- adicionar `durationMinutes` ao `CompletedTaskRecord` (schema v2.2) gravado no toggle; somar `durationMinutes/60`; registros antigos sem duração contam 0 (não inventar), ou
- resolver duração via `loadStudyPlan()` pelo `taskId`.

Nunca usar estimativa plana como dado real. Se a opção escolhida deixar horas = 0 para o checklist, documentar (checklist não mede tempo — aceitável).

## Não implementar

- Carregamento de `00-roadmap.md` (virou requisito formal da Task 009 — M4).
- Tasks 009, 010, 011 ou qualquer funcionalidade nova.
- Migração de registros legados com slugs (desenvolvimento, sem dados reais).
- Remover setTimeout fake de 300ms/600ms, cores hardcoded fora dos tokens, `useMemo` quebrado (P2 já registrados).

---

## Critérios de Aceite

- [ ] `pnpm build` OK, `pnpm lint` OK (`--max-warnings 0`), TypeScript strict.
- [ ] 125 testes existentes passando + novos testes passando.
- [ ] Atividades do planner gravam `disc_*`/`chap_*` oficiais quando há correspondência no índice.
- [ ] Teste de integração: concluir atividade do Planner move o progresso da disciplina (listagem e detalhe).
- [ ] Dashboard consome `getDisciplinesWithProgress()` — progresso idêntico ao da listagem.
- [ ] Nenhum `toISOString()` fora de `src/utils/date.ts`.
- [ ] taskId do checklist estável (`checklist_${chapterId}`).
- [ ] `studiedHours` derivado de duração real ou 0 — nunca estimativa plana.
- [ ] Fila de revisões continua com nomes legíveis.
- [ ] Nenhuma regressão.

## Checklist de Testes

- [ ] `getDisciplineIdByName` (match exato, normalização de acentos/case, undefined para desconhecido).
- [ ] `getChapterIdByTitle` (match, fallback undefined).
- [ ] Planner gera atividade com `disc_portugues` para Língua Portuguesa.
- [ ] Integração: toggle de atividade do planner → `getDisciplineWithProgress` reflete progresso.
- [ ] Fallback: "Revisão"/"Simulado" mantêm IDs fixos.
- [ ] Dashboard: disciplinas com progresso > 0 aparecem corretamente.
- [ ] Checklist: marcar/desmarcar com ID estável (sem duplicados).
- [ ] Regressão: suíte completa (125 testes).

## Entregáveis

Relatório contendo: arquivos criados/alterados, decisões arquiteturais (incl. opção escolhida para M5 e tratamento de registros legados), testes adicionados, impacto arquitetural, pendências remanescentes.

## Estimativa de Esforço

**2–3 horas.**

---

## Documentação

Ao concluir: atualizar CHANGELOG.md; submeter à re-verificação simplificada nesta conversa para liberação da Task 009.
