/**
 * Tests — search-service.ts
 *
 * Cobertura: busca fuzzy, agrupamento, labels, performance.
 */

import { describe, it, expect } from 'vitest'
import { search, groupResultsByType, getResultTypeLabel } from '@/services/search-service'

describe('search-service', () => {
  describe('search', () => {
    it('retorna array vazio para query vazia', () => {
      const results = search('')
      expect(results).toHaveLength(0)
    })

    it('retorna array vazio para query com 1 caractere', () => {
      const results = search('a')
      expect(results).toHaveLength(0)
    })

    it('encontra disciplina por nome exato', () => {
      const results = search('Português')
      expect(results.length).toBeGreaterThan(0)
    })

    it('encontra capítulo por título', () => {
      const results = search('Morfologia')
      expect(results.length).toBeGreaterThan(0)
      const first = results[0]
      if (first) {
        expect(first.type).toBe('chapter')
      }
    })

    it('encontra por palavra-chave (LGPD)', () => {
      const results = search('LGPD')
      expect(results.length).toBeGreaterThan(0)
    })

    it('tolerância a erros de digitação (fuzzy)', () => {
      const results = search('Portugues')
      expect(results.length).toBeGreaterThan(0)
    })

    it('limita a 12 resultados', () => {
      const broad = search('de')
      expect(broad.length).toBeLessThanOrEqual(12)
    })
  })

  describe('groupResultsByType', () => {
    it('agrupa resultados por tipo', () => {
      const results = search('Português')
      const grouped = groupResultsByType(results)
      expect(Object.keys(grouped).length).toBeGreaterThan(0)
    })

    it('retorna objeto vazio para array vazio', () => {
      const grouped = groupResultsByType([])
      expect(Object.keys(grouped)).toHaveLength(0)
    })
  })

  describe('getResultTypeLabel', () => {
    it('retorna labels corretos', () => {
      expect(getResultTypeLabel('discipline')).toBe('Disciplina')
      expect(getResultTypeLabel('module')).toBe('Módulo')
      expect(getResultTypeLabel('chapter')).toBe('Capítulo')
      expect(getResultTypeLabel('unknown')).toBe('unknown')
    })
  })

  describe('performance', () => {
    it('responde em menos de 300 ms', () => {
      const start = performance.now()
      search('Matemática Financeira')
      const end = performance.now()
      expect(end - start).toBeLessThan(300)
    })
  })
})
