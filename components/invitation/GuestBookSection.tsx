'use client'
import { useActionState } from 'react'
import type { GuestBookEntry, Invitation } from '@/lib/types'
import { submitGuestBook } from '@/app/[slug]/actions'

interface Props {
  invitation: Invitation
  entries: GuestBookEntry[]
  className?: string
}

export function GuestBookSection({ invitation, entries, className = '' }: Props) {
  const submitWithId = submitGuestBook.bind(null, invitation.id)
  const [state, action, pending] = useActionState(submitWithId, { success: false, error: null })

  return (
    <section className={`guestbook-section ${className}`}>
      <h2 className="section-title">Buku Tamu</h2>
      <form action={action} className="rsvp-form">
        {state.error && <p className="rsvp-error">{state.error}</p>}
        {state.success && <p className="rsvp-success">Ucapanmu telah terkirim!</p>}
        <div className="form-field">
          <label htmlFor="gb_name">Nama</label>
          <input id="gb_name" name="name" type="text" required className="form-input" />
        </div>
        <div className="form-field">
          <label htmlFor="gb_message">Ucapan & Doa</label>
          <textarea id="gb_message" name="message" rows={4} required className="form-input" />
        </div>
        <button type="submit" disabled={pending} className="form-btn">
          {pending ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </form>
      <div className="guestbook-entries">
        {entries.map((entry) => (
          <div key={entry.id} className="guestbook-entry">
            <p className="entry-name">{entry.name}</p>
            <p className="entry-message">{entry.message}</p>
            <p className="entry-date">
              {new Date(entry.created_at).toLocaleDateString('id-ID')}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
