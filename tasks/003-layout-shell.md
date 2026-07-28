# Task 003 — Layout Shell

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0

---

## Objetivo

Construir o layout estrutural da aplicação: Header, Sidebar, área principal (MainContent), Footer e PageContainer, responsivos e com dark mode, servindo de casca para todas as páginas.

## Contexto

O layout padrão é definido por UI_UX_GUIDELINES.md (Sidebar → Header → Conteúdo Principal → Painel Lateral opcional) e DESIGN_SYSTEM.md (Header → Sidebar → Área principal → Painel lateral → Footer). A Sidebar nunca pode esconder informações importantes. Desktop é prioridade, com adaptação para tablet e mobile.

## Documentos Obrigatórios

- UI_UX_GUIDELINES.md (layout, navegação, responsividade)
- DESIGN_SYSTEM.md (layout, grid, responsividade, estados)
- COMPONENT_LIBRARY.md (Layout Components)
- CODING_STANDARDS.md (componentização, máx. 300 linhas)
- TECH_STACK.md (§29 — responsividade)

## Arquivos Envolvidos

```
src/layouts/app-layout.tsx        (AppLayout — casca principal)
src/components/layout/header.tsx  (Header)
src/components/layout/sidebar.tsx (Sidebar)
src/components/layout/footer.tsx  (Footer)
src/components/layout/main-content.tsx
src/components/layout/page-container.tsx
src/components/layout/panel.tsx   (painel lateral opcional)
src/hooks/use-sidebar.ts          (estado aberto/recolhido)
src/types/layout.ts
```

## Dependências

- Task 001 — Bootstrap.
- Task 002 — Design System.
- Bloqueia: 004, 005, 008, 012.

## Critérios de Aceite

- [ ] AppLayout com Header + Sidebar + MainContent + Footer.
- [ ] Sidebar recolhível com estado persistido (localStorage).
- [ ] Itens de navegação: Dashboard, Cronograma, Disciplinas, Questões, Flashcards, Revisões, Simulados, Podcasts, Progresso, Configurações.
- [ ] Responsivo: sidebar fixa em desktop, drawer em mobile/tablet.
- [ ] Dark mode aplicado em todo o shell.
- [ ] Nenhum componente excede 300 linhas.
- [ ] Navegação por teclado completa no shell (tab order lógico, skip link para conteúdo).
- [ ] Estados de loading/erro/vazio previstos no MainContent.

## Checklist de Testes

- [ ] Teste de renderização do AppLayout (React Testing Library).
- [ ] Teste de responsividade (breakpoints desktop/tablet/mobile).
- [ ] Teste do hook `use-sidebar` (toggle + persistência).
- [ ] Verificação de acessibilidade: landmarks semânticos (`header`, `nav`, `main`, `footer`), skip link.
- [ ] Dark mode alternado sem perda de layout.

## Entregáveis

1. AppLayout funcional e responsivo.
2. Header, Sidebar, Footer, MainContent, PageContainer como componentes reutilizáveis.
3. Hook de sidebar com persistência.
4. Testes do shell.

## Estimativa de Esforço

**10 horas** (estrutura, responsividade, estados, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md e registrar componentes em COMPONENT_LIBRARY.md se novos padrões surgirem.
