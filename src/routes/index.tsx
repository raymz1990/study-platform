import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { RouteSkeleton, NotFoundPage } from '@/components/navigation/route-fallbacks'

/* Lazy loading de todas as páginas — TECH_STACK.md §27 */
const DashboardPage = lazy(() => import('@/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })))
const CronogramaPage = lazy(() => import('@/pages/cronograma-page').then((m) => ({ default: m.CronogramaPage })))
const DisciplinasPage = lazy(() => import('@/pages/disciplinas-page').then((m) => ({ default: m.DisciplinasPage })))
const DisciplinaDetalhePage = lazy(() => import('@/pages/disciplina-detalhe-page').then((m) => ({ default: m.DisciplinaDetalhePage })))
const QuestoesPage = lazy(() => import('@/pages/questoes-page').then((m) => ({ default: m.QuestoesPage })))
const FlashcardsPage = lazy(() => import('@/pages/flashcards-page').then((m) => ({ default: m.FlashcardsPage })))
const RevisoesPage = lazy(() => import('@/pages/revisoes-page').then((m) => ({ default: m.RevisoesPage })))
const SimuladosPage = lazy(() => import('@/pages/simulados-page').then((m) => ({ default: m.SimuladosPage })))
const PodcastsPage = lazy(() => import('@/pages/podcasts-page').then((m) => ({ default: m.PodcastsPage })))
const ProgressoPage = lazy(() => import('@/pages/progresso-page').then((m) => ({ default: m.ProgressoPage })))
const ConfiguracoesPage = lazy(() => import('@/pages/configuracoes-page').then((m) => ({ default: m.ConfiguracoesPage })))

/**
 * Definição de todas as rotas da aplicação.
 *
 * SSG + GitHub Pages → HashRouter no main.tsx.
 * Lazy loading em todas as páginas para code splitting.
 */
export function AppRoutes(): React.ReactElement {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/cronograma" element={<CronogramaPage />} />
        <Route path="/disciplinas" element={<DisciplinasPage />} />
        <Route path="/disciplinas/:id" element={<DisciplinaDetalhePage />} />
        <Route path="/questoes" element={<QuestoesPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/revisoes" element={<RevisoesPage />} />
        <Route path="/simulados" element={<SimuladosPage />} />
        <Route path="/podcasts" element={<PodcastsPage />} />
        <Route path="/progresso" element={<ProgressoPage />} />
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
