# Task 009 — Renderizador de Conteúdo (Capítulos e Tópicos)

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0

---

## Objetivo

Implementar a página de capítulo/tópico, que renderiza o conteúdo de estudo completo com todas as seções obrigatórias: objetivos, pré-requisitos, conteúdo, resumo, mapa mental, questões, flashcards, podcast, checklist final e link para o próximo capítulo.

## Contexto

A página do capítulo é onde o estudo efetivamente acontece (UI_UX_GUIDELINES.md). O conteúdo segue a estrutura de 15 seções do CONTENT_STANDARDS.md e a hierarquia do CONTENT_STRUCTURE.md (reconciliada, ADR-007). Mapas mentais são textuais e compatíveis com Mermaid (TECH_STACK.md §10). Metadados obrigatórios em todo documento (id, disciplina, capítulo, tópicos, palavras-chave, nível, tempo, versão, atualização).

## Documentos Obrigatórios

- CONTENT_STANDARDS.md (15 seções obrigatórias, metadados)
- CONTENT_STRUCTURE.md (estrutura de capítulo e tópico)
- UI_UX_GUIDELINES.md (página do capítulo)
- DATA_MODEL.md (Conteúdo, Capítulo, Tópico)
- COMPONENT_LIBRARY.md (Markdown Viewer, Glossary Panel, Metadata Panel)
- TECH_STACK.md (§10 — Mermaid)

## Arquivos Envolvidos

```
src/pages/chapter-page.tsx
src/components/content/chapter-header.tsx      (objetivos, pré-requisitos, tempo)
src/components/content/metadata-panel.tsx
src/components/content/glossary-panel.tsx
src/components/content/checklist-panel.tsx
src/components/content/mermaid-diagram.tsx     (mapas mentais)
src/components/content/next-chapter-link.tsx
src/services/content-service.ts                (carregamento + parsing de metadados)
src/types/chapter.ts
content/<disciplina>/01-fundamentos/*.md       (conteúdo real, quando produzido)
```

## Dependências

- Task 006 — Visualizador Markdown.
- Task 008 — Página de Disciplina (navegação capítulo).
- Bloqueia: 011 (busca indexa conteúdo), 014 (exportação NotebookLM).

## Critérios de Aceite

- [ ] Página de capítulo renderiza conteúdo Markdown completo com índice lateral.
- [ ] Metadados do documento exibidos (tempo estimado, nível, palavras-chave, versão).
- [ ] Seções identificáveis: objetivos, pré-requisitos, desenvolvimento, resumo, glossário, checklist.
- [ ] Mapas mentais renderizados com Mermaid.
- [ ] Glossário em painel lateral acessível durante a leitura.
- [ ] Checklist final interativo com persistência (localStorage).
- [ ] Link "Próximo Capítulo" respeitando a ordem do roadmap da disciplina.
- [ ] Conteúdo legível em longas sessões (tipografia, dark mode).
- [ ] Estados: loading, erro, vazio (capítulo sem conteúdo).

## Checklist de Testes

- [ ] Teste do `content-service` (parsing de frontmatter/metadados).
- [ ] Teste de renderização de capítulo com todas as seções.
- [ ] Teste do checklist interativo (marcação + persistência).
- [ ] Teste de renderização Mermaid (diagrama válido e fallback para erro).
- [ ] Teste de navegação sequencial entre capítulos.
- [ ] Verificação de acessibilidade (índice, painéis, foco).

## Entregáveis

1. Página de capítulo/tópico completa.
2. Componentes de metadados, glossário, checklist, mapa mental.
3. Serviço de conteúdo com parsing de metadados.
4. Um capítulo de exemplo em Markdown (placeholder estrutural, sem conteúdo de estudo).
5. Testes.

## Estimativa de Esforço

**14 horas** (página, componentes de apoio à leitura, Mermaid, serviços, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md (critério "Página de tópicos" do M2).
