import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

export function StorySection({ invitation, className = '' }: Props) {
  const items = invitation.story_items ?? []
  if (items.length === 0) return null

  return (
    <section className={`story-section ${className}`}>
      <h2 className="section-title">Kisah Kami</h2>
      <div className="story-timeline">
        {[...items].sort((a, b) => a.sort_order - b.sort_order).map((item) => (
          <div key={item.id} className="story-item">
            <div className="story-year">{item.year}</div>
            <div className="story-content">
              <h3 className="story-item-title">{item.title}</h3>
              <p className="story-item-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
