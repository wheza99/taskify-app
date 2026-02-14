'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface Task {
  id: string
  title: string
  completed: boolean
  created_at: string
}

interface TaskItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    await onToggle(task.id, !task.completed)
    setIsLoading(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    await onDelete(task.id)
    setIsLoading(false)
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
      <Checkbox
        id={task.id}
        checked={task.completed}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <label
        htmlFor={task.id}
        className={`flex-1 cursor-pointer ${
          task.completed ? 'line-through text-muted-foreground' : ''
        }`}
      >
        {task.title}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isLoading}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
