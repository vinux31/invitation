import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

export function CoverSection({ invitation, className = '' }: Props) {
  const weddingDate = invitation.akad_date ?? invitation.resepsi_date
  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return (
    <section className={`cover-section ${className}`}>
      <div className="cover-content">
        <p className="cover-label">Undangan Pernikahan</p>
        <h1 className="cover-names">
          {invitation.groom_name} & {invitation.bride_name}
        </h1>
        <div className="cover-divider" />
        {formattedDate && <p className="cover-date">{formattedDate}</p>}
      </div>
    </section>
  )
}
