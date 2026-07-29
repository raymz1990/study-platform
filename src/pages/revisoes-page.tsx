import { RotateCcw } from 'lucide-react'

export function RevisoesPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revisões</h1>
        <p className="text-sm text-muted-foreground">
          Revisões pendentes e espaçadas.
        </p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <RotateCcw className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Revisões em construção.</p>
        </div>
      </div>
    </div>
  )
}
