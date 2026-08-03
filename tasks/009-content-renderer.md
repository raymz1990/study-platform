# Task 009 — Renderizador de Conteúdo (Capítulos e Tópicos)

**Fase:** 2 — MVP de Estudos  
**Milestone:** 2 — MVP navegável  
**Status:** Planejada  
**Prioridade:** P0

---

# Objetivo

Implementar a infraestrutura completa de leitura de conteúdo da plataforma, permitindo a navegação e renderização de capítulos utilizando arquivos Markdown oficiais da estrutura `content/`, com suporte a metadados, Mermaid, checklist, glossário, persistência e navegação sequencial.

Esta task representa o ambiente onde o estudo efetivamente acontece.

---

# Contexto

Após a conclusão da Task 008, todas as disciplinas possuem páginas próprias e navegação funcional.

A Task 009 implementa a experiência completa de leitura.

Todo conteúdo deverá ser carregado exclusivamente da estrutura oficial do projeto.

```
content/
   disciplina/
      00-roadmap.md
      01-fundamentos/
         01-introducao.md
         02-...
```

O MarkdownViewer (Task 006) permanece responsável apenas pela renderização.

Toda descoberta de arquivos, parsing de metadados, validação e carregamento deverá ocorrer através do `content-service`.

A estrutura segue:

- CONTENT_STRUCTURE.md
- CONTENT_STANDARDS.md
- DATA_MODEL.md
- ADR-007

Todo documento deverá possuir Frontmatter válido.

---

# Documentos Obrigatórios

- CONTENT_STANDARDS.md
- CONTENT_STRUCTURE.md
- DATA_MODEL.md
- UI_UX_GUIDELINES.md
- COMPONENT_LIBRARY.md
- TECH_STACK.md
- FGV_EDITAL_ANALISE.md
- ROADMAP_DISCIPLINAS.md

---

# Arquivos Envolvidos

```
src/pages/chapter-page.tsx

src/components/content/
    chapter-header.tsx
    metadata-panel.tsx
    glossary-panel.tsx
    checklist-panel.tsx
    mermaid-diagram.tsx
    next-chapter-link.tsx
    previous-chapter-link.tsx

src/services/
    content-service.ts

src/types/
    chapter.ts

content/
    disciplina/
        00-roadmap.md
        01-fundamentos/
            *.md
```

---

# Dependências

Obrigatórias

- Task 006 — Markdown Viewer
- Task 008 — Página de Disciplina

Bloqueia

- Task 011
- Task 014

---

# Escopo

## P0

### 1. Carregamento oficial de conteúdo

Implementar carregamento exclusivamente através do `content-service`.

Não poderá existir conteúdo hardcoded.

Todos os caminhos deverão ser resolvidos pelo serviço.

---

### 2. Parsing do Frontmatter

Todo capítulo deverá possuir Frontmatter obrigatório.

Campos mínimos:

```
id
discipline
module
chapter
title
estimatedTime
difficulty
keywords
version
lastUpdated
```

Caso o Frontmatter esteja inválido:

- não lançar exceção;
- exibir Error State;
- registrar erro de parsing.

---

### 3. Página de capítulo

Renderizar:

- Header
- Objetivos
- Pré-requisitos
- Conteúdo
- Resumo
- Glossário
- Checklist
- Metadados
- Próximo capítulo
- Capítulo anterior

---

### 4. Mermaid

Renderizar diagramas Mermaid.

Caso o código esteja inválido:

- não quebrar a página;
- exibir fallback visual;
- registrar erro.

---

### 5. Checklist

Checklist persistido utilizando exatamente o mesmo modelo de progresso definido nas Tasks 007/010.

Não criar nova estrutura de persistência.

---

### 6. Navegação

Anterior / Próximo capítulo.

A ordem deverá ser determinada pelo roadmap oficial.

Nunca pela ordem alfabética.

---

### 7. Roadmap

Requisito herdado da Task 008.

A página da disciplina deverá carregar:

```
content/<disciplina>/00-roadmap.md
```

utilizando o mesmo `content-service`.

Nunca gerar roadmap inline.

---

## P1

### Empty States

Capítulo inexistente

Arquivo inexistente

Glossário inexistente

Mermaid inexistente

Checklist vazio

