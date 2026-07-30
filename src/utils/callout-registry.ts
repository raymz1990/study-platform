/**
 * Callout Registry — configuração centralizada dos callouts semânticos.
 *
 * Elimina switch/case e hardcoding de cores no componente.
 * Novos tipos podem ser adicionados aqui sem tocar no Callout.tsx.
 *
 * Tipos oficiais (CONTENT_STANDARDS.md):
 * - attention (Atenção)
 * - trap (Pegadinha)
 * - memorization (Memorização)
 * - important (Importante)
 * - legislation (Legislação)
 */

import {
  AlertTriangle,
  Brain,
  Info,
  Scale,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react'

export type CalloutVariant =
  | 'attention'
  | 'trap'
  | 'memorization'
  | 'important'
  | 'legislation'

export interface CalloutDefinition {
  /** Ícone Lucide associado. */
  icon: LucideIcon
  /** Título padrão (fallback quando title prop é omitido). */
  defaultTitle: string
  /** Classe da borda lateral (Tailwind). */
  borderClass: string
  /** Classe de fundo, incluindo dark mode. */
  backgroundClass: string
  /** Classe de cor do ícone e título, incluindo dark mode. */
  accentClass: string
}

export const calloutRegistry: Record<CalloutVariant, CalloutDefinition> = {
  attention: {
    icon: AlertTriangle,
    defaultTitle: 'Atenção',
    borderClass: 'border-l-yellow-500',
    backgroundClass: 'bg-yellow-50 dark:bg-yellow-950/30',
    accentClass: 'text-yellow-600 dark:text-yellow-400',
  },
  trap: {
    icon: ShieldAlert,
    defaultTitle: 'Pegadinha',
    borderClass: 'border-l-red-500',
    backgroundClass: 'bg-red-50 dark:bg-red-950/30',
    accentClass: 'text-red-600 dark:text-red-400',
  },
  memorization: {
    icon: Brain,
    defaultTitle: 'Memorização',
    borderClass: 'border-l-purple-500',
    backgroundClass: 'bg-purple-50 dark:bg-purple-950/30',
    accentClass: 'text-purple-600 dark:text-purple-400',
  },
  important: {
    icon: Info,
    defaultTitle: 'Importante',
    borderClass: 'border-l-blue-500',
    backgroundClass: 'bg-blue-50 dark:bg-blue-950/30',
    accentClass: 'text-blue-600 dark:text-blue-400',
  },
  legislation: {
    icon: Scale,
    defaultTitle: 'Legislação',
    borderClass: 'border-l-green-500',
    backgroundClass: 'bg-green-50 dark:bg-green-950/30',
    accentClass: 'text-green-600 dark:text-green-400',
  },
}

/** Lista de variantes válidas para runtime checks. */
export const validCalloutVariants: readonly CalloutVariant[] = Object.keys(
  calloutRegistry
) as CalloutVariant[]

export function isValidCalloutVariant(
  value: string
): value is CalloutVariant {
  return value in calloutRegistry
}
