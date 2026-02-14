'use client'

import { TaskItem } from './task-item'
import { TaskForm } from './task-form'

interface Task {
  id: string
  title: string
  completed: boolean
  created_at: string
}

interface TaskListProps {
  tasks: Task[]
  onAddTask: (title: string) => Promise<void>
  onToggleTask: (id: string, completed: boolean) => Promise<void>
  onDeleteTask: (id: string) => Promise<void>
}

export function TaskList({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskListProps) {
  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length

  return (
    <div className="space-y-6">
      <TaskForm onSubmit={onAddTask} />

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No tasks yet. Add your first task above!
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} tasks completed
            </p>
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
