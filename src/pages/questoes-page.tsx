import { HelpCircle, GraduationCap } from 'lucide-react'
import { EmptyState } from '@/components/navigation/route-fallbacks'

export function QuestoesPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Questões</h1>
        <p className="text-sm text-muted-foreground">Banco de questões comentadas da FGV.</p>
      </div>
      <div className="flex min-h-[50vh] items-center justify-center">
        <EmptyState
          title="Questões nos Capítulos"
          description="As questões comentadas e para resolver estão integradas nos capítulos de cada disciplina. Acesse uma disciplina e navegue até a seção Questões Comentadas."
          icon={<HelpCircle className="h-12 w-12" />}
          action={{
            label: 'Ver disciplinas',
            onClick: () => window.location.hash = '/disciplinas',
          }}
        />
      </div>
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Onde encontrar questões</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Cada capítulo de conteúdo já possui 2 questões comentadas (com gabarito e explicação
          passo a passo) e 2 questões para você resolver. Foco atual: Português, Matemática
          Financeira e Raciocínio Lógico.
        </p>
      </div>
    </div>
  )
}
