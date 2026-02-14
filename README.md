# Taskify - Task Manager App

A simple task manager built with Next.js 15, Supabase, and shadcn/ui.

## Features

- ✅ User authentication (signup, login, logout)
- ✅ Create, update, and delete tasks
- ✅ Mark tasks as completed
- ✅ Row-level security for data protection
- ✅ Responsive design with shadcn/ui
- ✅ Server-side rendering with Next.js App Router

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth, Database)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/wheza99/taskify-app.git
cd taskify-app
pnpm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Project Settings > API and copy your:
   - Project URL
   - anon/public key

3. Go to the SQL Editor in your Supabase dashboard and run the contents of `supabase/schema.sql`

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Via Vercel CLI

```bash
# Install Vercel CLI
pnpm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home/landing page
│   ├── login/page.tsx      # Login page
│   ├── signup/page.tsx     # Signup page
│   └── dashboard/page.tsx  # Dashboard (protected)
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── auth/               # Auth components
│   └── tasks/              # Task components
├── lib/
│   └── supabase/           # Supabase client utilities
├── types/
│   └── database.ts         # TypeScript types
└── middleware.ts           # Auth middleware
```

## License

MIT
