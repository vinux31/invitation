import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InvitationForm } from '@/components/admin/InvitationForm'
import { updateInvitation } from '@/app/admin/actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditInvitationPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: invitation } = await supabase
    .from('invitations')
    .select('*, story_items(*), gallery_items(*)')
    .eq('id', id)
    .single()

  if (!invitation) notFound()

  const updateWithId = updateInvitation.bind(null, id)

  return (
    <div>
      <h1 className="admin-page-title">
        Edit: {invitation.groom_name} & {invitation.bride_name}
      </h1>
      <InvitationForm
        invitation={invitation}
        action={updateWithId}
        submitLabel="Simpan Perubahan"
      />
    </div>
  )
}
