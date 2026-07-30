/**
 * TableRenderer — tabela responsiva com rolagem horizontal em mobile.
 *
 * Regras (UI_UX_GUIDELINES.md):
 * - Desktop: tabela completa visível
 * - Mobile: rolagem horizontal com fade indicator
 * - Dark mode: cores invertidas
 */

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TableRendererProps extends HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

export function TableRenderer({
  children,
  className,
  ...props
}: TableRendererProps): React.ReactElement {
  return (
    <div className="relative my-6 overflow-hidden rounded-lg border">
      {/* Fade indicator em mobile */}
      <div
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-8 bg-gradient-to-l from-background to-transparent md:hidden"
        aria-hidden="true"
      />
      <div className="overflow-x-auto">
        <table
          className={cn(
            'w-full text-sm',
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  )
}

export function TableHead({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>): React.ReactElement {
  return (
    <thead
      className={cn('bg-muted text-left text-xs font-semibold uppercase text-muted-foreground', className)}
      {...props}
    />
  )
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>): React.ReactElement {
  return (
    <tr
      className={cn('border-b transition-colors hover:bg-accent/50', className)}
      {...props}
    />
  )
}

export function TableHeaderCell({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>): React.ReactElement {
  return (
    <th
      className={cn('px-4 py-3', className)}
      {...props}
    />
  )
}

export function TableCell({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>): React.ReactElement {
  return (
    <td
      className={cn('px-4 py-3', className)}
      {...props}
    />
  )
}

TableRenderer.displayName = 'TableRenderer'
TableHead.displayName = 'TableHead'
TableRow.displayName = 'TableRow'
TableHeaderCell.displayName = 'TableHeaderCell'
TableCell.displayName = 'TableCell'
