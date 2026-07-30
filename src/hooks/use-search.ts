/**
 * useSearch — Hook de busca global com debounce e navegação por teclado.
 *
 * Responsabilidade: orquestrar estado da busca, debounce e navegação.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { search } from '@/services/search-service'
import type { SearchState } from '@/types/search'

const DEBOUNCE_MS = 150

export interface UseSearchReturn extends SearchState {
  setQuery: (query: string) => void
  open: () => void
  close: () => void
  toggle: () => void
  selectNext: () => void
  selectPrevious: () => void
  confirmSelection: () => void
}

export function useSearch(): UseSearchReturn {
  const navigate = useNavigate()
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    isOpen: false,
    selectedIndex: -1,
    isLoading: false,
  })

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ---------------------------------------------------------------------------
  // Debounced search
  // ---------------------------------------------------------------------------

  const performSearch = useCallback((query: string) => {
    if (query.trim().length < 2) {
      setState((prev) => ({
        ...prev,
        results: [],
        selectedIndex: -1,
        isLoading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true }))

    // Síncrono — Fuse.js é local e rápido
    const results = search(query)

    setState((prev) => ({
      ...prev,
      results,
      selectedIndex: results.length > 0 ? 0 : -1,
      isLoading: false,
    }))
  }, [])

  const setQuery = useCallback(
    (query: string) => {
      setState((prev) => ({ ...prev, query }))

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        performSearch(query)
      }, DEBOUNCE_MS)
    },
    [performSearch]
  )

  // ---------------------------------------------------------------------------
  // Modal
  // ---------------------------------------------------------------------------

  const open = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      query: '',
      results: [],
      selectedIndex: -1,
    }))
  }, [])

  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      query: '',
      results: [],
      selectedIndex: -1,
    }))
  }, [])

  const toggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      query: prev.isOpen ? '' : prev.query,
      results: prev.isOpen ? [] : prev.results,
      selectedIndex: prev.isOpen ? -1 : prev.selectedIndex,
    }))
  }, [])

  // ---------------------------------------------------------------------------
  // Navegação por teclado
  // ---------------------------------------------------------------------------

  const selectNext = useCallback(() => {
    setState((prev) => {
      if (prev.results.length === 0) return prev
      const next = prev.selectedIndex + 1
      return {
        ...prev,
        selectedIndex: next >= prev.results.length ? 0 : next,
      }
    })
  }, [])

  const selectPrevious = useCallback(() => {
    setState((prev) => {
      if (prev.results.length === 0) return prev
      const next = prev.selectedIndex - 1
      return {
        ...prev,
        selectedIndex: next < 0 ? prev.results.length - 1 : next,
      }
    })
  }, [])

  const confirmSelection = useCallback(() => {
    const selected = state.results[state.selectedIndex]
    if (selected) {
      navigate(selected.url)
      close()
    }
  }, [state.results, state.selectedIndex, navigate, close])

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return {
    ...state,
    setQuery,
    open,
    close,
    toggle,
    selectNext,
    selectPrevious,
    confirmSelection,
  }
}
