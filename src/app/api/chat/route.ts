import { createClient } from '@/lib/supabase/server'
import { groq } from '@ai-sdk/groq'
import { streamText } from 'ai'
import { z } from 'zod'

export const maxDuration = 30

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages } = await req.json()

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: `You are a helpful task management assistant. You help users manage their tasks through conversation.
    
You can:
- Create new tasks
- List all tasks
- Update task status (complete/incomplete)
- Delete tasks
- Help break down complex tasks into smaller subtasks
- Provide productivity tips and suggestions

Be friendly, concise, and proactive in helping users organize their work.
When users mention tasks, offer to add them. When they seem overwhelmed, suggest breaking things down.`,
    messages,
    tools: {
      createTask: {
        description: 'Create a new task for the user',
        inputSchema: z.object({
          title: z.string().describe('The title of the task'),
        }),
        execute: async ({ title }: { title: string }) => {
          const { data, error } = await supabase
            .from('tasks')
            .insert({ title, user_id: user.id })
            .select()
            .single()

          if (error) {
            return { success: false, error: error.message }
          }
          return { success: true, task: data }
        },
      },
      listTasks: {
        description: 'Get all tasks for the current user',
        inputSchema: z.object({}),
        execute: async () => {
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false })

          if (error) {
            return { success: false, error: error.message }
          }

          const completed = data?.filter((t) => t.completed).length || 0
          const total = data?.length || 0

          return {
            success: true,
            tasks: data,
            summary: { total, completed, pending: total - completed },
          }
        },
      },
      toggleTask: {
        description: 'Toggle a task completion status by ID',
        inputSchema: z.object({
          taskId: z.string().describe('The ID of the task to toggle'),
          completed: z.boolean().describe('The new completion status'),
        }),
        execute: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
          const { data, error } = await supabase
            .from('tasks')
            .update({ completed })
            .eq('id', taskId)
            .eq('user_id', user.id)
            .select()
            .single()

          if (error) {
            return { success: false, error: error.message }
          }
          return { success: true, task: data }
        },
      },
      deleteTask: {
        description: 'Delete a task by ID',
        inputSchema: z.object({
          taskId: z.string().describe('The ID of the task to delete'),
        }),
        execute: async ({ taskId }: { taskId: string }) => {
          const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .eq('user_id', user.id)

          if (error) {
            return { success: false, error: error.message }
          }
          return { success: true }
        },
      },
      updateTask: {
        description: 'Update a task title by ID',
        inputSchema: z.object({
          taskId: z.string().describe('The ID of the task to update'),
          title: z.string().describe('The new title for the task'),
        }),
        execute: async ({ taskId, title }: { taskId: string; title: string }) => {
          const { data, error } = await supabase
            .from('tasks')
            .update({ title })
            .eq('id', taskId)
            .eq('user_id', user.id)
            .select()
            .single()

          if (error) {
            return { success: false, error: error.message }
          }
          return { success: true, task: data }
        },
      },
      createSubtasks: {
        description: 'Create multiple subtasks from a breakdown',
        inputSchema: z.object({
          tasks: z.array(z.string()).describe('Array of task titles to create'),
        }),
        execute: async ({ tasks: taskTitles }: { tasks: string[] }) => {
          const tasksToInsert = taskTitles.map((title) => ({
            title,
            user_id: user.id,
          }))

          const { data, error } = await supabase
            .from('tasks')
            .insert(tasksToInsert)
            .select()

          if (error) {
            return { success: false, error: error.message }
          }
          return { success: true, tasks: data, count: data?.length || 0 }
        },
      },
    },
  })

  return result.toTextStreamResponse()
}
