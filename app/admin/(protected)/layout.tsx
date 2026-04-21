import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/admin/LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <Link href="/admin" className="admin-nav-brand">Undangan Digital</Link>
        <div className="admin-nav-actions">
          <Link href="/admin/new" className="admin-btn-primary">+ Undangan Baru</Link>
          <LogoutButton />
        </div>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  )
}
