/**
 * remark-callout — Plugin remark para transformar blockquotes em callouts.
 *
 * Detecta blockquotes no formato:
 *   > [!TYPE] Título
 *   > Corpo do callout
 *
 * Transforma o blockquote adicionando className via hProperties.
 */

import type { Plugin } from 'unified'

const CALLOUT_REGEX = /^\[!([A-Z_]+)\]\s*(.*?)(?:\n|$)/is

const calloutTypeMap: Record<string, string> = {
  ATTENTION: 'attention',
  TRAP: 'trap',
  PEGADINHA: 'trap',
  MEMORIZATION: 'memorization',
  MEMORIZAR: 'memorization',
  IMPORTANT: 'important',
  IMPORTANTE: 'important',
  LEGISLATION: 'legislation',
  LEGISLACAO: 'legislation',
  LEI: 'legislation',
}

interface AstNode {
  type: string
  children?: unknown[]
  value?: string
  data?: Record<string, unknown>
}

interface RootNode {
  type: 'root'
  children: unknown[]
}

function isNode(node: unknown): node is AstNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node
  )
}

function isParagraph(node: unknown): boolean {
  return isNode(node) && node.type === 'paragraph'
}

function isText(node: unknown): node is { type: string; value: string } {
  return (
    isNode(node) &&
    node.type === 'text' &&
    typeof node.value === 'string'
  )
}

export const remarkCallout: Plugin<[], RootNode> = () => (tree) => {
  const blockquotes: AstNode[] = []

  // Collect all blockquotes recursively
  function collect(node: unknown) {
    if (!isNode(node)) return
    if (node.type === 'blockquote') {
      blockquotes.push(node)
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        collect(child)
      }
    }
  }

  collect(tree)

  for (const blockquote of blockquotes) {
    const firstChild = blockquote.children?.[0]
    if (!firstChild || !isParagraph(firstChild)) continue

    const paragraph = firstChild as AstNode
    const firstText = paragraph.children?.[0]
    if (!firstText || !isText(firstText)) continue

    const match = firstText.value.match(CALLOUT_REGEX)
    if (!match || match[1] === undefined) continue

    const rawType = match[1].toUpperCase()
    const type = calloutTypeMap[rawType]
    if (!type) continue

    // Remove the callout marker from the first text node
    const newlineIndex = firstText.value.indexOf('\n')
    if (newlineIndex !== -1) {
      firstText.value = firstText.value.slice(newlineIndex + 1)
    } else {
      firstText.value = ''
    }

    // Clean up empty text nodes at the start of the paragraph
    while (
      Array.isArray(paragraph.children) &&
      paragraph.children.length > 0 &&
      isText(paragraph.children[0]) &&
      (paragraph.children[0] as { value: string }).value === ''
    ) {
      paragraph.children.shift()
    }

    // Remove the paragraph if it's now empty (all text was the marker)
    if (Array.isArray(paragraph.children) && paragraph.children.length === 0) {
      if (Array.isArray(blockquote.children)) {
        blockquote.children.shift()
      }
    }

    // Add className via hProperties
    const data = (blockquote.data ?? {}) as Record<string, unknown>
    const hProperties = (data.hProperties ?? {}) as Record<string, unknown>

    hProperties['className'] = ['callout', `callout-${type}`]
    data.hProperties = hProperties
    blockquote.data = data
  }
}
