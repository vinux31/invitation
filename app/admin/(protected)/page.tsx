import { createClient } from '@/lib/supabase/server'
import { InvitationList } from '@/components/admin/InvitationList'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: invitations } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="admin-page-title">Semua Undangan</h1>
      <InvitationList invitations={invitations ?? []} />
    </div>
  )
}
