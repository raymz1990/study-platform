import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SubjectChecklist } from './subject-checklist'
import type { Module } from '@/types/discipline'

const mockModules: Module[] = [
  {
    id: 'mod_1',
    name: 'Módulo 1',
    order: 1,
    chapters: [
      { id: 'chap_1', title: 'Capítulo 1', estimatedTime: 60, difficulty: 'medium' },
      { id: 'chap_2', title: 'Capítulo 2', estimatedTime: 45, difficulty: 'low' },
    ],
  },
]

describe('SubjectChecklist', () => {
  it('renderiza módulos e capítulos', () => {
    render(
      <SubjectChecklist
        modules={mockModules}
        checkedIds={new Set()}
        onToggle={() => {}}
      />
    )

    expect(screen.getByText('Módulo 1')).toBeTruthy()
    expect(screen.getByText('Capítulo 1')).toBeTruthy()
    expect(screen.getByText('Capítulo 2')).toBeTruthy()
  })

  it('marca capítulo como concluído quando checked', () => {
    render(
      <SubjectChecklist
        modules={mockModules}
        checkedIds={new Set(['chap_1'])}
        onToggle={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]?.getAttribute('aria-pressed')).toBe('true')
    expect(buttons[1]?.getAttribute('aria-pressed')).toBe('false')
  })

  it('chama onToggle ao clicar', () => {
    const handleToggle = vi.fn()
    render(
      <SubjectChecklist
        modules={mockModules}
        checkedIds={new Set()}
        onToggle={handleToggle}
      />
    )

    fireEvent.click(screen.getByText('Capítulo 1'))
    expect(handleToggle).toHaveBeenCalledWith('chap_1', true)
  })

  it('chama onToggle com false ao desmarcar', () => {
    const handleToggle = vi.fn()
    render(
      <SubjectChecklist
        modules={mockModules}
        checkedIds={new Set(['chap_1'])}
        onToggle={handleToggle}
      />
    )

    fireEvent.click(screen.getByText('Capítulo 1'))
    expect(handleToggle).toHaveBeenCalledWith('chap_1', false)
  })
})
