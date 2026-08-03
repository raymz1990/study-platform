# Task 002 — Design System

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0

---

## Objetivo

Implementar os tokens visuais oficiais da plataforma: paleta de cores semânticas, tipografia (Inter + JetBrains Mono), escala de espaçamento, bordas, sombras e tema dark mode, como fundação de todos os componentes.

## Contexto

O Design System é obrigatório antes de qualquer componente (DESIGN_SYSTEM.md). Cores representam estado, nunca decoração: verde = concluído, azul = em andamento, amarelo = atenção, vermelho = revisão urgente (UI_UX_GUIDELINES.md). Dark mode é obrigatório com preferência salva.

## Documentos Obrigatórios

- DESIGN_SYSTEM.md (íntegro)
- UI_UX_GUIDELINES.md (cores, tipografia, espaçamento, dark mode)
- TECH_STACK.md (§6, §31, §32 — Tailwind, dark mode, fontes)
- COMPONENT_LIBRARY.md (estados obrigatórios dos componentes)

## Arquivos Envolvidos

```
tailwind.config.ts              (tokens: cores, fontes, espaçamento)
src/index.css                   (variáveis CSS, camadas base)
src/styles/tokens.ts            (constantes de tema tipadas)
src/contexts/theme-context.tsx  (provedor de tema)
src/hooks/use-theme.ts          (hook de alternância de tema)
src/components/foundation/      (Button, Badge, Card base via shadcn/ui)
public/fonts/                   (Inter, JetBrains Mono — self-hosted)
```

## Dependências

- Task 001 — Bootstrap do Projeto.
- Bloqueia: 003, 005, 008, 012, 015.

## Critérios de Aceite

- [ ] Todos os tokens de cor são definidos por nomes semânticos, sem uso direto de cores hexadecimais nos componentes.
- [ ] Cores semânticas de estado de estudo mapeadas (concluído/andamento/atenção/urgente).
- [ ] Fontes Inter e JetBrains Mono carregadas; máximo de 2 famílias.
- [ ] Espaçamento utiliza exclusivamente a escala definida no Design System, sem valores arbitrários.
- [ ] Tema suporta `light`, `dark` e `system`, com persistência da preferência do usuário.
- [ ] Contraste WCAG AA verificado nos dois temas.
- [ ] Cada componente foundation implementa apenas os estados aplicáveis ao seu comportamento, conforme COMPONENT_LIBRARY.md.
- [ ] Nenhum CSS personalizado grande; Tailwind como prioridade (CODING_STANDARDS.md).

## Checklist de Testes

- [ ] Teste unitário do hook `use-theme` (alternância + persistência).
- [ ] Ao reiniciar a aplicação, o tema persistido é restaurado corretamente.
- [ ] Snapshot visual dos componentes base nos dois temas.
- [ ] Verificação de contraste (ferramenta automatizada ou manual) — WCAG AA.
- [ ] Navegação por teclado com foco visível nos componentes base.
- [ ] Sem regressão de build (`pnpm build` sem erros).

## Entregáveis

1. Tokens de tema em Tailwind + CSS variables.
2. Provedor e hook de tema com persistência.
3. Componentes foundation base (Button, Badge, Card) nos dois temas.
4. Documentação de uso dos tokens no próprio arquivo de tokens (comentários de motivação).

## Estimativa de Esforço

**8 horas** (tokens, tema, componentes base, verificação de acessibilidade).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md e confirmar cobertura dos princípios do DESIGN_SYSTEM.md.
