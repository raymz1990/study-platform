/**
 * Tipos do sistema de busca global — Concurso AI Platform.
 *
 * Fonte única da verdade: DATA_MODEL.md + UI_UX_GUIDELINES.md (busca)
 */

// ---------------------------------------------------------------------------
// Tipos de resultado
// ---------------------------------------------------------------------------

export type SearchResultType =
  | 'discipline'
  | 'module'
  | 'chapter'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  description?: string
  disciplineId: string
  moduleId?: string
  chapterId?: string
  url: string
}

// ---------------------------------------------------------------------------
// Entrada do índice (fonte para Fuse.js)
// ---------------------------------------------------------------------------

export interface SearchIndexEntry {
  id: string
  type: SearchResultType
  title: string
  description: string
  disciplineId: string
  moduleId?: string
  chapterId?: string
  keywords: string[]
  url: string
}

// ---------------------------------------------------------------------------
// Estado do hook useSearch
// ---------------------------------------------------------------------------

export interface SearchState {
  query: string
  results: SearchResult[]
  isOpen: boolean
  selectedIndex: number
  isLoading: boolean
}

// ---------------------------------------------------------------------------
// Configuração da busca
// ---------------------------------------------------------------------------

export interface SearchConfig {
  keys: string[]
  threshold: number
  limit: number
}
