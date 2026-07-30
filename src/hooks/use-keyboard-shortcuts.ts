import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Atalhos de teclado oficiais da plataforma.
 *
 * D → Dashboard
 * Q → Questões
 * F → Flashcards
 * R → Revisões
 * S → Busca (placeholder — Task 011)
 * Esc → Fechar drawer mobile
 *
 * Desativados automaticamente quando o foco está em inputs/textarea.
 */
const SHORTCUTS: Record<string, string> = {
  d: '/',
  q: '/questoes',
  f: '/flashcards',
  r: '/revisoes',
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false

  const tagName = target.tagName?.toLowerCase() ?? ''
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    target.isContentEditable ||
    (typeof target.getAttribute === 'function' && target.getAttribute('role') === 'textbox')
  )
}

export function useKeyboardShortcuts(): void {
  const navigate = useNavigate()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isEditableElement(event.target)) return

      const key = event.key.toLowerCase()

      if (key === 'escape') {
        /* Esc fecha drawers/modais — delegado para componentes individuais */
        return
      }

      if (key === 's') {
        event.preventDefault()
        window.dispatchEvent(new CustomEvent('open-search-modal'))
        return
      }

      const path = SHORTCUTS[key]
      if (path !== undefined) {
        event.preventDefault()
        navigate(path)
      }
    },
    [navigate]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
