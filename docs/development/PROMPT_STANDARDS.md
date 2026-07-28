# PROMPT_STANDARDS.md

# Concurso AI Platform
## Prompt Engineering Framework
Version: 1.0

---

# Objetivo

Este documento define o padrão oficial para construção de prompts utilizados pelas Skills da plataforma.

Nenhuma Skill deverá utilizar prompts livres.

Todos deverão seguir a estrutura definida neste documento.

O objetivo é garantir:

- previsibilidade
- qualidade
- reutilização
- consistência
- facilidade de manutenção

---

# Filosofia

Todo prompt representa um contrato.

O prompt deve informar claramente:

Quem é a Skill.

O que ela faz.

O que ela não faz.

Quais entradas recebe.

Quais saídas produz.

Como validar o resultado.

---

# Estrutura Obrigatória

Todos os prompts seguem a mesma estrutura.

SYSTEM

↓

ROLE

↓

OBJECTIVE

↓

CONTEXT

↓

INPUT

↓

PROCESS

↓

OUTPUT

↓

VALIDATION

↓

FAILURES

↓

NEXT ACTION

---

# SYSTEM

Define regras permanentes.

Exemplo

Você faz parte da Concurso AI Platform.

Sempre respeite:

SYSTEM_ARCHITECTURE.md

TECH_STACK.md

DATA_MODEL.md

CONTENT_STANDARDS.md

Nunca ignore estes documentos.

---

# ROLE

Define identidade.

Exemplo

Você é o Professor Engine.

ou

Você é o Planner Engine.

ou

Você é o QA Auditor.

A Role nunca muda durante a execução.

---

# OBJECTIVE

Explica claramente a missão.

Exemplo

Gerar uma apostila completa sobre determinado tópico.

Não incluir objetivos secundários.

---

# CONTEXT

Sempre apresentar:

Concurso

Perfil

Disciplina

Capítulo

Tópico

Banca

Nível

Tempo disponível

Dependências

Conhecimentos prévios

Nunca assumir contexto implícito.

---

# INPUT

Descrever exatamente os dados recebidos.

Exemplo

Disciplina

Capítulo

Tempo

Prioridade

Roadmap

Questões anteriores

Desempenho

---

# PROCESS

Descrever os passos internos.

Exemplo

Analisar contexto.

↓

Consultar dependências.

↓

Gerar teoria.

↓

Gerar exemplos.

↓

Gerar questões.

↓

Gerar flashcards.

↓

Gerar checklist.

Nunca omitir etapas importantes.

---

# OUTPUT

Definir estrutura obrigatória.

Exemplo

Markdown

Metadados

Títulos

Glossário

Checklist

Referências

Nunca produzir texto sem estrutura.

---

# VALIDATION

Todo prompt deve validar:

Alinhamento ao edital.

Completude.

Profundidade.

NotebookLM.

FGV.

Consistência.

---

# FAILURES

Caso alguma informação esteja ausente:

Nunca inventar.

Solicitar complemento.

Caso não seja possível:

Gerar saída parcial indicando claramente as limitações.

---

# NEXT ACTION

Toda Skill deverá indicar o próximo passo esperado.

Exemplo

Enviar para NotebookLM Builder.

Enviar para QA.

Enviar para HTML Builder.

---

# Regras Gerais

Nunca assumir fatos.

Nunca alterar escopo.

Nunca misturar responsabilidades.

Nunca gerar conteúdo fora do objetivo da Skill.

---

# Especialização

Cada Skill possui um único objetivo.

Exemplo

Professor

↓

Produzir teoria.

Planner

↓

Produzir cronograma.

QA

↓

Auditar.

Nunca misturar funções.

---

# Determinismo

Mesmo input.

Mesmo output esperado.

Evitar respostas excessivamente criativas quando a tarefa exigir padronização.

---

# Clareza

Utilizar linguagem objetiva.

Eliminar ambiguidades.

Explicitar todas as restrições.

---

# Referências

Sempre utilizar:

Edital

Legislação

Normas

Bibliografia oficial

Documentação técnica

Nunca utilizar fontes não verificáveis.

---

# Qualidade

Todo prompt deve responder:

O objetivo está claro?

As entradas são suficientes?

A saída está definida?

Existe validação?

Existe próximo passo?

Caso alguma resposta seja negativa, revisar o prompt.

---

# Templates

Toda Skill deverá possuir um template próprio seguindo este documento.

Não utilizar prompts escritos manualmente durante a implementação.

---

# Objetivo Final

Garantir que todas as Skills da plataforma produzam resultados previsíveis, consistentes, reutilizáveis e alinhados à arquitetura do sistema, permitindo evolução contínua sem perda de qualidade.