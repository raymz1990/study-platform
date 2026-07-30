/**
 * CodeBlock — bloco de código com fonte monoespaçada.
 *
 * Fonte: JetBrains Mono (TYPOGRAPHY.mono).
 * Dark mode: cores invertidas para legibilidade.
 */

import { useState, type HTMLAttributes } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/foundation/button'
import { cn } from '@/lib/utils'

export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  /** Linguagem do código (ex: typescript, python). */
  language?: string
  /** Conteúdo do código. */
  code: string
}

export function CodeBlock({
  code,
  language,
  className,
  ...props
}: CodeBlockProps): React.ReactElement {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border bg-muted">
      {/* Barra superior com linguagem + botão copiar */}
      <div className="flex items-center justify-between border-b bg-muted/80 px-4 py-2">
        {language ? (
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {language}
          </span>
        ) : (
          <span />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleCopy}
          aria-label={copied ? 'Copiado!' : 'Copiar código'}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </Button>
      </div>

      <pre
        className={cn(
          'overflow-x-auto p-4 text-sm leading-relaxed',
          "font-mono text-foreground",
          className
        )}
        {...props}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

CodeBlock.displayName = 'CodeBlock'
