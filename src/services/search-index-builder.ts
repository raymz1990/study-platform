/**
 * Search Index Builder — Constrói o índice de busca a partir do content/index.json.
 *
 * Responsabilidade: transformar a hierarquia de disciplinas/módulos/capítulos
 * em um array plano de SearchIndexEntry para indexação pelo Fuse.js.
 *
 * Regras:
 * - Toda entrada possui ID oficial (nunca slug como chave).
 * - Keywords enriquecidas com sinônimos comuns de concursos.
 * - URL gerada de acordo com as rotas definidas em src/routes/index.tsx.
 */

import type { SearchIndexEntry, SearchResultType } from '@/types/search'
import disciplineIndex from '../../content/index.json'

// ---------------------------------------------------------------------------
// Sinônimos e keywords extras por área (enriquecimento do índice)
// ---------------------------------------------------------------------------

const KEYWORD_MAP: Record<string, string[]> = {
  'Língua Portuguesa': ['gramática', 'interpretação', 'texto', 'ortografia', 'redação', 'fgv'],
  'Língua Inglesa': ['inglês', 'english', 'reading', 'vocabulary', 'compreensão'],
  'Raciocínio Lógico Matemático': ['lógica', 'matemática', 'proposição', 'conjunto', 'diagrama'],
  'Atualidades e Inteligência Artificial': ['ia', 'ml', 'machine learning', 'lgpd', 'notícias'],
  'Legislação de Segurança da Informação e Proteção de Dados': ['lgpd', 'lei', 'segurança', 'dados', 'privacidade'],
  'Matemática Financeira': ['juros', 'taxa', 'finanças', 'price', 'sac', 'vpl', 'tir'],
  'Administração Financeira': ['finanças', 'capital', 'tesouraria', 'valuation', 'custo'],
  'Avaliações Econômicas de Projetos': ['vpl', 'tir', 'payback', 'investimento', 'risco'],
  'Contabilidade Empresarial': ['contábil', 'balanço', 'dre', 'indicador', 'excel', 'r'],
  'Custos': ['custeio', 'absorção', 'direto', 'markup', 'equilíbrio'],
  'Orçamento': ['orçamentário', 'planejamento', 'governo', 'estatal', 'execução'],
  'Legislação Previdenciária e Trabalhista': ['trabalho', 'previdência', 'fgts', 'rgps', 'clt'],
}

function getKeywords(name: string): string[] {
  return KEYWORD_MAP[name] ?? []
}

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

function buildDisciplineEntry(
  discipline: typeof disciplineIndex.disciplines[0]
): SearchIndexEntry {
  return {
    id: discipline.id,
    type: 'discipline' as SearchResultType,
    title: discipline.name,
    description: discipline.description,
    disciplineId: discipline.id,
    keywords: [
      discipline.name,
      ...getKeywords(discipline.name),
      `peso ${discipline.weight}`,
      `prioridade ${discipline.priority}`,
      `${discipline.estimatedHours}h`,
    ],
    url: `/disciplinas/${discipline.id}`,
  }
}

function buildModuleEntry(
  discipline: typeof disciplineIndex.disciplines[0],
  module: typeof discipline.modules[0]
): SearchIndexEntry {
  return {
    id: module.id,
    type: 'module' as SearchResultType,
    title: `${discipline.name} — ${module.name}`,
    description: `Módulo ${module.name} da disciplina ${discipline.name}`,
    disciplineId: discipline.id,
    moduleId: module.id,
    keywords: [module.name, discipline.name, ...getKeywords(discipline.name)],
    url: `/disciplinas/${discipline.id}`,
  }
}

function buildChapterEntry(
  discipline: typeof disciplineIndex.disciplines[0],
  module: typeof discipline.modules[0],
  chapter: typeof module.chapters[0]
): SearchIndexEntry {
  return {
    id: chapter.id,
    type: 'chapter' as SearchResultType,
    title: `${chapter.title}`,
    description: `Capítulo ${chapter.title} do módulo ${module.name} em ${discipline.name}`,
    disciplineId: discipline.id,
    moduleId: module.id,
    chapterId: chapter.id,
    keywords: [
      chapter.title,
      module.name,
      discipline.name,
      ...getKeywords(discipline.name),
    ],
    url: `/disciplinas/${discipline.id}/capitulos/${chapter.id}`,
  }
}

// ---------------------------------------------------------------------------
// Build completo do índice
// ---------------------------------------------------------------------------

export function buildSearchIndex(): SearchIndexEntry[] {
  const entries: SearchIndexEntry[] = []

  for (const discipline of disciplineIndex.disciplines) {
    entries.push(buildDisciplineEntry(discipline))

    for (const module of discipline.modules) {
      entries.push(buildModuleEntry(discipline, module))

      for (const chapter of module.chapters) {
        entries.push(buildChapterEntry(discipline, module, chapter))
      }
    }
  }

  return entries
}

// ---------------------------------------------------------------------------
// Exportação estática (build time)
// ---------------------------------------------------------------------------

export const SEARCH_INDEX: SearchIndexEntry[] = buildSearchIndex()
