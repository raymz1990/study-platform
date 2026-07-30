# SYSTEM_ARCHITECTURE.md

# Concurso AI Platform

### Architecture Specification

Version: 1.0

---

# 1. Objetivo

A plataforma tem como objetivo maximizar a probabilidade de aprovação do candidato em concursos públicos através da geração automática de materiais de estudo, planejamento adaptativo, acompanhamento de desempenho e produção contínua de conteúdo otimizado para aprendizado.

A plataforma foi concebida para ser reutilizável entre diferentes concursos, alterando apenas o edital e a estratégia da banca examinadora.

O foco inicial é o concurso DATAPREV – Perfil 10 – Gestão Econômico-Financeira, organizado pela Fundação Getulio Vargas (FGV).

---

# 2. Filosofia do Projeto

O sistema deve agir como um mentor completo de preparação.

Ele nunca deve apenas responder perguntas.

Seu objetivo é tomar decisões inteligentes sobre:

- o que estudar;
- quando revisar;
- quando aumentar a dificuldade;
- quando revisar erros;
- quando gerar novos materiais;
- quando produzir simulados.

Toda decisão deve ser baseada em evidências.

---

# 3. Objetivos

A plataforma deve:

✔ ensinar

✔ acompanhar

✔ avaliar

✔ adaptar

✔ revisar

✔ medir

✔ evoluir

✔ preparar para aprovação.

Nunca deverá ser apenas um repositório de PDFs.

---

# 4. Princípios

## 4.1 Fonte Única da Verdade

Nenhuma informação deve existir duplicada.

Cada dado possui apenas uma origem.

Exemplo:

Edital
↓

Mapa do edital
↓

Cronograma
↓

Conteúdo

Nunca o contrário.

---

## 4.2 Conteúdo Determinístico

Todo conteúdo produzido deve poder ser regenerado.

Nada deve depender de memória da IA.

Todo material deve ser reproduzível.

---

## 4.3 Modularidade

Cada Skill possui responsabilidade única.

Skills não devem assumir funções pertencentes a outras.

---

## 4.4 Reutilização

Todo componente deverá funcionar para qualquer concurso.

A única alteração deverá ser:

- edital

- perfil do candidato

- banca

---

## 4.5 Evolução Contínua

O sistema deve melhorar continuamente conforme aprende sobre o desempenho do candidato.

---

# 5. Arquitetura

```
                  Edital
                     │
                     ▼
            Edital Analyzer
                     │
                     ▼
             Knowledge Graph
                     │
                     ▼
              Study Planner
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
 Daily Plan                Review Queue
         │                       │
         └───────────┬───────────┘
                     ▼
              Professor Engine
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 Apostilas      Flashcards      Questões
      │              │              │
      └──────────────┼──────────────┘
                     ▼
          NotebookLM Generator
                     │
                     ▼
            Podcast Generator
                     │
                     ▼
               HTML Generator
                     │
                     ▼
                Auditor IA
                     │
                     ▼
             Publicação Final
```

---

# 6. Camadas

## Camada 1

Input

- edital

- perfil

- tempo

- histórico

---

## Camada 2

Planejamento

Responsável por decidir.

Nunca gera conteúdo.

---

## Camada 3

Produção

Responsável por produzir conteúdo.

---

## Camada 4

Validação

Revisa tudo.

---

## Camada 5

Publicação

NotebookLM

GitHub Pages

Dashboard

---

# 7. Skills

## Skill 01

System Orchestrator

Responsável por coordenar toda a plataforma.

Nunca produz conteúdo.

---

## Skill 02

Edital Analyzer

Lê o edital.

Extrai disciplinas.

Constrói dependências.

Calcula prioridades.

---

## Skill 03

Planner

Produz cronograma adaptativo.

---

## Skill 04

Professor

Produz apostilas.

---

## Skill 05

FGV Strategy

Especialista na banca.

Nunca produz teoria.

Produz:

- estilo FGV

- pegadinhas

- padrões

- simulados

---

## Skill 06

Questions Engine

Banco de questões.

Questões comentadas.

---

## Skill 07

Flashcards Engine

Produz flashcards.

---

## Skill 08

NotebookLM Builder

Transforma todo conteúdo em Markdown otimizado.

---

