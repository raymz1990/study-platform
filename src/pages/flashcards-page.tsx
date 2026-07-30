import { Layers } from 'lucide-react'

export function FlashcardsPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
        <p className="text-muted-foreground text-sm">Revisão ativa com cartões.</p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <Layers className="text-muted-foreground mx-auto h-10 w-10" />
          <p className="text-muted-foreground mt-2 text-sm">Flashcards em construção.</p>
        </div>
      </div>
    </div>
  )
}
