/**
 * SearchResultItem — Item individual de resultado de busca.
 */

import type { ReactElement } from 'react'
import { BookOpen, FolderOpen, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchResult } from '@/types/search'

const TYPE_ICONS = {
  discipline: BookOpen,
  module: FolderOpen,
  chapter: FileText,
}

interface SearchResultItemProps {
  result: SearchResult
  isSelected: boolean
  onClick: () => void
  query: string
}

function highlightText(text: string, query: string): ReactElement {
  if (!query.trim()) return <>{text}</>

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="rounded bg-primary/20 px-0.5 font-semibold text-primary">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export function SearchResultItem({ result, isSelected, onClick, query }: SearchResultItemProps) {
  const Icon = TYPE_ICONS[result.type] ?? FileText

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg px-4 py-3 text-left transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isSelected
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-accent hover:text-accent-foreground'
      )}
      role="option"
      aria-selected={isSelected}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-medium truncate', isSelected && 'text-primary-foreground')}>
          {highlightText(result.title, query)}
        </p>
        {result.description && (
          <p className={cn('mt-0.5 text-xs truncate opacity-70', isSelected && 'text-primary-foreground/80')}>
            {highlightText(result.description, query)}
          </p>
        )}
      </div>
    </button>
  )
}
