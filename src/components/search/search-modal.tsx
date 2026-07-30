/**
 * SearchModal — Modal de busca global com overlay, input e resultados.
 *
 * Ativado pelo atalho S (Task 004) e fechado com Esc.
 * Navegação por teclado: ↑/↓ para selecionar, Enter para confirmar.
 */

import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchInput } from './search-input'
import { SearchResults } from './search-results'
import { useSearch } from '@/hooks/use-search'

export function SearchModal() {
  const search = useSearch()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOpen = () => search.open()
    window.addEventListener('open-search-modal', handleOpen)
    return () => window.removeEventListener('open-search-modal', handleOpen)
  }, [search])

  // Foco no input ao abrir
  useEffect(() => {
    if (search.isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [search.isOpen])

  // Tratamento de teclas globais quando o modal está aberto
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!search.isOpen) return

      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          search.close()
          break
        case 'ArrowDown':
          event.preventDefault()
          search.selectNext()
          break
        case 'ArrowUp':
          event.preventDefault()
          search.selectPrevious()
          break
        case 'Enter':
          event.preventDefault()
          search.confirmSelection()
          break
      }
    },
    [search]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Fechar ao clicar fora
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === modalRef.current) {
        search.close()
      }
    },
    [search]
  )

  const handleSelect = useCallback(
    (index: number) => {
      const result = search.results[index]
      if (result) {
        search.close()
        navigate(result.url)
      }
    },
    [search, navigate]
  )

  if (!search.isOpen) return null

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[10vh] backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Busca global"
    >
      <div
        className={cn(
          'w-full max-w-xl overflow-hidden rounded-lg border bg-popover shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200'
        )}
      >
        {/* Header */}
        <div className="relative">
          <SearchInput
            ref={inputRef}
            value={search.query}
            onChange={search.setQuery}
            isLoading={search.isLoading}
            autoFocus
          />
          <button
            type="button"
            onClick={search.close}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Fechar busca"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Resultados */}
        <SearchResults
          results={search.results}
          selectedIndex={search.selectedIndex}
          onSelect={handleSelect}
          query={search.query}
        />

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
          <div className="flex gap-3">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">↑↓</kbd>
            <span>Navegar</span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">Enter</kbd>
            <span>Selecionar</span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">Esc</kbd>
            <span>Fechar</span>
          </div>
          {search.results.length > 0 && (
            <span>{search.results.length} resultado{search.results.length > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  )
}
