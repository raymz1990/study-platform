import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Callout } from './callout'

describe('Callout', () => {
  it('renderiza callout do tipo attention', () => {
    render(
      <Callout type="attention">
        <p>Texto de atenção</p>
      </Callout>
    )

    expect(screen.getByRole('note')).toBeTruthy()
    expect(screen.getByLabelText('Atenção')).toBeTruthy()
    expect(screen.getByText('Texto de atenção')).toBeTruthy()
  })

  it('renderiza callout do tipo trap', () => {
    render(
      <Callout type="trap">
        <p>Cuidado com a pegadinha</p>
      </Callout>
    )

    expect(screen.getByLabelText('Pegadinha')).toBeTruthy()
    expect(screen.getByText('Cuidado com a pegadinha')).toBeTruthy()
  })

  it('renderiza callout com título customizado', () => {
    render(
      <Callout type="important" title="Título Importante">
        <p>Conteúdo importante</p>
      </Callout>
    )

    expect(screen.getByText('Título Importante')).toBeTruthy()
    expect(screen.getByText('Conteúdo importante')).toBeTruthy()
  })

  it('renderiza todos os 5 tipos de callout', () => {
    const types = [
      { type: 'attention' as const, label: 'Atenção' },
      { type: 'trap' as const, label: 'Pegadinha' },
      { type: 'memorization' as const, label: 'Memorização' },
      { type: 'important' as const, label: 'Importante' },
      { type: 'legislation' as const, label: 'Legislação' },
    ]

    for (const { type, label } of types) {
      const { unmount } = render(
        <Callout type={type}>Conteúdo</Callout>
      )
      expect(screen.getByLabelText(label)).toBeTruthy()
      unmount()
    }
  })

  it('renderiza children como string', () => {
    render(<Callout type="memorization">Memorize isso</Callout>)

    expect(screen.getByText('Memorize isso')).toBeTruthy()
  })
})
