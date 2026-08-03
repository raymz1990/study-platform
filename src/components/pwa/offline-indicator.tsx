import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { onOfflineChange } from '@/services/pwa-service'

/**
 * OfflineIndicator — Badge flutuante exibido quando o dispositivo
 * está sem conexão com a internet.
 */
export function OfflineIndicator(): React.ReactElement | null {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const unsubscribe = onOfflineChange((offline) => {
      setIsOffline(offline)
    })
    return unsubscribe
  }, [])

  if (!isOffline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive shadow-lg backdrop-blur-sm dark:bg-destructive/20"
    >
      <WifiOff className="h-4 w-4" aria-hidden="true" />
      <span>Você está offline</span>
    </div>
  )
}
