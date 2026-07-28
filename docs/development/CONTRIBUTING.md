# CONTRIBUTING.md

# Concurso AI Platform
## Development Workflow & Contribution Guide
Version: 1.0

---

# Objetivo

Este documento define o processo oficial para evolução da plataforma.

O projeto deverá permanecer:

- modular
- previsível
- documentado
- reutilizável
- facilmente mantido por agentes de IA

Toda alteração deverá seguir este documento.

---

# Filosofia

A plataforma será desenvolvida de forma incremental.

Nenhuma funcionalidade deverá ser criada sem planejamento.

Sempre priorizar:

Arquitetura

↓

Modelo de Dados

↓

Implementação

↓

Testes

↓

Documentação

Nunca inverter esta ordem.

---

# Fluxo Oficial

Nova funcionalidade

↓

Analisar necessidade

↓

Verificar arquitetura

↓

Verificar Data Model

↓

Verificar impacto

↓

Implementar

↓

Testar

↓

Documentar

↓

Refatorar

↓

Publicar

---

# Antes de Implementar

Sempre responder:

Esta funcionalidade já existe?

Pode ser reutilizada?

Existe componente semelhante?

Existe impacto em outro módulo?

A arquitetura permanece válida?

O Data Model precisa mudar?

A documentação precisa ser atualizada?

Caso alguma resposta seja "sim", realizar os ajustes antes da implementação.

---

# Ordem de Leitura

Antes de iniciar qualquer desenvolvimento:

1. SYSTEM_ARCHITECTURE.md

2. AI_ENGINE.md

3. TECH_STACK.md

4. DATA_MODEL.md

5. CODING_STANDARDS.md

6. UI_UX_GUIDELINES.md

7. CONTENT_STANDARDS.md

8. PROMPT_STANDARDS.md

9. DEPLOYMENT.md

Nunca implementar funcionalidades ignorando estes documentos.

---

# Estrutura de Desenvolvimento

Cada funcionalidade deverá possuir:

Objetivo

Escopo

Entradas

Saídas

Dependências

Critérios de aceite

Testes

Documentação

---

# Organização das Features

Toda nova funcionalidade deverá ser criada em uma branch própria.

Exemplo

feature/dashboard

feature/planner

feature/notebooklm

feature/fgv-strategy

Nunca desenvolver diretamente na branch principal.

---

# Commits

Um commit

↓

Uma responsabilidade

Exemplos

feat(planner): add adaptive study planner

feat(flashcards): spaced repetition engine

fix(review): correct review interval

refactor(content): split markdown parser

docs(system): update architecture

---

# Pull Requests

Toda Pull Request deverá responder:

Qual problema resolve?

Como foi implementada?

Existe impacto em outras áreas?

Foram adicionados testes?

A documentação foi atualizada?

Existe breaking change?

---

# Revisão de Código

Antes de aprovar qualquer alteração verificar:

Arquitetura preservada

↓

Sem duplicação

↓

Código legível

↓

Componentes reutilizáveis

↓

Tipagem correta

↓

Performance

↓

Acessibilidade

↓

Documentação

↓

Testes

---

# Refatoração

Sempre que identificar:

duplicação

alto acoplamento

arquivos grandes

baixa legibilidade

propor refatoração.

Nunca acumular dívida técnica.

---

# Documentação

Toda alteração relevante deverá atualizar:

Arquitetura

Modelo de Dados

Documentação Técnica

Fluxos

Roadmaps

Nunca permitir divergência entre código e documentação.

---

# Testes

Nenhuma funcionalidade crítica deverá ser considerada concluída sem testes.

Obrigatório para:

Planner

Knowledge Graph

Review Engine

Progress Tracker

Question Engine

Parser

Dashboard

---

# Critérios de Aceite

Toda funcionalidade deverá atender:

✓ arquitetura

✓ padrões de código

✓ modelo de dados

✓ testes

✓ documentação

✓ responsividade

✓ acessibilidade

✓ desempenho

---

# Débito Técnico

Caso seja identificado:

registrar

priorizar

corrigir

Nunca esconder dívida técnica.

---

# Escalabilidade

Sempre considerar:

Novos concursos

Novas bancas

Novos perfis

Novos formatos de conteúdo

Nunca desenvolver pensando apenas na DATAPREV.

---

# Segurança

Nunca armazenar informações sensíveis.

Nunca expor dados pessoais.

Nunca adicionar dependências desnecessárias.

---

# Objetivo Final

Garantir que a plataforma evolua continuamente mantendo consistência arquitetural, alta qualidade técnica e facilidade de manutenção, independentemente do número de funcionalidades adicionadas ao longo do tempo.