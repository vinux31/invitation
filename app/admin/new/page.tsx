import { InvitationForm } from '@/components/admin/InvitationForm'
import { createInvitation } from '@/app/admin/actions'

export default function NewInvitationPage() {
  return (
    <div>
      <h1 className="admin-page-title">Undangan Baru</h1>
      <InvitationForm action={createInvitation} submitLabel="Simpan Undangan" />
    </div>
  )
}
