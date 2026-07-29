import { BarChart3 } from 'lucide-react'

export function ProgressoPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Progresso</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhamento de desempenho.
        </p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Progresso em construção.</p>
        </div>
      </div>
    </div>
  )
}
