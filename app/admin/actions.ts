'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function extractInvitationFields(formData: FormData) {
  return {
    theme: formData.get('theme') as string,
    status: formData.get('status') as string,
    groom_name: formData.get('groom_name') as string,
    groom_father: (formData.get('groom_father') as string) || null,
    groom_mother: (formData.get('groom_mother') as string) || null,
    groom_photo_url: (formData.get('groom_photo_url') as string) || null,
    bride_name: formData.get('bride_name') as string,
    bride_father: (formData.get('bride_father') as string) || null,
    bride_mother: (formData.get('bride_mother') as string) || null,
    bride_photo_url: (formData.get('bride_photo_url') as string) || null,
    akad_date: (formData.get('akad_date') as string) || null,
    akad_time: (formData.get('akad_time') as string) || null,
    akad_venue: (formData.get('akad_venue') as string) || null,
    akad_address: (formData.get('akad_address') as string) || null,
    akad_maps_link: (formData.get('akad_maps_link') as string) || null,
    resepsi_date: (formData.get('resepsi_date') as string) || null,
    resepsi_time: (formData.get('resepsi_time') as string) || null,
    resepsi_venue: (formData.get('resepsi_venue') as string) || null,
    resepsi_address: (formData.get('resepsi_address') as string) || null,
    resepsi_maps_link: (formData.get('resepsi_maps_link') as string) || null,
    couple_quote: (formData.get('couple_quote') as string) || null,
    music_url: (formData.get('music_url') as string) || null,
  }
}

function parseStoryItems(formData: FormData) {
  const items = []
  let i = 0
  while (formData.get(`story_year_${i}`) !== null) {
    const year = formData.get(`story_year_${i}`) as string
    const title = formData.get(`story_title_${i}`) as string
    const description = formData.get(`story_desc_${i}`) as string
    if (year && title) items.push({ year, title, description })
    i++
  }
  return items
}

function parseGalleryUrls(formData: FormData): string[] {
  const raw = formData.get('gallery_urls') as string
  if (!raw) return []
  return raw.split('\n').map(u => u.trim()).filter(Boolean)
}

export async function createInvitation(formData: FormData) {
  const supabase = await createClient()
  const slug = formData.get('slug') as string

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Slug hanya boleh huruf kecil, angka, dan tanda hubung.')
  }

  const { data: invitation, error } = await supabase
    .from('invitations')
    .insert({ slug, ...extractInvitationFields(formData) })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  const storyItems = parseStoryItems(formData)
  if (storyItems.length > 0) {
    await supabase.from('story_items').insert(
      storyItems.map((item, i) => ({ ...item, invitation_id: invitation.id, sort_order: i }))
    )
  }

  const galleryUrls = parseGalleryUrls(formData)
  if (galleryUrls.length > 0) {
    await supabase.from('gallery_items').insert(
      galleryUrls.map((url, i) => ({ image_url: url, invitation_id: invitation.id, sort_order: i }))
    )
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateInvitation(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('invitations')
    .update({ ...extractInvitationFields(formData), updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await supabase.from('story_items').delete().eq('invitation_id', id)
  const storyItems = parseStoryItems(formData)
  if (storyItems.length > 0) {
    await supabase.from('story_items').insert(
      storyItems.map((item, i) => ({ ...item, invitation_id: id, sort_order: i }))
    )
  }

  await supabase.from('gallery_items').delete().eq('invitation_id', id)
  const galleryUrls = parseGalleryUrls(formData)
  if (galleryUrls.length > 0) {
    await supabase.from('gallery_items').insert(
      galleryUrls.map((url, i) => ({ image_url: url, invitation_id: id, sort_order: i }))
    )
  }

  revalidatePath('/admin')
  revalidatePath(`/admin/${id}/edit`)
  redirect('/admin')
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient()
  await supabase.from('invitations').delete().eq('id', id)
  revalidatePath('/admin')
}
