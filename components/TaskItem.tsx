'use client';

import { Task } from '@/lib/store';
import { useStore } from '@/lib/store';
import { Checkbox } from '@/components/ui/checkbox';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { useSortable } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  isDraggable?: boolean;
}

export function TaskItem({ task, isDraggable = false }: TaskItemProps) {
  const store = useStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined;

  const handleTaskClick = () => {
    if (!task.completed) {
      store.setCurrentTask(task.id);
    }
  };

  const isSelected = store.currentTaskId === task.id;

  const content = (
    <>
      {isDraggable && (
        <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground" />
      )}
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => store.toggleTaskCompletion(task.id)}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex-1">
        <p className={cn(
          task.completed ? 'line-through text-muted-foreground' : '',
          isSelected ? 'font-medium' : ''
        )}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        {task.estimatedMinutes}m
      </div>
    </>
  );

  const containerClasses = cn(
    'flex items-center space-x-2 p-2 rounded-lg transition-colors',
    !task.completed && 'cursor-pointer hover:bg-secondary/50',
    isSelected && 'bg-secondary/50',
    isDraggable && 'cursor-move'
  );

  if (isDraggable) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={containerClasses}
        onClick={handleTaskClick}
        {...attributes}
        {...listeners}
      >
        {content}
      </div>
    );
  }

  return (
    <div className={containerClasses} onClick={handleTaskClick}>
      {content}
    </div>
  );
}