# Task 008 — Página de Disciplina

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Liberada (Gate 007c aprovado em 29/07/2026) | **Prioridade:** P0

---

## Objetivo

Implementar as páginas de listagem de disciplinas e de detalhe de disciplina, com progresso, tempo estudado/estimado, roadmap, capítulos, questões, flashcards, resumo, podcast e checklist.

## Contexto

Cada disciplina deve apresentar (UI_UX_GUIDELINES.md): descrição, progresso, tempo estudado, tempo estimado, roadmap, capítulos, questões, flashcards, resumo, podcast e checklist. As 12 disciplinas do Perfil 10 são definidas em FGV_EDITAL_ANALISE.md com IDs oficiais (disc_*), prioridades e horas estimadas. O conteúdo segue a estrutura oficial de pastas (TECH_STACK.md §34).

## Documentos Obrigatórios

- UI_UX_GUIDELINES.md (página da disciplina)
- FGV_EDITAL_ANALISE.md (disciplinas, IDs, pesos, horas)
- DATA_MODEL.md (Disciplina, Módulo, Capítulo)
- COMPONENT_LIBRARY.md (Discipline Card, Topic Card, Learning Path)
- TECH_STACK.md (§34 — estrutura de conteúdo)
- ROADMAP_DISCIPLINAS.md (ordem oficial)

## Arquivos Envolvidos

```
src/pages/disciplines-page.tsx           (listagem)
src/pages/discipline-detail-page.tsx     (detalhe)
src/components/learning/discipline-card.tsx
src/components/learning/topic-card.tsx
src/components/learning/learning-path.tsx
src/components/learning/subject-checklist.tsx
src/services/discipline-service.ts
src/types/discipline.ts
content/index.json                       (índice das 12 disciplinas — DATA_MODEL)
```

## Dependências

- Task 004 — Navegação (rotas `/disciplinas`, `/disciplinas/:id`).
- Task 006 — Visualizador Markdown (roadmap da disciplina).
- Bloqueia: 009.

## Critérios de Aceite

- [ ] Listagem das 12 disciplinas com card: nome, progresso, prioridade, horas estimadas/estudadas.
- [ ] Ordenação conforme ordem oficial do ROADMAP_DISCIPLINAS.md.
- [ ] Página de detalhe com todas as seções obrigatórias (descrição, progresso, roadmap, capítulos, questões, flashcards, resumo, podcast, checklist).
- [ ] Roadmap da disciplina renderizado via MarkdownViewer (`00-roadmap.md`).
- [ ] Capítulos agrupados por módulo (hierarquia DATA_MODEL).
- [ ] Estados de estudo com cores semânticas (não iniciada/em andamento/concluída).
- [ ] Estados: loading, erro, vazio (disciplina sem conteúdo ainda).
- [ ] Breadcrumbs: Dashboard → Disciplinas → Disciplina.

## Checklist de Testes

- [ ] Teste de renderização da listagem com as 12 disciplinas (índice JSON).
- [ ] Teste de detalhe com disciplina completa e com disciplina vazia.
- [ ] Teste do `discipline-service` (carregamento e tipagem do índice).
- [ ] Teste de navegação listagem → detalhe → retorno (breadcrumbs).
- [ ] Verificação de responsividade dos cards nos 3 breakpoints.
- [ ] Acessibilidade: cards navegáveis por teclado.

## Entregáveis

1. Página de listagem de disciplinas.
2. Página de detalhe de disciplina.
3. Índice oficial das 12 disciplinas em JSON (IDs do FGV_EDITAL_ANALISE.md).
4. Componentes DisciplineCard, TopicCard, LearningPath.
5. Testes.

## Estimativa de Esforço

**12 horas** (duas páginas, componentes, índice de disciplinas, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md (critério "Página de disciplinas" do M2).
