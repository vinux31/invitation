import Image from 'next/image'
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

export function GallerySection({ invitation, className = '' }: Props) {
  const items = invitation.gallery_items ?? []
  if (items.length === 0) return null

  return (
    <section className={`gallery-section ${className}`}>
      <h2 className="section-title">Galeri</h2>
      <div className="gallery-grid">
        {[...items].sort((a, b) => a.sort_order - b.sort_order).map((item) => (
          <div key={item.id} className="gallery-item">
            <Image src={item.image_url} alt="gallery" fill className="gallery-img" />
          </div>
        ))}
      </div>
    </section>
  )
}
