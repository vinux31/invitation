import Link from 'next/link'
import type { Invitation } from '@/lib/types'
import { DeleteButton } from './DeleteButton'

const THEME_LABELS: Record<string, string> = {
  elegant: 'Elegant Gold',
  floral: 'Floral Soft',
  minimalist: 'Minimalist',
}

interface Props {
  invitations: Invitation[]
}

export function InvitationList({ invitations }: Props) {
  if (invitations.length === 0) {
    return (
      <div className="admin-empty">
        <p>Belum ada undangan. <Link href="/admin/new">Buat yang pertama →</Link></p>
      </div>
    )
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Pasangan</th>
            <th>Slug / Link</th>
            <th>Tema</th>
            <th>Status</th>
            <th>Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.groom_name} & {inv.bride_name}</td>
              <td>
                <a href={`/${inv.slug}`} target="_blank" rel="noopener noreferrer"
                  className="admin-link">
                  /{inv.slug}
                </a>
              </td>
              <td>{THEME_LABELS[inv.theme] ?? inv.theme}</td>
              <td>
                <span className={`status-badge status-${inv.status}`}>
                  {inv.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td>{new Date(inv.created_at).toLocaleDateString('id-ID')}</td>
              <td className="admin-actions">
                <Link href={`/admin/${inv.id}/edit`} className="admin-btn-small">Edit</Link>
                <Link href={`/admin/${inv.id}/rsvp`} className="admin-btn-small">RSVP</Link>
                <DeleteButton id={inv.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
