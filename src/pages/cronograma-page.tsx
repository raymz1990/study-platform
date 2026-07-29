import { Calendar } from 'lucide-react'

export function CronogramaPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cronograma</h1>
        <p className="text-sm text-muted-foreground">
          Planejamento semanal de estudos.
        </p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Cronograma em construção.</p>
        </div>
      </div>
    </div>
  )
}
