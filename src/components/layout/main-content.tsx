import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

/**
 * MainContent — área principal de conteúdo da aplicação.
 *
 * Aplica padding e scroll adequados.
 */
export type MainContentProps = HTMLAttributes<HTMLElement>

export function MainContent({
  className,
  children,
  ...props
}: MainContentProps): React.ReactElement {
  return (
    <main
      className={cn('flex-1 overflow-y-auto p-4 lg:p-6', className)}
      id="main-content"
      tabIndex={-1}
      {...props}
    >
      {children}
    </main>
  )
}
