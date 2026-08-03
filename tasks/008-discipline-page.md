# Task 008 — Discipline Module

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável  
**Status:** Planejada | **Prioridade:** P0

---

# Objetivo

Implementar o módulo completo de Disciplinas da plataforma, composto por:

- página de listagem das disciplinas;
- página de detalhe da disciplina;
- cálculo de progresso;
- integração com o Planner;
- integração com o Dashboard;
- carregamento da estrutura oficial de conteúdo.

A página de disciplina representa a entrada principal para todo o conteúdo produzido nas Tasks seguintes.

Não produz conteúdo.

Apenas organiza, apresenta e acompanha a evolução do estudo.

---

# Contexto

Cada disciplina do concurso possui:

- identificação oficial;
- prioridade;
- peso;
- horas estimadas;
- módulos;
- capítulos;
- roadmap;
- materiais.

Todas essas informações são definidas pelo edital analisado e organizadas em `content/index.json`.

O módulo de disciplinas é responsável por apresentar essas informações e acompanhar o progresso do usuário.

Todo o progresso é derivado do Planner.

Nunca existe lógica paralela.

---

# Documentos Obrigatórios

- SYSTEM_ARCHITECTURE.md
- DATA_MODEL.md
- CONTENT_STRUCTURE.md
- CONTENT_STANDARDS.md
- FGV_EDITAL_ANALISE.md
- ROADMAP_DISCIPLINAS.md
- UI_UX_GUIDELINES.md
- COMPONENT_LIBRARY.md
- CODING_STANDARDS.md
- TECH_STACK.md

---

# Arquivos Envolvidos

```
src/pages/

    disciplines-page.tsx
    discipline-detail-page.tsx

src/components/learning/

    discipline-card.tsx
    learning-path.tsx
    topic-card.tsx
    subject-checklist.tsx

src/services/

    discipline-service.ts

src/types/

    discipline.ts

content/

    index.json

    disciplinas/
```

---

# Dependências

Task 004 — Navegação

Task 006 — Markdown Viewer

Task 007 — Study Planner & Review Engine

Bloqueia:

- Task 009
- Task 010

---

# Responsabilidades

O módulo de disciplinas é responsável por:

- listar disciplinas;
- apresentar progresso;
- organizar capítulos;
- organizar módulos;
- apresentar roadmap;
- disponibilizar acesso ao conteúdo;
- disponibilizar acesso ao checklist;
- disponibilizar estatísticas.

Não pode:

- gerar plano de estudos;
- gerar revisões;
- calcular semana;
- controlar calendário.

Essas responsabilidades pertencem ao Planner.

---

# Fonte Única da Verdade

Todas as disciplinas devem ser carregadas exclusivamente de:

```
content/index.json
```

É proibido manter listas paralelas.

É proibido manter arrays fixos.

É proibido duplicar dados em componentes.

---

# IDs Oficiais

Todo o projeto utiliza exclusivamente os IDs definidos em:

```
content/index.json
```

Formato obrigatório:

```
disc_portugues

disc_ingles

disc_contabilidade

disc_administracao_financeira
```

Capítulos:

```
chap_introducao

chap_morfologia

chap_fluxo_caixa
```

Nunca utilizar:

- slug
- texto
- nome da disciplina

como identificador oficial.

---

# Estrutura Hierárquica

A hierarquia oficial é:

```
Concurso

↓

Perfil

↓

Disciplina

↓

Módulo

↓

Capítulo

↓

Objeto de Estudo
```

Nunca inverter essa estrutura.

---

# Discipline Service

O Discipline Service é o único responsável por:

- carregar disciplinas;
- localizar disciplina;
- calcular progresso;
- resolver IDs;
- organizar capítulos;
- calcular horas estudadas;
- calcular horas restantes.

Os componentes React nunca implementam essas regras.

---

# Resolvedores Oficiais

Devem existir resolvedores únicos para IDs.

Obrigatórios:

```ts
getDisciplineById()

getDisciplineIdByName()

getChapterById()

getChapterIdByTitle()

getDisciplines()

getDisciplinesWithProgress()
```

Todos os módulos da aplicação devem utilizar essas funções.

---

# Integração com o Planner

O progresso da disciplina deriva exclusivamente do Planner.

Fluxo:

```
Planner

↓

CompletedTask

↓

Discipline Service

↓

Discipline Progress
```

Nunca existe persistência própria da disciplina.

---

# Integração com o Dashboard

O Dashboard nunca calcula progresso.

Sempre consome:

```
getDisciplinesWithProgress()
```

É proibido manter:

- mapDisciplineToProgress()
- arrays paralelos
- mocks

---

# Cálculo de Progresso

O progresso é calculado utilizando:

- tarefas concluídas;
- capítulos concluídos;
- duração real.

Nunca utilizar:

- porcentagens fixas;
- pesos arbitrários;
- estimativas lineares.

---

# Horas Estudadas

Horas estudadas devem ser derivadas de:

- duração real das atividades concluídas

Nunca utilizar:

```
1 tarefa = 1,5 horas
```

Caso a duração não exista:

```
0 horas
```

Nunca inventar valores.

---

# Roadmap

Cada disciplina possui um roadmap.

Arquivo obrigatório:

```
00-roadmap.md
```

Esse documento é renderizado exclusivamente pelo Markdown Viewer.

O Discipline Module apenas solicita seu carregamento.

Nunca interpreta Markdown.

---

# Estrutura de Conteúdo

