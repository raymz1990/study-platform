# Task 007 — Study Planner & Review Engine

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável  
**Status:** Planejada | **Prioridade:** P0 (bloqueante)

---

# Objetivo

Implementar a Camada 2 da arquitetura da plataforma: o **Study Planner**, responsável por transformar o cronograma oficial em um plano diário de estudos, gerar automaticamente a fila de revisões espaçadas, persistir o progresso do usuário e fornecer esses dados ao Dashboard.

O Planner **decide o que estudar**, mas **nunca produz conteúdo**.

---

# Contexto

Esta task implementa a Camada 2 descrita em `SYSTEM_ARCHITECTURE.md`.

Fluxo oficial:

```
ROADMAP_DISCIPLINAS.md
        ↓
roadmap-s01-s11.json
        ↓
planner-service
        ↓
Daily Plan
        ↓
Review Queue
        ↓
Dashboard
```

O Planner possui responsabilidade exclusiva sobre:

- cronograma oficial;
- cálculo da semana atual;
- geração do plano diário;
- geração da fila de revisões;
- persistência do progresso.

O Dashboard é apenas consumidor dessas informações.

Toda a lógica deve ser determinística.

Nenhum componente React implementa regras de negócio.

---

# Documentos Obrigatórios

- ROADMAP_DISCIPLINAS.md
- FGV_EDITAL_ANALISE.md
- SYSTEM_ARCHITECTURE.md
- DATA_MODEL.md
- UI_UX_GUIDELINES.md
- COMPONENT_LIBRARY.md
- CODING_STANDARDS.md
- TECH_STACK.md

---

# Arquivos Envolvidos

```
src/pages/planner-page.tsx

src/components/planner/
    study-planner.tsx
    daily-mission.tsx
    weekly-plan.tsx
    planner-calendar.tsx
    task-item.tsx

src/hooks/
    use-planner-data.ts
    use-task-progress.ts

src/services/
    planner-service.ts
    review-queue-service.ts

src/utils/
    date.ts

src/types/
    planner.ts

src/data/planner/
    roadmap-s01-s11.json
    weekly-template.json
```

---

# Dependências

- Task 004 — Navegação
- Task 005 — Dashboard

Bloqueia:

- Task 008
- Task 010

---

# Responsabilidades

## Planner

Responsável por:

- carregar roadmap;
- identificar semana atual;
- identificar dia atual;
- gerar plano diário;
- gerar plano semanal;
- gerar calendário mensal;
- gerar fila de revisões;
- persistir progresso.

Não pode:

- renderizar markdown;
- conhecer disciplinas detalhadas;
- carregar conteúdo;
- gerar apostilas.

---

# Fonte Única da Verdade

Existe apenas uma fonte para o cronograma.

```
src/data/planner/
```

É proibido manter cópias em outros diretórios.

Todos os serviços devem consumir exatamente esses arquivos.

---

# Estrutura dos Dados

## Weekly Template

Define:

- disciplina
- duração
- tipo
- prioridade

Nunca datas.

---

## Roadmap

Define:

- semanas S01–S11
- datas
- módulo ativo
- objetivos
- hasSimulation

---

## Daily Plan

Contém:

- data
- semana
- tarefas
- tempo total
- revisões previstas

---

## Review Queue

Contém:

- tarefa
- disciplina
- tópico
- tipo da revisão
- data prevista
- prioridade

---

# Modelo de Persistência

Persistência obrigatória em localStorage.

Chave oficial:

```
cap.planner.progress
```

Schema obrigatório:

```ts
interface ProgressSnapshot {

    completedTasks: CompletedTaskRecord[]

    hoursLogged: Record<string, number>

    lastUpdated: string

}
```

Cada tarefa concluída deve armazenar:

```ts
interface CompletedTaskRecord {

    taskId: string

    completedDate: string

    disciplineId: string

    topicId: string

}
```

É proibido reconstruir essas informações a partir do ID da tarefa.

---

# IDs

Todas as tarefas devem possuir IDs estruturais estáveis.

Formato obrigatório:

```
task_s{week}_{weekday}_{slot}
```

Exemplo:

```
task_s01_1_0
task_s01_1_1
task_s04_5_2
```

É proibido gerar IDs utilizando:

- texto
- slug
- nome da disciplina
- nome do tópico

---

# Semana Atual

A semana deve ser calculada utilizando:

- data inicial da semana
- data final da semana

Nunca pelo índice do loop.

A identificação do dia da semana deve utilizar:

```
date.getDay()
```

Nunca:

```
índice do array
```

---

# Datas

Todos os cálculos devem utilizar exclusivamente:

```
utils/date.ts
```

Funções obrigatórias:

- toISODate()
- addDays()
- diffDays()

É proibido utilizar diretamente:

```
toISOString()
```

para cálculos de dias.

---

# Plano Diário

O Planner gera automaticamente:

- disciplina
- tarefas
- revisões
- tempo previsto

Tipos permitidos:

