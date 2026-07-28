# Task 007 — Study Planner (Cronograma)

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0

---

## Objetivo

Implementar a página de Cronograma com visualizações Hoje/Semana/Mês, baseada no plano oficial de 11 semanas (ROADMAP_DISCIPLINAS.md), incluindo plano diário, tarefas e fila de revisões.

## Contexto

O cronograma oficial é definido em ROADMAP_DISCIPLINAS.md v2.0: padrão semanal fixo (seg/qua Português, ter Inglês, qui rotativa, sex revisão, fins de semana Módulo II), semanas S01–S11, prova em 11/10/2026. O Planner pertence à Camada 2 — decide, nunca gera conteúdo (SYSTEM_ARCHITECTURE.md §6). Modelos: Plano Diário, Tarefa, Revisão (DATA_MODEL.md). Mostrar apenas informações úteis (UI_UX_GUIDELINES.md).

## Documentos Obrigatórios

- ROADMAP_DISCIPLINAS.md (cronograma oficial S01–S11 — fonte única)
- SYSTEM_ARCHITECTURE.md (§6, §9, §12 — camadas, fluxo diário, revisão espaçada)
- DATA_MODEL.md (Plano Diário, Tarefa, Revisão, Disciplina)
- UI_UX_GUIDELINES.md (cronograma)
- COMPONENT_LIBRARY.md (Study Planner, Weekly Plan, Calendar)
- FGV_EDITAL_ANALISE.md (disciplinas e prioridades)

## Arquivos Envolvidos

```
src/pages/planner-page.tsx
src/components/planner/study-planner.tsx
src/components/planner/weekly-plan.tsx
src/components/planner/daily-mission.tsx
src/components/planner/planner-calendar.tsx
src/components/planner/task-item.tsx
src/services/planner-service.ts        (geração do plano a partir do roadmap)
src/services/review-queue-service.ts   (fila de revisões espaçadas)
src/types/planner.ts
planner/roadmap-s01-s11.json           (cronograma oficial em JSON — DATA_MODEL)
planner/weekly-template.json           (padrão semanal fixo)
```

## Dependências

- Task 005 — Dashboard (compartilha plano diário e revisões).
- Task 004 — Navegação.
- Bloqueia: 010 (progresso consome tarefas do planner).

## Critérios de Aceite

- [ ] Visualizações Hoje, Semana e Mês funcionais.
- [ ] Cronograma oficial S01–S11 carregado de JSON (fonte única, regenerável — conteúdo determinístico).
- [ ] Plano diário com tarefas tipadas (Estudo, Questões, Flashcards, Podcast, Revisão, Simulado, Leitura).
- [ ] Fila de revisões com datas previstas (política 24h/7d/30d + adaptação ADR-008).
- [ ] Semana atual destacada; prova 11/10/2026 marcada.
- [ ] Tarefas marcáveis como concluídas, com persistência (localStorage).
- [ ] Dependências de disciplinas respeitadas na ordenação (mapa do FGV_EDITAL_ANALISE.md).
- [ ] Estados: loading, erro, vazio, sucesso.

## Checklist de Testes

- [ ] Teste unitário do `planner-service` (geração de plano diário a partir do template semanal).
- [ ] Teste unitário do `review-queue-service` (cálculo de próximas revisões — módulo crítico, cobertura ≥ 90%).
- [ ] Teste de integração Planner → Dashboard (plano do dia consistente nas duas telas).
- [ ] Teste de persistência de tarefas concluídas.
- [ ] Teste de regressão: semana corrente calculada corretamente a partir da data atual.
- [ ] Verificação de acessibilidade e teclado no calendário.

## Entregáveis

1. Página de Cronograma com 3 visualizações.
2. Serviços de planner e fila de revisões (testados, ≥ 90% de cobertura).
3. Cronograma oficial S01–S11 em JSON.
4. Integração do plano diário com o Dashboard.
5. Testes.

## Estimativa de Esforço

**20 horas** (regras de negócio do planner, revisão espaçada, calendário, integração, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md (critério "Cronograma" do M2).
