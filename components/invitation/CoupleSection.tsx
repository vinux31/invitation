import Image from 'next/image'
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

function PersonCard({ name, father, mother, photoUrl, role }: {
  name: string
  father: string | null
  mother: string | null
  photoUrl: string | null
  role: string
}) {
  return (
    <div className="couple-card">
      {photoUrl && (
        <div className="couple-photo-wrap">
          <Image src={photoUrl} alt={name} fill className="couple-photo" />
        </div>
      )}
      <p className="couple-role">{role}</p>
      <h2 className="couple-name">{name}</h2>
      {(father || mother) && (
        <p className="couple-parents">
          Putra/Putri dari {[father, mother].filter(Boolean).join(' & ')}
        </p>
      )}
    </div>
  )
}

export function CoupleSection({ invitation, className = '' }: Props) {
  return (
    <section className={`couple-section ${className}`}>
      {invitation.couple_quote && (
        <blockquote className="couple-quote">{invitation.couple_quote}</blockquote>
      )}
      <div className="couple-grid">
        <PersonCard
          name={invitation.groom_name}
          father={invitation.groom_father}
          mother={invitation.groom_mother}
          photoUrl={invitation.groom_photo_url}
          role="Mempelai Pria"
        />
        <div className="couple-ampersand">&</div>
        <PersonCard
          name={invitation.bride_name}
          father={invitation.bride_father}
          mother={invitation.bride_mother}
          photoUrl={invitation.bride_photo_url}
          role="Mempelai Wanita"
        />
      </div>
    </section>
  )
}