- Study
- Review
- Questions
- Flashcards
- Podcast
- Reading
- Simulation

---

# Simulados

O roadmap define:

```
hasSimulation
```

Sempre que verdadeiro:

o Planner deve gerar automaticamente uma tarefa do tipo:

```
Simulation
```

---

# Review Queue

A fila de revisões segue a política oficial.

Após conclusão:

```
24 horas

↓

7 dias

↓

30 dias
```

A Review Queue recebe objetos do tipo:

```
CompletedTask
```

Nunca deve reconstruir:

- disciplina
- tópico
- datas

a partir do taskId.

---

# Dashboard

O Dashboard nunca gera informações.

Sempre consome:

- planner-service
- review-queue-service

É proibido:

- recalcular plano diário
- recalcular revisões
- gerar dados próprios

---

# Estados da Interface

Obrigatórios:

- Loading
- Success
- Error
- Empty

Na ausência de dados reais:

mostrar Empty State.

Nunca utilizar mocks visíveis ao usuário.

---

# Critérios de Aceite

- [ ] Visualização Hoje funcional.
- [ ] Visualização Semana funcional.
- [ ] Visualização Mês funcional.
- [ ] Cronograma carregado exclusivamente de `src/data/planner`.
- [ ] Plano diário gerado automaticamente.
- [ ] Semana atual identificada corretamente.
- [ ] Segunda-feira utiliza o template de segunda-feira.
- [ ] Sexta-feira utiliza revisão.
- [ ] Sábado e domingo utilizam Módulo II.
- [ ] Simulados gerados automaticamente quando `hasSimulation = true`.
- [ ] Revisões calculadas em 24h → 7d → 30d.
- [ ] Dashboard consome exclusivamente o Planner.
- [ ] Progresso persistido em `cap.planner.progress`.
- [ ] IDs seguem o padrão `task_s{week}_{weekday}_{slot}`.
- [ ] Datas calculadas utilizando `utils/date.ts`.
- [ ] Nenhum cálculo utilizando `toISOString()`.
- [ ] Nenhum mock exibido ao usuário.
- [ ] Dark Mode completo.
- [ ] Estados Loading, Error e Empty implementados.
- [ ] Componentes acessíveis por teclado.

---

# Checklist de Testes

## Planner

- [ ] geração correta da semana atual.
- [ ] geração correta do plano diário.
- [ ] segunda-feira gera Português.
- [ ] terça-feira gera Inglês.
- [ ] quinta-feira gera disciplina rotativa.
- [ ] sexta-feira gera Revisão.
- [ ] sábado gera Módulo II.
- [ ] domingo gera Módulo II.

---

## Review Queue

- [ ] revisão 24h.
- [ ] revisão 7 dias.
- [ ] revisão 30 dias.
- [ ] ordenação por prioridade.
- [ ] ordenação por data.

---

## Persistência

- [ ] saveProgress().
- [ ] loadProgress().
- [ ] migração v1 → v2.
- [ ] snapshot vazio.
- [ ] storage corrompido.
- [ ] toggle adiciona completedDate.
- [ ] toggle remove tarefa.

---

## Integração

- [ ] Planner → Dashboard.
- [ ] Dashboard utiliza somente planner-service.
- [ ] atualização imediata após concluir tarefa.
- [ ] sincronização entre Planner e Dashboard.

---

## Datas

- [ ] timezone UTC-3.
- [ ] mudança de mês.
- [ ] mudança de semana.
- [ ] início do roadmap.
- [ ] fim do roadmap.

---

## Interface

- [ ] teclado.
- [ ] responsividade.
- [ ] dark mode.
- [ ] estados Loading.
- [ ] estados Empty.
- [ ] estados Error.

---

# Entregáveis

1. Página de Cronograma.
2. Planner Service.
3. Review Queue Service.
4. Hook de progresso.
5. Hook de dados do Planner.
6. JSON oficial do cronograma.
7. JSON oficial do template semanal.
8. Persistência do progresso.
9. Integração completa com o Dashboard.
10. Testes unitários e de integração.

---

# Estimativa de Esforço

**22 horas**

Inclui:

- Planner
- Review Engine
- Persistência
- Integração Dashboard
- Calendário
- Testes
- Validação

---

# Definition of Done

## Código

- [ ] TypeScript strict.
- [ ] Nenhum `any`.
- [ ] ESLint sem erros.
- [ ] Prettier aplicado.
- [ ] Build sem erros.

## Testes

- [ ] Todos os testes passando.
- [ ] Cobertura dos serviços críticos ≥ 90%.

## Funcional

- [ ] Planner totalmente funcional.
- [ ] Dashboard consumindo Planner.
- [ ] Revisões corretas.
- [ ] Persistência correta.
- [ ] Nenhum mock em produção.

## Documentação

Ao concluir:

- atualizar `CHANGELOG.md`;
- atualizar `MILESTONES.md`;
- registrar qualquer alteração estrutural no `DATA_MODEL.md` caso o schema do Planner evolua.
