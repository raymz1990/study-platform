# CODING_STANDARDS.md

# Concurso AI Platform

## Coding Standards

Version: 1.0

---

# Objetivo

Este documento define os padrões obrigatórios para desenvolvimento da plataforma.

Todas as implementações deverão seguir estas convenções.

Caso exista conflito entre documentos, prevalece a hierarquia oficial definida em AI_ENGINE.md:

1. README.md
2. SYSTEM_ARCHITECTURE.md
3. AI_ENGINE.md
4. PROMPT_STANDARDS.md
5. CODING_STANDARDS.md
6. CONTENT_STANDARDS.md
7. CONTENT_STRUCTURE.md
8. GLOSSARIO.md
9. FGV_STRATEGY.md
10. ROADMAP_DISCIPLINAS.md

---

# Filosofia

Todo código deve ser:

- simples
- previsível
- modular
- reutilizável
- testável
- documentado

Sempre priorizar legibilidade.

Código é escrito para pessoas.

---

# Complexidade

Sempre escolher a solução mais simples que atenda ao problema.

Evitar:

- abstrações prematuras
- otimizações desnecessárias
- arquitetura excessivamente complexa

---

# Responsabilidade Única

Cada:

arquivo

componente

hook

classe

função

deve possuir apenas uma responsabilidade.

---

# Organização

Nunca criar arquivos "genéricos".

Exemplo ruim

utils.ts

helpers.ts

misc.ts

common.ts

Sempre utilizar nomes específicos.

---

# Nomenclatura

## Pastas

kebab-case

study-planner

question-engine

fgv-strategy

---

## Arquivos

kebab-case

daily-dashboard.ts

progress-card.tsx

knowledge-node.ts

---

## Componentes

PascalCase

StudyDashboard

QuestionCard

FlashcardView

LearningTimeline

---

## Interfaces

PascalCase

interface Question

interface Discipline

interface StudyPlan

---

## Types

PascalCase

QuestionType

ReviewType

DifficultyLevel

---

## Variáveis

camelCase

studyPlan

currentTopic

reviewQueue

---

## Constantes

UPPER_SNAKE_CASE

MAX_REVIEW_DAYS

DEFAULT_SESSION_TIME

---

## Funções

camelCase

generateFlashcards()

loadDashboard()

calculateProgress()

---

# Tipagem

Obrigatório.

Nunca utilizar

any

Preferir

unknown

generics

interfaces

union types

---

# Componentes React

Componentes devem:

ser pequenos

ser reutilizáveis

receber poucas props

não conter lógica pesada

---

# Hooks

Toda lógica reutilizável deve ser extraída para Hooks.

Nunca duplicar lógica.

---

# Props

Sempre utilizar interfaces.

Nunca utilizar objetos anônimos grandes.

---

# Estado

Prioridade

Estado local

↓

Context

↓

Persistência

Evitar estado global desnecessário.

---

# Persistência

Conteúdo

Markdown

Configuração

JSON

Usuário

localStorage

Nunca persistir HTML.

---

# Markdown

Todo conteúdo oficial será escrito em Markdown.

Nunca escrever HTML manualmente.

---

# HTML

Toda renderização ocorre através de componentes.

Nunca concatenar HTML.

---

# CSS

Prioridade

Tailwind

↓

CSS Modules

↓

CSS personalizado

Nunca utilizar estilos inline, exceto quando estritamente necessário.

---

# Componentes

Máximo recomendado

300 linhas

Caso ultrapasse

avaliar divisão.

---

# Funções

Máximo recomendado

60 linhas

Caso ultrapasse

refatorar.

---

# Arquivos

Máximo recomendado

500 linhas

Acima disso

dividir.

---

# Comentários

Comentar

motivações

decisões

algoritmos complexos

Não comentar código óbvio.

Ruim

incrementa contador

Bom

A FGV considera esta regra em concursos desde 2022.

---

# Imports

Ordem

Bibliotecas

↓

Componentes

↓

Hooks

↓

Serviços

↓

Tipos

↓

Utilitários

↓

Arquivos locais

---

# Dependências

Antes de instalar:

Existe solução nativa?

Já utilizamos biblioteca equivalente?

Vale o aumento da complexidade?

---

# Tratamento de Erros

Nunca utilizar

try/catch vazio

Sempre registrar erro.

Sempre apresentar mensagem útil.

---

# Logs

Durante desenvolvimento

console.debug()

console.warn()

console.error()

Antes do deploy

remover logs desnecessários.

---

# Testes

Toda lógica crítica deve possuir testes.

Obrigatório

Planner

Progress

Review

Parser

Knowledge Graph

Flashcards

Questões

---

# Performance

Priorizar

Lazy Loading

Memoização

Virtualização

Cache

Evitar re-renderizações.

---

# Acessibilidade

Todos os componentes devem:

possuir labels

funcionar via teclado

ter contraste adequado

utilizar HTML semântico

---

# Internacionalização

Todo texto visível deve ser centralizado.

Evitar strings espalhadas.

---

# Configuração

Nunca utilizar números mágicos.

Utilizar constantes.

---

# IDs

Nunca depender do texto.

Sempre utilizar IDs.

---

# Estrutura

Cada módulo deve possuir

index.ts

types.ts

services.ts

components/

hooks/

utils/

tests/

---

# Testes

Nome

nome.test.ts

Nunca misturar testes com implementação.

---

# Commits

Um commit

uma responsabilidade.

Exemplos

feat(planner): add adaptive schedule generation

fix(review): correct spaced repetition calculation

refactor(content): split markdown parser

---

# Pull Requests

Toda PR deve responder:

O que foi feito?

Por que foi feito?

Qual impacto?

Existe breaking change?

---

# Refatoração

Sempre que identificar

duplicação

acoplamento

arquivos grandes

código difícil

propor refatoração.

---

# Documentação

Toda alteração arquitetural exige atualização da documentação correspondente.

Nunca deixar documentação desatualizada.

---

# Qualidade

Antes de concluir qualquer tarefa verificar:

✓ arquitetura respeitada

✓ tipagem correta

✓ testes

✓ documentação

✓ acessibilidade

✓ desempenho

✓ reutilização

✓ simplicidade

---

# Objetivo Final

Construir uma base de código limpa, previsível e sustentável, permitindo que a plataforma evolua continuamente por vários concursos sem perda de qualidade, mantendo alta legibilidade tanto para desenvolvedores humanos quanto para agentes de IA.
