# Task 001 — Bootstrap do Projeto

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P0 (bloqueante)

---

## Objetivo

Criar a fundação técnica da aplicação: projeto Vite + React + TypeScript com Tailwind CSS, shadcn/ui, pnpm, ESLint/Prettier e estrutura de diretórios oficial, pronto para receber todas as demais features.

## Contexto

A Fase 1 (Fundação/documentação) está concluída. O Milestone 2 exige um MVP navegável. Nenhuma linha de código existe ainda — esta é a primeira Task do projeto e bloqueia todas as outras. A arquitetura é SSG sem backend (TECH_STACK.md §3); todo processamento ocorre em build time.

## Documentos Obrigatórios

- README.md (fluxo de trabalho)
- SYSTEM_ARCHITECTURE.md (§10 — organização do conteúdo)
- TECH_STACK.md (§3–8, §20–22, §25, §33 — stack, estrutura, qualidade, pnpm)
- CODING_STANDARDS.md (nomenclatura, tipagem, organização)
- CONTRIBUTING.md (fluxo oficial, branches)
- DEPLOYMENT.md (§estratégia de branches)

## Arquivos Envolvidos

```
package.json
pnpm-lock.yaml
vite.config.ts
tsconfig.json
tsconfig.node.json
tailwind.config.ts
postcss.config.js
index.html
.eslintrc / eslint.config.js
.prettierrc
.gitignore
src/main.tsx
src/App.tsx
src/index.css
src/types/
src/components/
src/pages/
src/hooks/
src/services/
src/utils/
src/contexts/
src/layouts/
src/assets/
content/            (estrutura de disciplinas — TECH_STACK §34)
scripts/
config/
```

## Dependências

- Nenhuma (Task inicial).
- Bloqueia: todas as demais Tasks.

## Critérios de Aceite

- [ ] Projeto criado com pnpm (nunca npm) e Vite + React + TypeScript.
- [ ] TypeScript strict ativo; nenhum `any` permitido (regra de lint).
- [ ] Tailwind CSS configurado com dark mode por classe.
- [ ] shadcn/ui inicializado (components.json) com Lucide React.
- [ ] ESLint + Prettier configurados e passando sem erros.
- [ ] Estrutura de diretórios conforme TECH_STACK.md §21–22 e §34.
- [ ] `pnpm dev` sobe a aplicação; `pnpm build` gera bundle sem erros.
- [ ] Branch `feature/bootstrap` criada a partir de `develop` (ADR-009).
- [ ] Nenhuma dependência fora da lista permitida (TECH_STACK.md §38).

## Checklist de Testes

- [ ] `pnpm lint` executa sem erros.
- [ ] `pnpm build` conclui sem erros de tipagem.
- [ ] Aplicação renderiza página inicial vazia sem erros de console.
- [ ] Alternância de tema (classe `dark` no `<html>`) funciona via Tailwind.

## Entregáveis

1. Repositório inicializado com estrutura oficial.
2. Configurações de build, lint e formatação.
3. App React mínimo renderizando.
4. Branch `feature/bootstrap` com commits convencionados (`feat(bootstrap): ...`).

## Estimativa de Esforço

**6 horas** (setup, configuração, validação de build e lint).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md (`Added`) e marcar progresso no MILESTONES.md (M2 em andamento).
