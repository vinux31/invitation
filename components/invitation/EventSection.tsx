import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

function formatTime(time: string | null) {
  if (!time) return ''
  const [h, m] = time.split(':')
  return `${h}.${m} WIB`
}

function formatDate(date: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function EventSection({ invitation, className = '' }: Props) {
  return (
    <section className={`event-section ${className}`}>
      <h2 className="section-title">Detail Acara</h2>
      <div className="event-grid">
        {invitation.akad_venue && (
          <div className="event-card">
            <h3 className="event-type">Akad Nikah</h3>
            <p className="event-date">{formatDate(invitation.akad_date)}</p>
            <p className="event-time">{formatTime(invitation.akad_time)}</p>
            <p className="event-venue">{invitation.akad_venue}</p>
            <p className="event-address">{invitation.akad_address}</p>
            {invitation.akad_maps_link && (
              <a href={invitation.akad_maps_link} target="_blank" rel="noopener noreferrer"
                className="event-maps-btn">
                Lihat Peta
              </a>
            )}
          </div>
        )}
        {invitation.resepsi_venue && (
          <div className="event-card">
            <h3 className="event-type">Resepsi</h3>
            <p className="event-date">{formatDate(invitation.resepsi_date)}</p>
            <p className="event-time">{formatTime(invitation.resepsi_time)}</p>
            <p className="event-venue">{invitation.resepsi_venue}</p>
            <p className="event-address">{invitation.resepsi_address}</p>
            {invitation.resepsi_maps_link && (
              <a href={invitation.resepsi_maps_link} target="_blank" rel="noopener noreferrer"
                className="event-maps-btn">
                Lihat Peta
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
