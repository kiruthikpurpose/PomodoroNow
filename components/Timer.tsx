'use client';

import { useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function Timer() {
  const store = useStore();
  const currentTask = store.tasks.find((task) => task.id === store.currentTaskId);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    if (!currentTask) return 0;
    const totalSeconds = currentTask.estimatedMinutes * 60;
    return ((totalSeconds - store.timeRemaining) / totalSeconds) * 100;
  };

  const handleTick = useCallback(() => {
    if (!store.isRunning) return;

    if (store.timeRemaining > 0) {
      store.updateTimeRemaining(store.timeRemaining - 1);
    } else {
      store.pauseTimer();
      if (currentTask && !store.isBreak) {
        store.toggleTaskCompletion(currentTask.id);
      }
    }
  }, [store, currentTask]);

  useEffect(() => {
    const interval = setInterval(handleTick, 1000);
    return () => clearInterval(interval);
  }, [handleTick]);

  if (!currentTask) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Select a task from the list to start the timer</p>
      </Card>
    );
  }

  return (
    <Card className="p-8 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{currentTask.title}</h2>
        {currentTask.description && (
          <p className="text-muted-foreground">{currentTask.description}</p>
        )}
      </div>

      <div className="text-center">
        <span className="text-6xl font-mono tabular-nums">
          {formatTime(store.timeRemaining)}
        </span>
      </div>

      <Progress value={calculateProgress()} className="w-full" />

      <div className="flex justify-center space-x-4">
        {!store.isRunning ? (
          <Button onClick={() => store.startTimer()} size="lg">
            <Play className="h-4 w-4 mr-2" />
            Start
          </Button>
        ) : (
          <Button onClick={() => store.pauseTimer()} size="lg">
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
        )}
        <Button variant="outline" onClick={() => store.resetTimer()} size="lg">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </Card>
  );
}