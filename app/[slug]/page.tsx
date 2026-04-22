import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ThemeRenderer } from '@/components/themes'
import type { Invitation, GuestBookEntry } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

async function getInvitation(slug: string): Promise<Invitation | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('invitations')
    .select('*, story_items(*), gallery_items(*)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  return data
}

async function getGuestBookEntries(invitationId: string): Promise<GuestBookEntry[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guest_book')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false })
    .limit(50)
  return data ?? []
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const invitation = await getInvitation(slug)
  if (!invitation) return {}
  return {
    title: `Undangan Pernikahan ${invitation.groom_name} & ${invitation.bride_name}`,
    description: `Kami mengundang Anda untuk hadir di pernikahan ${invitation.groom_name} & ${invitation.bride_name}`,
  }
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params
  const invitation = await getInvitation(slug)
  if (!invitation) notFound()

  const guestBookEntries = await getGuestBookEntries(invitation.id)

  return <ThemeRenderer invitation={invitation} guestBookEntries={guestBookEntries} />
}
