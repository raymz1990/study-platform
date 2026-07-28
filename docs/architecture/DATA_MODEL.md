# DATA_MODEL.md

# Concurso AI Platform
## Data Model Specification
Version: 1.0

---

# Objetivo

Este documento define todos os modelos de dados utilizados pela plataforma.

A plataforma não utiliza banco de dados.

Todos os dados são armazenados em arquivos Markdown, JSON e conteúdo gerado.

Este documento é a fonte única da verdade para qualquer estrutura de dados utilizada no projeto.

---

# Filosofia

Todo objeto deve possuir:

- Identificador único
- Estrutura previsível
- Tipagem consistente
- Independência da interface
- Independência da banca

---

# Identificadores

Todos os objetos possuem:

id

Formato:

categoria_nome_slug

Exemplos

disc_contabilidade

topic_balanco_patrimonial

question_fgv_000123

flashcard_001245

podcast_000041

---

# Hierarquia

Concurso

↓

Perfil

↓

Disciplina

↓

Módulo

↓

Capítulo

↓

Tópico

↓

Objeto de Estudo

---

# Concurso

Representa um edital completo.

Campos

id

nome

instituicao

banca

cargo

perfil

edital

data_prova

disciplinas[]

status

---

# Perfil

Representa o perfil/cargo escolhido.

Campos

id

nome

descricao

requisitos

atribuicoes

disciplinas[]

---

# Disciplina

Campos

id

nome

ordem

peso

prioridade

horas_estimadas

horas_estudadas

percentual_concluido

status

dependencias[]

modulos[]

---

# Módulo

Exemplo

Contabilidade Geral

↓

Ativo

↓

Passivo

↓

Patrimônio Líquido

Campos

id

disciplina

nome

descricao

ordem

capitulos[]

---

# Capítulo

Campos

id

titulo

descricao

tempo_estimado

dificuldade

objetivos[]

topicos[]

status

---

# Tópico

Menor unidade pedagógica.

Campos

id

titulo

descricao

competencias[]

conteudos[]

questoes[]

flashcards[]

podcasts[]

revisoes[]

---

# Competência

Representa uma habilidade esperada.

Campos

id

descricao

nivel

status

---

# Conteúdo

Representa uma apostila.

Campos

id

tipo

titulo

descricao

arquivo

tempo_leitura

versao

status

referencias[]

---

Tipos

apostila

resumo

mapa_mental

checklist

glossario

tabela

roteiro

---

# Questão

Campos

id

banca

ano

disciplina

topico

nivel

tipo

enunciado

alternativas[]

gabarito

explicacao

fonte

tags[]

---

Tipos

múltipla escolha

certo ou errado

dissertativa

---

# Flashcard

Campos

id

topico

frente

verso

nivel

tags[]

ultima_revisao

proxima_revisao

acertos

erros

---

# Podcast

Campos

id

titulo

topico

duracao

roteiro

arquivo

status

---

# Revisão

Campos

id

topico

tipo

data_prevista

data_realizada

resultado

tempo

---

Tipos

24h

7d

30d

60d

90d

livre

---

# Simulado

Campos

id

titulo

banca

disciplinas[]

questoes[]

tempo

nota

data

---

# Plano Diário

Campos

id

data

disciplinas[]

tarefas[]

tempo_previsto

tempo_realizado

status

---

# Tarefa

Campos

id

tipo

titulo

descricao

tempo

prioridade

status

---

Tipos

Estudo

Questões

Flashcards

Podcast

Revisão

Simulado

Leitura

---

# Estatísticas

Campos

horas_estudadas

horas_previstas

acertos

erros

percentual_edital

percentual_disciplina

revisoes_pendentes

simulados

nota_media

tempo_medio

---

# Dashboard

O Dashboard utiliza apenas leitura dos modelos.

Nunca deverá possuir lógica própria.

---

# Strategy

As bancas nunca alteram os modelos.

Cada banca apenas acrescenta comportamento.

Exemplo

FGV

↓

peso_assunto

pegadinhas

estilo

bibliografia

---

# Conteúdo NotebookLM

Todo documento deve possuir metadados.

Campos

titulo

disciplina

capitulo

topicos

palavras_chave

objetivos

nivel

referencias

ultima_atualizacao

---

# HTML

Cada página deverá possuir

id

slug

titulo

conteudo

indice

breadcrumbs

tags

---

# Favoritos

Campos

id_usuario

conteudo

tipo

data

---

# Configuração

Campos

tema

tempo_estudo

horas_semanais

objetivo

data_prova

notificacoes

---

# Progresso

Campos

disciplina

topico

percentual

tempo

acertos

erros

ultima_revisao

---

# Histórico

Campos

data

atividade

tempo

resultado

observacoes

---

# Auditoria

Campos

conteudo

status

problemas

recomendacoes

ultima_analise

---

# Convenções

Nunca armazenar HTML.

Sempre armazenar Markdown.

Nunca duplicar conteúdo.

Sempre utilizar IDs imutáveis.

Toda referência deve utilizar IDs.

Nunca utilizar texto como chave.

---

# Relacionamentos

Concurso

└── Perfil

    └── Disciplinas

        └── Módulos

            └── Capítulos

                └── Tópicos

                    ├── Apostilas

                    ├── Flashcards

                    ├── Questões

                    ├── Podcasts

                    ├── Revisões

                    └── Estatísticas

---

# Objetivo Final

Criar um modelo de dados consistente, desacoplado e reutilizável, permitindo que qualquer concurso possa ser incorporado à plataforma apenas substituindo o edital, a estratégia da banca e o conteúdo, sem necessidade de alterar a arquitetura principal.