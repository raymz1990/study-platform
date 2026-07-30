import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DisciplineCard } from './discipline-card'
import type { DisciplineWithProgress } from '@/types/discipline'

const mockDiscipline: DisciplineWithProgress = {
  id: 'disc_teste',
  name: 'Disciplina de Teste',
  order: 1,
  weight: 2,
  priority: 1,
  estimatedHours: 40,
  description: 'Descrição de teste',
  modules: [],
  studiedHours: 10,
  percentCompleted: 25,
  status: 'in_progress',
}

describe('DisciplineCard', () => {
  it('renderiza nome, descrição e progresso', () => {
    render(<DisciplineCard discipline={mockDiscipline} />)

    expect(screen.getByText('Disciplina de Teste')).toBeTruthy()
    expect(screen.getByText('Descrição de teste')).toBeTruthy()
    expect(screen.getByText('25%')).toBeTruthy()
    expect(screen.getByText('10h / 40h')).toBeTruthy()
  })

  it('exibe badge de status correto', () => {
    render(<DisciplineCard discipline={mockDiscipline} />)
    expect(screen.getByText('Em andamento')).toBeTruthy()
  })

  it('chama onClick ao clicar no card', () => {
    const handleClick = vi.fn()
    render(<DisciplineCard discipline={mockDiscipline} onClick={handleClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledWith('disc_teste')
  })

  it('chama onClick ao pressionar Enter', () => {
    const handleClick = vi.fn()
    render(<DisciplineCard discipline={mockDiscipline} onClick={handleClick} />)

    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledWith('disc_teste')
  })

  it('é acessível (role button, tabindex, aria-label)', () => {
    render(<DisciplineCard discipline={mockDiscipline} />)
    const card = screen.getByRole('button')
    expect(card).toBeTruthy()
    expect(card.getAttribute('tabIndex')).toBe('0')
    expect(card.getAttribute('aria-label')).toContain('Disciplina de Teste')
  })
})
