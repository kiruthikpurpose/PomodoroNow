'use client';

import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export function TaskList() {
  const store = useStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = store.tasks.findIndex((task) => task.id === active.id);
      const newIndex = store.tasks.findIndex((task) => task.id === over.id);
      store.reorderTasks(arrayMove(store.tasks, oldIndex, newIndex));
    }
  };

  const pendingTasks = store.tasks.filter((task) => !task.completed);
  const completedTasks = store.tasks.filter((task) => task.completed);

  return (
    <Card className="w-96 p-4 space-y-4">
      <TaskForm />

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Pending Tasks</h3>
          <ScrollArea className="h-[200px]">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={pendingTasks}
                strategy={verticalListSortingStrategy}
              >
                {pendingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} isDraggable />
                ))}
              </SortableContext>
            </DndContext>
          </ScrollArea>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Completed Tasks</h3>
          <ScrollArea className="h-[200px]">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
}