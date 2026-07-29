import { Calendar } from 'lucide-react'

export function CronogramaPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cronograma</h1>
        <p className="text-muted-foreground text-sm">Planejamento semanal de estudos.</p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <Calendar className="text-muted-foreground mx-auto h-10 w-10" />
          <p className="text-muted-foreground mt-2 text-sm">Cronograma em construção.</p>
        </div>
      </div>
    </div>
  )
}
