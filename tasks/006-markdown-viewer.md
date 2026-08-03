# Task 006 — Visualizador Markdown

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0

---

## Objetivo

Implementar o renderizador oficial de conteúdo Markdown da plataforma, com react-markdown + remark + rehype, suporte a callouts, tabelas, blocos de código e tipografia otimizada para leitura longa. O MarkdownViewer é um componente puro de renderização e não realiza descoberta, leitura ou indexação de conteúdo.

## Contexto

Todo conteúdo oficial é escrito em Markdown — nunca HTML manual (TECH_STACK.md §11, CODING_STANDARDS.md). O parser e o renderizador permanecem desacoplados conforme SYSTEM_ARCHITECTURE.md. O conteúdo deve privilegiar leitura: títulos, listas, quadros, tabelas, callouts e diagramas (UI_UX_GUIDELINES.md). Os callouts oficiais são: Atenção, Pegadinha, Memorização, Importante, Legislação (CONTENT_STANDARDS.md).

## Documentos Obrigatórios

- CONTENT_STANDARDS.md (escrita, destaques, tabelas, diagramas)
- CONTENT_STRUCTURE.md (estrutura dos documentos)
- TECH_STACK.md (§11–12 — Markdown, parser)
- UI_UX_GUIDELINES.md (conteúdo, tipografia)
- CODING_STANDARDS.md (persistência: nunca HTML)

## Arquivos Envolvidos

```
src/components/content/markdown-viewer.tsx
src/components/content/callout.tsx           (Atenção, Pegadinha, Memorização, Importante, Legislação)
src/components/content/code-block.tsx
src/components/content/table-renderer.tsx
src/components/content/heading-anchor.tsx    (âncoras + índice)
src/services/markdown-service.ts             (carregamento de .md do /content)
src/types/content.ts
content/                                     (estrutura oficial de disciplinas)
```

## Dependências

- Task 001 — Bootstrap.
- Task 002 — Design System (tipografia e cores).
- Bloqueia: 008, 009, 014.

## Critérios de Aceite

- [ ] Renderiza Markdown com react-markdown + remark + rehype.
- [ ] Suporte a GFM (tabelas, listas de tarefas, tachado).
- [ ] Callouts customizados nos 5 tipos oficiais com ícones Lucide.
- [ ] Blocos de código com JetBrains Mono e realce de sintaxe.
- [ ] Títulos com âncoras e índice lateral gerado automaticamente.
- [ ] Tabelas responsivas com rolagem horizontal em mobile.
- [ ] Tipografia confortável para leitura longa (medida, entrelinha, parágrafos ≤ 6 linhas).
- [ ] Dark mode completo, inclusive em código e tabelas.
- [ ] HTML bruto sanitizado por rehype-sanitize.
- [ ] Frontmatter validado por Zod.
- [ ] TOC e HeadingAnchor utilizam a mesma implementação de slug.

## Checklist de Testes

- [ ] Teste unitário do parser/renderização com documento de exemplo (todas as features).
- [ ] Teste dos 5 callouts (renderização e acessibilidade).
- [ ] Teste de sanitização (HTML malicioso não é executado).
- [ ] Teste de índice gerado a partir dos títulos.
- [ ] Verificação visual nos dois temas e nos 3 breakpoints.
- [ ] Leitura confortável validada com documento longo real (apostila-modelo).
- [ ] Teste de validação do frontmatter (campos válidos e inválidos).
- [ ] Teste de geração consistente de slugs entre TOC e HeadingAnchor.

## Entregáveis

1. MarkdownViewer completo.
2. Componentes Callout, CodeBlock, TableRenderer, HeadingAnchor.
3. Parser de conteúdo Markdown com extração e validação de frontmatter.
4. Documento Markdown de exemplo cobrindo todos os recursos.
5. Testes.

## Estimativa de Esforço

**10 horas** (parser, componentes customizados, estilos de leitura, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md (critério "Markdown" do M2) e registrar convenção de callouts no guia de conteúdo se necessário.
