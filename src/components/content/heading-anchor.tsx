/**
 * HeadingAnchor — heading com ID e link de âncora.
 *
 * Gera índice navegável automaticamente.
 * Ícone de link visível no hover.
 */

import { type HTMLAttributes, type ReactNode } from 'react'
import { Link } from 'lucide-react'
import { slugify } from '@/utils/slugify'
import { cn } from '@/lib/utils'

export interface HeadingAnchorProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6
}

const headingClasses: Record<number, string> = {
  1: 'mt-8 mb-4 text-3xl font-bold tracking-tight',
  2: 'mt-8 mb-3 text-2xl font-semibold tracking-tight',
  3: 'mt-6 mb-2 text-xl font-semibold tracking-tight',
  4: 'mt-6 mb-2 text-lg font-semibold',
  5: 'mt-4 mb-2 text-base font-semibold',
  6: 'mt-4 mb-2 text-sm font-semibold',
}

function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) {
    return children
      .map((c) => (typeof c === 'string' ? c : ''))
      .join('')
  }
  return ''
}

export function HeadingAnchor({
  level,
  children,
  id: propId,
  className,
  ...props
}: HeadingAnchorProps): React.ReactElement {
  const Tag = `h${level}` as const
  const text = extractTextFromChildren(children)
  const id = propId ?? (text ? slugify(text) : undefined)

  return (
    <Tag
      id={id}
      className={cn(
        'group relative scroll-mt-20',
        headingClasses[level],
        className
      )}
      {...props}
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 inline-block opacity-0 transition-opacity group-hover:opacity-100"
          aria-label={`Link para ${text || 'esta seção'}`}
        >
          <Link className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </a>
      )}
    </Tag>
  )
}

HeadingAnchor.displayName = 'HeadingAnchor'
