import { CheckCircle2, Play, Circle } from 'lucide-react'
import type { PlannerActivity } from '@/types/planner'
import { cn } from '@/lib/utils'

export interface TaskItemProps {
  activity: PlannerActivity
  isCompleted: boolean
  onToggle: () => void
}

const priorityConfig = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-blue-500',
}

export function TaskItem({ activity, isCompleted, onToggle }: TaskItemProps): React.ReactElement {
  return (
    <li
      className={cn(
        'flex items-start gap-3 rounded-md border-l-4 p-3 transition-colors',
        'hover:bg-accent/50',
        priorityConfig[activity.priority],
        isCompleted && 'opacity-60'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="mt-0.5 shrink-0 focus-visible:ring-ring rounded focus-visible:outline-none focus-visible:ring-2"
        aria-label={isCompleted ? 'Desmarcar tarefa' : 'Marcar tarefa como concluída'}
        aria-pressed={isCompleted}
      >
        {isCompleted ? (
          <CheckCircle2 className="text-green-500 h-5 w-5" aria-hidden="true" />
        ) : activity.status === 'in_progress' ? (
          <Play className="text-blue-500 h-5 w-5" aria-hidden="true" />
        ) : (
          <Circle className="text-muted-foreground h-5 w-5" aria-hidden="true" />
        )}
      </button>

      <div className="flex-1 space-y-1">
        <p
          className={cn(
            'text-sm font-medium',
            isCompleted && 'text-muted-foreground line-through'
          )}
        >
          {activity.title}
        </p>
        {activity.description && (
          <p className="text-muted-foreground text-xs">{activity.description}</p>
        )}
        <p className="text-muted-foreground text-xs">
          {activity.discipline} · {activity.duration} min
        </p>
      </div>
    </li>
  )
}

TaskItem.displayName = 'TaskItem'
