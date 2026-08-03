/**
 * PWA Service — Gerencia o ciclo de vida do Service Worker,
 * detecção de estado offline e atualizações da aplicação.
 */

type PWAUpdateHandler = () => void
type PWAOfflineHandler = (offline: boolean) => void

interface PWAUpdateEventDetail {
  updateSW: () => Promise<void>
}

interface PWAState {
  isOffline: boolean
  needsUpdate: boolean
  updateSW: (() => Promise<void>) | null
}

const state: PWAState = {
  isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  needsUpdate: false,
  updateSW: null,
}

const updateHandlers: Set<PWAUpdateHandler> = new Set()
const offlineHandlers: Set<PWAOfflineHandler> = new Set()

function notifyUpdate(): void {
  updateHandlers.forEach((handler) => handler())
}

function notifyOffline(): void {
  offlineHandlers.forEach((handler) => handler(state.isOffline))
}

function isCustomEventWithDetail(event: Event): event is CustomEvent<PWAUpdateEventDetail> {
  return 'detail' in event && event instanceof CustomEvent
}

/**
 * Registra listeners de eventos online/offline do navegador
 * e de atualização do vite-plugin-pwa.
 */
function registerNetworkListeners(): void {
  if (typeof window === 'undefined') return

  window.addEventListener('online', () => {
    state.isOffline = false
    notifyOffline()
  })

  window.addEventListener('offline', () => {
    state.isOffline = true
    notifyOffline()
  })

  window.addEventListener('vite-pwa:update-ready', (e: Event) => {
    if (!isCustomEventWithDetail(e)) return

    const detail = e.detail
    if (typeof detail.updateSW === 'function') {
      state.needsUpdate = true
      state.updateSW = detail.updateSW
      notifyUpdate()
    }
  })
}

/**
 * Registra o callback de atualização do vite-plugin-pwa.
 * Mantido para compatibilidade com integrações externas.
 */
export function registerSWUpdate(callback: (updateFn: () => Promise<void>) => void): void {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('vite-pwa:update-ready', (e: Event) => {
    if (!isCustomEventWithDetail(e)) return

    const detail = e.detail
    if (typeof detail.updateSW === 'function') {
      callback(detail.updateSW)
    }
  })
}

/**
 * Executa a atualização do Service Worker.
 */
export async function applyUpdate(): Promise<void> {
  if (state.updateSW) {
    await state.updateSW()
    state.needsUpdate = false
  }
}

/**
 * Retorna o estado atual de offline.
 */
export function getIsOffline(): boolean {
  return state.isOffline
}

/**
 * Retorna se há uma atualização pendente.
 */
export function getNeedsUpdate(): boolean {
  return state.needsUpdate
}

/**
 * Subscreve a mudanças de estado offline.
 */
export function onOfflineChange(handler: PWAOfflineHandler): () => void {
  offlineHandlers.add(handler)
  // Notifica estado inicial
  handler(state.isOffline)
  return () => {
    offlineHandlers.delete(handler)
  }
}

/**
 * Subscreve a notificações de atualização.
 */
export function onUpdateAvailable(handler: PWAUpdateHandler): () => void {
  updateHandlers.add(handler)
  // Se já houver uma atualização pendente, notifica imediatamente
  if (state.needsUpdate) {
    handler()
  }
  return () => {
    updateHandlers.delete(handler)
  }
}

/**
 * Inicializa o serviço PWA (listeners de rede e SW).
 */
export function initPWAService(): void {
  if (typeof navigator !== 'undefined') {
    state.isOffline = !navigator.onLine
  }
  registerNetworkListeners()
}

/**
 * Reseta o estado interno do serviço PWA.
 * Uso exclusivo em testes.
 */
export function __resetPWAState(): void {
  state.isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false
  state.needsUpdate = false
  state.updateSW = null
  updateHandlers.clear()
  offlineHandlers.clear()
}