Cada disciplina deve seguir obrigatoriamente:

```
disciplina/

    00-roadmap.md

    modulo-01/

    modulo-02/

    modulo-03/
```

Capítulos pertencem aos módulos.

Nunca diretamente à disciplina.

---

# Página de Listagem

Cada card deve apresentar:

- nome
- prioridade
- progresso
- horas estudadas
- horas restantes
- percentual
- status

Os cards seguem a ordem oficial do edital.

Nunca ordem alfabética.

---

# Página de Detalhe

A página deve apresentar:

- descrição
- progresso
- roadmap
- módulos
- capítulos
- checklist
- questões
- flashcards
- podcasts
- estatísticas

Caso algum conteúdo ainda não exista:

mostrar Empty State.

Nunca utilizar mocks.

---

# Checklist

Cada capítulo possui um checklist.

IDs obrigatórios:

```
checklist_{chapterId}
```

Nunca utilizar:

```
Date.now()

timestamp

random
```

Os IDs precisam ser determinísticos.

---

# Estados

Toda página deve implementar:

- Loading
- Success
- Error
- Empty

É proibido apresentar informações fictícias.

---

# Datas

Todo cálculo de data utiliza exclusivamente:

```
utils/date.ts
```

É proibido utilizar diretamente:

```
toISOString()
```

para cálculos da aplicação.

---

# Acessibilidade

Obrigatório:

- navegação por teclado;
- foco visível;
- landmarks;
- breadcrumbs;
- ordem lógica de tabulação.

## Critérios de Aceite

### Funcionalidades

- [ ] Listagem contendo exatamente as 12 disciplinas do Perfil 10.
- [ ] Ordenação seguindo `ROADMAP_DISCIPLINAS.md`.
- [ ] Cards exibem:
  - nome;
  - prioridade;
  - progresso;
  - horas estimadas;
  - horas estudadas;
  - status.
- [ ] Página de detalhe contendo:
  - descrição;
  - roadmap;
  - módulos;
  - capítulos;
  - progresso;
  - checklist;
  - estatísticas;
  - questões;
  - flashcards;
  - resumo;
  - podcast.
- [ ] Roadmap carregado através do Markdown Viewer.
- [ ] Capítulos organizados por módulos.
- [ ] Checklist sincronizado com o Progress Tracker.
- [ ] Breadcrumb:
  Dashboard → Disciplinas → Disciplina.

### Arquitetura

- [ ] `content/index.json` é a única fonte das disciplinas.
- [ ] IDs oficiais (`disc_*`, `mod_*`, `chap_*`) utilizados em toda a aplicação.
- [ ] Nenhum slug utilizado como identificador persistente.
- [ ] Página não contém lógica de negócio.
- [ ] Toda leitura realizada através de `discipline-service.ts`.

### Interface

- [ ] Loading.
- [ ] Empty State.
- [ ] Error State.
- [ ] Dark Mode.
- [ ] Responsividade Desktop / Tablet / Mobile.

### Qualidade

- [ ] `pnpm lint`
- [ ] `pnpm build`
- [ ] TypeScript strict.
- [ ] Nenhum `any`.
- [ ] Componentes ≤300 linhas.

---

## Checklist de Testes

### discipline-service

- [ ] carregar índice.
- [ ] buscar disciplina por ID.
- [ ] resolver IDs oficiais.
- [ ] calcular progresso.
- [ ] horas estudadas.

### Página

- [ ] renderização das 12 disciplinas.
- [ ] ordenação correta.
- [ ] navegação listagem → detalhe.
- [ ] breadcrumb.
- [ ] roadmap markdown.
- [ ] checklist.

### Integração

- [ ] progresso vindo do Planner.
- [ ] progresso vindo do Progress Tracker.
- [ ] Dashboard apresenta exatamente os mesmos percentuais.

### UI

- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.
- [ ] Dark Mode.
- [ ] acessibilidade.
- [ ] navegação por teclado.

### Regressão

- [ ] Toda a suíte existente permanece verde.

---

## Entregáveis

### Código

- Página de listagem.
- Página de detalhe.
- Discipline Service.
- Componentes Learning.
- Índice oficial.

### Testes

- Unitários.
- Integração.
- Regressão.

### Dados

- `content/index.json`
- IDs oficiais.
- Estrutura preparada para Task 009.

---

## Fora do Escopo

Não implementar:

- Renderização do conteúdo dos capítulos.
- Busca.
- Flashcards.
- Questões.
- Podcast Player.
- Export NotebookLM.
- Progress Tracker.
- Analytics.
- Funcionalidades das Tasks 009 em diante.

---

## Estimativa

**12 horas**

- Estrutura das páginas.
- Componentes.
- Integração.
- Testes.
- Ajustes.

---

## Critério para Liberação da Task 009

A Task somente será considerada concluída quando:

- todas as disciplinas forem carregadas do índice oficial;
- os IDs oficiais forem utilizados integralmente;
- Planner, Dashboard e Discipline Page apresentarem exatamente o mesmo progresso;
- o Roadmap estiver integrado ao Markdown Viewer;
- todos os testes estiverem aprovados;
- `pnpm build`;
- `pnpm lint`;
- Gate Review aprovado.

---

## Documentação

Ao concluir:

- atualizar `CHANGELOG.md`;
- atualizar `MILESTONES.md`;
- registrar decisões arquiteturais relevantes, caso existam;
- submeter ao Gate Review para liberação da **Task 009**.