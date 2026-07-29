import { HelpCircle } from 'lucide-react'

export function QuestoesPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Questões</h1>
        <p className="text-muted-foreground text-sm">Banco de questões comentadas.</p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <HelpCircle className="text-muted-foreground mx-auto h-10 w-10" />
          <p className="text-muted-foreground mt-2 text-sm">Banco de questões em construção.</p>
        </div>
      </div>
    </div>
  )
}
