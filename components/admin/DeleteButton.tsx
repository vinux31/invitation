'use client'
import { deleteInvitation } from '@/app/admin/actions'

export function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm('Hapus undangan ini? Data RSVP dan buku tamu juga akan terhapus.')) return
    await deleteInvitation(id)
  }

  return (
    <button onClick={handleDelete} className="admin-btn-small admin-btn-danger">
      Hapus
    </button>
  )
}
