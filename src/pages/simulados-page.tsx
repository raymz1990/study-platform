import { ClipboardList } from 'lucide-react'

export function SimuladosPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Simulados</h1>
        <p className="text-sm text-muted-foreground">
          Simulados no formato da prova.
        </p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Simulados em construção.</p>
        </div>
      </div>
    </div>
  )
}
