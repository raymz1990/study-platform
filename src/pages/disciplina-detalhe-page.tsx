import { useParams } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export function DisciplinaDetalhePage(): React.ReactElement {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Disciplina</h1>
        <p className="text-sm text-muted-foreground">ID: {id}</p>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Detalhes da disciplina em construção.</p>
        </div>
      </div>
    </div>
  )
}
