# Task 011 — Busca Global

**Fase:** 2 — MVP de Estudos  
**Milestone:** 2 — MVP navegável  
**Status:** Planejada  
**Prioridade:** P0

---

# Objetivo

Implementar o mecanismo oficial de busca global da plataforma, permitindo localizar instantaneamente disciplinas, módulos, capítulos, tópicos, glossário, legislação, questões, flashcards e demais conteúdos do projeto, utilizando indexação local baseada em Fuse.js.

Toda a busca deverá funcionar **100% offline**, sem qualquer dependência de servidor, API ou serviço externo.

---

# Contexto

Após a Task 009, todo o conteúdo da plataforma passa a existir na estrutura oficial `content/`.

A busca deverá utilizar exclusivamente essa estrutura como fonte da verdade.

O índice deverá ser gerado em **build time**, tornando a pesquisa determinística, rápida e totalmente offline.

A arquitetura fica dividida em quatro responsabilidades distintas:

- **search-index-builder** → gera o índice
- **search-service** → realiza consultas
- **use-search** → controla estado da interface
- **SearchModal** → apresenta resultados

Nenhuma camada deverá assumir responsabilidade da outra.

---

# Documentos Obrigatórios

- UI_UX_GUIDELINES.md
- TECH_STACK.md
- DATA_MODEL.md
- CONTENT_STRUCTURE.md
- CONTENT_STANDARDS.md
- TESTING.md
- COMPONENT_LIBRARY.md
- CODING_STANDARDS.md

---

# Arquivos Envolvidos

```
src/components/search/
    search-input.tsx
    search-modal.tsx
    search-results.tsx
    search-result-item.tsx

src/hooks/
    use-search.ts

src/services/
    search-service.ts
    search-index-builder.ts

src/types/
    search.ts

scripts/
    generate-search-index.ts

generated/
    search-index.json
```

---

# Dependências

Obrigatórias

- Task 004 — Navegação
- Task 009 — Renderizador de Conteúdo

Bloqueia

Nenhuma.

---

# Escopo

## P0

### 1. Geração do índice

Implementar geração automática do índice durante o build.

Fonte única:

```
content/
```

O índice deverá ser salvo em

```
generated/search-index.json
```

Nunca gerar índice em runtime.

---

### 2. Estrutura do índice

Cada registro deverá possuir:

```ts
id
type
title
subtitle
keywords
aliases
content
path
disciplineId
chapterId
```

Sempre utilizar IDs oficiais.

Nunca utilizar texto como identificador.

---

### 3. Itens indexados

Indexar:

- disciplinas
- módulos
- capítulos
- tópicos
- glossário
- legislação
- palavras-chave
- definições
- flashcards
- questões
- roadmap
- títulos
- aliases

---

### 4. Search Service

Responsável exclusivamente por:

- carregar o índice
- inicializar Fuse.js
- realizar consultas
- ordenar resultados
- destacar termos encontrados

Nenhuma responsabilidade de interface.

---

### 5. Search Hook

Responsável exclusivamente por:

- estado da pesquisa
- termo digitado
- debounce
- abertura
- fechamento
- navegação por teclado

---

### 6. Search Modal

Responsável apenas por:

- renderização
- agrupamento
- Empty State
- Error State
- navegação

Nenhuma lógica de busca.

---

### 7. Busca

A pesquisa deverá:

- ignorar acentos
- ignorar maiúsculas
- aceitar pequenos erros de digitação
- funcionar parcialmente
- funcionar por aliases
- funcionar por keywords

---

### 8. Ordenação

Ordenação obrigatória:

1. score do Fuse
2. prioridade do tipo

Prioridade:

1. disciplina
2. capítulo
3. tópico
4. legislação
5. glossário
6. flashcard
7. questão

---

### 9. Navegação

Atalho:

```
S
```

Fechar:

```
Esc
```

Resultados:

- ↑
- ↓
- Enter

---

## P1

### Performance

