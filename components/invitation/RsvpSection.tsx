'use client'
import { useActionState } from 'react'
import type { Invitation } from '@/lib/types'
import { submitRsvp } from '@/app/[slug]/actions'

interface Props {
  invitation: Invitation
  className?: string
}

export function RsvpSection({ invitation, className = '' }: Props) {
  const submitRsvpWithId = submitRsvp.bind(null, invitation.id)
  const [state, action, pending] = useActionState(submitRsvpWithId, { success: false, error: null })

  return (
    <section className={`rsvp-section ${className}`}>
      <h2 className="section-title">Konfirmasi Kehadiran</h2>
      {state.success ? (
        <p className="rsvp-success">Terima kasih, kehadiranmu telah dicatat!</p>
      ) : (
        <form action={action} className="rsvp-form">
          {state.error && <p className="rsvp-error">{state.error}</p>}
          <div className="form-field">
            <label htmlFor="guest_name">Nama Lengkap</label>
            <input id="guest_name" name="guest_name" type="text" required className="form-input" />
          </div>
          <div className="form-field">
            <label>Konfirmasi Kehadiran</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="attendance" value="hadir" required /> Hadir
              </label>
              <label className="radio-label">
                <input type="radio" name="attendance" value="tidak_hadir" /> Tidak Hadir
              </label>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="guest_count">Jumlah Tamu</label>
            <input id="guest_count" name="guest_count" type="number" min="1" max="10"
              defaultValue="1" className="form-input" />
          </div>
          <div className="form-field">
            <label htmlFor="rsvp_message">Pesan (opsional)</label>
            <textarea id="rsvp_message" name="message" rows={3} className="form-input" />
          </div>
          <button type="submit" disabled={pending} className="form-btn">
            {pending ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        </form>
      )}
    </section>
  )
}
