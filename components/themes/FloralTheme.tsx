import type { GuestBookEntry, Invitation } from '@/lib/types'
import { CoverSection } from '@/components/invitation/CoverSection'
import { CountdownSection } from '@/components/invitation/CountdownSection'
import { CoupleSection } from '@/components/invitation/CoupleSection'
import { StorySection } from '@/components/invitation/StorySection'
import { GallerySection } from '@/components/invitation/GallerySection'
import { EventSection } from '@/components/invitation/EventSection'
import { LocationSection } from '@/components/invitation/LocationSection'
import { RsvpSection } from '@/components/invitation/RsvpSection'
import { GuestBookSection } from '@/components/invitation/GuestBookSection'

interface Props {
  invitation: Invitation
  guestBookEntries: GuestBookEntry[]
}

export function FloralTheme({ invitation, guestBookEntries }: Props) {
  return (
    <div data-theme="floral">
      <CoverSection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <CoupleSection invitation={invitation} />
      <StorySection invitation={invitation} />
      <GallerySection invitation={invitation} />
      <EventSection invitation={invitation} />
      <LocationSection invitation={invitation} />
      <RsvpSection invitation={invitation} />
      <GuestBookSection invitation={invitation} entries={guestBookEntries} />
    </div>
  )
}
