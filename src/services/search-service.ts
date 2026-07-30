/**
 * Search Service — Motor de busca local com Fuse.js.
 *
 * Responsabilidade: consultar o índice e retornar resultados ranqueados.
 * Puro — sem React, sem estado, sem efeitos colaterais.
 */

import Fuse, { type IFuseOptions } from 'fuse.js'
import { SEARCH_INDEX } from '@/services/search-index-builder'
import type { SearchResult, SearchIndexEntry } from '@/types/search'

// ---------------------------------------------------------------------------
// Configuração Fuse.js
// ---------------------------------------------------------------------------

const FUSE_OPTIONS: IFuseOptions<SearchIndexEntry> = {
  keys: [
    { name: 'title', weight: 0.45 },
    { name: 'description', weight: 0.25 },
    { name: 'keywords', weight: 0.30 },
  ],
  threshold: 0.35,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  shouldSort: true,
}

// ---------------------------------------------------------------------------
// Instância singleton (lazy — apenas quando necessário)
// ---------------------------------------------------------------------------

let fuseInstance: Fuse<SearchIndexEntry> | null = null

function getFuse(): Fuse<SearchIndexEntry> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(SEARCH_INDEX, FUSE_OPTIONS)
  }
  return fuseInstance
}

// ---------------------------------------------------------------------------
// Busca pública
// ---------------------------------------------------------------------------

const RESULT_LIMIT = 12

export function search(query: string): SearchResult[] {
  const trimmed = query.trim()

  if (trimmed.length < 2) {
    return []
  }

  const fuse = getFuse()
  const raw = fuse.search(trimmed, { limit: RESULT_LIMIT })

  return raw.map((item) => {
    const entry = item.item
    const base: SearchResult = {
      id: entry.id,
      type: entry.type,
      title: entry.title,
      description: entry.description,
      disciplineId: entry.disciplineId,
      url: entry.url,
    }

    // exactOptionalPropertyTypes: só inclui propriedade se tiver valor
    if (entry.moduleId) {
      base.moduleId = entry.moduleId
    }
    if (entry.chapterId) {
      base.chapterId = entry.chapterId
    }

    return base
  })
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

export function groupResultsByType(results: SearchResult[]): Record<string, SearchResult[]> {
  const groups: Record<string, SearchResult[]> = {}

  for (const result of results) {
    const key = result.type
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(result)
  }

  return groups
}

export function getResultTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    discipline: 'Disciplina',
    module: 'Módulo',
    chapter: 'Capítulo',
  }
  return labels[type] ?? type
}
