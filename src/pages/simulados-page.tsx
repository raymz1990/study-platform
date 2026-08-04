import { ClipboardList, BookOpen } from 'lucide-react'
import { EmptyState } from '@/components/navigation/route-fallbacks'

export function SimuladosPage(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Simulados</h1>
        <p className="text-sm text-muted-foreground">Simulados no formato da prova DATAPREV.</p>
      </div>
      <div className="flex min-h-[50vh] items-center justify-center">
        <EmptyState
          title="Simulado Piloto Disponível"
          description="O Simulado 01 está pronto com 20 questões misturando 8 disciplinas do Perfil 10. Mais simulados serão adicionados em breve."
          icon={<ClipboardList className="h-12 w-12" />}
          action={{
            label: 'Acessar conteúdo de estudo',
            onClick: () =>
              window.open(
                `${import.meta.env.BASE_URL}content/simulados/simulado-01.md`,
                '_blank'
              ),
          }}
        />
      </div>
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Dica de estudo</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Enquanto a interface de simulados está em desenvolvimento, você pode acessar o simulado
          diretamente no arquivo Markdown. O simulado inclui gabarito completo e tabela de
          desempenho esperado.
        </p>
      </div>
    </div>
  )
}
