# Task 012 — Configurações

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P1

---

## Objetivo

Implementar a página de Configurações: tema, tempo de estudo diário, horas semanais, objetivo, data da prova e preferências de notificação, com persistência local.

## Contexto

O modelo Configuração é definido em DATA_MODEL.md (tema, tempo_estudo, horas_semanais, objetivo, data_prova, notificacoes). Valores oficiais atuais: 13h30 semanais (seg–sex 1h30, sáb/dom 3h) e prova em 11/10/2026 (ROADMAP_DISCIPLINAS.md). As configurações alimentam o Planner (Task 007) e o Dashboard (Task 005) — fonte única da verdade para parâmetros do candidato. Persistência: localStorage (TECH_STACK.md §14).

## Documentos Obrigatórios

- DATA_MODEL.md (Configuração)
- UI_UX_GUIDELINES.md (feedback, estados)
- TECH_STACK.md (§14 — localStorage, §31 — dark mode)
- ROADMAP_DISCIPLINAS.md (parâmetros oficiais)
- COMPONENT_LIBRARY.md (Inputs, Feedback)

## Arquivos Envolvidos

```
src/pages/settings-page.tsx
src/components/settings/settings-form.tsx
src/components/settings/theme-settings.tsx
src/components/settings/study-settings.tsx
src/components/settings/exam-settings.tsx
src/services/settings-service.ts
src/types/settings.ts
config/defaults.json                    (valores oficiais: 13h30/sem, prova 2026-10-11)
```

## Dependências

- Task 003 — Layout Shell.
- Task 002 — Design System (tema).
- Bloqueia: nenhuma (integra-se a 005/007 já entregues).

## Critérios de Aceite

- [ ] Formulário com: tema (claro/escuro/sistema), tempo diário por dia da semana, horas semanais, objetivo, data da prova.
- [ ] Valores padrão oficiais carregados de `config/defaults.json`.
- [ ] Persistência em localStorage com schema tipado e validação.
- [ ] Alterações refletidas imediatamente no Planner e no Dashboard (sem reload).
- [ ] Validação de entradas (horas entre 0 e 16/dia; data da prova futura).
- [ ] Opção de restaurar padrões oficiais.
- [ ] Feedback visual em todo salvamento.
- [ ] Acessibilidade: labels associados, navegação por teclado.

## Checklist de Testes

- [ ] Teste unitário do `settings-service` (salvar, carregar, validar, restaurar).
- [ ] Teste de validação do formulário (valores inválidos rejeitados).
- [ ] Teste de integração: alterar horas semanais reflete no Planner.
- [ ] Teste de persistência entre sessões do navegador.
- [ ] Verificação de acessibilidade do formulário.
- [ ] Regressão: padrões oficiais correspondem ao ROADMAP_DISCIPLINAS.md.

## Entregáveis

1. Página de Configurações completa.
2. Serviço de configurações com persistência e validação.
3. Arquivo de padrões oficiais.
4. Testes.

## Estimativa de Esforço

**8 horas** (formulário, serviço, integração, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md.
