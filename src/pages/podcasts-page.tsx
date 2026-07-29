import { Headphones } from 'lucide-react'

export function PodcastsPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Podcasts</h1>
        <p className="text-muted-foreground text-sm">Revisão em áudio para NotebookLM.</p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <Headphones className="text-muted-foreground mx-auto h-10 w-10" />
          <p className="text-muted-foreground mt-2 text-sm">Podcasts em construção.</p>
        </div>
      </div>
    </div>
  )
}
