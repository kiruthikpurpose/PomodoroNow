'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

export function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('25');
  const store = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !estimatedMinutes) return;

    store.addTask({
      title,
      description,
      estimatedMinutes: parseInt(estimatedMinutes),
    });

    setTitle('');
    setDescription('');
    setEstimatedMinutes('25');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="number"
        min="1"
        placeholder="Estimated minutes"
        value={estimatedMinutes}
        onChange={(e) => setEstimatedMinutes(e.target.value)}
      />
      <Button type="submit" className="w-full">
        Add Task
      </Button>
    </form>
  );
}