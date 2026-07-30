/**
 * DisciplinesPage — listagem das 12 disciplinas do Perfil 10.
 *
 * Requisitos:
 * - Ordenação oficial do ROADMAP_DISCIPLINAS.md.
 * - Cards com progresso, prioridade, horas.
 * - Estados: loading, erro, vazio.
 * - Breadcrumbs: Dashboard → Disciplinas.
 */

import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, AlertCircle } from 'lucide-react'
import { DisciplineCard } from '@/components/learning/discipline-card'
import { Skeleton } from '@/components/foundation/skeleton'
import { Button } from '@/components/foundation/button'
import { getDisciplinesWithProgress } from '@/services/discipline-service'
import type { DisciplineWithProgress } from '@/types/discipline'

export function DisciplinasPage(): React.ReactElement {
  const navigate = useNavigate()
  const [state, setState] = useState<{
    disciplines: DisciplineWithProgress[]
    loading: boolean
    error: string | null
  }>({ disciplines: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // Simula um breve delay para o skeleton ser visível em desenvolvimento
        await new Promise((r) => setTimeout(r, 300))
        const disciplines = getDisciplinesWithProgress()
        if (!cancelled) {
          setState({ disciplines, loading: false, error: null })
        }
      } catch {
        if (!cancelled) {
          setState({ disciplines: [], loading: false, error: 'Erro ao carregar disciplinas.' })
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const handleCardClick = useMemo(
    () => (id: string) => navigate(`/disciplinas/${id}`),
    [navigate]
  )

  if (state.loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold">Erro ao carregar disciplinas</h2>
        <p className="mt-1 text-sm text-muted-foreground">{state.error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (state.disciplines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <BookOpen className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold">Nenhuma disciplina encontrada</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Verifique se o índice de disciplinas está disponível.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Disciplinas</h1>
        <p className="text-muted-foreground text-sm">
          {state.disciplines.length} disciplinas do edital DATAPREV — Perfil 10
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        role="list"
        aria-label="Lista de disciplinas"
      >
        {state.disciplines.map((d) => (
          <div key={d.id} role="listitem">
            <DisciplineCard discipline={d} onClick={handleCardClick} />
          </div>
        ))}
      </div>
    </div>
  )
}

DisciplinasPage.displayName = 'DisciplinasPage'
