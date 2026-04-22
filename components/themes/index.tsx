import type { ComponentType } from 'react'
import type { GuestBookEntry, Invitation, ThemeId } from '@/lib/types'
import { ElegantTheme } from './ElegantTheme'
import { FloralTheme } from './FloralTheme'
import { MinimalistTheme } from './MinimalistTheme'

interface ThemeProps {
  invitation: Invitation
  guestBookEntries: GuestBookEntry[]
}

const THEMES: Record<ThemeId, ComponentType<ThemeProps>> = {
  elegant: ElegantTheme,
  floral: FloralTheme,
  minimalist: MinimalistTheme,
}

export function resolveTheme(themeId: ThemeId): ComponentType<ThemeProps> {
  return THEMES[themeId] ?? ElegantTheme
}

export function ThemeRenderer({ invitation, guestBookEntries }: ThemeProps) {
  const Component = THEMES[invitation.theme] ?? ElegantTheme
  return <Component invitation={invitation} guestBookEntries={guestBookEntries} />
}
