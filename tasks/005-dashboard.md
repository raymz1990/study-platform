# Task 005 — Dashboard

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0 (tela principal)

---

## Objetivo

Construir o Dashboard — tela principal da plataforma ("cockpit de estudos") — com plano do dia, revisões pendentes, contagem regressiva para a prova, progresso do edital, horas estudadas/restantes, taxa de acertos e gráficos de evolução.

## Contexto

O Dashboard deve responder imediatamente (UI_UX_GUIDELINES.md): quanto falta até a prova (11/10/2026), quantas horas ainda preciso estudar, qual disciplina estudar agora, quais revisões estão vencidas, qual o percentual do edital, qual a taxa de acertos. Hierarquia visual: plano do dia → revisões → cronograma → progresso → estatísticas → complementar. O Dashboard usa apenas leitura dos modelos — nunca lógica própria (DATA_MODEL.md). Dados do cronograma: ROADMAP_DISCIPLINAS.md v2.0 (S01–S11, 13h30/semana).

## Documentos Obrigatórios

- UI_UX_GUIDELINES.md (dashboard, hierarquia visual, cores)
- SYSTEM_ARCHITECTURE.md (§13 — dashboard)
- DATA_MODEL.md (Estatísticas, Plano Diário, Progresso)
- COMPONENT_LIBRARY.md (KPI Card, Progress Chart, Calendar, Statistics Panel)
- ROADMAP_DISCIPLINAS.md (cronograma oficial, parâmetros)
- TECH_STACK.md (§9 — Recharts)

## Arquivos Envolvidos

```
src/pages/dashboard-page.tsx
src/components/dashboard/kpi-card.tsx
src/components/dashboard/exam-countdown.tsx
src/components/dashboard/daily-plan-card.tsx
src/components/dashboard/review-queue-card.tsx
src/components/dashboard/progress-chart.tsx      (Recharts)
src/components/dashboard/discipline-progress-list.tsx
src/components/dashboard/study-streak.tsx
src/services/dashboard-service.ts                (somente leitura dos modelos)
src/services/statistics-service.ts
src/types/dashboard.ts
config/exam.json                                 (data da prova: 2026-10-11)
```

## Dependências

- Task 003 — Layout Shell.
- Task 004 — Navegação.
- Dados: estruturas de DATA_MODEL.md (mock inicial em JSON até Tasks 007/010).

## Critérios de Aceite

- [ ] Contagem regressiva para 11/10/2026 exibida em destaque.
- [ ] Plano do dia visível no topo (disciplina do momento, tarefas, tempo previsto).
- [ ] Revisões pendentes/vencidas destacadas (vermelho = urgente).
- [ ] Percentual do edital e progresso por disciplina (12 disciplinas do FGV_EDITAL_ANALISE.md).
- [ ] Horas estudadas vs. horas restantes (referência: 13h30/semana).
- [ ] Taxa de acertos e gráfico de evolução temporal (Recharts).
- [ ] Carregamento < 2 segundos; transições instantâneas.
- [ ] Estados: loading (skeleton), erro, vazio (primeiro acesso), sucesso.
- [ ] Cores apenas semânticas; dark mode completo.

## Checklist de Testes

- [ ] Teste unitário do `statistics-service` (cálculos de percentual, taxa de acerto).
- [ ] Teste do countdown (data correta até 11/10/2026).
- [ ] Teste de renderização com dados mockados (todos os estados).
- [ ] Teste de regressão visual dos gráficos nos dois temas.
- [ ] Verificação de performance (first load < 2s).
- [ ] Acessibilidade: gráficos com descrição textual alternativa.

## Entregáveis

1. Página Dashboard completa.
2. Componentes de KPI, countdown, plano diário, fila de revisões e gráficos.
3. Serviços de leitura de estatísticas e progresso (tipados, sem lógica de negócio no componente).
4. Dados mockados iniciais em JSON conforme DATA_MODEL.md.
5. Testes.

## Estimativa de Esforço

**16 horas** (página, componentes, gráficos, serviços, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md e MILESTONES.md (critério "Dashboard" do M2).
