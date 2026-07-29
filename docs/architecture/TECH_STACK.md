# TECH_STACK.md

# Concurso AI Platform

## Technical Stack

Version: 1.0

---

# 1. Objetivo

Este documento define todas as tecnologias oficiais utilizadas no projeto.

Nenhuma tecnologia deverá ser substituída sem justificativa técnica.

Todas as Skills deverão respeitar este documento.

---

# 2. Filosofia

A stack deve priorizar:

- Gratuidade
- Simplicidade
- Performance
- Escalabilidade
- Manutenibilidade
- Compatibilidade com GitHub Pages
- Facilidade para agentes de IA

---

# 3. Arquitetura

Tipo:

Static Site Generation (SSG)

Sem Backend

Sem Banco SQL

Sem APIs obrigatórias

Todo processamento ocorre durante a geração do projeto.

---

# 4. Linguagem

Oficial:

TypeScript

Nunca utilizar JavaScript puro para novos módulos.

---

# 5. Front-end

Framework Oficial

React

Build Tool

Vite

Motivos

- extremamente rápido

- excelente suporte de ferramentas de IA

- simples

- GitHub Pages

- grande comunidade

---

# 6. Estilo

Tailwind CSS

Motivos

- produtividade

- responsividade

- organização

- Dark Mode nativo

Nunca escrever CSS grande quando Tailwind resolver.

CSS personalizado apenas quando necessário.

---

# 7. Componentes

shadcn/ui

Motivos

- acessibilidade

- componentes modernos

- excelente integração React

---

# 8. Ícones

Lucide React

Nunca utilizar imagens para ícones.

---

# 9. Gráficos

Recharts

Usado para

Dashboard

Progresso

Acertos

Horas estudadas

Cronograma

---

# 10. Diagramas

Mermaid

Utilizado em:

Arquitetura

Fluxos

Roadmaps

Mapas

---

# 11. Markdown

Todos os conteúdos serão escritos em Markdown.

Formato oficial

.md

Nunca HTML manual para apostilas.

---

# 12. Parser Markdown

react-markdown

remark

rehype

---

# 13. Busca

Fuse.js

Busca local

Sem servidor

Offline

---

# 14. Armazenamento

localStorage

Responsável por:

- progresso

- configurações

- favoritos

- tema

- tempo estudado

Nunca armazenar conteúdo.

Conteúdo permanece em arquivos Markdown.

---

# 15. Estrutura de Conteúdo

/content

Cada disciplina possui:

Roadmap

Capítulos

Flashcards

Questões

Resumos

Podcasts

---

# 16. Formato dos Dados

JSON

Utilizado para:

cronograma

progresso

questões

estatísticas

planejamento

---

# 17. Banco de Dados

Não utilizar.

Toda informação será baseada em arquivos.

---

# 18. Pesquisa

Busca local indexada.

Sem ElasticSearch.

Sem Algolia.

Sem serviços externos.

---

# 19. Deploy

GitHub Actions

↓

GitHub Pages

↓

Cloudflare Access

Deploy automático.

---

# 20. Versionamento

Git

GitHub

Estratégia de branches oficial (unificada com DEPLOYMENT.md):

main

Produção

develop

Integração

feature/*

Novas funcionalidades

bugfix/*

Correções

release/*

Preparação para produção

hotfix/*

Correções urgentes

refactor/*

Refatorações (merged via develop)

Nunca desenvolver diretamente na main.

---

# 21. Estrutura

project/

    docs/

    public/

    src/

    content/

    scripts/

    config/

    planner/

    notebooklm/

    podcasts/

    dashboard/

---

# 22. Organização React

src/

components/

pages/

hooks/

services/

types/

utils/

contexts/

layouts/

assets/

---

# 23. Componentização

Cada componente deve possuir responsabilidade única.

Nunca criar componentes gigantes.

Máximo recomendado:

300 linhas.

---

# 24. Tipagem

Obrigatório.

Nunca utilizar:

any

Preferir:

interfaces

types

generics

---

# 25. Qualidade

ESLint

Prettier

Configuração obrigatória.

---

# 26. Testes

Vitest

React Testing Library

Testes mínimos para:

Planner

Progress

Parser

Flashcards

---

# 27. Performance

Lazy Loading

Code Splitting

Memoização quando necessária.

---

# 28. Acessibilidade

WCAG AA

Navegação por teclado.

Contraste adequado.

---

# 29. Responsividade

Desktop

Tablet

Mobile

Desktop é prioridade.

---

# 30. Progressive Web App

Utilizar:

vite-plugin-pwa

Objetivos

Instalação

Offline

Cache

Atualização automática

---

# 31. Dark Mode

Obrigatório.

Preferência salva.

---

# 32. Fontes

Inter

JetBrains Mono

---

# 33. Gerenciador de Pacotes

pnpm

Nunca utilizar npm para novos projetos.

---

# 34. Estrutura de Conteúdo

Estrutura oficial por disciplina (unificada com SYSTEM_ARCHITECTURE.md §11):

disciplina/

    00-roadmap.md

    01-fundamentos/

    02-intermediario/

    03-avancado/

    04-questoes/

    05-revisao/

    06-simulado/

    07-flashcards/

    08-podcast/

    09-resumos/

---

# 35. Scripts

scripts/

build-content.ts

generate-index.ts

planner.ts

generate-dashboard.ts

deploy.ts

---

# 36. NotebookLM

Todo Markdown deverá conter:

Título

Resumo

Índice

Capítulos

Glossário

Referências

Checklist

---

# 37. HTML

Nunca utilizar HTML puro.

Todo HTML deve ser gerado por React.

---

# 38. Dependências Permitidas

React

Vite

Tailwind

TypeScript

React Router

Fuse.js

Recharts

Mermaid

Lucide

React Markdown

Remark

Rehype

Shadcn/ui

Vitest

PWA Plugin

---

# 39. Dependências Proibidas

jQuery

Bootstrap

Moment.js

Angular

Vue

Next.js

Banco SQL

Firebase

Supabase

Backend Node

PHP

---

# 40. Objetivo Final

Construir uma plataforma moderna, rápida, gratuita, escalável e facilmente mantida por agentes de IA, utilizando exclusivamente tecnologias compatíveis com hospedagem estática no GitHub Pages e preparadas para evolução futura.
