'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Calendar, Trash2, CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/api'
import type { Booking } from '@/lib/types'
import { BOOKING_STATUS_LABELS_AR, BOOKING_STATUS_LABELS_EN, PLATFORM_LABELS } from '@/lib/constants'
import { useAdminLang } from '@/contexts/AdminLanguageContext'

const ROSE_DK   = '#E8609A'
const ROSE_GRAD = 'linear-gradient(135deg,#FD93C3 0%,#E8609A 100%)'

const GLASS_TABLE = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(253,147,195,0.18)',
  borderRadius: '20px',
  overflow: 'hidden',
} as const

const statusStyles: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(251,191,36,0.15)',  color: '#92400e' },
  confirmed: { bg: 'rgba(34,197,94,0.15)',   color: '#14532d' },
  cancelled: { bg: 'rgba(239,68,68,0.15)',   color: '#7f1d1d' },
  completed: { bg: 'rgba(142,181,210,0.2)',  color: '#1e3a5f' },
}

export default function AdminBookingsPage() {
  const { locale, dir, t } = useAdminLang()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const BOOKING_STATUS_LABELS = locale === 'ar' ? BOOKING_STATUS_LABELS_AR : BOOKING_STATUS_LABELS_EN

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const url = statusFilter ? `/bookings?status=${statusFilter}` : '/bookings'
      const res = await api.get<{ bookings: Booking[] }>(url)
      setBookings(res.bookings)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [statusFilter])

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/bookings/${id}`, { status })
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: status as Booking['status'] } : b))
    } catch {}
  }

  const deleteBooking = async (id: string) => {
    if (!confirm(t('Delete this booking?','هل أنت متأكد من حذف هذا الحجز؟'))) return
    try {
      await api.delete(`/bookings/${id}`)
      setBookings(prev => prev.filter(b => b._id !== id))
    } catch {}
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl" dir={dir}>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: "'Boldonse', cursive", fontSize: 'clamp(1.5rem,3.5vw,2.1rem)', background: 'linear-gradient(135deg,#2A1040 0%,#E8609A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>
              {t('Bookings', 'الحجوزات')}
            </h1>
            <p style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif", marginTop: '4px', fontSize: '0.9rem' }}>
              {t('Manage all consultation bookings', 'إدارة جميع حجوزات الاستشارات')}
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '0.6rem 1.1rem 0.6rem 2.2rem', borderRadius: '12px', border: '1.5px solid rgba(253,147,195,0.3)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', fontSize: '0.875rem', color: '#2A1040', fontFamily: "'Bricolage Grotesque',sans-serif", outline: 'none', cursor: 'pointer', appearance: 'none' }}>
              <option value="">{t('All statuses','كل الحالات')}</option>
              {Object.entries(BOOKING_STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: ROSE_DK, fontSize: '0.75rem' }}>▾</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={GLASS_TABLE}>
          {loading ? (
            <div className="text-center py-20" style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('Loading...','جاري التحميل...')}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <Calendar size={48} style={{ color: 'rgba(253,147,195,0.35)', margin: '0 auto 1rem' }} />
              <p style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('No bookings','لا توجد حجوزات')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(253,147,195,0.06)', borderBottom: '1px solid rgba(253,147,195,0.12)' }}>
                    {[
                      t('Name','الاسم'), t('WhatsApp','واتساب'), t('Date & Time','التاريخ والوقت'),
                      t('Platform','المنصة'), t('Message','الرسالة'), t('Status','الحالة'), t('Actions','إجراءات')
                    ].map(h => (
                      <th key={h} className="text-right px-5 py-3" style={{ fontSize: '0.78rem', color: '#8B6BA8', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => {
                    const s = statusStyles[b.status] ?? statusStyles.pending
                    return (
                      <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        style={{ borderTop: '1px solid rgba(253,147,195,0.07)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(253,147,195,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td className="px-5 py-4" style={{ fontWeight: 600, color: '#1a0a2e', whiteSpace: 'nowrap' }}>{b.name}</td>
                        <td className="px-5 py-4" style={{ color: '#6B5A7E', direction: 'ltr', textAlign: 'right' }}>{b.whatsapp}</td>
                        <td className="px-5 py-4" style={{ color: '#6B5A7E', whiteSpace: 'nowrap' }}>{b.date} — {b.time}</td>
                        <td className="px-5 py-4" style={{ color: '#6B5A7E' }}>{PLATFORM_LABELS[b.platform]}</td>
                        <td className="px-5 py-4" style={{ color: '#6B5A7E', maxWidth: '200px' }}>
                          <p style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{b.message}</p>
                        </td>
                        <td className="px-5 py-4">
                          <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                            style={{ padding: '3px 8px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: s.bg, color: s.color, fontFamily: "'Bricolage Grotesque',sans-serif", outline: 'none' }}>
                            {Object.entries(BOOKING_STATUS_LABELS).map(([val, label]) => (
                              <option key={val} value={val}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateStatus(b._id, 'confirmed')} title="تأكيد" style={{ color: '#22C55E', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#16A34A')} onMouseLeave={e => (e.currentTarget.style.color = '#22C55E')}><CheckCircle size={18} /></button>
                            <button onClick={() => updateStatus(b._id, 'cancelled')} title="إلغاء" style={{ color: '#F97316', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#EA580C')} onMouseLeave={e => (e.currentTarget.style.color = '#F97316')}><XCircle size={18} /></button>
                            <button onClick={() => deleteBooking(b._id)} title="حذف" style={{ color: '#EF4444', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')} onMouseLeave={e => (e.currentTarget.style.color = '#EF4444')}><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}
