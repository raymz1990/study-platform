import { BookOpen } from 'lucide-react'

export function DisciplinasPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Disciplinas</h1>
        <p className="text-sm text-muted-foreground">
          Todas as disciplinas do edital DATAPREV.
        </p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Lista de disciplinas em construção.</p>
        </div>
      </div>
    </div>
  )
}
