/**
 * SearchResults — Lista de resultados agrupados por tipo.
 */

import { SearchResultItem } from './search-result-item'
import { getResultTypeLabel } from '@/services/search-service'
import type { SearchResult } from '@/types/search'

interface SearchResultsProps {
  results: SearchResult[]
  selectedIndex: number
  onSelect: (index: number) => void
  query: string
}

export function SearchResults({ results, selectedIndex, onSelect, query }: SearchResultsProps) {
  if (results.length === 0) {
    if (query.trim().length >= 2) {
      return (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum resultado encontrado para &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Tente termos mais gerais ou verifique a ortografia.
          </p>
        </div>
      )
    }

    return (
      <div className="px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Digite pelo menos 2 caracteres para buscar.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {['Português', 'Matemática Financeira', 'LGPD', 'VPL'].map((term) => (
            <kbd
              key={term}
              className="rounded border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {term}
            </kbd>
          ))}
        </div>
      </div>
    )
  }

  // Agrupa por tipo mantendo a ordem dos resultados
  const grouped: { type: string; items: { result: SearchResult; index: number }[] }[] = []
  let currentType = ''
  let currentGroup: (typeof grouped)[number] | null = null

  for (const [i, result] of results.entries()) {
    if (result.type !== currentType) {
      currentType = result.type
      currentGroup = { type: currentType, items: [] }
      grouped.push(currentGroup)
    }
    if (currentGroup) {
      currentGroup.items.push({ result, index: i })
    }
  }

  return (
    <div className="max-h-[60vh] overflow-y-auto py-2" role="listbox">
      {grouped.map((group) => (
        <div key={group.type}>
          <div className="sticky top-0 bg-background/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
            {getResultTypeLabel(group.type)}
          </div>
          <div className="px-2">
            {group.items.map(({ result, index }) => (
              <SearchResultItem
                key={result.id}
                result={result}
                isSelected={index === selectedIndex}
                onClick={() => onSelect(index)}
                query={query}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
