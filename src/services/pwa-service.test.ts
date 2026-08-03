import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  initPWAService,
  getIsOffline,
  onOfflineChange,
  onUpdateAvailable,
  applyUpdate,
  __resetPWAState,
} from './pwa-service'

describe('pwa-service', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    __resetPWAState()
    // Reset navigator.onLine para online por padrão
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initPWAService', () => {
    it('registra listeners de online/offline', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      initPWAService()
      expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
    })
  })

  describe('getIsOffline', () => {
    it('retorna false quando navigator.onLine é true', () => {
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
      initPWAService()
      expect(getIsOffline()).toBe(false)
    })

    it('retorna true quando navigator.onLine é false', () => {
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
      initPWAService()
      expect(getIsOffline()).toBe(true)
    })
  })

  describe('onOfflineChange', () => {
    it('notifica handler quando estado muda para offline', () => {
      const handler = vi.fn()
      initPWAService()
      onOfflineChange(handler)

      // Dispara evento offline
      const offlineEvent = new Event('offline')
      window.dispatchEvent(offlineEvent)

      expect(handler).toHaveBeenCalledWith(true)
    })

    it('notifica handler quando estado muda para online', () => {
      const handler = vi.fn()
      initPWAService()
      onOfflineChange(handler)

      // Primeiro vai para offline
      window.dispatchEvent(new Event('offline'))
      // Depois volta para online
      window.dispatchEvent(new Event('online'))

      expect(handler).toHaveBeenLastCalledWith(false)
    })

    it('retorna função de unsubscribe funcional', () => {
      const handler = vi.fn()
      initPWAService()
      const unsubscribe = onOfflineChange(handler)

      // Limpa as chamadas do estado inicial
      handler.mockClear()

      unsubscribe()

      window.dispatchEvent(new Event('offline'))
      expect(handler).not.toHaveBeenCalled()
    })

    it('notifica estado inicial imediatamente', () => {
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
      const handler = vi.fn()
      initPWAService()
      onOfflineChange(handler)

      expect(handler).toHaveBeenCalledWith(true)
    })
  })

  describe('onUpdateAvailable', () => {
    it('notifica handlers quando evento vite-pwa:update-ready é disparado', () => {
      const handler = vi.fn()
      const mockUpdateSW = vi.fn().mockResolvedValue(undefined)

      initPWAService()
      onUpdateAvailable(handler)

      const event = new CustomEvent('vite-pwa:update-ready', {
        detail: { updateSW: mockUpdateSW },
      })
      window.dispatchEvent(event)

      expect(handler).toHaveBeenCalled()
    })

    it('retorna função de unsubscribe funcional', () => {
      const handler = vi.fn()
      const unsubscribe = onUpdateAvailable(handler)
      unsubscribe()

      const event = new CustomEvent('vite-pwa:update-ready', {
        detail: { updateSW: vi.fn() },
      })
      window.dispatchEvent(event)

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('applyUpdate', () => {
    it('executa updateSW quando disponível', async () => {
      const mockUpdateSW = vi.fn().mockResolvedValue(undefined)

      initPWAService()
      onUpdateAvailable(vi.fn())

      const event = new CustomEvent('vite-pwa:update-ready', {
        detail: { updateSW: mockUpdateSW },
      })
      window.dispatchEvent(event)

      await applyUpdate()

      expect(mockUpdateSW).toHaveBeenCalled()
    })

    it('não falha quando updateSW não está disponível', async () => {
      // Sem disparar evento de update, applyUpdate deve ser seguro
      await expect(applyUpdate()).resolves.toBeUndefined()
    })
  })
})
