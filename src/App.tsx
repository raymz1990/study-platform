import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/foundation/button'
import { Badge } from '@/components/foundation/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/foundation/card'
import { AppLayout } from '@/layouts/app-layout'
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Loader2,
} from 'lucide-react'

function App(): React.ReactElement {
  const { resolvedTheme } = useTheme()

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Título da página */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            DATAPREV — Perfil 10 — Gestão Econômico-Financeira — FGV
          </p>
        </div>

        {/* Badges de Estado */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Estados de Estudo</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Concluído
            </Badge>
            <Badge variant="info">
              <Info className="mr-1 h-3 w-3" />
              Em andamento
            </Badge>
            <Badge variant="warning">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Atenção
            </Badge>
            <Badge variant="danger">
              <XCircle className="mr-1 h-3 w-3" />
              Revisão urgente
            </Badge>
            <Badge variant="secondary">Não iniciado</Badge>
          </div>
        </section>

        {/* Variantes de Botão */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Botões</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Perigoso</Button>
            <Button isLoading>
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando
            </Button>
            <Button disabled>Desabilitado</Button>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Cards</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Disciplina: Administração Financeira</CardTitle>
                <CardDescription>Progresso: 45% — 12h estudadas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Próximo capítulo: Análise de demonstrações financeiras.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Continuar</Button>
              </CardFooter>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Revisões Pendentes</CardTitle>
                <CardDescription>3 itens para revisar hoje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge variant="danger">1 urgente</Badge>
                  <Badge variant="warning">2 atenção</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  <BookOpen className="mr-1 h-4 w-4" />
                  Revisar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Info do Tema */}
        <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Tema atual: <strong className="text-foreground">{resolvedTheme}</strong>
        </section>
      </div>
    </AppLayout>
  )
}

export default App
