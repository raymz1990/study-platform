/**
 * ProgressChart — gráfico de evolução temporal com Recharts.
 *
 * Exibe horas estudadas, taxa de acerto e percentual do edital ao longo do tempo.
 * Acessibilidade: descrição textual alternativa via aria-label.
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/foundation/card'
import { Skeleton } from '@/components/foundation/skeleton'
import type { EvolutionPoint } from '@/types/dashboard'
import { useTheme } from '@/hooks/use-theme'

export interface ProgressChartProps {
  data: EvolutionPoint[]
  isLoading?: boolean
}

export function ProgressChart({ data, isLoading = false }: ProgressChartProps): React.ReactElement {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '0.5rem',
    color: isDark ? '#f8fafc' : '#0f172a',
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Evolução Temporal</CardTitle>
          <CardDescription>Sem dados de evolução disponíveis.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground flex h-64 items-center justify-center text-sm">
          Estude regularmente para visualizar seu progresso.
        </CardContent>
      </Card>
    )
  }

  // Formata data para exibição amigável
  const formattedData = data.map((point) => ({
    ...point,
    displayDate: new Date(point.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    }),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Temporal</CardTitle>
        <CardDescription>Horas estudadas, taxa de acerto e percentual do edital</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="h-72 w-full"
          aria-label="Gráfico de evolução temporal mostrando horas estudadas, taxa de acerto e percentual do edital ao longo do tempo"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} iconType="circle" />
              <Area
                type="monotone"
                dataKey="hoursStudied"
                name="Horas Estudadas"
                stroke="#2563eb"
                fill="url(#hoursGradient)"
                strokeWidth={2}
                dot={{ r: 3, fill: '#2563eb' }}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="correctRate"
                name="Taxa de Acerto (%)"
                stroke="#16a34a"
                fill="url(#rateGradient)"
                strokeWidth={2}
                dot={{ r: 3, fill: '#16a34a' }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

ProgressChart.displayName = 'ProgressChart'
