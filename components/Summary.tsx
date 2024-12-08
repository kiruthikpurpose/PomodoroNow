'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

export function Summary() {
  const store = useStore();
  const completedTasks = store.tasks.filter((task) => task.completed);
  const totalMinutes = completedTasks.reduce(
    (acc, task) => acc + task.estimatedMinutes,
    0
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    doc.setFontSize(20);
    doc.text('PomodoroNow - Daily Summary', 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${today}`, 20, 30);
    doc.text(`Total Time: ${totalMinutes} minutes`, 20, 40);
    doc.text(`Tasks Completed: ${completedTasks.length}`, 20, 50);

    doc.text('Completed Tasks:', 20, 70);
    let y = 80;
    completedTasks.forEach((task) => {
      doc.text(`• ${task.title} (${task.estimatedMinutes}m)`, 30, y);
      if (task.description) {
        y += 10;
        doc.setFontSize(10);
        doc.text(task.description, 35, y);
        doc.setFontSize(12);
      }
      y += 10;
    });

    doc.save('pomodoro-summary.pdf');
  };

  return (
    <Card className="w-96 p-4 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Today's Progress</h2>
        <p className="text-muted-foreground">
          Completed Tasks: {completedTasks.length}
        </p>
        <p className="text-muted-foreground">Total Time: {totalMinutes} minutes</p>
      </div>

      <Button onClick={generatePDF} className="w-full">
        <Download className="h-4 w-4 mr-2" />
        Export Summary
      </Button>
    </Card>
  );
}