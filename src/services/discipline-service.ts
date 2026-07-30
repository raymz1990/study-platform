/**
 * Discipline Service — Concurso AI Platform.
 *
 * Responsabilidade: carregar e consultar o índice oficial de disciplinas.
 * Fonte única: content/index.json
 * Nenhum dado inventado — apenas leitura do índice.
 */

import type { Discipline, DisciplineIndex, DisciplineWithProgress, DisciplineStatus } from '@/types/discipline'
import type { ProgressSnapshot } from '@/types/planner'
import { loadProgress } from '@/services/planner-service'

// ---------------------------------------------------------------------------
// Fonte de dados
// ---------------------------------------------------------------------------

import indexRaw from '../../content/index.json'

const index: DisciplineIndex = indexRaw as DisciplineIndex

// ---------------------------------------------------------------------------
// Cache interno (dados estáticos)
// ---------------------------------------------------------------------------

const disciplinesById = new Map<string, Discipline>()
const disciplinesByOrder = new Map<number, Discipline>()

for (const d of index.disciplines) {
  disciplinesById.set(d.id, d)
  disciplinesByOrder.set(d.order, d)
}

// ---------------------------------------------------------------------------
// Normalização de nomes para matching
// ---------------------------------------------------------------------------

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const disciplinesByNormalizedName = new Map<string, string>()
for (const d of index.disciplines) {
  disciplinesByNormalizedName.set(normalizeName(d.name), d.id)
}

// ---------------------------------------------------------------------------
// Aliases: nomes abreviados usados no roadmap-s01-s11.json
// ---------------------------------------------------------------------------

const DISCIPLINE_ALIASES: Record<string, string> = {
  'legislacao de dados': 'disc_leg_seg_dados',
  'legislacao previdenciaria': 'disc_leg_prev_trab',
}

const aliasesByNormalizedName = new Map<string, string>(
  Object.entries(DISCIPLINE_ALIASES).map(([k, v]) => [k, v])
)

const chaptersByDiscipline = new Map<string, Map<string, string>>()
for (const d of index.disciplines) {
  const chapterMap = new Map<string, string>()
  for (const mod of d.modules) {
    for (const ch of mod.chapters) {
      chapterMap.set(normalizeName(ch.title), ch.id)
    }
  }
  chaptersByDiscipline.set(d.id, chapterMap)
}

// ---------------------------------------------------------------------------
// Resolvedores de ID
// ---------------------------------------------------------------------------

/**
 * Resolve nome de disciplina → ID oficial (disc_*).
 * Retorna undefined se não houver correspondência no índice.
 */
export function getDisciplineIdByName(name: string): string | undefined {
  const normalized = normalizeName(name)
  return disciplinesByNormalizedName.get(normalized) ?? aliasesByNormalizedName.get(normalized)
}

/**
 * Resolve título de capítulo → ID oficial (chap_*) dentro de uma disciplina.
 * Retorna undefined se não houver correspondência.
 */
export function getChapterIdByTitle(disciplineId: string, topicTitle: string): string | undefined {
  const chapterMap = chaptersByDiscipline.get(disciplineId)
  if (!chapterMap) return undefined
  return chapterMap.get(normalizeName(topicTitle))
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

/**
 * Retorna todas as disciplinas na ordem oficial (ROADMAP_DISCIPLINAS.md).
 */
export function getAllDisciplines(): Discipline[] {
  return [...index.disciplines].sort((a, b) => a.order - b.order)
}

/**
 * Retorna uma disciplina pelo ID oficial (ex: disc_portugues).
 * Retorna undefined se não encontrada.
 */
export function getDisciplineById(id: string): Discipline | undefined {
  return disciplinesById.get(id)
}

/**
 * Verifica se uma disciplina existe no índice.
 */
export function disciplineExists(id: string): boolean {
  return disciplinesById.has(id)
}

/**
 * Calcula o progresso de uma disciplina a partir do snapshot de progresso.
 * studiedHours usa durationMinutes quando disponível (schema v2.2); registros
 * sem duração contam 0 (nunca estimativa plana).
 */
function calculateDisciplineProgress(
  discipline: Discipline,
  progress: ProgressSnapshot
): { studiedHours: number; percentCompleted: number; status: DisciplineStatus } {
  const totalChapters = discipline.modules.reduce((sum, m) => sum + m.chapters.length, 0)
  if (totalChapters === 0) {
    return { studiedHours: 0, percentCompleted: 0, status: 'not_started' }
  }

  const disciplineTasks = progress.completedTasks.filter(
    (t) => t.disciplineId === discipline.id
  )

  const studiedHours = disciplineTasks.length > 0
    ? disciplineTasks.reduce((sum, t) => sum + (t.durationMinutes ?? 0) / 60, 0)
    : 0

  // percentual baseado em capítulos com pelo menos uma tarefa concluída
  const completedChapterIds = new Set(disciplineTasks.map((t) => t.topicId))
  const percentCompleted = Math.round((completedChapterIds.size / totalChapters) * 100)

  let status: DisciplineStatus = 'not_started'
  if (percentCompleted >= 100) {
    status = 'completed'
  } else if (percentCompleted > 0) {
    status = 'in_progress'
  }

  return {
    studiedHours: Math.round(studiedHours * 10) / 10,
    percentCompleted,
    status,
  }
}

/**
 * Retorna todas as disciplinas enriquecidas com progresso do usuário.
 */
export function getDisciplinesWithProgress(): DisciplineWithProgress[] {
  const progress = loadProgress()
  const disciplines = getAllDisciplines()

  return disciplines.map((d) => {
    const p = calculateDisciplineProgress(d, progress)
    return { ...d, ...p }
  })
}

/**
 * Retorna uma disciplina enriquecida com progresso.
 */
export function getDisciplineWithProgress(id: string): DisciplineWithProgress | undefined {
  const discipline = getDisciplineById(id)
  if (!discipline) return undefined

  const progress = loadProgress()
  const p = calculateDisciplineProgress(discipline, progress)
  return { ...discipline, ...p }
}

/**
 * Conta capítulos totais e concluídos de uma disciplina.
 */
export function getDisciplineChapterCounts(
  discipline: Discipline,
  progress: ProgressSnapshot
): { total: number; completed: number } {
  const total = discipline.modules.reduce((sum, m) => sum + m.chapters.length, 0)
  const completedChapterIds = new Set(
    progress.completedTasks
      .filter((t) => t.disciplineId === discipline.id)
      .map((t) => t.topicId)
  )
  return { total, completed: completedChapterIds.size }
}