Roadmap inexistente

---

### Performance

Carregar somente o capítulo atual.

Não carregar toda a disciplina.

---

### Interface

Dark Mode

Responsividade

Tipografia de leitura longa

Índice lateral sincronizado

---

# Critérios de Aceite

## Funcionalidades

- [ ] Conteúdo carregado exclusivamente do diretório `content/`.
- [ ] Nenhum conteúdo hardcoded.
- [ ] Frontmatter obrigatório.
- [ ] Parsing realizado pelo `content-service`.
- [ ] Markdown Viewer apenas renderiza.
- [ ] Roadmap carregado através do arquivo `00-roadmap.md`.
- [ ] Glossário funcional.
- [ ] Checklist persistido.
- [ ] Mermaid renderizado.
- [ ] Navegação anterior/próximo funcionando.
- [ ] Ordem baseada no roadmap oficial.
- [ ] Índice lateral sincronizado.
- [ ] Estados Loading.
- [ ] Error State.
- [ ] Empty State.

---

## Arquitetura

- [ ] Separação clara entre renderização e carregamento.
- [ ] Nenhuma lógica de negócio na página.
- [ ] Todo carregamento realizado pelo `content-service`.
- [ ] MarkdownViewer reutilizado.
- [ ] Persistência compartilhada com Progress Tracker.

---

## Interface

- [ ] Dark Mode.
- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.
- [ ] Tipografia otimizada para leitura longa.
- [ ] Painéis laterais acessíveis.

---

## Qualidade

- [ ] pnpm lint
- [ ] pnpm build
- [ ] TypeScript strict
- [ ] Nenhum any
- [ ] Componentes ≤300 linhas

---

# Checklist de Testes

## content-service

- [ ] carregar capítulo
- [ ] carregar roadmap
- [ ] parsing de Frontmatter
- [ ] frontmatter inválido
- [ ] arquivo inexistente
- [ ] capítulo inexistente

---

## Mermaid

- [ ] diagrama válido
- [ ] diagrama inválido
- [ ] fallback

---

## Checklist

- [ ] marcar
- [ ] desmarcar
- [ ] persistência
- [ ] recarregar página

---

## Navegação

- [ ] próximo capítulo
- [ ] capítulo anterior
- [ ] ordem correta
- [ ] breadcrumb

---

## Estados

- [ ] loading
- [ ] empty
- [ ] error

---

## Interface

- [ ] desktop
- [ ] tablet
- [ ] mobile
- [ ] dark mode
- [ ] acessibilidade
- [ ] teclado

---

## Regressão

- [ ] Toda a suíte permanece verde.

---

# Entregáveis

## Código

- Chapter Page
- Content Service
- Metadata Panel
- Glossary Panel
- Checklist Panel
- Mermaid Component
- Previous Chapter Link
- Next Chapter Link

---

## Dados

- Estrutura oficial de conteúdo
- Capítulo modelo
- Roadmap carregado do arquivo

---

## Testes

- Unitários
- Integração
- Regressão

---

# Fora do Escopo

Não implementar:

- Busca.
- Analytics.
- Progress Tracker.
- Flashcards.
- Questões.
- Podcasts.
- NotebookLM.
- Geração automática de conteúdo.
- IA.
- Qualquer funcionalidade das Tasks 010 em diante.

---

# Estimativa

**14 horas**

Incluindo:

- Content Service
- Parsing
- Página
- Mermaid
- Checklist
- Navegação
- Testes

---

# Critério para Liberação da Task 010

A Task será considerada concluída quando:

- todo conteúdo for carregado exclusivamente da estrutura `content/`;
- o roadmap for carregado de `00-roadmap.md`;
- todos os metadados forem interpretados corretamente;
- checklist persistir corretamente;
- Mermaid funcionar com fallback;
- anterior/próximo respeitarem o roadmap;
- nenhum conteúdo estiver hardcoded;
- todos os testes estiverem aprovados;
- `pnpm build`;
- `pnpm lint`;
- Gate Review aprovado.

---

# Documentação

Ao concluir:

- atualizar `CHANGELOG.md`;
- atualizar `MILESTONES.md`;
- registrar eventuais decisões arquiteturais;
- submeter ao Gate Review para liberação da **Task 010**.