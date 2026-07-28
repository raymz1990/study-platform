# Task 011 — Busca Global

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0

---

## Objetivo

Implementar a busca global instantânea da plataforma com Fuse.js, indexando disciplinas, capítulos, assuntos, questões, flashcards, glossário e termos técnicos — 100% local, offline, sem servidor.

## Contexto

Busca global é obrigatória (UI_UX_GUIDELINES.md): pesquisar por disciplina, capítulo, assunto, questão, flashcard, glossário, lei, termo técnico, com resultado instantâneo (< 300 ms — TESTING.md). Busca local indexada, sem ElasticSearch, Algolia ou serviços externos (TECH_STACK.md §13, §18). Ativada pelo atalho S (Task 004).

## Documentos Obrigatórios

- UI_UX_GUIDELINES.md (busca)
- TECH_STACK.md (§13, §18 — Fuse.js, busca local)
- TESTING.md (performance: pesquisa < 300 ms)
- DATA_MODEL.md (IDs para referência dos resultados)
- COMPONENT_LIBRARY.md (Search Input, Empty State)
- CODING_STANDARDS.md (IDs imutáveis, nunca texto como chave)

## Arquivos Envolvidos

```
src/components/search/search-input.tsx
src/components/search/search-results.tsx
src/components/search/search-result-item.tsx
src/components/search/search-modal.tsx          (atalho S)
src/services/search-service.ts                  (índice Fuse.js)
src/services/search-index-builder.ts            (build do índice a partir do /content)
src/hooks/use-search.ts
src/types/search.ts
scripts/generate-index.ts                       (índice em build time — TECH_STACK §35)
```

## Dependências

- Task 004 — Navegação (atalho S, modal).
- Task 009 — Renderizador de Conteúdo (fonte de dados do índice).
- Bloqueia: nenhuma.

## Critérios de Aceite

- [ ] Índice gerado em build time a partir do diretório `content/` (conteúdo determinístico).
- [ ] Busca cobre: disciplinas, capítulos, tópicos, glossário, questões, flashcards, leis e termos técnicos.
- [ ] Resultados agrupados por tipo com destaque do termo encontrado.
- [ ] Resposta < 300 ms para o volume de conteúdo do MVP.
- [ ] Modal de busca aberto pelo atalho S e fechado com Esc.
- [ ] Navegação por teclado nos resultados (setas + Enter).
- [ ] Empty state para busca sem resultados.
- [ ] Resultados referenciam objetos por ID (nunca por texto).
- [ ] Funciona offline (PWA-ready).

## Checklist de Testes

- [ ] Teste unitário do `search-service` (consultas típicas e casos limite).
- [ ] Teste do `search-index-builder` (índice completo e consistente com o /content).
- [ ] Teste de performance: busca < 300 ms no dataset do MVP.
- [ ] Teste de navegação por teclado no modal.
- [ ] Teste de regressão: conteúdo novo aparece no índice após rebuild.
- [ ] Acessibilidade: modal com foco aprisionado e ARIA correto.

## Entregáveis

1. Busca global funcional (modal + página de resultados).
2. Serviço de busca com Fuse.js e índice em build time.
3. Script `generate-index.ts`.
4. Testes incluindo benchmark de performance.

## Estimativa de Esforço

**10 horas** (indexação, serviço, UI do modal, performance, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md (critério "Pesquisa" do M2).
