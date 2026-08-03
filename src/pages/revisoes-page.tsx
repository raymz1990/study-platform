import { useMemo } from 'react'
import { RotateCcw, AlertCircle, Clock, CheckCircle2, BookOpen } from 'lucide-react'
import { usePlannerData } from '@/hooks/use-planner-data'
import { EmptyState } from '@/components/navigation/route-fallbacks'
import type { ReviewItem, ReviewUrgency } from '@/types/dashboard'

// ---------------------------------------------------------------------------
// Helpers visuais
// ---------------------------------------------------------------------------

function urgencyConfig(urgency: ReviewUrgency) {
  switch (urgency) {
    case 'urgent':
      return {
        badge: 'bg-destructive/10 text-destructive border-destructive/20',
        icon: AlertCircle,
        label: 'Urgente',
      }
    case 'attention':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900',
        icon: Clock,
        label: 'Hoje',
      }
    case 'normal':
      return {
        badge: 'bg-muted text-muted-foreground border-border',
        icon: CheckCircle2,
        label: 'Em dia',
      }
  }
}

function typeLabel(type: ReviewItem['type']): string {
  switch (type) {
    case '24h':
      return '24 horas'
    case '7d':
      return '7 dias'
    case '30d':
      return '30 dias'
    default:
      return type
  }
}

// ---------------------------------------------------------------------------
// Componente de card de revisão
// ---------------------------------------------------------------------------

function ReviewCard({ review }: { review: ReviewItem }): React.ReactElement {
  const config = urgencyConfig(review.urgency)
  const Icon = config.icon

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.badge.split(' ')[0]}`}>
        <Icon className={`h-4 w-4 ${config.badge.split(' ')[1]}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${config.badge}`}>
            {config.label}
          </span>
          <span className="text-xs text-muted-foreground">{typeLabel(review.type)}</span>
        </div>
        <p className="mt-1 truncate text-sm font-medium">{review.topic}</p>
        <p className="text-xs text-muted-foreground">{review.discipline}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs text-muted-foreground">{review.scheduledDate}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------

export function RevisoesPage(): React.ReactElement {
  const { reviews, isLoading, error } = usePlannerData()

  const stats = useMemo(() => {
    const urgent = reviews.filter((r) => r.urgency === 'urgent').length
    const attention = reviews.filter((r) => r.urgency === 'attention').length
    const normal = reviews.filter((r) => r.urgency === 'normal').length
    return { urgent, attention, normal, total: reviews.length }
  }, [reviews])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revisões</h1>
          <p className="text-sm text-muted-foreground">Carregando fila de revisões...</p>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revisões</h1>
          <p className="text-sm text-muted-foreground">Erro ao carregar revisões.</p>
        </div>
        <EmptyState
          title="Erro ao carregar"
          description={error}
          icon={<AlertCircle className="h-12 w-12" />}
        />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revisões</h1>
          <p className="text-sm text-muted-foreground">Revisões pendentes e espaçadas.</p>
        </div>
        <div className="flex min-h-[50vh] items-center justify-center">
          <EmptyState
            title="Nenhuma revisão pendente"
            description="Complete atividades no cronograma para gerar revisões espaçadas (24h, 7d, 30d)."
            icon={<RotateCcw className="h-12 w-12" />}
            action={{
              label: 'Ir ao cronograma',
              onClick: () => window.location.hash = '/cronograma',
            }}
          />
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Como funcionam as revisões</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Quando você marca uma atividade como concluída no cronograma, a plataforma gera
            automaticamente revisões espaçadas: 24 horas depois, 7 dias depois e 30 dias depois.
            Isso maximiza a retenção de conteúdo através da curva do esquecimento.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revisões</h1>
        <p className="text-sm text-muted-foreground">Fila de revisões espaçadas geradas automaticamente.</p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Urgentes</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{stats.urgent}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Para hoje</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{stats.attention}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Em dia</p>
          <p className="mt-1 text-2xl font-bold text-muted-foreground">{stats.normal}</p>
        </div>
      </div>

      {/* Lista de revisões */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
