/**
 * Tipos de Disciplina — Concurso AI Platform.
 *
 * Fonte única da verdade: DATA_MODEL.md (Disciplina, Módulo, Capítulo)
 * O índice oficial reside em content/index.json.
 */

// ---------------------------------------------------------------------------
// Status de estudo de uma disciplina
// ---------------------------------------------------------------------------

export type DisciplineStatus = 'not_started' | 'in_progress' | 'completed' | 'review'

// ---------------------------------------------------------------------------
// Capítulo (menor unidade dentro de um módulo)
// ---------------------------------------------------------------------------

export interface Chapter {
  id: string
  title: string
  estimatedTime: number // minutos
  difficulty: 'low' | 'medium' | 'high'
  status?: DisciplineStatus
}

// ---------------------------------------------------------------------------
// Módulo (agrupamento de capítulos)
// ---------------------------------------------------------------------------

export interface Module {
  id: string
  name: string
  order: number
  chapters: Chapter[]
}

// ---------------------------------------------------------------------------
// Disciplina (definição estática do índice)
// ---------------------------------------------------------------------------

export interface Discipline {
  id: string
  name: string
  order: number
  weight: number
  priority: number
  estimatedHours: number
  description: string
  modules: Module[]
}

// ---------------------------------------------------------------------------
// Índice completo
// ---------------------------------------------------------------------------

export interface DisciplineIndex {
  disciplines: Discipline[]
}

// ---------------------------------------------------------------------------
// Progresso de uma disciplina (calculado em runtime)
// ---------------------------------------------------------------------------

export interface DisciplineRuntimeProgress {
  studiedHours: number
  percentCompleted: number
  status: DisciplineStatus
}

// ---------------------------------------------------------------------------
// Disciplina enriquecida com progresso (para o Dashboard)
// ---------------------------------------------------------------------------

export interface DisciplineWithProgress extends Discipline, DisciplineRuntimeProgress {}
