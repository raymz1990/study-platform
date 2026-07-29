import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

/**
 * PageContainer — container para o conteúdo de uma página específica.
 *
 * Aplica largura máxima e centralização.
 */
export type PageContainerProps = HTMLAttributes<HTMLDivElement>

export function PageContainer({
  className,
  children,
  ...props
}: PageContainerProps): React.ReactElement {
  return (
    <div className={cn('mx-auto w-full max-w-6xl', className)} {...props}>
      {children}
    </div>
  )
}
