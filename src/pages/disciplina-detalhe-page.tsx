/**
 * DisciplineDetailPage — página de detalhe de uma disciplina.
 *
 * Requisitos:
 * - Todas as seções obrigatórias: descrição, progresso, roadmap, capítulos,
 *   questões, flashcards, resumo, podcast, checklist.
 * - Roadmap renderizado via MarkdownViewer (00-roadmap.md via content-service).
 * - Capítulos agrupados por módulo (LearningPath).
 * - Estados: loading, erro, vazio.
 * - Breadcrumbs: Dashboard → Disciplinas → Disciplina.
 */

import { useMemo, useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  AlertCircle,
  ArrowLeft,
  HelpCircle,
  Layers,
  MessageSquare,
  Headphones,
  FileText,
  CheckSquare,
  Clock,
  Target,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { Badge } from '@/components/foundation/badge'
import { Button } from '@/components/foundation/button'
import { Skeleton } from '@/components/foundation/skeleton'
import { MarkdownViewer } from '@/components/content/markdown-viewer'
import { LearningPath } from '@/components/learning/learning-path'
import { SubjectChecklist } from '@/components/learning/subject-checklist'
import { getDisciplineWithProgress, disciplineExists, getDisciplineById } from '@/services/discipline-service'
import { loadProgress, saveProgress } from '@/services/planner-service'
import { loadDisciplineRoadmap } from '@/services/content-service'
import { toISODate } from '@/utils/date'
import type { DisciplineStatus } from '@/types/discipline'

const STATUS_CONFIG: Record<DisciplineStatus, { label: string; badgeVariant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'secondary'; barColor: string }> = {
  not_started: { label: 'Não iniciada', badgeVariant: 'outline', barColor: 'bg-muted' },
  in_progress: { label: 'Em andamento', badgeVariant: 'info', barColor: 'bg-blue-500' },
  completed: { label: 'Concluída', badgeVariant: 'success', barColor: 'bg-green-500' },
  review: { label: 'Revisão', badgeVariant: 'warning', barColor: 'bg-yellow-500' },
}

export function DisciplinaDetalhePage(): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [state, setState] = useState<{
    loading: boolean
    error: string | null
  }>({ loading: true, error: null })

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [roadmapMarkdown, setRoadmapMarkdown] = useState<string>('')

  // Carrega dados da disciplina
  const discipline = useMemo(() => {
    if (!id) return undefined
    return getDisciplineWithProgress(id)
  }, [id])

  // Computa status por capítulo a partir do progresso
  const chapterStatuses = useMemo(() => {
    if (!discipline) return {}
    const progress = loadProgress()
    const completedTopicIds = new Set(
      progress.completedTasks
        .filter((t) => t.disciplineId === discipline.id)
        .map((t) => t.topicId)
    )

    const map: Record<string, DisciplineStatus> = {}
    for (const module of discipline.modules) {
      for (const chapter of module.chapters) {
        map[chapter.id] = completedTopicIds.has(chapter.id) ? 'completed' : 'not_started'
      }
    }
    return map
  }, [discipline])

  // Inicializa checkedIds a partir do progresso
  useEffect(() => {
    if (!discipline) return
    const progress = loadProgress()
    const completed = progress.completedTasks
      .filter((t) => t.disciplineId === discipline.id)
      .map((t) => t.topicId)
    setCheckedIds(new Set(completed))
  }, [discipline])

  // Simula loading
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      if (!cancelled) {
        if (!id || !disciplineExists(id)) {
          setState({ loading: false, error: 'Disciplina não encontrada.' })
        } else {
          setState({ loading: false, error: null })
        }
      }
    }, 300)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [id])

  // Carrega roadmap real via content-service (herança M4 do Gate 008)
  useEffect(() => {
    if (!discipline) return
    const d = discipline
    let cancelled = false

    async function load() {
      const raw = await loadDisciplineRoadmap(d.id)
      if (cancelled) return
      if (raw) {
        setRoadmapMarkdown(raw)
      } else {
        const lines = [
          `# Roadmap: ${d.name}`,
          '',
          `> O conteúdo completo do roadmap será disponibilizado em \`content/${d.id}/00-roadmap.md\`.`,
          '',
          '## Estrutura',
          '',
          ...d.modules.map((m) => `- **${m.name}**: ${m.chapters.length} capítulo(s)`),
        ]
        setRoadmapMarkdown(lines.join('\n'))
      }
    }

    void load()
    return () => { cancelled = true }
  }, [discipline])

  // Toggle do checklist
  const handleToggleChecklist = useCallback((chapterId: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(chapterId)
      } else {
        next.delete(chapterId)
      }
      return next
    })

    if (!id) return
    const progress = loadProgress()
    if (checked) {
      const alreadyCompleted = progress.completedTasks.some(
        (t) => t.disciplineId === id && t.topicId === chapterId
      )
      if (!alreadyCompleted) {
        const disciplineData = getDisciplineById(id)
        const moduleName = disciplineData?.modules.find((m) =>
          m.chapters.some((c) => c.id === chapterId)
        )?.name ?? ''
        const chapterObj = disciplineData?.modules
          .flatMap((m) => m.chapters)
          .find((c) => c.id === chapterId)
        const chapterName = chapterObj?.title ?? ''

        progress.completedTasks.push({
          taskId: `checklist_${chapterId}`,
          completedDate: toISODate(new Date()),
          disciplineId: id,
          disciplineName: disciplineData?.name ?? id,
          topicId: chapterId,
          topicName: chapterName || moduleName || chapterId,
          ...(chapterObj?.estimatedTime != null && chapterObj.estimatedTime > 0
            ? { durationMinutes: chapterObj.estimatedTime }
            : {}),
        })
        saveProgress(progress)
      }
    } else {
      progress.completedTasks = progress.completedTasks.filter(
        (t) => !(t.disciplineId === id && t.topicId === chapterId)
      )
      saveProgress(progress)
    }
  }, [id])

  if (state.loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-40 lg:col-span-2" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (state.error || !discipline) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold">
          {state.error ?? 'Disciplina não encontrada'}
        </h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/disciplinas')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Disciplinas
        </Button>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[discipline.status]

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 h-8 px-2 text-muted-foreground"
            onClick={() => navigate('/disciplinas')}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Disciplinas
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{discipline.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{discipline.description}</p>
        </div>
        <Badge variant={statusConfig.badgeVariant} className="shrink-0 self-start">
          {statusConfig.label}
        </Badge>
      </div>

      {/* Progresso e métricas */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" aria-hidden="true" />
              Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {discipline.percentCompleted}% concluído
                </span>
                <span className="text-muted-foreground">
                  {discipline.studiedHours}h / {discipline.estimatedHours}h
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${statusConfig.barColor}`}
                  style={{ width: `${discipline.percentCompleted}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              Resumo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peso</span>
              <span className="font-medium">{discipline.weight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prioridade</span>
              <span className="font-medium">{discipline.priority === 1 ? 'Alta' : discipline.priority === 2 ? 'Média' : 'Baixa'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Módulos</span>
              <span className="font-medium">{discipline.modules.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capítulos</span>
              <span className="font-medium">
                {discipline.modules.reduce((s, m) => s + m.chapters.length, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap */}
      <section aria-labelledby="roadmap-heading">
        <h2 id="roadmap-heading" className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Layers className="h-5 w-5 text-primary" aria-hidden="true" />
          Roadmap
        </h2>
        <Card>
          <CardContent className="pt-6">
            <MarkdownViewer source={roadmapMarkdown} />
          </CardContent>
        </Card>
      </section>

      {/* Capítulos / Learning Path */}
      <section aria-labelledby="chapters-heading">
        <h2 id="chapters-heading" className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight">
          <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
          Capítulos
        </h2>
        <LearningPath
          modules={discipline.modules}
          chapterStatuses={chapterStatuses}
          onChapterClick={(chapterId) => {
            navigate(`/disciplinas/${discipline.id}/capitulos/${chapterId}`)
          }}
        />
      </section>

      {/* Seções futuras (cards placeholder com Empty State) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PlaceholderSection
          icon={<HelpCircle className="h-5 w-5" />}
          title="Questões"
          description="Questões por capítulo serão disponibilizadas em breve."
        />
        <PlaceholderSection
          icon={<MessageSquare className="h-5 w-5" />}
          title="Flashcards"
          description="Flashcards de revisão serão disponibilizados em breve."
        />
        <PlaceholderSection
          icon={<FileText className="h-5 w-5" />}
          title="Resumo"
          description="Resumo executivo da disciplina em construção."
        />
        <PlaceholderSection
          icon={<Headphones className="h-5 w-5" />}
          title="Podcast"
          description="Episódio de podcast em produção."
        />
      </div>

      {/* Checklist */}
      <section aria-labelledby="checklist-heading">
        <h2 id="checklist-heading" className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight">
          <CheckSquare className="h-5 w-5 text-primary" aria-hidden="true" />
          Checklist de Estudo
        </h2>
        <Card>
          <CardContent className="pt-6">
            <SubjectChecklist
              modules={discipline.modules}
              checkedIds={checkedIds}
              onToggle={handleToggleChecklist}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

DisciplinaDetalhePage.displayName = 'DisciplinaDetalhePage'

// ---------------------------------------------------------------------------
// Sub-componente: placeholder de seção futura
// ---------------------------------------------------------------------------

function PlaceholderSection({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}): React.ReactElement {
  return (
    <Card className="flex items-center gap-4 p-4 opacity-70">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  )
}
