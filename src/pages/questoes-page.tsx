import { HelpCircle } from 'lucide-react'

export function QuestoesPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Questões</h1>
        <p className="text-sm text-muted-foreground">
          Banco de questões comentadas.
        </p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <HelpCircle className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Banco de questões em construção.</p>
        </div>
      </div>
    </div>
  )
}
