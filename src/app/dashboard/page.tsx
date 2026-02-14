import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TaskList } from '@/components/tasks/task-list'
import { AiChat } from '@/components/ai/ai-chat'
import { LogoutButton } from '@/components/auth/logout-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Taskify AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Task List */}
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>
                {tasks?.length || 0} tasks • {tasks?.filter((t) => t.completed).length || 0} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList
                tasks={tasks || []}
                onAddTask={async (title: string) => {
                  'use server'
                  const supabase = await createClient()
                  const {
                    data: { user },
                  } = await supabase.auth.getUser()
                  if (user) {
                    await supabase.from('tasks').insert({
                      title,
                      user_id: user.id,
                    })
                  }
                }}
                onToggleTask={async (id: string, completed: boolean) => {
                  'use server'
                  const supabase = await createClient()
                  await supabase.from('tasks').update({ completed }).eq('id', id)
                }}
                onDeleteTask={async (id: string) => {
                  'use server'
                  const supabase = await createClient()
                  await supabase.from('tasks').delete().eq('id', id)
                }}
              />
            </CardContent>
          </Card>

          {/* AI Chat */}
          <AiChat />
        </div>
      </main>
    </div>
  )
}
