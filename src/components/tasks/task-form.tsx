'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TaskFormProps {
  onSubmit: (title: string) => Promise<void>
  loading?: boolean
}

export function TaskForm({ onSubmit, loading }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    await onSubmit(title.trim())
    setTitle('')
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Label htmlFor="task" className="sr-only">
          New task
        </Label>
        <Input
          id="task"
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading || isSubmitting}
        />
      </div>
      <Button type="submit" disabled={loading || isSubmitting || !title.trim()}>
        Add
      </Button>
    </form>
  )
}
