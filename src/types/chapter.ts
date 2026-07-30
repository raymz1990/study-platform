/**
 * Tipos de Capítulo — Concurso AI Platform.
 *
 * Fonte única: CONTENT_STRUCTURE.md + DATA_MODEL.md
 * Representa o conteúdo de estudo de um capítulo/tópico.
 */

import type { ParsedContent } from '@/types/content'

// ---------------------------------------------------------------------------
// Conteúdo carregado de um capítulo
// ---------------------------------------------------------------------------

export interface ChapterContent {
  /** ID da disciplina (ex: disc_portugues). */
  disciplineId: string
  /** ID do capítulo (ex: chap_morfologia). */
  chapterId: string
  /** Conteúdo parseado (markdown + metadados + headings). */
  parsed: ParsedContent
}

// ---------------------------------------------------------------------------
// Navegação sequencial entre capítulos
// ---------------------------------------------------------------------------

export interface ChapterNavigation {
  /** Capítulo anterior na ordem do roadmap, ou null se for o primeiro. */
  previous: { id: string; title: string; disciplineId: string } | null
  /** Próximo capítulo na ordem do roadmap, ou null se for o último. */
  next: { id: string; title: string; disciplineId: string } | null
}

// ---------------------------------------------------------------------------
// Estado do checklist de um capítulo
// ---------------------------------------------------------------------------

export interface ChapterChecklistItem {
  id: string
  label: string
  checked: boolean
}

// ---------------------------------------------------------------------------
// Resultado do carregamento de conteúdo
// ---------------------------------------------------------------------------

export type ContentLoadResult =
  | { status: 'success'; content: ChapterContent; navigation: ChapterNavigation }
  | { status: 'not_found' }
  | { status: 'error'; message: string }
