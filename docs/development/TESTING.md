# TESTING.md

# Concurso AI Platform
## Testing Strategy
Version: 1.0

---

# Objetivo

Definir a estratégia oficial de testes da plataforma.

Todo componente, conteúdo e funcionalidade deverá ser validado antes de ser considerado concluído.

O objetivo não é apenas encontrar erros.

O objetivo é garantir qualidade técnica, consistência pedagógica e estabilidade da plataforma.

---

# Filosofia

Toda implementação deverá responder quatro perguntas:

Está funcionando?

↓

Está correta?

↓

É sustentável?

↓

Ajuda o candidato a estudar melhor?

Caso qualquer resposta seja negativa, a implementação não deve ser considerada concluída.

---

# Pirâmide de Testes

Prioridade

Testes Unitários

↓

Testes de Integração

↓

Testes Funcionais

↓

Testes de Interface

↓

Testes de Conteúdo

↓

Testes Pedagógicos

---

# Tipos de Testes

## Unitários

Validam funções isoladas.

Exemplos

Parser Markdown

Planner

Knowledge Graph

Review Engine

Flashcards

Progress Tracker

---

## Integração

Validam comunicação entre módulos.

Exemplos

Planner → Dashboard

Conteúdo → HTML

Markdown → NotebookLM

Questões → Estatísticas

---

## Funcionais

Validam funcionalidades completas.

Exemplos

Criar plano diário

Resolver questões

Registrar revisão

Exportar conteúdo

Gerar podcast

---

## Interface

Validam experiência do usuário.

Verificar

Responsividade

Navegação

Acessibilidade

Dark Mode

Performance

Atalhos

---

## Conteúdo

Todo material deve ser validado quanto a:

alinhamento ao edital

completude

clareza

estrutura

referências

FGV

NotebookLM

---

## Pedagógicos

Verificar

Objetivos definidos

Progressão lógica

Exemplos suficientes

Pegadinhas FGV

Questões comentadas

Checklist

Flashcards

Resumo

Podcast

---

# Critérios de Aceite

Uma funcionalidade somente poderá ser considerada pronta quando:

✓ Implementação concluída

✓ Testes unitários aprovados

✓ Integração validada

✓ Documentação atualizada

✓ Performance mantida

✓ Sem regressões

---

# Cobertura

Módulos críticos

Cobertura mínima

90%

Demais módulos

Cobertura mínima

80%

---

# Casos Críticos

Obrigatório testar

Planner

Knowledge Graph

Question Engine

Review Engine

Dashboard

Progress Tracker

Parser Markdown

Gerador HTML

---

# Testes de Regressão

Após qualquer alteração verificar:

Dashboard

Cronograma

Questões

Flashcards

Progresso

Conteúdo

Exportação

---

# Testes de Performance

Objetivos

Página inicial

<2 segundos

Mudança de página

Instantânea

Pesquisa

<300 ms

Build

<5 minutos

---

# Testes de Acessibilidade

Verificar

Contraste

HTML semântico

ARIA

Teclado

Leitor de tela

Foco

---

# Testes de Responsividade

Desktop

Tablet

Mobile

A plataforma deve manter funcionalidade em todos os dispositivos suportados.

---

# Testes de Conteúdo

Toda apostila deverá possuir:

Objetivos

Introdução

Conteúdo

Exemplos

Questões

Resumo

Glossário

Flashcards

Checklist

Referências

---

# Testes NotebookLM

Verificar

Hierarquia

Metadados

Estrutura

Compatibilidade

Títulos

Subtítulos

---

# Testes FGV

Todo capítulo deverá responder:

O assunto está previsto no edital?

As questões seguem o padrão FGV?

Existem pegadinhas?

Há exemplos de cobrança?

O resumo contempla os pontos críticos?

---

# Testes de Segurança

Verificar

Dependências

Dados do usuário

Configurações

Links

Exportações

---

# Testes Automatizados

Sempre automatizar quando possível.

Prioridade

Unitários

Integração

Build

Lint

Links

Markdown

---

# Testes Manuais

Obrigatórios para

Experiência de estudo

Conteúdo

Interface

Fluxos completos

---

# Registro de Defeitos

Todo defeito deverá conter

ID

Descrição

Severidade

Reprodução

Impacto

Correção

Status

---

# Severidade

Crítica

Impede utilização.

Alta

Compromete funcionalidade.

Média

Impacta experiência.

Baixa

Problema visual ou melhoria.

---

# Checklist Final

Antes de concluir qualquer tarefa verificar

✓ Arquitetura preservada

✓ Data Model respeitado

✓ Código limpo

✓ Sem duplicação

✓ Testes aprovados

✓ Conteúdo validado

✓ NotebookLM compatível

✓ FGV validada

✓ Performance

✓ Responsividade

✓ Acessibilidade

✓ Documentação atualizada

---

# Objetivo Final

Garantir que toda funcionalidade, conteúdo e componente entregue pela plataforma seja tecnicamente correto, pedagogicamente eficaz e mantenha a qualidade arquitetural do projeto ao longo de sua evolução.