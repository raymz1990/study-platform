# Task 014 — Exportação NotebookLM

**Fase:** 2 — MVP de Estudos  
**Milestone:** 2 — MVP navegável  
**Status:** Planejada  
**Prioridade:** P1

---

# Objetivo

Implementar toda a infraestrutura de exportação de conteúdo da plataforma para o formato otimizado do Google NotebookLM.

A exportação deverá produzir documentos Markdown estruturados, enriquecidos com metadados, mantendo total compatibilidade com:

- NotebookLM
- Audio Overview
- Podcasts
- IA Generativa
- RAG
- Pesquisa futura

A exportação nunca poderá modificar o conteúdo original presente na pasta `content/`.

---

# Contexto

Toda a plataforma utiliza Markdown como fonte única da verdade.

```
content/
```

O NotebookLM utilizará exatamente esses documentos para geração de:

- Audio Overview
- Podcasts
- Perguntas
- Resumos
- Pesquisa

A exportação deve apenas montar um documento otimizado.

Ela nunca deverá editar o conteúdo original.

A arquitetura continua obedecendo:

```
Content
        ↓

Notebook Export Service

        ↓

NotebookLM Markdown

        ↓

Download
```

O serviço será completamente determinístico.

---

# Documentos Obrigatórios

- NOTEBOOKLM_GUIDE.md
- CONTENT_STANDARDS.md
- CONTENT_STRUCTURE.md
- DATA_MODEL.md
- SYSTEM_ARCHITECTURE.md
- TECH_STACK.md
- COMPONENT_LIBRARY.md
- UI_UX_GUIDELINES.md

---

# Arquivos Envolvidos

```
src/pages/

src/components/export/
    notebook-export.tsx
    download-panel.tsx
    export-progress.tsx
    export-options.tsx

src/services/
    notebook-export-service.ts
    notebook-builder.ts

src/types/
    notebook-export.ts

scripts/
    build-notebooklm.ts

notebooklm/
    disciplina/
        *.md
```

---

# Dependências

## Obrigatórias

- Task 009 — Sistema de Conteúdo

## Bloqueia

Nenhuma.

Será utilizada futuramente pelas fases:

- Podcasts
- IA
- NotebookLM
- RAG

---

# Escopo

## P0

### 1. Exportação de capítulo

Cada capítulo poderá ser exportado individualmente.

O documento deverá conter:

- Frontmatter
- Metadados
- Conteúdo completo
- Glossário
- Checklist
- Referências
- FAQ
- Resumo Executivo

---

### 2. Exportação da disciplina

Permitir exportação completa de todos os capítulos da disciplina.

A ordem deverá respeitar:

```
00-roadmap.md
```

Nunca ordem alfabética.

---

### 3. Builder NotebookLM

Implementar um Builder responsável por montar o documento final.

Fluxo:

```
Markdown Original

↓

Parser

↓

Metadados

↓

Notebook Builder

↓

NotebookLM Markdown
```

Toda montagem ocorrerá neste Builder.

---

### 4. Metadados

Adicionar automaticamente:

```
Disciplina

Módulo

Capítulo

ID

Versão

Última atualização

Tempo estimado

Dificuldade

Palavras-chave

Fonte

Roadmap
```

---

### 5. Estrutura NotebookLM

Todo documento exportado deverá seguir exatamente:

```
Título

Objetivos

Pré-requisitos

Conteúdo

Exemplos

Pegadinhas

Questões comentadas

Resumo Executivo

Glossário

Checklist

Referências

FAQ (10 perguntas)

Metadados
```

---

### 6. Download

Permitir:

- Exportar capítulo
- Exportar disciplina
- Exportar tudo

Todos em Markdown.

---

### 7. Build em lote

Criar script

```
build-notebooklm.ts
```

capaz de exportar automaticamente toda a biblioteca.

Destino:

```
notebooklm/
```

---

## P1

### Compatibilidade Audio Overview

O documento deverá ser otimizado para leitura.

Evitar:

