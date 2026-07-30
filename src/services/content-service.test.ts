import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  loadChapterContent,
  loadDisciplineRoadmap,
  chapterContentExists,
} from './content-service'

describe('content-service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('loadDisciplineRoadmap', () => {
    it('retorna conteúdo markdown quando roadmap existe', async () => {
      const mockFetch = vi.mocked(globalThis.fetch)
      mockFetch.mockResolvedValueOnce(
        new Response('# Roadmap: Teste\n\nConteúdo.', { status: 200 })
      )

      const roadmap = await loadDisciplineRoadmap('disc_portugues')
      expect(roadmap).not.toBeNull()
      expect(roadmap).toContain('Roadmap: Teste')
    })

    it('retorna null quando roadmap não existe (404)', async () => {
      const mockFetch = vi.mocked(globalThis.fetch)
      mockFetch.mockResolvedValueOnce(
        new Response('Not found', { status: 404 })
      )

      const roadmap = await loadDisciplineRoadmap('disc_inexistente')
      expect(roadmap).toBeNull()
    })

    it('retorna null quando fetch falha', async () => {
      const mockFetch = vi.mocked(globalThis.fetch)
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const roadmap = await loadDisciplineRoadmap('disc_portugues')
      expect(roadmap).toBeNull()
    })
  })

  describe('loadChapterContent', () => {
    it('retorna sucesso para capítulo existente', async () => {
      const markdown = `---
title: Morfologia
discipline: Português
---

# Morfologia

Conteúdo aqui.
`
      const mockFetch = vi.mocked(globalThis.fetch)
      mockFetch.mockResolvedValueOnce(
        new Response(markdown, { status: 200 })
      )

      const result = await loadChapterContent('disc_portugues', 'chap_morfologia')
      expect(result.status).toBe('success')

      if (result.status === 'success') {
        expect(result.content.disciplineId).toBe('disc_portugues')
        expect(result.content.chapterId).toBe('chap_morfologia')
        expect(result.content.parsed.metadata.title).toBe('Morfologia')
        expect(result.content.parsed.headings.length).toBeGreaterThan(0)
      }
    })

    it('retorna not_found para disciplina inexistente', async () => {
      const result = await loadChapterContent('disc_fake', 'chap_fake')
      expect(result.status).toBe('not_found')
    })

    it('retorna not_found para capítulo inexistente em disciplina existente', async () => {
      const result = await loadChapterContent('disc_portugues', 'chap_inexistente')
      expect(result.status).toBe('not_found')
    })

    it('retorna not_found quando fetch retorna 404', async () => {
      const mockFetch = vi.mocked(globalThis.fetch)
      mockFetch.mockResolvedValueOnce(
        new Response('Not found', { status: 404 })
      )

      const result = await loadChapterContent('disc_portugues', 'chap_morfologia')
      expect(result.status).toBe('not_found')
    })

    it('metadados incluem campos obrigatórios', async () => {
      const markdown = `---
id: chap-teste
title: Teste
discipline: Português
level: beginner
estimatedTime: 30
version: "1.0"
updatedAt: "2026-07-30"
keywords: [a, b]
---

# Teste
`
      const mockFetch = vi.mocked(globalThis.fetch)
      mockFetch.mockResolvedValueOnce(
        new Response(markdown, { status: 200 })
      )

      const result = await loadChapterContent('disc_portugues', 'chap_morfologia')
      if (result.status !== 'success') return

      const meta = result.content.parsed.metadata
      expect(meta.id).toBe('chap-teste')
      expect(meta.title).toBe('Teste')
      expect(meta.discipline).toBe('Português')
      expect(meta.level).toBe('beginner')
      expect(meta.estimatedTime).toBe(30)
      expect(meta.version).toBe('1.0')
      expect(meta.updatedAt).toBe('2026-07-30')
      expect(meta.keywords).toEqual(['a', 'b'])
    })

    it('navegação contém próximo capítulo', async () => {
      const mockFetch = vi.mocked(globalThis.fetch)
      mockFetch.mockResolvedValueOnce(
        new Response('# Teste\n', { status: 200 })
      )

      const result = await loadChapterContent('disc_portugues', 'chap_morfologia')
      if (result.status !== 'success') return

      expect(result.navigation.next).not.toBeNull()
      expect(result.navigation.next?.disciplineId).toBe('disc_portugues')
    })

    it('primeiro capítulo não tem anterior', async () => {
      const mockFetch = vi.mocked(globalThis.fetch)
      mockFetch.mockResolvedValueOnce(
        new Response('# Teste\n', { status: 200 })
      )

      const result = await loadChapterContent('disc_portugues', 'chap_morfologia')
      if (result.status !== 'success') return

      expect(result.navigation.previous).toBeNull()
    })
  })

  describe('chapterContentExists', () => {
    it('retorna true para capítulo existente', async () => {
      const mockFetch = vi.mocked(globalThis.fetch)
      mockFetch.mockResolvedValueOnce(
        new Response('# Teste\n', { status: 200 })
      )

      const exists = await chapterContentExists('disc_portugues', 'chap_morfologia')
      expect(exists).toBe(true)
    })

    it('retorna false para capítulo inexistente', async () => {
      const mockFetch = vi.mocked(globalThis.fetch)
      mockFetch.mockResolvedValueOnce(
        new Response('Not found', { status: 404 })
      )

      const exists = await chapterContentExists('disc_portugues', 'chap_fake')
      expect(exists).toBe(false)
    })
  })
})
