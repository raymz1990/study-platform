/**
 * Skeleton — componente foundation para estados de carregamento.
 *
 * Acessibilidade: aria-busy="true" no container pai.
 */

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Forma do skeleton.
   * @default 'rectangle'
   */
  shape?: 'rectangle' | 'circle'
}

export function Skeleton({
  className,
  shape = 'rectangle',
  ...props
}: SkeletonProps): React.ReactElement {
  return (
    <div
      className={cn(
        'bg-muted animate-pulse',
        shape === 'circle' && 'rounded-full',
        shape === 'rectangle' && 'rounded-md',
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}

Skeleton.displayName = 'Skeleton'