- listas excessivamente grandes;
- tabelas gigantes;
- parágrafos extremamente longos.

---

### Performance

A exportação deverá utilizar somente leitura dos arquivos.

Não deverá carregar toda a biblioteca quando exportar apenas um capítulo.

---

### Interface

Adicionar painel de download contendo:

- capítulo
- disciplina
- biblioteca completa

Mostrar progresso da exportação.

---

# Critérios de Aceite

## Funcionalidades

- [ ] Exportação individual de capítulo.
- [ ] Exportação completa da disciplina.
- [ ] Exportação da biblioteca inteira.
- [ ] Documento otimizado para NotebookLM.
- [ ] Builder responsável pela montagem.
- [ ] Metadados completos.
- [ ] Glossário incluído.
- [ ] Checklist incluído.
- [ ] FAQ incluído.
- [ ] Referências incluídas.
- [ ] Ordem baseada no roadmap.
- [ ] Download funcionando.
- [ ] Script de build funcionando.

---

## Arquitetura

- [ ] Nenhuma alteração no conteúdo original.
- [ ] Exportação somente leitura.
- [ ] NotebookBuilder centraliza toda montagem.
- [ ] Componentes sem lógica de negócio.
- [ ] Serviço reutilizável.

---

## Interface

- [ ] Dark Mode.
- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.
- [ ] Feedback durante exportação.
- [ ] Barra de progresso.
- [ ] Download imediato após conclusão.

---

## Qualidade

- [ ] pnpm lint
- [ ] pnpm build
- [ ] TypeScript strict
- [ ] Nenhum any
- [ ] Componentes ≤300 linhas

---

# Checklist de Testes

## notebook-export-service

- [ ] exportar capítulo
- [ ] exportar disciplina
- [ ] exportar biblioteca
- [ ] roadmap respeitado
- [ ] metadados completos

---

## notebook-builder

- [ ] gera todas as seções
- [ ] mantém ordem correta
- [ ] FAQ presente
- [ ] glossário presente
- [ ] checklist presente

---

## Scripts

- [ ] build-notebooklm
- [ ] exportação incremental
- [ ] diretório notebooklm criado

---

## Integridade

- [ ] conteúdo original permanece inalterado
- [ ] export reproduz exatamente o Markdown
- [ ] nenhuma mutação da pasta content

---

## Interface

- [ ] download capítulo
- [ ] download disciplina
- [ ] download biblioteca
- [ ] barra de progresso
- [ ] dark mode

---

## Regressão

- [ ] suíte completa permanece verde.

---

# Entregáveis

## Código

- Notebook Export Service
- Notebook Builder
- Download Panel
- Export Progress
- Export Options

---

## Scripts

- build-notebooklm.ts

---

## Dados

```
notebooklm/
```

contendo os arquivos exportados.

---

## Testes

- Unitários
- Integração
- Regressão

---

# Fora do Escopo

Não implementar:

- Upload para NotebookLM.
- Integração com APIs externas.
- IA Generativa.
- Podcasts automáticos.
- Audio Overview automático.
- Exportação PDF.
- Exportação DOCX.
- Exportação HTML.

---

# Estimativa

**8 horas**

Incluindo:

- Builder
- Serviço
- Interface
- Script
- Download
- Testes

---

# Critério para Liberação da Task 015

A Task será considerada concluída quando:

- todos os capítulos puderem ser exportados;
- disciplinas completas puderem ser exportadas;
- o Builder gerar documentos compatíveis com NotebookLM;
- nenhuma alteração ocorrer na pasta `content/`;
- o script de exportação em lote funcionar;
- todos os testes forem aprovados;
- `pnpm build`;
- `pnpm lint`;
- Gate Review aprovado.

---

# Documentação

Ao concluir:

- atualizar `CHANGELOG.md`;
- atualizar `MILESTONES.md`;
- registrar decisões arquiteturais relevantes;
- validar a compatibilidade com `NOTEBOOKLM_GUIDE.md`;
- submeter ao Gate Review para liberação da **Task 015**.