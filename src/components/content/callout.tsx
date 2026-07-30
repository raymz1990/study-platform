/**
 * Callout — destaque semântico para conteúdo de estudo.
 *
 * 5 tipos oficiais (CONTENT_STANDARDS.md).
 * Configuração centralizada em {@link calloutRegistry}.
 */

import { type ReactNode } from 'react'
import {
  calloutRegistry,
  type CalloutVariant,
} from '@/utils/callout-registry'
import { cn } from '@/lib/utils'

export type CalloutType = CalloutVariant

export interface CalloutProps {
  type: CalloutType
  title?: string
  children: ReactNode
}

export function Callout({
  type,
  title,
  children,
}: CalloutProps): React.ReactElement {
  const def = calloutRegistry[type]
  const Icon = def.icon
  const displayTitle = title ?? def.defaultTitle

  return (
    <div
      className={cn(
        'my-6 rounded-r-lg border-l-4 p-4',
        def.borderClass,
        def.backgroundClass
      )}
      role="note"
      aria-label={def.defaultTitle}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn('mt-0.5 h-5 w-5 shrink-0', def.accentClass)}
          aria-hidden="true"
        />
        <div className="flex-1">
          <p className={cn('mb-1 font-semibold', def.accentClass)}>
            {displayTitle}
          </p>
          <div className="text-sm leading-relaxed text-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

Callout.displayName = 'Callout'
