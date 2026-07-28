# Task 015 — Polimento de UI (Polish)

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável (fechamento)
**Status:** Planejada | **Prioridade:** P1

---

## Objetivo

Realizar o polimento final do MVP: microinterações discretas, revisão completa de estados (loading/erro/vazio/sucesso), responsividade fina, acessibilidade, performance e consistência visual — fechando o Milestone 2.

## Contexto

Esta Task é o gate de qualidade do MVP. Todo componente deve prever loading, erro, vazio e sucesso (UI_UX_GUIDELINES.md). Microinterações devem ser discretas e nunca atrasar o estudo. Performance: primeiro carregamento < 2s, mudança de página instantânea, busca < 300 ms (TESTING.md). Acessibilidade WCAG AA em toda a aplicação. Nenhuma entrega é concluída sem validação (README.md).

## Documentos Obrigatórios

- UI_UX_GUIDELINES.md (feedback, estados, microinterações, performance)
- DESIGN_SYSTEM.md (consistência, estados, performance visual)
- TESTING.md (critérios de aceite, regressão, acessibilidade)
- CODING_STANDARDS.md (qualidade final)
- COMPONENT_LIBRARY.md (estados obrigatórios)
- DEPLOYMENT.md (checklist de deploy)

## Arquivos Envolvidos

```
src/components/foundation/skeleton.tsx        (revisão)
src/components/foundation/empty-state.tsx     (revisão)
src/components/foundation/error-state.tsx     (revisão)
src/components/foundation/toast.tsx           (feedback unificado)
(todas as páginas — revisão de estados e responsividade)
```

## Dependências

- Todas as Tasks 001–014 concluídas.
- Bloqueia: fechamento do Milestone 2 e deploy do MVP.

## Critérios de Aceite

- [ ] Todas as páginas com os 4 estados (loading, erro, vazio, sucesso) implementados.
- [ ] Feedback visual (toast) unificado em todas as ações do usuário.
- [ ] Microinterações discretas (< 200 ms) sem animações excessivas.
- [ ] Responsividade validada em desktop, tablet e mobile (experiência desktop excelente).
- [ ] Acessibilidade WCAG AA validada (contraste, teclado, ARIA, leitor de tela, foco).
- [ ] Performance: first load < 2s, transições instantâneas, busca < 300 ms.
- [ ] Cobertura de testes: ≥ 90% módulos críticos, ≥ 80% demais.
- [ ] `pnpm lint`, `pnpm build` e testes passando sem erros.
- [ ] Checklist de deploy (DEPLOYMENT.md) integralmente verificado.
- [ ] Zero erros críticos ou altos abertos (registro de defeitos — TESTING.md).

## Checklist de Testes

- [ ] Teste de regressão completo: Dashboard, Cronograma, Disciplinas, Capítulos, Progresso, Busca, Configurações, PWA.
- [ ] Auditoria de acessibilidade (automatizada + manual com teclado).
- [ ] Auditoria de performance (Lighthouse nos 3 breakpoints).
- [ ] Revisão de consistência visual contra DESIGN_SYSTEM.md.
- [ ] Verificação de logs: sem `console.log` desnecessário em produção.
- [ ] Smoke test do build de produção com PWA.

## Entregáveis

1. MVP polido e validado end-to-end.
2. Relatório de auditoria (acessibilidade + performance).
3. Cobertura de testes nos mínimos oficiais.
4. Milestone 2 fechado e registrado em MILESTONES.md.
5. PR `release/mvp` → `main` pronta para deploy (GitHub Pages + Cloudflare Access).

## Estimativa de Esforço

**12 horas** (auditorias, correções, regressão completa, fechamento do milestone).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md, MILESTONES.md (M2 concluído) e validar README.md (estado atual do projeto).
