import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RsvpTable } from '@/components/admin/RsvpTable'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RsvpPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: invitation }, { data: rsvp }, { data: guestBook }] = await Promise.all([
    supabase.from('invitations').select('groom_name, bride_name, slug').eq('id', id).single(),
    supabase.from('rsvp_responses').select('*').eq('invitation_id', id).order('created_at', { ascending: false }),
    supabase.from('guest_book').select('*').eq('invitation_id', id).order('created_at', { ascending: false }),
  ])

  if (!invitation) notFound()

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          {invitation.groom_name} & {invitation.bride_name}
        </h1>
        <Link href={`/${invitation.slug}`} target="_blank" className="admin-btn-small">
          Lihat Undangan ↗
        </Link>
      </div>
      <RsvpTable rsvpResponses={rsvp ?? []} guestBookEntries={guestBook ?? []} />
    </div>
  )
}
