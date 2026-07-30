import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarkdownViewer } from './markdown-viewer'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

describe('MarkdownViewer', () => {
  beforeEach(() => {
    mockMatchMedia(false)
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: MockIntersectionObserver,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const sampleMarkdown = `---
title: Apostila de Teste
discipline: Matemática
estimatedTime: 30
---

# Introdução

Texto introdutório.

## Desenvolvimento

Conteúdo principal.

> [!ATTENTION] Atenção especial
> Este é um callout de atenção.

\`\`\`typescript
const x = 1;
\`\`\`

| Coluna A | Coluna B |
|----------|----------|
| Valor 1  | Valor 2  |

## Conclusão

Resumo final.
`

  it('renderiza título e metadados do frontmatter', () => {
    render(<MarkdownViewer source={sampleMarkdown} />)

    expect(screen.getByText('Apostila de Teste')).toBeTruthy()
    expect(screen.getByText(/Matemática/)).toBeTruthy()
    expect(screen.getByText(/Tempo estimado/)).toBeTruthy()
  })

  it('renderiza headings com IDs', () => {
    render(<MarkdownViewer source={sampleMarkdown} />)

    const intro = document.getElementById('introducao')
    expect(intro).toBeTruthy()
    expect(intro?.textContent).toContain('Introdução')

    const dev = document.getElementById('desenvolvimento')
    expect(dev).toBeTruthy()
  })

  it('renderiza callout a partir de blockquote', () => {
    render(<MarkdownViewer source={sampleMarkdown} />)

    expect(screen.getByLabelText('Atenção')).toBeTruthy()
    expect(screen.getByText('Este é um callout de atenção.')).toBeTruthy()
  })

  it('renderiza bloco de código', () => {
    render(<MarkdownViewer source={sampleMarkdown} />)

    expect(screen.getByText('const x = 1;')).toBeTruthy()
  })

  it('renderiza tabela', () => {
    render(<MarkdownViewer source={sampleMarkdown} />)

    expect(screen.getByText('Coluna A')).toBeTruthy()
    expect(screen.getByText('Coluna B')).toBeTruthy()
    expect(screen.getByText('Valor 1')).toBeTruthy()
  })

  it('renderiza sem frontmatter', () => {
    const md = '# Título Simples\n\nParágrafo de texto.'
    render(<MarkdownViewer source={md} />)

    expect(screen.getByText('Título Simples')).toBeTruthy()
    expect(screen.getByText('Parágrafo de texto.')).toBeTruthy()
  })

  it('renderiza TOC quando showToc=true', () => {
    render(<MarkdownViewer source={sampleMarkdown} showToc />)

    expect(screen.getByLabelText('Índice do documento')).toBeTruthy()
    expect(screen.getByText('Índice')).toBeTruthy()
  })

  it('não renderiza TOC quando showToc=false', () => {
    render(<MarkdownViewer source={sampleMarkdown} showToc={false} />)

    expect(document.querySelector('[aria-label="Índice do documento"]')).toBeNull()
  })

  it('aplica className customizada', () => {
    const { container } = render(
      <MarkdownViewer source="# Teste" className="classe-custom" />
    )

    expect(container.querySelector('.classe-custom')).toBeTruthy()
  })
})
