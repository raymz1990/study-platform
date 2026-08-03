import { Layers, BookMarked } from 'lucide-react'
import { EmptyState } from '@/components/navigation/route-fallbacks'

export function FlashcardsPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
        <p className="text-sm text-muted-foreground">Revisão ativa com cartões de memória.</p>
      </div>
      <div className="flex min-h-[50vh] items-center justify-center">
        <EmptyState
          title="Flashcards nos Capítulos"
          description="Flashcards estão disponíveis nos capítulos de Morfologia, Sintaxe e Juros Simples. Mais flashcards serão adicionados conforme o conteúdo cresce."
          icon={<Layers className="h-12 w-12" />}
          action={{
            label: 'Ver capítulos com flashcards',
            onClick: () => window.location.hash = '/disciplinas/disc_portugues',
          }}
        />
      </div>
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Metodologia de revisão</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Cada capítulo contém uma seção Flashcards com perguntas na frente e respostas no verso.
          Use-os para revisão espaçada: releia os cards diariamente, semanalmente e mensalmente
          até dominar o conteúdo.
        </p>
      </div>
    </div>
  )
}
