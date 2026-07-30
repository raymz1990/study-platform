import { describe, it, expect } from 'vitest'
import { createParser } from './content-parser'

describe('content-parser', () => {
  const sampleMarkdown = `---
id: test_001
title: Apostila de Teste
discipline: Matemática
level: intermediate
estimatedTime: 30
version: "1.0"
---

# Introdução

Texto introdutório.

## Desenvolvimento

Conteúdo principal.

### Subseção

Mais detalhes.

## Conclusão

Resumo final.
`

  it('extrai frontmatter YAML corretamente', () => {
    const parser = createParser()
    const result = parser.parse(sampleMarkdown)

    expect(result.metadata.id).toBe('test_001')
    expect(result.metadata.title).toBe('Apostila de Teste')
    expect(result.metadata.discipline).toBe('Matemática')
    expect(result.metadata.level).toBe('intermediate')
    expect(result.metadata.estimatedTime).toBe(30)
    expect(result.metadata.version).toBe('1.0')
  })

  it('remove frontmatter do markdown resultante', () => {
    const parser = createParser()
    const result = parser.parse(sampleMarkdown)

    expect(result.markdown).not.toContain('---')
    expect(result.markdown).toContain('# Introdução')
    expect(result.markdown).toContain('## Desenvolvimento')
  })

  it('extrai headings para índice', () => {
    const parser = createParser()
    const result = parser.parse(sampleMarkdown)

    expect(result.headings).toHaveLength(4)

    const h1 = result.headings[0]
    const h2 = result.headings[1]
    const h3 = result.headings[2]
    const h4 = result.headings[3]

    expect(h1).toBeDefined()
    expect(h2).toBeDefined()
    expect(h3).toBeDefined()
    expect(h4).toBeDefined()

    if (h1) {
      expect(h1.id).toBe('introducao')
      expect(h1.text).toBe('Introdução')
      expect(h1.level).toBe(1)
    }
    if (h2) {
      expect(h2.id).toBe('desenvolvimento')
      expect(h2.text).toBe('Desenvolvimento')
      expect(h2.level).toBe(2)
    }
    if (h3) {
      expect(h3.id).toBe('subsecao')
      expect(h3.text).toBe('Subseção')
      expect(h3.level).toBe(3)
    }
    if (h4) {
      expect(h4.id).toBe('conclusao')
      expect(h4.text).toBe('Conclusão')
      expect(h4.level).toBe(2)
    }
  })

  it('funciona sem frontmatter', () => {
    const parser = createParser()
    const result = parser.parse('# Título\n\nConteúdo.')

    expect(result.metadata).toEqual({})
    expect(result.headings).toHaveLength(1)
    expect(result.markdown).toBe('# Título\n\nConteúdo.')
  })

  it('retorna plugins remark padrão', () => {
    const parser = createParser()
    const plugins = parser.getRemarkPlugins()

    expect(plugins.length).toBeGreaterThanOrEqual(3)
  })

  it('retorna plugins rehype padrão', () => {
    const parser = createParser()
    const plugins = parser.getRehypePlugins()

    expect(plugins.length).toBeGreaterThanOrEqual(1)
  })

  it('aceita plugins customizados', () => {
    const customRemark = () => () => {}
    const customRehype = () => () => {}

    const parser = createParser({
      remarkPlugins: [customRemark],
      rehypePlugins: [customRehype],
    })

    expect(parser.getRemarkPlugins()).toContain(customRemark)
    expect(parser.getRehypePlugins()).toContain(customRehype)
  })

  it('aceita aliases modernos de frontmatter (difficulty, estimated_time)', () => {
    const modernMarkdown = `---
title: Apostila Moderna
discipline: Física
difficulty: advanced
estimated_time: 45
author: Autor Teste
updated: 2024-01-15
---

# Conteúdo

Texto.
`
    const parser = createParser()
    const result = parser.parse(modernMarkdown)

    expect(result.metadata.title).toBe('Apostila Moderna')
    expect(result.metadata.discipline).toBe('Física')
    expect(result.metadata.level).toBe('advanced')
    expect(result.metadata.estimatedTime).toBe(45)
    expect(result.metadata.author).toBe('Autor Teste')
    expect(result.metadata.updatedAt).toBe('2024-01-15')
  })

  it('lança erro para frontmatter inválido (difficulty inválido)', () => {
    const invalidMarkdown = `---
title: Teste
difficulty: invalid_value
---

# Teste
`
    const parser = createParser()

    expect(() => parser.parse(invalidMarkdown)).toThrow('Frontmatter inválido')
  })

  it('lança erro detalhado com issues do Zod para frontmatter inválido', () => {
    const invalidMarkdown = `---
estimated_time: not_a_number
---

# Teste
`
    const parser = createParser()

    try {
      parser.parse(invalidMarkdown)
      expect.fail('Deveria ter lançado erro')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toContain('Frontmatter inválido')
      expect((error as Error).name).toBe('FrontmatterValidationError')
    }
  })

  it('aceita module como alias para chapter', () => {
    const markdown = `---
module: Módulo 3
---

# Teste
`
    const parser = createParser()
    const result = parser.parse(markdown)

    expect(result.metadata.chapter).toBe('Módulo 3')
  })

  it('processa topics como string separada por vírgula', () => {
    const markdown = `---
topics: "álgebra, geometria, trigonometria"
---

# Teste
`
    const parser = createParser()
    const result = parser.parse(markdown)

    expect(result.metadata.topics).toEqual(['álgebra', 'geometria', 'trigonometria'])
  })

  it('processa topics como array YAML', () => {
    const markdown = `---
topics: ["álgebra", "geometria"]
---

# Teste
`
    const parser = createParser()
    const result = parser.parse(markdown)

    expect(result.metadata.topics).toEqual(['álgebra', 'geometria'])
  })

  it('permite desabilitar sanitização', () => {
    const parser = createParser({ sanitize: false })
    const plugins = parser.getRehypePlugins()

    // rehype-sanitize não deve estar presente
    const hasSanitize = plugins.some((p) =>
      Array.isArray(p) && p[0]?.name === 'rehypeSanitize'
    )
    expect(hasSanitize).toBe(false)
  })
})
