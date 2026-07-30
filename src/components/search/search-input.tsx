/**
 * SearchInput — Campo de busca estilizado com ícone.
 */

import { forwardRef } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
  autoFocus?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ value, onChange, isLoading, autoFocus }, ref) {
    return (
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar disciplina, capítulo, assunto..."
          autoFocus={autoFocus}
          className={cn(
            'h-11 w-full rounded-t-lg border-b bg-transparent pl-9 pr-10 text-sm',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-0'
          )}
          aria-label="Buscar na plataforma"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
        />
        {isLoading && (
          <Loader2
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </div>
    )
  }
)
