'use server'
import { createClient } from '@/lib/supabase/server'

type ActionState = { success: boolean; error: string | null }

export async function submitRsvp(
  invitationId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase.from('rsvp_responses').insert({
    invitation_id: invitationId,
    guest_name: formData.get('guest_name') as string,
    attendance: formData.get('attendance') as string,
    guest_count: parseInt(formData.get('guest_count') as string) || 1,
    message: (formData.get('message') as string) || null,
  })

  if (error) return { success: false, error: 'Gagal mengirim konfirmasi. Coba lagi.' }
  return { success: true, error: null }
}

export async function submitGuestBook(
  invitationId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase.from('guest_book').insert({
    invitation_id: invitationId,
    name: formData.get('name') as string,
    message: formData.get('message') as string,
  })

  if (error) return { success: false, error: 'Gagal mengirim ucapan. Coba lagi.' }
  return { success: true, error: null }
}
