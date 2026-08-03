# Task 012 — Configurações

**Fase:** 2 — MVP de Estudos  
**Milestone:** 2 — MVP navegável  
**Status:** Planejada  
**Prioridade:** P1

---

# Objetivo

Implementar o módulo completo de Configurações da plataforma, responsável pelo gerenciamento de todas as preferências persistentes do usuário.

As configurações representam a única fonte de verdade dos parâmetros pessoais utilizados pelo Dashboard, Planner, Progress Tracker e demais módulos da aplicação.

---

# Contexto

A plataforma utiliza apenas persistência local.

Todas as configurações deverão ser carregadas através do `settings-service`, não sendo permitido acesso direto ao localStorage por páginas ou componentes.

O sistema deverá possuir configuração centralizada, tipada, validada e observável.

Alterações nas configurações deverão refletir imediatamente em todos os módulos consumidores.

Valores oficiais iniciais:

- prova: 11/10/2026
- cronograma semanal: 13h30
- segunda a sexta: 1h30
- sábado e domingo: 3h
- tema: System

A estrutura deverá seguir:

- DATA_MODEL.md
- ROADMAP_DISCIPLINAS.md
- SYSTEM_ARCHITECTURE.md
- TECH_STACK.md

---

# Documentos Obrigatórios

- DATA_MODEL.md
- SYSTEM_ARCHITECTURE.md
- ROADMAP_DISCIPLINAS.md
- UI_UX_GUIDELINES.md
- COMPONENT_LIBRARY.md
- TECH_STACK.md
- CODING_STANDARDS.md

---

# Arquivos Envolvidos

```
src/pages/
    settings-page.tsx

src/components/settings/
    settings-form.tsx
    theme-settings.tsx
    study-settings.tsx
    exam-settings.tsx
    notification-settings.tsx
    settings-section.tsx

src/services/
    settings-service.ts

src/hooks/
    use-settings.ts

src/types/
    settings.ts

config/
    defaults.json
```

---

# Dependências

Obrigatórias

- Task 002 — Design System
- Task 003 — Layout Shell
- Task 004 — Navegação

Consumido por

- Task 005 — Dashboard
- Task 007 — Planner
- Task 010 — Progress Tracker
- Task 013 — PWA

---

# Escopo

## P0

### 1. Serviço de Configuração

Implementar um serviço centralizado responsável por:

- carregar configurações
- validar
- salvar
- restaurar padrões
- emitir atualizações para os consumidores

Nenhum componente poderá acessar diretamente o localStorage.

---

### 2. Persistência

Persistência utilizando apenas localStorage.

Schema tipado.

Versionado.

Compatível com futuras migrações.

---

### 3. Tema

Permitir:

- Light
- Dark
- System

Utilizar a infraestrutura criada na Task 002.

A alteração deverá ocorrer imediatamente.

---

### 4. Configurações de Estudo

Permitir configurar:

- horas por dia
- horas semanais
- objetivo
- tempo diário
- duração das sessões

Esses valores deverão alimentar automaticamente o Planner.

---

### 5. Configurações da Prova

Permitir alterar:

- data da prova
- descrição da prova
- objetivo

O Dashboard deverá recalcular automaticamente:

- countdown
- semanas restantes
- planejamento

---

### 6. Notificações

Preparar a estrutura para notificações futuras.

Nesta fase apenas:

- habilitar
- desabilitar

Nenhuma notificação deverá ser implementada.

---

### 7. Restaurar Padrões

Botão para restaurar os valores definidos em:

```
config/defaults.json
```

---

## P1

### Integração

Todas as alterações deverão refletir imediatamente em:

- Dashboard
- Planner
- Progress Tracker

sem necessidade de reload.

---

### Interface

Separar as configurações em grupos:

- Aparência
- Estudos
- Prova
- Notificações

Cada grupo deverá utilizar componentes reutilizáveis.

---

### Feedback

Salvar automaticamente.

Exibir confirmação visual.

Exibir erro quando necessário.

---

# Critérios de Aceite

## Funcionalidades

- [ ] Todas as configurações carregadas pelo settings-service.
- [ ] Nenhum acesso direto ao localStorage.
- [ ] Tema funcionando.
- [ ] Alteração imediata do Dashboard.
- [ ] Alteração imediata do Planner.
- [ ] Alteração imediata do Progress Tracker.
- [ ] Configuração da prova funcionando.
- [ ] Configuração de horas funcionando.
- [ ] Configuração de notificações funcionando.
- [ ] Restaurar padrões funcionando.

---

## Arquitetura

- [ ] Fonte única das configurações.
- [ ] Serviço centralizado.
- [ ] Hook reutilizável.
- [ ] Schema tipado.
- [ ] Persistência compartilhada.

---

## Interface

- [ ] Dark Mode.
- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.
- [ ] Navegação por teclado.
- [ ] Labels acessíveis.

---

## Qualidade

- [ ] pnpm lint
- [ ] pnpm build
- [ ] TypeScript strict
- [ ] Nenhum any
- [ ] Componentes ≤300 linhas

---

# Checklist de Testes

## settings-service

- [ ] carregar
- [ ] salvar
- [ ] validar
- [ ] restaurar padrões
- [ ] migração de versão

---

## Hook

- [ ] atualização reativa
- [ ] múltiplos consumidores
- [ ] sincronização

---

## Integração

- [ ] Dashboard atualizado
- [ ] Planner atualizado
- [ ] Progress Tracker atualizado

---

## Persistência

- [ ] recarregar navegador
- [ ] restaurar padrões
- [ ] schema inválido
- [ ] storage corrompido

---

## Interface

- [ ] desktop
- [ ] tablet
- [ ] mobile
- [ ] dark mode
- [ ] acessibilidade

---

## Regressão

- [ ] Toda a suíte permanece verde.

---

# Entregáveis

## Código

- Settings Page
- Settings Service
- Hook de Configuração
- Componentes reutilizáveis

---

## Dados

- defaults.json
- schema tipado

---

## Testes

- Unitários
- Integração
- Regressão

---

# Fora do Escopo

Não implementar:

- sincronização em nuvem;
- login;
- múltiplos perfis;
- exportação/importação;
- notificações reais;
- backend;
- armazenamento remoto.

---

# Estimativa

**8 horas**

Incluindo:

- serviço
- hook
- persistência
- interface
- integração
- testes

---

# Critério para Liberação da Task 013

A Task será considerada concluída quando:

- todas as configurações forem persistidas corretamente;
- Dashboard, Planner e Progress Tracker reagirem automaticamente às alterações;
- nenhum componente acessar diretamente o localStorage;
- o tema funcionar corretamente;
- os padrões forem restauráveis;
- todos os testes estiverem aprovados;
- `pnpm build`;
- `pnpm lint`;
- Gate Review aprovado.

---

# Documentação

Ao concluir:

- atualizar `CHANGELOG.md`;
- atualizar `MILESTONES.md`;
- registrar eventuais decisões arquiteturais;
- submeter ao Gate Review para liberação da **Task 013**.