import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Taskify</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold tracking-tight">
            Manage your tasks with ease
          </h2>
          <p className="text-xl text-muted-foreground">
            A simple and elegant task manager built with Next.js, Supabase, and
            shadcn/ui. Sign up today and start organizing your life.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg">Get started for free</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-2">Fast & Simple</h3>
            <p className="text-muted-foreground">
              Add, complete, and delete tasks in seconds. No complexity, just
              productivity.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-2">Secure</h3>
            <p className="text-muted-foreground">
              Your tasks are protected with Supabase authentication and row-level
              security.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-2">Free Forever</h3>
            <p className="text-muted-foreground">
              No subscriptions, no limits. Create your account and start managing
              tasks today.
            </p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>Built with Next.js, Supabase, and shadcn/ui</p>
      </footer>
    </div>
  )
}
