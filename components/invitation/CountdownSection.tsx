'use client'
import { useEffect, useState } from 'react'
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function CountdownSection({ invitation, className = '' }: Props) {
  const targetDate = invitation.akad_date ?? invitation.resepsi_date
  const [timeLeft, setTimeLeft] = useState(targetDate ? getTimeLeft(targetDate) : null)

  useEffect(() => {
    if (!targetDate) return
    const interval = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (!targetDate) return null

  return (
    <section className={`countdown-section ${className}`}>
      <p className="countdown-tagline">Menghitung hari menuju hari istimewa kami</p>
      {timeLeft ? (
        <div className="countdown-grid">
          {[
            { value: timeLeft.days, label: 'Hari' },
            { value: timeLeft.hours, label: 'Jam' },
            { value: timeLeft.minutes, label: 'Menit' },
            { value: timeLeft.seconds, label: 'Detik' },
          ].map(({ value, label }) => (
            <div key={label} className="countdown-box">
              <span className="countdown-num">{String(value).padStart(2, '0')}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="countdown-passed">Hari ini adalah hari istimewa kami ✦</p>
      )}
    </section>
  )
}
