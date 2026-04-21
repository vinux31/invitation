'use client'
import { useState } from 'react'
import type { Invitation, StoryItem, ThemeId } from '@/lib/types'

interface Props {
  invitation?: Invitation
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'elegant', label: 'Elegant Gold & Navy' },
  { id: 'floral', label: 'Floral Soft' },
  { id: 'minimalist', label: 'Modern Minimalist' },
]

export function InvitationForm({ invitation, action, submitLabel }: Props) {
  const [storyItems, setStoryItems] = useState<Partial<StoryItem>[]>(
    invitation?.story_items?.length
      ? invitation.story_items
      : [{ year: '', title: '', description: '' }]
  )

  function addStoryItem() {
    setStoryItems(prev => [...prev, { year: '', title: '', description: '' }])
  }

  function removeStoryItem(index: number) {
    setStoryItems(prev => prev.filter((_, i) => i !== index))
  }

  const defaultGalleryUrls = invitation?.gallery_items
    ?.sort((a, b) => a.sort_order - b.sort_order)
    .map(g => g.image_url)
    .join('\n') ?? ''

  return (
    <form action={action} className="admin-form">

      <section className="form-section">
        <h2 className="form-section-title">Pengaturan Undangan</h2>
        <div className="form-row-2">
          {!invitation && (
            <div className="form-field">
              <label htmlFor="slug">Slug URL <span className="required">*</span></label>
              <input id="slug" name="slug" type="text" required className="admin-input"
                placeholder="rizky-aisyah" pattern="[a-z0-9-]+" />
              <p className="form-hint">Hanya huruf kecil, angka, dan tanda hubung</p>
            </div>
          )}
          <div className="form-field">
            <label htmlFor="theme">Tema <span className="required">*</span></label>
            <select id="theme" name="theme" required className="admin-input"
              defaultValue={invitation?.theme ?? 'elegant'}>
              {THEMES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" className="admin-input"
              defaultValue={invitation?.status ?? 'active'}>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Mempelai Pria</h2>
        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="groom_name">Nama Lengkap <span className="required">*</span></label>
            <input id="groom_name" name="groom_name" type="text" required className="admin-input"
              defaultValue={invitation?.groom_name ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="groom_photo_url">URL Foto</label>
            <input id="groom_photo_url" name="groom_photo_url" type="url" className="admin-input"
              defaultValue={invitation?.groom_photo_url ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="groom_father">Nama Ayah</label>
            <input id="groom_father" name="groom_father" type="text" className="admin-input"
              defaultValue={invitation?.groom_father ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="groom_mother">Nama Ibu</label>
            <input id="groom_mother" name="groom_mother" type="text" className="admin-input"
              defaultValue={invitation?.groom_mother ?? ''} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Mempelai Wanita</h2>
        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="bride_name">Nama Lengkap <span className="required">*</span></label>
            <input id="bride_name" name="bride_name" type="text" required className="admin-input"
              defaultValue={invitation?.bride_name ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="bride_photo_url">URL Foto</label>
            <input id="bride_photo_url" name="bride_photo_url" type="url" className="admin-input"
              defaultValue={invitation?.bride_photo_url ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="bride_father">Nama Ayah</label>
            <input id="bride_father" name="bride_father" type="text" className="admin-input"
              defaultValue={invitation?.bride_father ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="bride_mother">Nama Ibu</label>
            <input id="bride_mother" name="bride_mother" type="text" className="admin-input"
              defaultValue={invitation?.bride_mother ?? ''} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Akad Nikah</h2>
        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="akad_date">Tanggal</label>
            <input id="akad_date" name="akad_date" type="date" className="admin-input"
              defaultValue={invitation?.akad_date ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="akad_time">Waktu</label>
            <input id="akad_time" name="akad_time" type="time" className="admin-input"
              defaultValue={invitation?.akad_time ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="akad_venue">Nama Venue</label>
            <input id="akad_venue" name="akad_venue" type="text" className="admin-input"
              defaultValue={invitation?.akad_venue ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="akad_address">Alamat</label>
            <input id="akad_address" name="akad_address" type="text" className="admin-input"
              defaultValue={invitation?.akad_address ?? ''} />
          </div>
          <div className="form-field" style={{gridColumn: 'span 2'}}>
            <label htmlFor="akad_maps_link">Link Google Maps</label>
            <input id="akad_maps_link" name="akad_maps_link" type="url" className="admin-input"
              defaultValue={invitation?.akad_maps_link ?? ''} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Resepsi</h2>
        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="resepsi_date">Tanggal</label>
            <input id="resepsi_date" name="resepsi_date" type="date" className="admin-input"
              defaultValue={invitation?.resepsi_date ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="resepsi_time">Waktu</label>
            <input id="resepsi_time" name="resepsi_time" type="time" className="admin-input"
              defaultValue={invitation?.resepsi_time ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="resepsi_venue">Nama Venue</label>
            <input id="resepsi_venue" name="resepsi_venue" type="text" className="admin-input"
              defaultValue={invitation?.resepsi_venue ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="resepsi_address">Alamat</label>
            <input id="resepsi_address" name="resepsi_address" type="text" className="admin-input"
              defaultValue={invitation?.resepsi_address ?? ''} />
          </div>
          <div className="form-field" style={{gridColumn: 'span 2'}}>
            <label htmlFor="resepsi_maps_link">Link Google Maps</label>
            <input id="resepsi_maps_link" name="resepsi_maps_link" type="url" className="admin-input"
              defaultValue={invitation?.resepsi_maps_link ?? ''} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Kisah Cinta</h2>
        {storyItems.map((item, i) => (
          <div key={i} className="story-form-item">
            <div className="form-row-3" style={{flex: 1}}>
              <div className="form-field">
                <label>Tahun</label>
                <input name={`story_year_${i}`} type="text" className="admin-input"
                  defaultValue={item.year ?? ''} placeholder="2020" />
              </div>
              <div className="form-field">
                <label>Judul</label>
                <input name={`story_title_${i}`} type="text" className="admin-input"
                  defaultValue={item.title ?? ''} placeholder="Pertama Bertemu" />
              </div>
              <div className="form-field">
                <label>Deskripsi</label>
                <input name={`story_desc_${i}`} type="text" className="admin-input"
                  defaultValue={item.description ?? ''} />
              </div>
            </div>
            <button type="button" onClick={() => removeStoryItem(i)} className="admin-btn-danger">
              Hapus
            </button>
          </div>
        ))}
        <button type="button" onClick={addStoryItem} className="admin-btn-small">
          + Tambah Momen
        </button>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Galeri Foto</h2>
        <div className="form-field">
          <label htmlFor="gallery_urls">URL Foto (satu per baris)</label>
          <textarea id="gallery_urls" name="gallery_urls" rows={6} className="admin-input"
            defaultValue={defaultGalleryUrls}
            placeholder={'https://example.com/foto1.jpg\nhttps://example.com/foto2.jpg'} />
          <p className="form-hint">Upload foto ke Supabase Storage, lalu paste URL-nya di sini</p>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Lainnya</h2>
        <div className="form-field">
          <label htmlFor="couple_quote">Kutipan / Ayat</label>
          <textarea id="couple_quote" name="couple_quote" rows={3} className="admin-input"
            defaultValue={invitation?.couple_quote ?? ''} />
        </div>
        <div className="form-field" style={{marginTop: '1rem'}}>
          <label htmlFor="music_url">URL Musik Background (opsional)</label>
          <input id="music_url" name="music_url" type="url" className="admin-input"
            defaultValue={invitation?.music_url ?? ''} />
        </div>
      </section>

      <div className="form-footer">
        <button type="submit" className="admin-btn-primary">{submitLabel}</button>
      </div>
    </form>
  )
}