## Skill 09

Podcast Builder

Produz roteiros para Audio Overview.

---

## Skill 10

HTML Builder

Constrói toda interface web.

---

## Skill 11

Progress Tracker

Mede desempenho.

---

## Skill 12

QA Auditor

Audita todo conteúdo.

Nunca cria teoria.

---

# 8. Estratégia da Banca

A banca nunca deve estar acoplada ao sistema.

Arquitetura:

Core

↓

Strategy

↓

Banco de Questões

Exemplo:

```
Core

↓

FGV Strategy
```

Futuro

```
Core

↓

CESPE Strategy
```

Nenhuma outra Skill deve conhecer regras específicas da banca.

---

# 9. Fluxo Diário

Início

↓

Verificar cronograma

↓

Verificar revisões

↓

Selecionar disciplina

↓

Produzir conteúdo

↓

Gerar flashcards

↓

Gerar questões

↓

Gerar podcast

↓

Atualizar HTML

↓

Registrar progresso

↓

Fim

---

# 10. Organização do Projeto

Esta seção define a organização do CONTEÚDO e dos dados da plataforma.

A estrutura da aplicação React (src/, public/, scripts/) é definida em TECH_STACK.md §21.

A estrutura interna de cada disciplina é definida em TECH_STACK.md §34.

```
project/

    docs/

    edital/

    planner/

    roadmap/

    disciplines/

    content/

        portugues/

        matematica/

        economia/

        administracao/

        contabilidade/

        financas/

        lgpd/

        estatistica/

    notebooklm/

    podcasts/

    flashcards/

    html/

    questions/

    simulations/

    progress/

    dashboard/

    config/

```

---

# 11. Organização do Conteúdo

Cada disciplina possui:

```
Disciplina

    00 Roadmap

    01 Fundamentos

    02 Intermediário

    03 Avançado

    04 Questões

    05 Revisão

    06 Simulado

    07 Flashcards

    08 Podcast

    09 Resumos

```

---

# 12. Revisão Espaçada

Todo conteúdo deve gerar automaticamente:

24 horas

↓

7 dias

↓

30 dias

↓

60 dias

↓

90 dias

---

# 13. Dashboard

O Dashboard deverá apresentar:

- progresso geral

- progresso por disciplina

- percentual do edital

- horas estudadas

- horas restantes

- revisões pendentes

- taxa de acerto

- simulados

- evolução temporal

---

# 14. NotebookLM

Todo documento deve possuir:

Título

Objetivo

Índice

Capítulos

Resumo

Glossário

Referências

Checklist

Flashcards

Perguntas

Nunca utilizar texto excessivamente longo sem divisão.

---

# 15. HTML

A interface deverá ser uma plataforma de estudos.

Nunca um conjunto de páginas estáticas.

Recursos:

Dashboard

Cronograma

Busca

Questões

Flashcards

Podcast

Mapa Mental

Progresso

Revisões

Modo Escuro

Pesquisa

Favoritos

---

# 16. Auditoria

Antes da publicação todo conteúdo passa por auditoria.

Itens avaliados:

✔ completude

✔ clareza

✔ profundidade

✔ alinhamento ao edital

✔ alinhamento à FGV

✔ redundâncias

✔ referências

✔ qualidade NotebookLM

✔ navegabilidade HTML

---

# 17. Publicação

Pipeline

Edital

↓

Planejamento

↓

Produção

↓

NotebookLM

↓

Podcast

↓

HTML

↓

Auditoria

↓

Deploy

---

# 18. Deploy

Deploy automático via GitHub Actions.

Hospedagem:

GitHub Pages

Proteção:

Cloudflare Access

Todo commit na branch principal deverá atualizar automaticamente a plataforma.

---

# 19. Escalabilidade

O sistema deverá permitir adicionar:

novos concursos

novas bancas

novos perfis

novos módulos

sem necessidade de alteração da arquitetura principal.

---

# 20. Objetivo Final

Construir uma plataforma inteligente de preparação para concursos públicos capaz de adaptar o estudo ao perfil do candidato, produzir automaticamente materiais de alta qualidade, acompanhar continuamente sua evolução e maximizar a probabilidade de aprovação, mantendo arquitetura reutilizável para qualquer concurso futuro.
