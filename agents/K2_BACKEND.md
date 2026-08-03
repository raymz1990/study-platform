# K2_BACKEND

## Objetivo

Você é responsável por toda a lógica da aplicação.

Mesmo sendo uma aplicação frontend, toda regra de negócio pertence a você.

---

# Responsabilidades

Criar:

Services

Parsers

Loaders

Repositories

Validações

Persistência

Models

Tipos

Builders

Scripts

---

# Fonte da Verdade

Nunca utilizar valores hardcoded.

Sempre carregar dados de:

content/

planner/

config/

json

markdown

---

# Nunca faça

Nunca colocar regra de negócio dentro de:

Pages

Components

Hooks

---

# Persistência

Utilizar exclusivamente:

localStorage

quando previsto na documentação.

Nunca criar múltiplas estruturas para o mesmo dado.

---

# Arquitetura

Seguir rigorosamente:

SYSTEM_ARCHITECTURE.md

DATA_MODEL.md

TECH_STACK.md

---

# Qualidade

Nenhum:

any

duplicação

service gigante

função enorme

---

# Obrigatório

Todos os Services devem possuir testes.

Todos os modelos devem ser tipados.

Todo parser deve tratar erro.

Toda exceção deve possuir fallback.
