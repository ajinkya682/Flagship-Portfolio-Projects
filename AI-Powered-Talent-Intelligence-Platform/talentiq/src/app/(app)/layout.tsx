import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'

export default function AppLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')?.value

  if (!token) {
    redirect('/login')
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  )
}
