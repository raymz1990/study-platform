import { Headphones, FileAudio } from 'lucide-react'
import { EmptyState } from '@/components/navigation/route-fallbacks'

export function PodcastsPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Podcasts</h1>
        <p className="text-sm text-muted-foreground">Revisão em áudio para NotebookLM.</p>
      </div>
      <div className="flex min-h-[50vh] items-center justify-center">
        <EmptyState
          title="Revisão por Áudio"
          description="A geração automática de podcasts para NotebookLM será implementada em uma versão futura. Por enquanto, você pode exportar o conteúdo dos capítulos manualmente."
          icon={<Headphones className="h-12 w-12" />}
          action={{
            label: 'Ver guia NotebookLM',
            onClick: () => window.open('https://notebooklm.google.com', '_blank'),
          }}
        />
      </div>
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <FileAudio className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Como usar com NotebookLM</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          1. Acesse os capítulos de conteúdo em Markdown. 2. Copie o texto relevante.
          3. Cole no NotebookLM como fonte. 4. Gere Audio Overview para revisão passiva
          durante deslocamentos.
        </p>
      </div>
    </div>
  )
}
