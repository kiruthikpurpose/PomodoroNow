import { Timer } from '@/components/Timer';
import { TaskList } from '@/components/TaskList';
import { Summary } from '@/components/Summary';
import { Timer as TimerIcon } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TimerIcon className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold">PomodoroNow</h1>
          </div>
          <p className="text-muted-foreground">
            Stay focused and productive with the Pomodoro technique
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-8">
            <Timer />
            <Summary />
          </div>
          <div className="lg:col-span-1">
            <TaskList />
          </div>
        </div>
      </div>
    </main>
  );
}