# Task 010 — Progress Tracker (Controle de Progresso)

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0

---

## Objetivo

Implementar o sistema de acompanhamento de progresso: registro de sessões de estudo, tempo por disciplina/tópico, percentuais de conclusão, sequência de dias (streak) e histórico, com persistência em localStorage.

## Contexto

O Progress Tracker mede desempenho (SYSTEM_ARCHITECTURE.md, Skill 11). Persistência: localStorage para progresso, nunca conteúdo (TECH_STACK.md §14). Gamificação apenas utilitária: sequência de estudos, dias consecutivos, percentual concluído, metas (UI_UX_GUIDELINES.md). A sessão de estudo tem cronômetro, objetivo, tempo restante, pausa e registro automático ao finalizar. Dados do usuário jamais vão para o deploy (DEPLOYMENT.md).

## Documentos Obrigatórios

- SYSTEM_ARCHITECTURE.md (§11 — Progress Tracker)
- DATA_MODEL.md (Progresso, Histórico, Estatísticas, Revisão)
- UI_UX_GUIDELINES.md (sessão de estudo, gamificação)
- TECH_STACK.md (§14 — localStorage)
- COMPONENT_LIBRARY.md (Progress Card, Study Streak, Study Metrics)
- ROADMAP_DISCIPLINAS.md (indicadores oficiais: horas, questões, acertos, revisões)

## Arquivos Envolvidos

```
src/pages/progress-page.tsx
src/components/learning/progress-card.tsx
src/components/learning/study-streak.tsx
src/components/learning/study-metrics.tsx
src/components/learning/study-session.tsx       (cronômetro + registro)
src/components/learning/goal-tracker.tsx
src/services/progress-service.ts                (leitura/escrita localStorage)
src/services/session-service.ts                 (registro de sessões)
src/hooks/use-study-timer.ts
src/types/progress.ts
```

## Dependências

- Task 005 — Dashboard (exibe métricas).
- Task 007 — Study Planner (sessões vinculadas a tarefas).
- Bloqueia: 015 (polimento final).

## Critérios de Aceite

- [ ] Sessão de estudo com cronômetro, objetivo, pausa e registro automático.
- [ ] Registro de tempo por disciplina e tópico (modelo Progresso do DATA_MODEL).
- [ ] Percentual de conclusão por disciplina e do edital total (12 disciplinas).
- [ ] Streak de dias consecutivos e meta semanal (13h30 — ROADMAP_DISCIPLINAS.md).
- [ ] Histórico de atividades (data, atividade, tempo, resultado).
- [ ] Persistência 100% local (localStorage), com versionamento de schema e migração segura.
- [ ] Nenhum dado do usuário incluído em build/deploy.
- [ ] Página de Progresso com métricas, gráficos (Recharts) e indicadores oficiais.
- [ ] Feedback visual em todo registro (sessão salva, meta atingida).

## Checklist de Testes

- [ ] Teste unitário do `progress-service` (cálculos de percentual e streak — cobertura ≥ 90%, módulo crítico).
- [ ] Teste unitário do `session-service` (registro e recuperação de sessões).
- [ ] Teste do hook `use-study-timer` (iniciar, pausar, finalizar).
- [ ] Teste de migração de schema do localStorage.
- [ ] Teste de integração: sessão registrada reflete no Dashboard.
- [ ] Verificação de privacidade: nenhum dado de usuário em artefatos de build.

## Entregáveis

1. Sistema de sessão de estudo com cronômetro.
2. Serviços de progresso e sessão (persistência local tipada).
3. Página de Progresso com métricas e gráficos.
4. Indicadores oficiais do ROADMAP_DISCIPLINAS.md implementados.
5. Testes (≥ 90% nos serviços críticos).

## Estimativa de Esforço

**14 horas** (serviços de persistência, cronômetro, página de progresso, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md (critério "Controle de progresso" do M2).
