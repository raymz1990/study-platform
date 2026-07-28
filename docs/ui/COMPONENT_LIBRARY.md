# COMPONENT_LIBRARY.md

# Concurso AI Platform
## Component Library
Version: 2.0

---

# Objetivo

Definir todos os componentes reutilizáveis da plataforma.

Os componentes são divididos em quatro categorias:

- Foundation Components
- Layout Components
- Business Components
- Learning Components

Todo novo componente deverá pertencer a apenas uma categoria.

---

# Arquitetura

Foundation

↓

Layout

↓

Business

↓

Learning

Nunca inverter esta hierarquia.

---

# Foundation Components

Componentes básicos reutilizados em toda aplicação.

## Inputs

Button

IconButton

Input

Textarea

Select

Checkbox

Radio

Switch

Slider

DatePicker

SearchInput

---

## Feedback

Alert

Toast

Modal

Drawer

Tooltip

Popover

Spinner

Skeleton

ProgressBar

EmptyState

ErrorState

LoadingState

---

## Navegação

Tabs

Breadcrumb

Pagination

Dropdown

Menu

ContextMenu

---

## Exibição

Badge

Chip

Avatar

Tag

Divider

Card

Table

List

Accordion

Timeline

TreeView

---

# Layout Components

Estrutura visual da aplicação.

Header

Sidebar

Footer

MainContent

PageContainer

Section

Panel

Grid

SplitView

FloatingActionBar

---

# Business Components

Componentes relacionados ao funcionamento da plataforma.

## Conteúdo

MarkdownViewer

GlossaryPanel

ReferencePanel

MetadataPanel

Callout

CodeBlock

FormulaViewer

ImageViewer

VideoPlayer

AudioPlayer

---

## Dashboard

KPICard

ProgressChart

Heatmap

RadarChart

TimelineChart

Calendar

RecentActivity

NotificationsPanel

StatisticsPanel

---

## Exportação

NotebookExport

PodcastExport

MarkdownPreview

PrintPreview

DownloadPanel

---

# Learning Components

Componentes específicos do domínio de concursos públicos.

## Planejamento

StudyPlanner

StudyRoadmap

StudySession

DailyMission

WeeklyPlan

ExamCountdown

---

## Aprendizagem

SubjectCard

DisciplineCard

TopicCard

LessonCard

ConceptCard

KnowledgeGraph

LearningPath

DependencyMap

---

## Questões

QuestionCard

QuestionReview

QuestionFilter

QuestionHistory

AnswerAnalysis

ErrorAnalysis

QuestionStatistics

---

## Revisão

Flashcard

FlashcardDeck

RevisionCard

RevisionQueue

RevisionTimeline

RevisionCalendar

SpacedRepetitionPanel

---

## Desempenho

ProgressCard

StudyStreak

WeakTopicsPanel

StrongTopicsPanel

PerformanceIndicator

PerformanceHeatmap

StudyMetrics

GoalTracker

---

## NotebookLM

NotebookSource

NotebookCollection

NotebookSyncStatus

PodcastQueue

PodcastEpisode

PodcastHistory

---

# Estados

Todo componente deverá implementar:

Default

Hover

Focus

Active

Disabled

Loading

Success

Error

Empty

---

# Responsividade

Todos os componentes deverão funcionar em:

Desktop

Tablet

Mobile

---

# Acessibilidade

Todo componente deverá possuir:

HTML semântico

Navegação por teclado

Focus visível

Compatibilidade com leitores de tela

ARIA quando aplicável

---

# Reutilização

Antes de criar um novo componente verificar:

Existe componente semelhante?

Pode ser estendido?

Pode ser parametrizado?

Nunca criar componentes duplicados.

---

# Versionamento

Toda alteração em componente reutilizável deverá atualizar este documento.

---

# Convenções

Utilizar PascalCase para componentes.

Exemplos:

StudyPlanner

FlashcardDeck

QuestionReview

KnowledgeGraph

Nunca utilizar nomes genéricos.

---

# Objetivo Final

Manter uma biblioteca única de componentes reutilizáveis, organizada por responsabilidade, consistente com o Design System e preparada para evolução contínua da plataforma.