'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Calendar, Briefcase, PenSquare, Users } from 'lucide-react'
import api from '@/lib/api'
import type { Booking } from '@/lib/types'
import { BOOKING_STATUS_LABELS_AR } from '@/lib/constants'

const BOOKING_STATUS_LABELS = BOOKING_STATUS_LABELS_AR

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, jobs: 0, posts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<{ bookings: Booking[]; total: number }>('/bookings?limit=5'),
      api.get<{ jobs: unknown[] }>('/jobs/all'),
      api.get<{ posts: unknown[] }>('/blog/all'),
    ]).then(([bRes, jRes, pRes]) => {
      setBookings(bRes.bookings)
      const pending = bRes.bookings.filter((b) => b.status === 'pending').length
      const confirmed = bRes.bookings.filter((b) => b.status === 'confirmed').length
      setStats({
        pending,
        confirmed,
        jobs: jRes.jobs.length,
        posts: pRes.posts.length,
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'حجوزات معلقة', value: stats.pending, icon: <Calendar className="text-rose" size={24} />, bg: 'bg-rose/10' },
    { label: 'حجوزات مؤكدة', value: stats.confirmed, icon: <Users className="text-blue-brand" size={24} />, bg: 'bg-blue-brand/10' },
    { label: 'وظائف منشورة', value: stats.jobs, icon: <Briefcase className="text-green-brand" size={24} />, bg: 'bg-green-brand/10' },
    { label: 'مقالات منشورة', value: stats.posts, icon: <PenSquare className="text-purple-500" size={24} />, bg: 'bg-purple-100' },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
    completed: 'bg-blue-100 text-blue-700',
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl text-gray-900">أهلاً بك 👋</h1>
          <p className="text-gray-500 mt-1">إليك ملخص نشاط منصتك</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900">{card.value}</div>
              <div className="text-gray-500 text-sm mt-1">{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-lg">آخر الحجوزات</h2>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">جاري التحميل...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">لا توجد حجوزات بعد</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm">
                    <th className="text-right px-6 py-3 font-medium">الاسم</th>
                    <th className="text-right px-6 py-3 font-medium">التاريخ</th>
                    <th className="text-right px-6 py-3 font-medium">الوقت</th>
                    <th className="text-right px-6 py-3 font-medium">المنصة</th>
                    <th className="text-right px-6 py-3 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{booking.name}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.date}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.time}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.platform === 'google_meet' ? 'Google Meet' : 'Zoom'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                          {BOOKING_STATUS_LABELS[booking.status]}
                        </span>
                      </td>
                    </tr>
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
