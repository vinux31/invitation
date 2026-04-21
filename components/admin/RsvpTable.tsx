import type { GuestBookEntry, RsvpResponse } from '@/lib/types'

interface Props {
  rsvpResponses: RsvpResponse[]
  guestBookEntries: GuestBookEntry[]
}

export function RsvpTable({ rsvpResponses, guestBookEntries }: Props) {
  const hadirCount = rsvpResponses.filter(r => r.attendance === 'hadir').length
  const totalGuests = rsvpResponses
    .filter(r => r.attendance === 'hadir')
    .reduce((sum, r) => sum + r.guest_count, 0)

  return (
    <div className="rsvp-view">
      <div className="rsvp-stats">
        <div className="stat-card">
          <p className="stat-number">{rsvpResponses.length}</p>
          <p className="stat-label">Total Respon</p>
        </div>
        <div className="stat-card">
          <p className="stat-number stat-green">{hadirCount}</p>
          <p className="stat-label">Hadir</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{rsvpResponses.length - hadirCount}</p>
          <p className="stat-label">Tidak Hadir</p>
        </div>
        <div className="stat-card">
          <p className="stat-number stat-green">{totalGuests}</p>
          <p className="stat-label">Estimasi Tamu</p>
        </div>
      </div>

      <h2 className="admin-page-title" style={{marginTop: '2rem'}}>Konfirmasi Kehadiran</h2>
      {rsvpResponses.length === 0 ? (
        <p className="admin-empty">Belum ada konfirmasi.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kehadiran</th>
                <th>Jumlah Tamu</th>
                <th>Pesan</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {rsvpResponses.map(r => (
                <tr key={r.id}>
                  <td>{r.guest_name}</td>
                  <td>
                    <span className={`status-badge ${r.attendance === 'hadir' ? 'status-active' : 'status-inactive'}`}>
                      {r.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                    </span>
                  </td>
                  <td>{r.attendance === 'hadir' ? r.guest_count : '-'}</td>
                  <td>{r.message ?? '-'}</td>
                  <td>{new Date(r.created_at).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="admin-page-title" style={{marginTop: '2rem'}}>Buku Tamu</h2>
      {guestBookEntries.length === 0 ? (
        <p className="admin-empty">Belum ada ucapan.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Ucapan</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {guestBookEntries.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.message}</td>
                  <td>{new Date(e.created_at).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
