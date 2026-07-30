import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MarkdownViewer } from './markdown-viewer'

describe('MarkdownViewer — segurança (sanitização)', () => {
  it('remove tags <script> do conteúdo', () => {
    const malicious = `# Título

<script>alert('xss')</script>

Texto normal.
`
    const { container } = render(<MarkdownViewer source={malicious} />)

    expect(container.querySelector('script')).toBeNull()
    expect(container.textContent).toContain('Texto normal.')
  })

  it('remove atributos javascript: de links', () => {
    const malicious = `[Clique aqui](javascript:alert('xss'))
`
    const { container } = render(<MarkdownViewer source={malicious} />)

    const link = container.querySelector('a')
    expect(link).toBeTruthy()
    const href = link?.getAttribute('href') ?? ''
    expect(href).not.toMatch(/^javascript:/i)
  })

  it('remove handlers de evento inline (onerror) de imagens', () => {
    const malicious = `![Alt](https://example.com/img.png "Title")
`
    const { container } = render(<MarkdownViewer source={malicious} />)

    const img = container.querySelector('img')
    if (img) {
      expect(img.hasAttribute('onerror')).toBe(false)
    }
  })

  it('não renderiza HTML bruto malicioso', () => {
    const malicious = `# Título

<div onclick="alert('xss')">Clique</div>

<img src="x" onerror="alert('xss')" />
`
    const { container } = render(<MarkdownViewer source={malicious} />)

    const div = container.querySelector('div[onclick]')
    const img = container.querySelector('img[onerror]')

    expect(div).toBeNull()
    expect(img).toBeNull()
  })

  it('mantém links seguros intactos', () => {
    const safe = `[Google](https://google.com)
`
    const { container } = render(<MarkdownViewer source={safe} />)

    const link = container.querySelector('a')
    expect(link).toBeTruthy()
    expect(link?.getAttribute('href')).toBe('https://google.com')
  })
})
