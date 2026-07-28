# Task 004 — Navegação

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0

---

## Objetivo

Implementar o sistema de navegação da plataforma: rotas com React Router, breadcrumbs, menu ativo por contexto e atalhos de teclado oficiais.

## Contexto

A navegação deve dar acesso rápido a todas as áreas (UI_UX_GUIDELINES.md) e oferecer atalhos: D (Dashboard), Q (Questões), F (Flashcards), R (Revisões), S (Buscar), Esc (fechar modal). Mudança entre páginas deve ser instantânea (lazy loading por rota — TECH_STACK.md §27).

## Documentos Obrigatórios

- UI_UX_GUIDELINES.md (navegação, atalhos)
- COMPONENT_LIBRARY.md (navegação: Tabs, Breadcrumb, Menu)
- TECH_STACK.md (§27 — lazy loading, §38 — React Router)
- CODING_STANDARDS.md (componentização, hooks)
- GLOSSARIO.md (terminologia das áreas)

## Arquivos Envolvidos

```
src/routes/index.tsx              (definição de rotas)
src/routes/lazy-routes.ts         (lazy loading por página)
src/components/navigation/breadcrumb.tsx
src/components/navigation/nav-item.tsx
src/components/navigation/keyboard-shortcuts.tsx
src/hooks/use-keyboard-shortcuts.ts
src/hooks/use-breadcrumbs.ts
src/types/navigation.ts
```

## Dependências

- Task 003 — Layout Shell.
- Bloqueia: 005, 008, 011.

## Critérios de Aceite

- [ ] Rotas definidas: `/` (Dashboard), `/cronograma`, `/disciplinas`, `/disciplinas/:id`, `/questoes`, `/flashcards`, `/revisoes`, `/simulados`, `/podcasts`, `/progresso`, `/configuracoes`.
- [ ] Lazy loading em todas as rotas de página.
- [ ] Breadcrumbs refletindo a hierarquia da rota atual.
- [ ] Item de menu ativo destacado conforme rota.
- [ ] Atalhos de teclado D/Q/F/R/S/Esc funcionais e desativados durante digitação em inputs.
- [ ] Mudança de página instantânea (sem reload; suspense com fallback skeleton).
- [ ] Rota 404 com EmptyState e retorno ao Dashboard.

## Checklist de Testes

- [ ] Teste de roteamento (navegação entre todas as rotas).
- [ ] Teste dos atalhos de teclado (ativar + ignorar em campos de texto).
- [ ] Teste de breadcrumbs em rotas aninhadas (`/disciplinas/:id`).
- [ ] Teste de fallback de suspense durante carregamento de rota.
- [ ] Verificação de acessibilidade: foco movido para o conteúdo ao trocar de rota.

## Entregáveis

1. Sistema de rotas com lazy loading.
2. Breadcrumbs dinâmicos.
3. Atalhos de teclado oficiais.
4. Página 404.
5. Testes de navegação.

## Estimativa de Esforço

**8 horas** (rotas, atalhos, breadcrumbs, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md; registrar atalhos implementados (referência: UI_UX_GUIDELINES.md).
