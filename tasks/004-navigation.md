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
- [ ] Todas as páginas são carregadas via React.lazy(), com Suspense e fallback visual consistente.
- [ ] Breadcrumbs derivados exclusivamente da definição oficial de rotas, sem duplicação manual de labels.
- [ ] Estado ativo do menu deriva exclusivamente da rota atual (React Router), sem controle manual de estado.
- [ ] Atalhos globais possuem prioridade inferior aos elementos de entrada (input, textarea, contenteditable e componentes equivalentes).
- [ ] A navegação ocorre exclusivamente pelo React Router, sem recarregamento completo da página (SPA).
- [ ] Página 404 utiliza navegação SPA (`useNavigate`) para retornar ao Dashboard, sem recarregar a aplicação.

## Checklist de Testes

- [ ] Teste de roteamento (navegação entre todas as rotas).
- [ ] Atalhos não entram em conflito quando múltiplos componentes registram listeners.
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
