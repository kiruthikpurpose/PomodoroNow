import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedMinutes: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface PomodoroState {
  tasks: Task[];
  currentTaskId: string | null;
  isRunning: boolean;
  timeRemaining: number;
  isBreak: boolean;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  removeTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  setCurrentTask: (id: string | null) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateTimeRemaining: (time: number) => void;
  reorderTasks: (tasks: Task[]) => void;
}

export const useStore = create<PomodoroState>()(
  persist(
    (set) => ({
      tasks: [],
      currentTaskId: null,
      isRunning: false,
      timeRemaining: 0,
      isBreak: false,

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              completed: false,
              createdAt: new Date(),
            },
          ],
        })),

      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          currentTaskId: state.currentTaskId === id ? null : state.currentTaskId,
        })),

      toggleTaskCompletion: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  completedAt: !task.completed ? new Date() : undefined,
                }
              : task
          ),
          currentTaskId: state.currentTaskId === id ? null : state.currentTaskId,
        })),

      setCurrentTask: (id) =>
        set((state) => ({
          currentTaskId: id,
          timeRemaining: id
            ? state.tasks.find((task) => task.id === id)?.estimatedMinutes * 60 || 0
            : 0,
          isBreak: false,
          isRunning: false,
        })),

      startTimer: () => set({ isRunning: true }),
      pauseTimer: () => set({ isRunning: false }),
      resetTimer: () =>
        set((state) => ({
          timeRemaining: state.currentTaskId
            ? state.tasks.find((task) => task.id === state.currentTaskId)
                ?.estimatedMinutes * 60 || 0
            : 0,
          isRunning: false,
          isBreak: false,
        })),

      updateTimeRemaining: (time) => set({ timeRemaining: time }),
      reorderTasks: (tasks) => set({ tasks }),
    }),
    {
      name: 'pomodoro-storage',
    }
  )
);