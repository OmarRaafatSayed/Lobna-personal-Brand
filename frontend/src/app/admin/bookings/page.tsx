'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Calendar, Trash2, CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/api'
import type { Booking } from '@/lib/types'
import { BOOKING_STATUS_LABELS_AR, PLATFORM_LABELS } from '@/lib/constants'

const BOOKING_STATUS_LABELS = BOOKING_STATUS_LABELS_AR

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-blue-100 text-blue-700',
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const url = statusFilter ? `/bookings?status=${statusFilter}` : '/bookings'
      const res = await api.get<{ bookings: Booking[] }>(url)
      setBookings(res.bookings)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [statusFilter])

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/bookings/${id}`, { status })
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: status as Booking['status'] } : b))
    } catch {}
  }

  const deleteBooking = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return
    try {
      await api.delete(`/bookings/${id}`)
      setBookings((prev) => prev.filter((b) => b._id !== id))
    } catch {}
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl text-gray-900">الحجوزات</h1>
            <p className="text-gray-500 mt-1">إدارة جميع حجوزات الاستشارات</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border-2 border-rose/30 focus:border-rose focus:outline-none bg-white text-sm"
          >
            <option value="">كل الحالات</option>
            {Object.entries(BOOKING_STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="text-gray-300 mx-auto mb-4" size={48} />
              <p className="text-gray-400">لا توجد حجوزات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    {['الاسم', 'واتساب', 'التاريخ والوقت', 'المنصة', 'الرسالة', 'الحالة', 'إجراءات'].map((h) => (
                      <th key={h} className="text-right px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <motion.tr
                      key={b._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">{b.name}</td>
                      <td className="px-5 py-4 text-gray-600 ltr">{b.whatsapp}</td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{b.date} - {b.time}</td>
                      <td className="px-5 py-4 text-gray-600">{PLATFORM_LABELS[b.platform]}</td>
                      <td className="px-5 py-4 text-gray-600 max-w-xs">
                        <p className="line-clamp-2">{b.message}</p>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b._id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[b.status]}`}
                        >
                          {Object.entries(BOOKING_STATUS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateStatus(b._id, 'confirmed')} title="تأكيد" className="text-green-500 hover:text-green-700 transition-colors">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => updateStatus(b._id, 'cancelled')} title="إلغاء" className="text-orange-400 hover:text-orange-600 transition-colors">
                            <XCircle size={18} />
                          </button>
                          <button onClick={() => deleteBooking(b._id)} title="حذف" className="text-red-400 hover:text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
