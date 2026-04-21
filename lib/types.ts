export type ThemeId = 'elegant' | 'floral' | 'minimalist'
export type InvitationStatus = 'active' | 'inactive'

export interface StoryItem {
  id: string
  invitation_id: string
  year: string
  title: string
  description: string
  sort_order: number
}

export interface GalleryItem {
  id: string
  invitation_id: string
  image_url: string
  sort_order: number
}

export interface RsvpResponse {
  id: string
  invitation_id: string
  guest_name: string
  attendance: 'hadir' | 'tidak_hadir'
  guest_count: number
  message: string | null
  created_at: string
}

export interface GuestBookEntry {
  id: string
  invitation_id: string
  name: string
  message: string
  created_at: string
}

export interface Invitation {
  id: string
  slug: string
  theme: ThemeId
  status: InvitationStatus
  groom_name: string
  groom_father: string | null
  groom_mother: string | null
  groom_photo_url: string | null
  bride_name: string
  bride_father: string | null
  bride_mother: string | null
  bride_photo_url: string | null
  akad_date: string | null
  akad_time: string | null
  akad_venue: string | null
  akad_address: string | null
  akad_maps_link: string | null
  resepsi_date: string | null
  resepsi_time: string | null
  resepsi_venue: string | null
  resepsi_address: string | null
  resepsi_maps_link: string | null
  couple_quote: string | null
  music_url: string | null
  created_at: string
  updated_at: string
  story_items?: StoryItem[]
  gallery_items?: GalleryItem[]
}
