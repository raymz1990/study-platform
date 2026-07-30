/**
 * Content Service — Concurso AI Platform.
 *
 * Responsabilidade: carregar e parsear conteúdo Markdown de capítulos.
 * Camada 3 — produção de conteúdo (leitura de arquivos markdown).
 *
 * Carregamento via fetch para compatibilidade com GitHub Pages / SSG.
 * Arquivos markdown residem em public/content/ e são servidos como assets estáticos.
 */

import { createParser } from '@/services/content-parser'
import { getDisciplineById } from '@/services/discipline-service'
import type { ChapterContent, ChapterNavigation, ContentLoadResult } from '@/types/chapter'
import type { Chapter } from '@/types/discipline'
import { slugify } from '@/utils/slugify'

// ---------------------------------------------------------------------------
// Base URL para conteúdo estático (public/content/ → /content/ no deploy)
// ---------------------------------------------------------------------------

const CONTENT_BASE = '/content'

function resolveContentUrl(disciplineId: string, ...segments: string[]): string {
  return `${CONTENT_BASE}/${disciplineId}/${segments.join('/')}`
}

// ---------------------------------------------------------------------------
// Flat list de capítulos por disciplina (ordem do roadmap)
// ---------------------------------------------------------------------------

function getChapterList(disciplineId: string): Chapter[] {
  const discipline = getDisciplineById(disciplineId)
  if (!discipline) return []
  return discipline.modules.flatMap((m) => m.chapters)
}

function buildNavigation(disciplineId: string, chapterId: string): ChapterNavigation {
  const chapters = getChapterList(disciplineId)
  const index = chapters.findIndex((c) => c.id === chapterId)

  const prevChapter = index > 0 ? chapters[index - 1] : undefined
  const nextChapter = index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : undefined

  const previous = prevChapter
    ? { id: prevChapter.id, title: prevChapter.title, disciplineId }
    : null

  const next = nextChapter
    ? { id: nextChapter.id, title: nextChapter.title, disciplineId }
    : null

  return { previous, next }
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

const parser = createParser()

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

/**
 * Carrega o conteúdo de um capítulo específico.
 *
 * Busca em: public/content/<disciplineId>/<moduleFolder>/<chapterFile>.md
 * Retorna 'not_found' se o arquivo não existir.
 */
export async function loadChapterContent(
  disciplineId: string,
  chapterId: string
): Promise<ContentLoadResult> {
  const discipline = getDisciplineById(disciplineId)
  if (!discipline) {
    return { status: 'not_found' }
  }

  // Encontra o capítulo nos módulos da disciplina
  let url: string | undefined
  for (const mod of discipline.modules) {
    const chapter = mod.chapters.find((c) => c.id === chapterId)
    if (chapter) {
      const moduleFolder = `${String(mod.order).padStart(2, '0')}-${slugify(mod.name)}`
      const chapterFile = slugify(chapter.title)
      url = resolveContentUrl(disciplineId, moduleFolder, `${chapterFile}.md`)
      break
    }
  }

  if (!url) {
    return { status: 'not_found' }
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { status: 'not_found' }
    }
    const markdown = await response.text()
    const parsed = parser.parse(markdown)
    const content: ChapterContent = {
      disciplineId,
      chapterId,
      parsed,
    }
    const navigation = buildNavigation(disciplineId, chapterId)
    return { status: 'success', content, navigation }
  } catch {
    return { status: 'not_found' }
  }
}

/**
 * Carrega o roadmap de uma disciplina (00-roadmap.md).
 *
 * Herança do Gate 008 (M4): substituir roadmap inline por conteúdo real.
 * Retorna null se o arquivo não existir.
 */
export async function loadDisciplineRoadmap(disciplineId: string): Promise<string | null> {
  const url = resolveContentUrl(disciplineId, '00-roadmap.md')
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    return await response.text()
  } catch {
    return null
  }
}

/**
 * Verifica se existe conteúdo para um capítulo.
 */
export async function chapterContentExists(
  disciplineId: string,
  chapterId: string
): Promise<boolean> {
  const result = await loadChapterContent(disciplineId, chapterId)
  return result.status === 'success'
}