Carregar índice apenas uma vez.

Utilizar singleton.

Nunca recriar Fuse a cada pesquisa.

---

### Interface

Resultados agrupados por tipo.

Highlight do termo pesquisado.

Scroll virtual caso necessário.

---

### Offline

Busca totalmente funcional sem internet.

Compatível com PWA.

---

# Critérios de Aceite

## Funcionalidades

- [ ] Índice gerado em build time.
- [ ] Nenhum conteúdo indexado em runtime.
- [ ] Índice salvo em `generated/search-index.json`.
- [ ] Busca cobre todos os tipos oficiais.
- [ ] Busca ignora acentos.
- [ ] Busca ignora maiúsculas.
- [ ] Busca por aliases.
- [ ] Busca por keywords.
- [ ] Busca tolera pequenos erros.
- [ ] Resultados agrupados.
- [ ] Highlight do termo encontrado.
- [ ] Navegação por teclado.
- [ ] Atalho S.
- [ ] Esc fecha modal.
- [ ] Offline.

---

## Arquitetura

- [ ] Search Service não renderiza UI.
- [ ] Search Modal não executa busca.
- [ ] Hook controla apenas estado.
- [ ] Search Index Builder executado somente durante build.
- [ ] Índice carregado apenas uma vez.
- [ ] IDs oficiais utilizados em todos os resultados.

---

## Interface

- [ ] Loading.
- [ ] Empty State.
- [ ] Error State.
- [ ] Dark Mode.
- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.

---

## Qualidade

- [ ] pnpm lint
- [ ] pnpm build
- [ ] TypeScript strict
- [ ] Nenhum any
- [ ] Componentes ≤300 linhas

---

# Checklist de Testes

## Search Index Builder

- [ ] gera índice completo
- [ ] IDs corretos
- [ ] conteúdo consistente
- [ ] rebuild atualiza índice

---

## Search Service

- [ ] busca por disciplina
- [ ] busca por capítulo
- [ ] busca por glossário
- [ ] busca por aliases
- [ ] busca parcial
- [ ] busca sem resultados
- [ ] busca com erro de digitação

---

## Hook

- [ ] debounce
- [ ] abrir modal
- [ ] fechar modal
- [ ] limpar pesquisa

---

## Modal

- [ ] teclado
- [ ] Enter
- [ ] Esc
- [ ] setas
- [ ] highlight
- [ ] agrupamento

---

## Performance

- [ ] abertura <100 ms
- [ ] pesquisa <300 ms
- [ ] índice carregado uma única vez

---

## Interface

- [ ] desktop
- [ ] tablet
- [ ] mobile
- [ ] dark mode
- [ ] acessibilidade

---

## Regressão

- [ ] Toda a suíte permanece verde.

---

# Entregáveis

## Código

- Search Service
- Search Index Builder
- Search Hook
- Search Modal
- Search Results
- Search Input

---

## Dados

- `generated/search-index.json`

---

## Scripts

- `generate-search-index.ts`

---

## Testes

- Unitários
- Integração
- Performance
- Regressão

---

# Fora do Escopo

Não implementar:

- Busca semântica por IA.
- Vetores.
- Embeddings.
- ElasticSearch.
- Algolia.
- Banco de dados.
- Busca online.
- OCR.
- Pesquisa por voz.
- Funcionalidades das Tasks posteriores.

---

# Estimativa

**10 horas**

Incluindo:

- geração do índice
- Search Service
- Fuse.js
- Search Modal
- Hook
- testes
- performance

---

# Critério para Encerramento

A Task será considerada concluída quando:

- o índice for gerado automaticamente durante o build;
- toda pesquisa utilizar exclusivamente o índice gerado;
- nenhum conteúdo for carregado diretamente da interface;
- todos os resultados utilizarem IDs oficiais;
- a pesquisa permanecer abaixo de 300 ms;
- a abertura do modal ocorrer em menos de 100 ms;
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
- submeter ao Gate Review de encerramento.