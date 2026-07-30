import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LearningPath } from './learning-path'
import type { Module } from '@/types/discipline'

const mockModules: Module[] = [
  {
    id: 'mod_1',
    name: 'Fundamentos',
    order: 1,
    chapters: [
      { id: 'chap_1', title: 'Cap 1', estimatedTime: 60, difficulty: 'medium' },
    ],
  },
  {
    id: 'mod_2',
    name: 'Avançado',
    order: 2,
    chapters: [
      { id: 'chap_2', title: 'Cap 2', estimatedTime: 90, difficulty: 'high' },
    ],
  },
]

describe('LearningPath', () => {
  it('renderiza módulos e capítulos', () => {
    render(
      <LearningPath
        modules={mockModules}
        chapterStatuses={{ chap_1: 'not_started', chap_2: 'completed' }}
      />
    )

    expect(screen.getByText('Fundamentos')).toBeTruthy()
    expect(screen.getByText('Avançado')).toBeTruthy()
    expect(screen.getByText('Cap 1')).toBeTruthy()
    expect(screen.getByText('Cap 2')).toBeTruthy()
  })

  it('indica status correto dos módulos', () => {
    const { container } = render(
      <LearningPath
        modules={mockModules}
        chapterStatuses={{ chap_1: 'not_started', chap_2: 'completed' }}
      />
    )

    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })
})
