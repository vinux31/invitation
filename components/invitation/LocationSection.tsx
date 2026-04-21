import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

function MapsEmbed({ link, label }: { link: string; label: string }) {
  const embedUrl = link.includes('output=embed')
    ? link
    : link.replace('https://maps.google.com/?', 'https://maps.google.com/maps?') + '&output=embed'
  return (
    <div className="location-embed-wrap">
      <h3 className="location-label">{label}</h3>
      <iframe
        src={embedUrl}
        className="location-iframe"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

export function LocationSection({ invitation, className = '' }: Props) {
  const hasAkad = !!invitation.akad_maps_link
  const hasResepsi = !!invitation.resepsi_maps_link
  if (!hasAkad && !hasResepsi) return null

  return (
    <section className={`location-section ${className}`}>
      <h2 className="section-title">Lokasi</h2>
      <div className="location-grid">
        {hasAkad && (
          <MapsEmbed link={invitation.akad_maps_link!} label="Akad Nikah" />
        )}
        {hasResepsi && (
          <MapsEmbed link={invitation.resepsi_maps_link!} label="Resepsi" />
        )}
      </div>
    </section>
  )
}
