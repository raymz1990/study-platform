import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { applyUpdate, onUpdateAvailable } from '@/services/pwa-service'

/**
 * UpdatePrompt — Toast fixo exibido quando uma nova versão
 * da aplicação está disponível. O usuário pode atualizar
 * imediatamente ou dispensar.
 */
export function UpdatePrompt(): React.ReactElement | null {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = onUpdateAvailable(() => {
      setVisible(true)
    })
    return unsubscribe
  }, [])

  const handleUpdate = useCallback(async () => {
    await applyUpdate()
    window.location.reload()
  }, [])

  const handleDismiss = useCallback(() => {
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-16 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-primary/30 bg-card p-4 shadow-xl backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <RefreshCw className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-card-foreground">
            Nova versão disponível
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Uma atualização foi instalada em segundo plano. Recarregue para
            obter as melhorias.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleUpdate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Atualizar agora
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Depois
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fechar notificação"
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
